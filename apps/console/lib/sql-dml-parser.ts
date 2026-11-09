import type { SqlQueryResult } from "./sql-executor";

export async function executeSelectQuery(
  sql: string,
  supabase: any,
  startTime: number
): Promise<SqlQueryResult> {
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

export async function executeInsertQuery(
  sql: string,
  supabase: any,
  startTime: number
): Promise<SqlQueryResult> {
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

export async function executeUpdateQuery(
  sql: string,
  supabase: any,
  startTime: number
): Promise<SqlQueryResult> {
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

export async function executeDeleteQuery(
  sql: string,
  supabase: any,
  startTime: number
): Promise<SqlQueryResult> {
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
