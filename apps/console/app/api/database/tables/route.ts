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

    // 2. Get table metadata - fallback to basic info if function doesn't exist
    let columnsData: any[] = [];
    let pkData: any[] = [];
    let tableCounts: any[] = [];

    try {
      const { data: metadata, error: metadataError } = await supabase
        .rpc('get_table_metadata_with_counts');
      
      if (!metadataError && metadata) {
        columnsData = metadata.columns || [];
        pkData = metadata.primary_keys || [];
        tableCounts = metadata.table_counts || [];
      } else {
        console.warn('Metadata function not available, using fallback');
        // Fallback to basic table info without column details
        columnsData = tablesData.map(t => ({
          table_name: t.table_name,
          column_name: 'id',
          data_type: 'text',
          is_nullable: false,
          column_default: null
        }));
        pkData = tablesData.map(t => ({
          table_name: t.table_name,
          column_name: 'id'
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch metadata:', err);
      // Continue with fallback data
    }

    // 4. Build enhanced table metadata with counts
    const enhancedTables: TableMeta[] = tablesData.map(table => {
      const tableName = table.table_name;
      
      // Get columns for this table
      const tableColumns = columnsData
        .filter((c: any) => c.table_name === tableName)
        .map((col: any) => ({
          name: col.column_name,
          type: col.data_type || 'text',
          isPrimaryKey: pkData.some((pk: any) => 
            pk.table_name === tableName && pk.column_name === col.column_name
          ),
          required: col.is_nullable === false,
          defaultVal: col.column_default
        } as ColumnMeta));

      // Fallback if no columns found
      if (tableColumns.length === 0) {
        tableColumns.push({
          name: 'id',
          type: 'text',
          isPrimaryKey: true,
          required: true,
          defaultVal: null
        });
      }

      const primaryKey = pkData.find((pk: any) => pk.table_name === tableName)?.column_name || 'id';
      const rowCount = tableCounts.find((tc: any) => tc.table_name === tableName)?.row_count || 0;

      return {
        name: tableName,
        primaryKey,
        rowCount,
        columns: tableColumns
      };
    });

    if (enhancedTables.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No tables found in database",
        tables: []
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        tables: enhancedTables,
        count: enhancedTables.length,
        totalRows: enhancedTables.reduce((sum, table) => sum + table.rowCount, 0)
      }
    });
  } catch (err: unknown) {
    console.error("Database tables listing error:", err);
    const error = err instanceof Error ? err : new Error("Unknown error");
    
    // Return basic table list even if metadata fails
    if (tablesData?.length > 0) {
      const basicTables = tablesData.map(t => ({
        name: t.table_name,
        primaryKey: 'id',
        rowCount: 0,
        columns: [{
          name: 'id',
          type: 'text',
          isPrimaryKey: true,
          required: true,
          defaultVal: null
        }]
      }));
      
      return NextResponse.json({ 
        success: true,
        tables: basicTables,
        warning: "Limited metadata available: " + error.message
      });
    }

    const statusCode = error.message.includes("permission denied") ? 403 : 
                     error.message.includes("not found") ? 404 : 500;
    
    return NextResponse.json({
      success: false,
      error: "Database tables listing failed",
      message: error.message,
      details: process.env.NODE_ENV === "development" ? {
        stack: error.stack,
        tablesData: tablesData,
        columnsData: columnsData,
        pkData: pkData
      } : undefined
    }, { 
      status: statusCode 
    });
  }
}
