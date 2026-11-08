import { getSupabaseAdminClient } from "@/lib/supabase";

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

  // 1. Try Supabase RPC exec_sql if user created it in their database
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc("exec_sql", { sql: trimmed });
    if (!rpcError && rpcData !== undefined) {
      const execTime = Math.round(performance.now() - startTime);
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
  } catch {
    // RPC not present, fallback to built-in query interpreter
  }

  // 2. Built-in SQL interpreter for common DML statements
  try {
    const lower = trimmed.toLowerCase();

    // SHOW TABLES
    if (lower === "show tables" || lower === "select table_name from information_schema.tables") {
      const knownTables = [
        { table_name: "apps", schema: "public" },
        { table_name: "blog_posts", schema: "public" },
        { table_name: "blog_comments", schema: "public" },
        { table_name: "oauth_clients", schema: "public" },
        { table_name: "oauth_codes", schema: "public" },
        { table_name: "oauth_client_requests", schema: "public" },
      ];
      return {
        success: true,
        data: knownTables,
        columns: ["table_name", "schema"],
        rowCount: knownTables.length,
        executionTimeMs: Math.round(performance.now() - startTime),
      };
    }

    // SELECT query
    if (lower.startsWith("select")) {
      return await executeSelectQuery(trimmed, supabase, startTime);
    }

    // INSERT query
    if (lower.startsWith("insert into")) {
      return await executeInsertQuery(trimmed, supabase, startTime);
    }

    // UPDATE query
    if (lower.startsWith("update")) {
      return await executeUpdateQuery(trimmed, supabase, startTime);
    }

    // DELETE query
    if (lower.startsWith("delete from")) {
      return await executeDeleteQuery(trimmed, supabase, startTime);
    }

    // DDL query (CREATE / ALTER / DROP)
    if (lower.startsWith("create") || lower.startsWith("alter") || lower.startsWith("drop")) {
      return {
        success: false,
        error:
          "Các câu lệnh DDL (CREATE / ALTER / DROP) cần thực thi trực tiếp qua Supabase SQL Editor hoặc cài đặt RPC 'exec_sql'. Vui lòng dùng liên kết Supabase Studio ở góc trên.",
      };
    }

    return {
      success: false,
      error: `Cú pháp SQL chưa được hỗ trợ trực tiếp: ${trimmed.slice(0, 30)}...`,
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

async function executeSelectQuery(sql: string, supabase: any, startTime: number): Promise<SqlQueryResult> {
  const match = sql.match(/select\s+([\s\S]+?)\s+from\s+([a-zA-Z0-9_."]+)([\s\S]*)/i);
  if (!match || !match[1] || !match[2]) {
    return { success: false, error: "Không thể phân tích cú pháp câu lệnh SELECT" };
  }

  const rawCols = match[1];
  const rawTable = match[2];
  const rest = match[3] || "";
  const tableName = rawTable.replace(/^public\./, "").replace(/["`]/g, "").trim();
  const columns = rawCols.trim() === "*" ? "*" : rawCols.replace(/["`]/g, "").trim();

  let query = supabase.from(tableName).select(columns);

  // Parse WHERE
  const whereMatch = rest.match(/\s+where\s+([\s\S]+?)(?:\s+order\s+by|\s+limit|\s+offset|$)/i);
  if (whereMatch && whereMatch[1]) {
    const whereClause = whereMatch[1].trim();
    // Support simple col = 'val' or col = num
    const condMatch = whereClause.match(/([a-zA-Z0-9_]+)\s*(=|!=|>|<|>=|<=|ilike|like)\s*(.+)/i);
    if (condMatch && condMatch[1] && condMatch[2] && condMatch[3]) {
      const col = condMatch[1];
      const op = condMatch[2];
      const rawVal = condMatch[3];
      const cleanVal = rawVal.trim().replace(/^['"]|['"]$/g, "");
      const opLower = op.toLowerCase();
      if (opLower === "=") query = query.eq(col, cleanVal);
      else if (opLower === "!=") query = query.neq(col, cleanVal);
      else if (opLower === ">") query = query.gt(col, cleanVal);
      else if (opLower === "<") query = query.lt(col, cleanVal);
      else if (opLower === ">=") query = query.gte(col, cleanVal);
      else if (opLower === "<=") query = query.lte(col, cleanVal);
      else if (opLower === "like" || opLower === "ilike") query = query.ilike(col, cleanVal);
    }
  }

  // Parse ORDER BY
  const orderMatch = rest.match(/\s+order\s+by\s+([a-zA-Z0-9_]+)(?:\s+(asc|desc))?/i);
  if (orderMatch && orderMatch[1]) {
    const col = orderMatch[1];
    const dir = orderMatch[2];
    query = query.order(col, { ascending: (dir || "asc").toLowerCase() === "asc" });
  }

  // Parse LIMIT
  const limitMatch = rest.match(/\s+limit\s+(\d+)/i);
  const limit = limitMatch && limitMatch[1] ? parseInt(limitMatch[1], 10) : 50;
  query = query.limit(Math.min(limit, 200));

  const { data, error } = await query;
  if (error) throw error;

  const rows = data || [];
  const colKeys = rows.length > 0 && rows[0]
    ? Object.keys(rows[0])
    : columns === "*"
    ? []
    : columns.split(",").map((c: string) => c.trim());

  return {
    success: true,
    data: rows,
    columns: colKeys,
    rowCount: rows.length,
    executionTimeMs: Math.round(performance.now() - startTime),
  };
}

async function executeInsertQuery(sql: string, supabase: any, startTime: number): Promise<SqlQueryResult> {
  const match = sql.match(/insert\s+into\s+([a-zA-Z0-9_."]+)\s*\(([\s\S]+?)\)\s*values\s*\(([\s\S]+?)\)/i);
  if (!match || !match[1] || !match[2] || !match[3]) {
    return { success: false, error: "Cú pháp INSERT INTO cần có: (col1, col2) VALUES ('val1', 'val2')" };
  }

  const rawTable = match[1];
  const rawCols = match[2];
  const rawVals = match[3];
  const tableName = rawTable.replace(/^public\./, "").replace(/["`]/g, "").trim();
  const cols = rawCols.split(",").map((c) => c.trim().replace(/["`]/g, ""));
  const vals = rawVals.split(",").map((v) => {
    const trimmedVal = v.trim();
    if (trimmedVal.startsWith("'") && trimmedVal.endsWith("'")) return trimmedVal.slice(1, -1);
    if (!isNaN(Number(trimmedVal))) return Number(trimmedVal);
    if (trimmedVal.toLowerCase() === "true") return true;
    if (trimmedVal.toLowerCase() === "false") return false;
    if (trimmedVal.toLowerCase() === "null") return null;
    return trimmedVal;
  });

  const record: Record<string, any> = {};
  cols.forEach((col, idx) => {
    record[col] = vals[idx];
  });

  const { data, error } = await supabase.from(tableName).insert(record).select();
  if (error) throw error;

  return {
    success: true,
    data: data || [record],
    columns: Object.keys(record),
    rowCount: (data || [record]).length,
    message: "Đã chèn bản ghi thành công!",
    executionTimeMs: Math.round(performance.now() - startTime),
  };
}

async function executeUpdateQuery(sql: string, supabase: any, startTime: number): Promise<SqlQueryResult> {
  const match = sql.match(/update\s+([a-zA-Z0-9_."]+)\s+set\s+([\s\S]+?)\s+where\s+([\s\S]+)/i);
  if (!match || !match[1] || !match[2] || !match[3]) {
    return { success: false, error: "Cú pháp UPDATE cần mệnh đề WHERE để tránh cập nhật toàn bộ bảng" };
  }

  const rawTable = match[1];
  const rawSet = match[2];
  const rawWhere = match[3];
  const tableName = rawTable.replace(/^public\./, "").replace(/["`]/g, "").trim();

  const updates: Record<string, any> = {};
  rawSet.split(",").forEach((item) => {
    const [k, v] = item.split("=").map((s) => s.trim());
    if (k && v !== undefined) {
      const cleanKey = k.replace(/["`]/g, "");
      updates[cleanKey] = v.startsWith("'") && v.endsWith("'") ? v.slice(1, -1) : v;
    }
  });

  let query = supabase.from(tableName).update(updates);
  const condMatch = rawWhere.trim().match(/([a-zA-Z0-9_]+)\s*(=|!=)\s*(.+)/);
  if (condMatch && condMatch[1] && condMatch[2] && condMatch[3]) {
    const col = condMatch[1];
    const op = condMatch[2];
    const val = condMatch[3];
    const cleanVal = val.trim().replace(/^['"]|['"]$/g, "");
    if (op === "=") query = query.eq(col, cleanVal);
    else query = query.neq(col, cleanVal);
  }

  const { data, error } = await query.select();
  if (error) throw error;

  return {
    success: true,
    data: data || [],
    columns: Object.keys(updates),
    rowCount: (data || []).length,
    message: `Đã cập nhật ${(data || []).length} bản ghi!`,
    executionTimeMs: Math.round(performance.now() - startTime),
  };
}

async function executeDeleteQuery(sql: string, supabase: any, startTime: number): Promise<SqlQueryResult> {
  const match = sql.match(/delete\s+from\s+([a-zA-Z0-9_."]+)\s+where\s+([\s\S]+)/i);
  if (!match || !match[1] || !match[2]) {
    return { success: false, error: "Cú pháp DELETE FROM bắt buộc phải có điều kiện WHERE để đảm bảo an toàn" };
  }

  const rawTable = match[1];
  const rawWhere = match[2];
  const tableName = rawTable.replace(/^public\./, "").replace(/["`]/g, "").trim();

  let query = supabase.from(tableName).delete();
  const condMatch = rawWhere.trim().match(/([a-zA-Z0-9_]+)\s*(=|!=)\s*(.+)/);
  if (condMatch && condMatch[1] && condMatch[2] && condMatch[3]) {
    const col = condMatch[1];
    const op = condMatch[2];
    const val = condMatch[3];
    const cleanVal = val.trim().replace(/^['"]|['"]$/g, "");
    if (op === "=") query = query.eq(col, cleanVal);
    else query = query.neq(col, cleanVal);
  }

  const { data, error } = await query.select();
  if (error) throw error;

  return {
    success: true,
    data: data || [],
    rowCount: (data || []).length,
    message: `Đã xóa ${(data || []).length} bản ghi thành công!`,
    executionTimeMs: Math.round(performance.now() - startTime),
  };
}
