import { getSupabaseAdminClient } from "@/lib/supabase";
import {
  executeSelectQuery,
  executeInsertQuery,
  executeUpdateQuery,
  executeDeleteQuery,
} from "./sql-dml-parser";

export interface SqlQueryResult {
  success: boolean;
  data?: Record<string, any>[];
  columns?: string[];
  rowCount?: number;
  executionTimeMs?: number;
  message?: string;
  error?: string;
}

/**
 * Execute raw or parsed SQL queries using Supabase Service Role
 */
export async function executeSqlQuery(sql: string): Promise<SqlQueryResult> {
  const startTime = performance.now();
  const trimmed = sql.trim().replace(/;+$/, "").trim();

  if (!trimmed) {
    return { success: false, error: "Câu lệnh SQL rỗng" };
  }

  const supabase = getSupabaseAdminClient() as any;
  const lower = trimmed.toLowerCase();

  // 1. SELECT and SHOW TABLES Queries: route to DML reader for structured row results
  if (lower === "show tables" || lower === "select table_name from information_schema.tables") {
    const knownTables = [
      { table_name: "apps", schema: "public" },
      { table_name: "app_requests", schema: "public" },
      { table_name: "app_remote_configs", schema: "public" },
      { table_name: "app_permissions", schema: "public" },
      { table_name: "app_docs_pages", schema: "public" },
      { table_name: "app_legal_docs", schema: "public" },
      { table_name: "blog_posts", schema: "public" },
      { table_name: "blog_comments", schema: "public" },
      { table_name: "oauth_clients", schema: "public" },
      { table_name: "oauth_codes", schema: "public" },
      { table_name: "iam_roles", schema: "public" },
      { table_name: "iam_role_permissions", schema: "public" },
      { table_name: "iam_user_roles", schema: "public" },
      { table_name: "telebot_subscribers", schema: "public" },
    ];
    return {
      success: true,
      data: knownTables,
      columns: ["table_name", "schema"],
      rowCount: knownTables.length,
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  }

  if (lower.startsWith("select")) {
    try {
      return await executeSelectQuery(trimmed, supabase, startTime);
    } catch {
      // Fall through to RPC if custom SELECT has syntax or join unhandled by simple parser
    }
  }

  // 2. Execute via Supabase RPC exec_sql (Supports DDL, DML, multiple statements, transactions)
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc("exec_sql", { sql: trimmed });
    const execTime = Math.round(performance.now() - startTime);

    if (rpcError) {
      const isMissingRpc =
        rpcError.code === "PGRST202" ||
        rpcError.message?.toLowerCase().includes("schema cache") ||
        rpcError.message?.toLowerCase().includes("could not find the function");

      if (isMissingRpc) {
        if (lower.startsWith("create") || lower.startsWith("alter") || lower.startsWith("drop")) {
          return {
            success: false,
            error:
              "Các câu lệnh DDL (CREATE / ALTER / DROP) cần thực thi trực tiếp qua Supabase SQL Editor hoặc cài đặt RPC 'exec_sql'. Vui lòng dùng liên kết Supabase Studio ở góc trên.",
          };
        }
      } else {
        // Return exact Postgres error message without masking
        return {
          success: false,
          error: rpcError.message || rpcError.details || "Lỗi thực thi SQL trên Supabase Postgres",
          executionTimeMs: execTime,
        };
      }
    } else if (rpcData !== undefined) {
      if (rpcData && typeof rpcData === "object" && !Array.isArray(rpcData)) {
        if (rpcData.success === false) {
          return {
            success: false,
            error: rpcData.error || "Lỗi thực thi SQL",
            executionTimeMs: execTime,
          };
        }
        if (rpcData.success === true && !rpcData.data) {
          return {
            success: true,
            message: rpcData.message || "Thực thi câu lệnh SQL thành công!",
            executionTimeMs: execTime,
            rowCount: 0,
          };
        }
      }

      const rows = Array.isArray(rpcData) ? rpcData : [rpcData];
      const cols = rows.length > 0 && typeof rows[0] === "object" ? Object.keys(rows[0]) : [];
      return {
        success: true,
        data: rows,
        columns: cols,
        rowCount: rows.length,
        executionTimeMs: execTime,
      };
    }
  } catch (err: unknown) {
    console.warn("RPC exec_sql invocation error, falling back to DML:", err);
  }

  // 3. Built-in DML fallback when RPC is unavailable
  try {
    if (lower.startsWith("insert into")) {
      return await executeInsertQuery(trimmed, supabase, startTime);
    }
    if (lower.startsWith("update")) {
      return await executeUpdateQuery(trimmed, supabase, startTime);
    }
    if (lower.startsWith("delete from")) {
      return await executeDeleteQuery(trimmed, supabase, startTime);
    }

    if (lower.startsWith("create") || lower.startsWith("alter") || lower.startsWith("drop")) {
      return {
        success: false,
        error:
          "Các câu lệnh DDL (CREATE / ALTER / DROP) cần thực thi trực tiếp qua Supabase SQL Editor (quyền Superuser) hoặc cần cài đặt hàm RPC 'exec_sql' một lần duy nhất. Bạn hãy mở Supabase Studio từ nút ở trên để chạy lệnh này.",
      };
    }

    return {
      success: false,
      error: `Cú pháp SQL chưa được hỗ trợ trực tiếp: ${trimmed.slice(0, 40)}...`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi thực thi SQL";
    return {
      success: false,
      error: msg,
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  }
}
