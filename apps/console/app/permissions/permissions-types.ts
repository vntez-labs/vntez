export type StandardResource =
  | "apps"
  | "users"
  | "database"
  | "blog"
  | "storage"
  | "telebot"
  | "settings"
  | string;

export type StandardAction =
  | "create"
  | "read:self"
  | "read:all"
  | "update:self"
  | "update:all"
  | "delete:self"
  | "delete:all"
  | string;

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  is_system: boolean;
  permissions: string[];
}

export interface AppScopeItem {
  id: string | null; // null represents Root / Global
  name: string;
  category?: string;
  color?: string;
}

export interface PermissionMatrixResponse {
  success: boolean;
  standard_resources: string[];
  standard_actions: string[];
  built_in_roles: Record<string, string[]>;
  all_roles?: RoleDefinition[];
}
