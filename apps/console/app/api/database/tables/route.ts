import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { getSupabaseAdminClient, SUPABASE_URL } from "@/lib/supabase";
import type { TableMeta, ColumnMeta } from "@/app/database/types";
import { TABLE_METADATA_MAP } from "@/app/database/database-schema-constants";

export type { TableMeta, ColumnMeta };

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
    const definitions = Object.entries<any>(spec.definitions || {});

    // Query exact row counts and build metadata concurrently with Promise.all
    const tables: TableMeta[] = await Promise.all(
      definitions.map(async ([tableName, def]) => {
        const properties = def.properties || {};
        const requiredCols: string[] = def.required || [];
        const propKeys = Object.keys(properties);

        // 1. Detect primary key from OpenAPI spec, centralized metadata or common column names
        let discoveredPk: string | null = null;
        for (const [colName, prop] of Object.entries<any>(properties)) {
          if (
            prop.description &&
            (prop.description.includes("<pk/>") || prop.description.toLowerCase().includes("primary key"))
          ) {
            discoveredPk = colName;
            break;
          }
        }

        const knownPk = TABLE_METADATA_MAP[tableName]?.primaryKey;
        const primaryKey =
          discoveredPk ||
          (knownPk && propKeys.includes(knownPk) ? knownPk : null) ||
          (propKeys.includes("id") ? "id" : null) ||
          (propKeys.includes("slug") ? "slug" : null) ||
          (propKeys.includes("chat_id") ? "chat_id" : null) ||
          (propKeys.includes("code") ? "code" : null) ||
          (propKeys.includes("client_id") ? "client_id" : null) ||
          propKeys[0] ||
          "id";

        const columns: ColumnMeta[] = [];
        for (const [colName, prop] of Object.entries<any>(properties)) {
          const isPk = colName === primaryKey;
          columns.push({
            name: colName,
            type: prop.type || "string",
            format: prop.format,
            isPrimaryKey: isPk,
            required: requiredCols.includes(colName),
            defaultVal: prop.default,
          });
        }

        // Query row count concurrently for each table
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

        return {
          name: tableName,
          primaryKey,
          rowCount,
          columns,
        };
      })
    );

    // Deduplicate tables by table name and sort alphabetically
    const uniqueTables = Array.from(
      new Map(tables.map((t) => [t.name, t])).values()
    );
    uniqueTables.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ success: true, tables: uniqueTables });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error listing database tables";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
