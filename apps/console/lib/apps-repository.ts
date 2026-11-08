import crypto from "crypto";
import type {
  AppItem,
  AppRole,
  AppDocPage,
  AppLegalDocument,
} from "@workspace/ui/lib/content-types";

export const STANDARD_APP_RESOURCES = [
  "users",
  "files",
  "database",
  "api",
  "settings",
];

export const STANDARD_APP_ACTIONS = [
  "create",
  "read:self",
  "read:all",
  "update:self",
  "update:all",
  "delete:self",
  "delete:all",
];

export const DEFAULT_APP_ROLES: AppRole[] = [
  { id: "admin", name: "Quản trị viên (Admin)", description: "Toàn quyền quản trị tài nguyên app", isSystem: true },
  { id: "developer", name: "Lập trình viên (Developer)", description: "Truy cập API, database và cấu hình", isSystem: true },
  { id: "member", name: "Thành viên (Member)", description: "Thao tác trên dữ liệu được phân công", isSystem: true },
  { id: "viewer", name: "Người xem (Viewer)", description: "Chỉ đọc dữ liệu cá nhân", isSystem: true },
];

export interface AppMetadata {
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  isInternal: boolean;
  roles: AppRole[];
  resources: string[];
  rolePermissions: Record<string, string[]>;
  docsPages: AppDocPage[];
  legalDocuments: AppLegalDocument[];
  remoteConfig: Record<string, unknown>;
}

export function generateAppClientId(appId: string): string {
  const clean = appId.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `vntez_${clean}`;
}

export function generateAppSecret(): string {
  return `vsec_${crypto.randomBytes(24).toString("hex")}`;
}

export function buildDefaultRolePerms(appId: string): Record<string, string[]> {
  const allPerms: string[] = [];
  STANDARD_APP_RESOURCES.forEach((r) => {
    STANDARD_APP_ACTIONS.forEach((a) => {
      allPerms.push(`${appId}:${r}:${a}`);
    });
  });

  return {
    admin: allPerms,
    developer: [
      `${appId}:users:read:all`,
      `${appId}:database:read:all`,
      `${appId}:database:update:all`,
      `${appId}:api:create`,
      `${appId}:api:read:all`,
      `${appId}:settings:read:all`,
    ],
    member: [
      `${appId}:users:read:self`,
      `${appId}:users:update:self`,
      `${appId}:files:create`,
      `${appId}:files:read:self`,
      `${appId}:database:read:self`,
      `${appId}:database:update:self`,
    ],
    viewer: [
      `${appId}:users:read:self`,
      `${appId}:files:read:self`,
      `${appId}:database:read:self`,
    ],
  };
}

export function getDefaultMetadata(app: AppItem): AppMetadata {
  const clientId = app.clientId || generateAppClientId(app.id);
  const clientSecret = app.clientSecret || generateAppSecret();
  const redirectUris = app.redirectUris || [
    `https://${app.id}.vntez.net/auth/callback`,
    "http://localhost:3000/auth/callback",
  ];
  const isInternal = app.isInternal !== undefined ? app.isInternal : true;
  const roles = app.roles && app.roles.length > 0 ? app.roles : DEFAULT_APP_ROLES;
  const resources = app.resources && app.resources.length > 0 ? app.resources : STANDARD_APP_RESOURCES;
  const rolePermissions = app.rolePermissions || buildDefaultRolePerms(app.id);

  const docsPages: AppDocPage[] = [
    {
      slug: "index",
      title: "Tổng quan & Kiến trúc",
      category: "Bắt đầu",
      order: 1,
      content: `# Tổng quan: ${app.name}\n\nỨng dụng **${app.name}** được thiết kế chạy trên Edge Cloud của VNTEZ.\n\n## 1. Thông số Kỹ thuật\n- Client ID: \`${clientId}\`\n- Giao thức Xác thực: OAuth 2.0 PKCE\n`,
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "api-reference",
      title: "Tham chiếu API",
      category: "Lập trình",
      order: 2,
      content: `# Điểm cuối API: ${app.name}\n\n## 1. Endpoint Tình trạng Dịch vụ\n\`\`\`http\nGET /api/v1/${app.id}/health\n\`\`\`\n\n## 2. Truy xuất Dữ liệu\n\`\`\`http\nGET /api/v1/${app.id}/resources\nAuthorization: Bearer <access_token>\n\`\`\`\n`,
      updatedAt: new Date().toISOString(),
    },
  ];

  const legalDocuments: AppLegalDocument[] = [
    {
      slug: "privacy",
      title: "Chính sách Bảo mật Quyền riêng tư",
      version: "1.0",
      effectiveDate: "01/11/2026",
      content: `# Chính sách Bảo mật — ${app.name}\n\nTuân thủ Nghị định 13/2023/NĐ-CP.\n\n## 1. Dữ liệu thu thập\nChúng tôi chỉ thu thập các định danh phiên cần thiết theo cơ chế Zero-Knowledge.\n`,
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "terms",
      title: "Điều khoản Sử dụng Dịch vụ",
      version: "1.0",
      effectiveDate: "01/11/2026",
      content: `# Điều khoản Sử dụng — ${app.name}\n\n## 1. Cam kết Dịch vụ\nNgười dùng đồng ý tuân thủ toàn bộ các chính sách bảo vệ tài nguyên trên hệ sinh thái.\n`,
      updatedAt: new Date().toISOString(),
    },
  ];

  const remoteConfig: Record<string, unknown> = {
    maintenance_mode: false,
    min_client_version: "1.0.0",
    enable_ai_agent: true,
    telemetry_rate: 1.0,
  };

  return {
    clientId,
    clientSecret,
    redirectUris,
    isInternal,
    roles,
    resources,
    rolePermissions,
    docsPages,
    legalDocuments,
    remoteConfig,
  };
}
