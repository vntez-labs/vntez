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
    console.log('Supabase client initialized:', !!supabase);

    // 1. Get list of tables from public schema
    const { data: tablesData, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tablesError) throw tablesError;

    // 2. Get all metadata in one RPC call
    const { data: metadata, error: metadataError } = await supabase
      .rpc('get_table_metadata');
    
    if (metadataError) throw metadataError;

    const columnsData = metadata?.columns || [];
    const pkData = metadata?.primary_keys || [];

    // 4. Build enhanced table metadata
    const enhancedTables: TableMeta[] = tablesData.map(table => {
      const tableName = table.table_name;
      const tableColumns = columnsData
        .filter((c: any) => c.table_name === tableName)
        .map((col: any) => ({
          name: col.column_name,
          type: col.data_type,
          isPrimaryKey: pkData.some((pk: any) => 
            pk.table_name === tableName && pk.column_name === col.column_name
          ),
          required: !col.is_nullable,
          defaultVal: col.column_default
        } as ColumnMeta));

      const primaryKey = pkData.find((pk: any) => pk.table_name === tableName)?.column_name || 'id';
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
    const error = err instanceof Error ? err : new Error("Unknown error");
    
    return NextResponse.json({
      success: false,
      error: "Failed to fetch database metadata",
      details: {
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      }
    }, { 
      status: error.message.includes("permission denied") ? 403 : 500 
    });
  }
}
