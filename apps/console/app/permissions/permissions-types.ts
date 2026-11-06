export type StandardResource = "users" | "files" | "messages" | "clients" | "roles" | string;

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

export interface PermissionMatrixResponse {
  success: boolean;
  standard_resources: string[];
  standard_actions: string[];
  built_in_roles: Record<string, string[]>;
  all_roles?: RoleDefinition[];
}

export interface EvaluationResult {
  allowed: boolean;
  reason?: string;
  user_id: string;
  permission: string;
  matched_roles?: string[];
}
