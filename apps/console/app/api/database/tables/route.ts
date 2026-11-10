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

    // 1. Get list of tables with row counts
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables_with_counts');
    if (tablesError) throw tablesError;

    // 2. Get column metadata from information_schema
    const { data: columnsData, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('table_name, column_name, data_type, is_nullable, column_default')
      .eq('table_schema', 'public');
    if (columnsError) throw columnsError;

    // 3. Get primary keys
    const { data: pkData, error: pkError } = await supabase
      .from('information_schema.key_column_usage')
      .select('table_name, column_name')
      .eq('constraint_name', 'primary');
    if (pkError) throw pkError;

    // 4. Build enhanced table metadata
    const enhancedTables: TableMeta[] = tables.map(table => {
      const tableColumns = columnsData
        .filter(c => c.table_name === table.name)
        .map(col => ({
          name: col.column_name,
          type: col.data_type,
          isPrimaryKey: pkData.some(pk => 
            pk.table_name === table.name && pk.column_name === col.column_name
          ),
          required: col.is_nullable === 'NO',
          defaultVal: col.column_default
        } as ColumnMeta));

      const primaryKey = pkData.find(pk => pk.table_name === table.name)?.column_name || 'id';

      return {
        name: table.name,
        primaryKey,
        rowCount: table.row_count || 0,
        columns: tableColumns
      };
    });

    return NextResponse.json({ 
      success: true, 
      tables: enhancedTables 
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error listing database tables";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
