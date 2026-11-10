import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { TableMeta, ColumnMeta } from "@/app/database/types";

export type { TableMeta, ColumnMeta };

export async function GET() {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdminClient();

    // 1. Get list of tables using information_schema (more reliable with Supabase permissions)
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');
    if (tablesError) throw tablesError;

    // 2. Get column metadata from information_schema
    const { data: columnsData, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('table_name, column_name, data_type, is_nullable, column_default')
      .eq('table_schema', 'public');
    if (columnsError) throw columnsError;

    // 3. Get primary keys from information_schema
    const { data: pkData, error: pkError } = await supabase
      .from('information_schema.key_column_usage')
      .select('table_name, column_name')
      .eq('constraint_name', 'primary');
    if (pkError) throw pkError;

    // 4. Build enhanced table metadata
    const enhancedTables: TableMeta[] = tablesData.map(table => {
      const tableName = table.table_name;
      const tableColumns = columnsData
        .filter(c => c.table_name === tableName)
        .map(col => ({
          name: col.column_name,
          type: col.data_type,
          isPrimaryKey: pkData.some(pk => 
            pk.table_name === tableName && pk.column_name === col.column_name
          ),
          required: col.is_nullable === 'NO',
          defaultVal: col.column_default
        } as ColumnMeta));

      const primaryKey = pkData.find(pk => pk.table_name === tableName)?.column_name || 'id';
      const rowCount = 0; // We'll get this separately

      return {
        name: tableName,
        primaryKey,
        rowCount,
        columns: tableColumns
      };
    });

    // 5. Get row counts for each table
    for (const table of enhancedTables) {
      try {
        const { count } = await supabase
          .from(table.name)
          .select('*', { count: 'exact', head: true });
        table.rowCount = count || 0;
      } catch {
        table.rowCount = 0;
      }
    }

    return NextResponse.json({ 
      success: true, 
      tables: enhancedTables 
    });
  } catch (err: unknown) {
    console.error("Database tables listing error:", err);
    let status = 500;
    let message = "Error listing database tables";
    
    if (err instanceof Error) {
      // Handle specific Supabase errors
      if (err.message.includes("permission denied")) {
        status = 403;
        message = "Permission denied - check database permissions";
      } else if (err.message.includes("connection")) {
        status = 503;
        message = "Database connection error";
      }
    }

    return NextResponse.json({ 
      success: false,
      error: message,
      details: err instanceof Error ? err.message : undefined 
    }, { status });
  }
}
