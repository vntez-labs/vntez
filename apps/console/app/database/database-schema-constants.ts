/**
 * Centralized Schema Constants, Table Metadata & SQL Helper Utilities
 * Reusable across Database Table Tabs, SQL Schema Sidebar, and Monaco Editor.
 */

export interface TableDisplayInfo {
  name: string;
  display: string;
  tag: string;
  description: string;
  defaultColumns: string[];
  primaryKey: string;
}

export const TABLE_METADATA_MAP: Record<string, Partial<TableDisplayInfo>> = {
  apps: {
    display: "apps",
    tag: "Apps & OAuth",
    description: "Danh mục ứng dụng và OAuth clients trong hệ sinh thái VNTEZ",
    defaultColumns: ["id", "name", "category", "status", "url"],
    primaryKey: "id",
  },
  app_requests: {
    display: "app_requests",
    tag: "Requests",
    description: "Yêu cầu tích hợp ứng dụng và OAuth từ đối tác / lập trình viên",
    defaultColumns: ["id", "app_name", "team_email", "status", "created_at"],
    primaryKey: "id",
  },
  oauth_client_requests: {
    display: "oauth_client_requests",
    tag: "Legacy",
    description: "Bảng yêu cầu client OAuth cũ (tiền thân của app_requests)",
    defaultColumns: ["id", "app_name", "team_email", "status", "created_at"],
    primaryKey: "id",
  },
  oauth_codes: {
    display: "oauth_codes",
    tag: "PKCE",
    description: "Mã Authorization Code trao đổi PKCE ngắn hạn (10 phút)",
    defaultColumns: ["code", "client_id", "user_id", "used", "expires_at"],
    primaryKey: "code",
  },
  blog_posts: {
    display: "blog_posts",
    tag: "Blog",
    description: "Bài viết kỹ thuật, tài liệu kiến trúc và tin tức hệ sinh thái",
    defaultColumns: ["slug", "title", "category", "published", "views_count"],
    primaryKey: "slug",
  },
  blog_comments: {
    display: "blog_comments",
    tag: "Comments",
    description: "Bình luận trao đổi của người dùng dưới các bài blog",
    defaultColumns: ["id", "post_slug", "author_name", "content", "created_at"],
    primaryKey: "id",
  },
  telebot_subscribers: {
    display: "telebot_subscribers",
    tag: "TeleBot",
    description: "Danh sách người nhận thông báo Telegram kèm Email và User ID liên kết",
    defaultColumns: ["chat_id", "email", "user_id", "username", "status"],
    primaryKey: "chat_id",
  },
  oauth_clients: {
    display: "oauth_clients",
    tag: "Legacy",
    description: "Bảng cấu hình OAuth cũ (đã được hợp nhất vào bảng apps)",
    defaultColumns: ["client_id", "project_name", "is_active"],
    primaryKey: "client_id",
  },
  iam_roles: {
    display: "iam_roles",
    tag: "IAM Roles",
    description: "Danh sách vai trò người dùng trong hệ thống phân quyền IAM (app_id null = Root)",
    defaultColumns: ["id", "app_id", "name", "description", "updated_at"],
    primaryKey: "id",
  },
  iam_role_permissions: {
    display: "iam_role_permissions",
    tag: "IAM Perms",
    description: "Ma trận quyền hạn chi tiết gắn với từng vai trò hệ thống",
    defaultColumns: ["id", "role_id", "permission", "created_at"],
    primaryKey: "id",
  },
  iam_user_roles: {
    display: "iam_user_roles",
    tag: "User Roles",
    description: "Liên kết gán vai trò IAM cho từng tài khoản người dùng",
    defaultColumns: ["id", "user_id", "role_id", "app_id", "created_at"],
    primaryKey: "id",
  },
  app_remote_configs: {
    display: "app_remote_configs",
    tag: "Remote Config",
    description: "Cấu hình JSON thời gian thực và cờ tính năng cho từng ứng dụng",
    defaultColumns: ["app_id", "is_enabled", "config", "updated_at"],
    primaryKey: "app_id",
  },
  app_permissions: {
    display: "app_permissions",
    tag: "App IAM",
    description: "Ma trận vai trò, tài nguyên và quyền hạn riêng biệt của từng ứng dụng",
    defaultColumns: ["app_id", "roles", "resources", "role_permissions", "updated_at"],
    primaryKey: "app_id",
  },
  app_docs_pages: {
    display: "app_docs_pages",
    tag: "Docs MDX",
    description: "Tài liệu kỹ thuật định dạng MDX phân nhánh theo từng ứng dụng",
    defaultColumns: ["id", "app_id", "slug", "title", "category", "updated_at"],
    primaryKey: "id",
  },
  app_legal_docs: {
    display: "app_legal_docs",
    tag: "Legal MDX",
    description: "Chính sách bảo mật và điều khoản dịch vụ pháp lý của từng ứng dụng",
    defaultColumns: ["id", "app_id", "slug", "title", "version", "effective_date"],
    primaryKey: "id",
  },
};

/**
 * Get formatted table display information including Vietnamese tag, description and primary key
 */
export function getTableDisplayInfo(tableName: string): {
  display: string;
  tag: string;
  description: string;
  defaultColumns: string[];
  primaryKey: string;
} {
  const meta = TABLE_METADATA_MAP[tableName];
  return {
    display: meta?.display || tableName,
    tag: meta?.tag || "Table",
    description: meta?.description || `Bảng dữ liệu Postgres: ${tableName}`,
    defaultColumns: meta?.defaultColumns || [],
    primaryKey: meta?.primaryKey || "id",
  };
}

/**
 * Generate an optimized SELECT query using primary columns instead of heavy SELECT *
 */
export function generateSelectQuery(tableName: string, limit = 20): string {
  const meta = TABLE_METADATA_MAP[tableName];
  if (meta?.defaultColumns && meta.defaultColumns.length > 0) {
    return `SELECT ${meta.defaultColumns.join(", ")} FROM ${tableName} LIMIT ${limit};`;
  }
  return `SELECT * FROM ${tableName} LIMIT ${limit};`;
}

/**
 * Standard SQL Keywords for Monaco Editor and Query Builder Autocomplete
 */
export const SQL_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "ORDER BY",
  "GROUP BY",
  "LIMIT",
  "OFFSET",
  "INSERT INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE FROM",
  "JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "ON",
  "COUNT",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
  "DISTINCT",
  "AS",
  "AND",
  "OR",
  "NOT",
  "IN",
  "IS NULL",
  "IS NOT NULL",
  "LIKE",
  "ILIKE",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "ASC",
  "DESC",
  "SHOW TABLES;",
  "DESCRIBE",
];
