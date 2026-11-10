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

    // 1. Get list of tables using a custom RPC function
    const { data: tablesData, error: tablesError } = await supabase
      .rpc('get_public_tables_list');
    
    console.log('Tables query result:', { data: tablesData, error: tablesError });
    if (tablesError) {
      console.error('Tables query failed:', tablesError);
      throw tablesError;
    }

    // 2. Get table metadata using RPC
    const { data: metadata, error: metadataError } = await supabase
      .rpc('get_table_metadata_with_counts');
    
    console.log('Metadata query result:', { data: metadata, error: metadataError });
    if (metadataError) {
      console.error('Metadata query failed:', metadataError);
      throw metadataError;
    }

    const columnsData = metadata?.columns || [];
    const pkData = metadata?.primary_keys || [];
    const tableCounts = metadata?.table_counts || [];

    // 4. Build enhanced table metadata with counts
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
      const rowCount = tableCounts.find((tc: any) => tc.table_name === tableName)?.row_count || 0;

      return {
        name: tableName,
        primaryKey,
        rowCount,
        columns: tableColumns
      };
    });

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
