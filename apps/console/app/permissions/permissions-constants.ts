import type { RoleDefinition } from "./permissions-types";

export const IAM_API_URL = process.env.NEXT_PUBLIC_IAM_API_URL || "https://iam.hnamhocit.workers.dev";

export const STANDARD_RESOURCES = [
  "apps",
  "users",
  "database",
  "blog",
  "storage",
  "telebot",
  "settings",
];

export const RESOURCE_DETAILS: Record<string, { label: string; description: string }> = {
  apps: {
    label: "Ứng dụng & OAuth",
    description: "Quản lý ứng dụng nội bộ/bên thứ 3, cấp Client ID & Secret, Redirect URIs",
  },
  users: {
    label: "Người dùng & Định danh",
    description: "Quản lý hồ sơ, tài khoản người dùng, gán vai trò RBAC và kiểm soát truy cập",
  },
  database: {
    label: "Cơ sở dữ liệu Postgres",
    description: "Quản trị bảng dữ liệu, lược đồ schema, thực thi truy vấn SQL và phân quyền bảng",
  },
  blog: {
    label: "Blog & Bình luận",
    description: "Quản trị bài viết kỹ thuật, xuất bản bài viết và kiểm duyệt bình luận",
  },
  storage: {
    label: "Lưu trữ đám mây R2",
    description: "Lưu trữ tệp tin Cloudflare R2, tải lên, xem danh sách và cấp URL tải an toàn",
  },
  telebot: {
    label: "TeleBot Telegram",
    description: "Cấu hình Webhook, gửi broadcast thông báo hệ thống và quản lý người đăng ký bot",
  },
  settings: {
    label: "Cài đặt Hệ thống",
    description: "Cấu hình biến môi trường toàn cục, thiết lập bảo mật và quản trị Console",
  },
};

export const STANDARD_ACTIONS = [
  "create",
  "read:self",
  "read:all",
  "update:self",
  "update:all",
  "delete:self",
  "delete:all",
];

export const ALL_PERMISSIONS = STANDARD_RESOURCES.flatMap((res) =>
  STANDARD_ACTIONS.map((act) => `${res}:${act}`)
);

export const ROOT_DEFAULT_ROLES: RoleDefinition[] = [
  {
    id: "admin",
    name: "Quản trị viên (Super Admin)",
    description: "Toàn quyền kiểm soát mọi tài nguyên trên toàn hệ sinh thái VNTEZ",
    is_system: true,
    permissions: ["*:*"],
  },
  {
    id: "developer",
    name: "Lập trình viên (Developer)",
    description: "Toàn quyền với Storage R2, TeleBot, Database và Apps; chỉ sửa hồ sơ cá nhân",
    is_system: true,
    permissions: [],
  },
  {
    id: "operator",
    name: "Điều hành viên (Operator)",
    description: "Vận hành nội dung Blog, TeleBot broadcast và xem thông tin tài khoản người dùng",
    is_system: true,
    permissions: [],
  },
  {
    id: "viewer",
    name: "Người xem (Viewer)",
    description: "Chỉ được xem thông tin công khai (Read-only) trên các phân hệ cơ bản",
    is_system: true,
    permissions: [],
  },
];

export const INITIAL_ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ["*:*"],
  developer: [
    "apps:create",
    "apps:read:all",
    "apps:update:all",
    "database:read:all",
    "database:update:all",
    "storage:create",
    "storage:read:all",
    "storage:update:all",
    "telebot:create",
    "telebot:read:all",
    "users:read:self",
    "users:update:self",
    "blog:read:all",
  ],
  operator: [
    "apps:read:all",
    "blog:create",
    "blog:read:all",
    "blog:update:all",
    "blog:delete:all",
    "telebot:create",
    "telebot:read:all",
    "users:read:all",
  ],
  viewer: [
    "apps:read:all",
    "blog:read:all",
    "users:read:self",
  ],
};

export const DEFAULT_APP_ROLES: RoleDefinition[] = [
  { id: "admin", name: "Quản trị viên App", description: "Toàn quyền quản trị app này", is_system: true, permissions: [] },
  { id: "member", name: "Thành viên App", description: "Người dùng tiêu chuẩn", is_system: true, permissions: [] },
  { id: "viewer", name: "Người xem App", description: "Chỉ đọc tài nguyên app", is_system: true, permissions: [] },
];

export function parseAppScopeConfig(app: any, appId: string) {
  const resources: string[] = app?.resources && app.resources.length > 0
    ? app.resources
    : ["users", "settings", "analytics", "storage"];

  const roles: RoleDefinition[] = app?.roles && app.roles.length > 0
    ? app.roles.map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description || `Vai trò của app ${appId}`,
        is_system: Boolean(r.isSystem),
        permissions: [],
      }))
    : DEFAULT_APP_ROLES;

  const rawPerms = app?.rolePermissions || {};
  const permsMap: Record<string, Set<string>> = {};
  roles.forEach((r) => {
    permsMap[r.id] = new Set(rawPerms[r.id] || []);
  });

  return { resources, roles, permsMap };
}
