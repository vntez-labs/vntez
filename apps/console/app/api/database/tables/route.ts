import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { getSupabaseAdminClient, SUPABASE_URL } from "@/lib/supabase";

export interface ColumnMeta {
  name: string;
  type: string;
  format?: string;
  isPrimaryKey: boolean;
  required: boolean;
  defaultVal?: string;
}

export interface TableMeta {
  name: string;
  primaryKey: string;
  rowCount: number;
  columns: ColumnMeta[];
}

export async function GET() {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) {
      return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to introspect Supabase schema" }, { status: 500 });
    }

    const spec = await res.json();
    const supabase = getSupabaseAdminClient();
    const tables: TableMeta[] = [];

    for (const [tableName, def] of Object.entries<any>(spec.definitions || {})) {
      const properties = def.properties || {};
      const requiredCols: string[] = def.required || [];

      let primaryKey = "id";
      const columns: ColumnMeta[] = [];

      for (const [colName, prop] of Object.entries<any>(properties)) {
        const isPk = Boolean(prop.description && prop.description.includes("<pk/>"));
        if (isPk) {
          primaryKey = colName;
        }

        columns.push({
          name: colName,
          type: prop.type || "string",
          format: prop.format,
          isPrimaryKey: isPk,
          required: requiredCols.includes(colName),
          defaultVal: prop.default,
        });
      }

      // Query exact row count
      let rowCount = 0;
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select("*", { count: "exact", head: true });
        if (!error && typeof count === "number") {
          rowCount = count;
        }
      } catch {
        rowCount = 0;
      }

      tables.push({
        name: tableName,
        primaryKey,
        rowCount,
        columns,
      });
    }

    // Sort tables alphabetically
    tables.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ success: true, tables });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error listing database tables";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
