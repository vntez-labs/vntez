export interface SqlSuggestion {
  label: string;
  type: "keyword" | "table" | "column" | "function";
  detail?: string;
  insertText: string;
}

export const SQL_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "INSERT INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE FROM",
  "ORDER BY",
  "GROUP BY",
  "LIMIT",
  "OFFSET",
  "JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "ON",
  "AS",
  "AND",
  "OR",
  "NOT",
  "LIKE",
  "ILIKE",
  "IN",
  "IS NULL",
  "IS NOT NULL",
  "ASC",
  "DESC",
  "SHOW TABLES",
  "CREATE TABLE",
  "ALTER TABLE",
  "DROP TABLE",
];

export const SQL_FUNCTIONS = ["COUNT(*)", "SUM", "AVG", "MIN", "MAX", "NOW()", "LOWER", "UPPER", "COALESCE"];

export const KNOWN_TABLES: Record<string, string[]> = {
  apps: ["id", "name", "description", "url", "release_date", "platforms", "avatar_url", "status", "created_at", "updated_at"],
  app_requests: ["id", "app_name", "team_email", "redirect_uris", "url", "status", "created_at"],
  blog_posts: ["slug", "title", "excerpt", "content", "category", "author", "date", "read_time", "status", "likes_count", "views_count", "created_at"],
  blog_comments: ["id", "post_slug", "parent_id", "reply_to_author", "author", "avatar", "content", "likes_count", "created_at"],
  oauth_codes: ["code", "client_id", "user_id", "redirect_uri", "scope", "code_challenge", "expires_at", "used", "created_at"],
  oauth_client_requests: ["id", "app_name", "team_email", "redirect_uris", "status", "created_at"],
  oauth_clients: ["client_id", "name", "description", "redirect_uris", "logo_url", "is_internal", "created_at"],
};

export function getSqlSuggestions(
  currentWord: string,
  customTables?: Record<string, string[]>
): SqlSuggestion[] {
  const q = currentWord.toLowerCase().trim();
  if (!q) return [];

  const tablesMap = { ...KNOWN_TABLES, ...(customTables || {}) };
  const list: SqlSuggestion[] = [];

  // Table matches
  for (const table of Object.keys(tablesMap)) {
    if (table.toLowerCase().includes(q)) {
      list.push({
        label: table,
        type: "table",
        detail: "Database Table",
        insertText: table,
      });
    }
  }

  // Column matches
  for (const [table, cols] of Object.entries(tablesMap)) {
    for (const col of cols) {
      if (col.toLowerCase().includes(q) && !list.some((s) => s.label === col)) {
        list.push({
          label: col,
          type: "column",
          detail: `Column in ${table}`,
          insertText: col,
        });
      }
    }
  }

  // Keyword matches
  for (const kw of SQL_KEYWORDS) {
    if (kw.toLowerCase().startsWith(q) || kw.toLowerCase().includes(q)) {
      list.push({
        label: kw,
        type: "keyword",
        detail: "SQL Keyword",
        insertText: kw + " ",
      });
    }
  }

  // Function matches
  for (const fn of SQL_FUNCTIONS) {
    if (fn.toLowerCase().includes(q)) {
      list.push({
        label: fn,
        type: "function",
        detail: "SQL Aggregate Function",
        insertText: fn.includes("(") ? fn : `${fn}()`,
      });
    }
  }

  return list.slice(0, 10);
}
