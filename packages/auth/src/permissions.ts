import type { VntezUser } from "./types";

/**
 * Standard Built-in Role Definitions & Default Permissions
 */
export type BuiltInRole = "admin" | "developer" | "member" | "viewer";

export const BUILT_IN_ROLE_PERMISSIONS: Record<BuiltInRole, string[]> = {
  admin: [
    "*:*",
    "users:create",
    "users:read:all",
    "users:update:all",
    "users:delete:all",
    "files:create",
    "files:read:all",
    "files:update:all",
    "files:delete:all",
    "messages:create",
    "messages:read:all",
    "messages:delete:all",
    "clients:create",
    "clients:read:all",
    "clients:update:all",
    "clients:delete:all",
    "roles:create",
    "roles:read:all",
    "roles:update:all",
    "roles:delete:all",
  ],
  developer: [
    "users:read:self",
    "users:update:self",
    "files:create",
    "files:read:all",
    "files:update:self",
    "files:delete:self",
    "messages:create",
    "messages:read:all",
    "clients:create",
    "clients:read:all",
    "clients:update:self",
    "clients:delete:self",
    "roles:read:all",
  ],
  member: [
    "users:read:self",
    "users:update:self",
    "files:create",
    "files:read:self",
    "files:delete:self",
  ],
  viewer: [
    "users:read:self",
    "files:read:all",
    "messages:read:all",
  ],
};

/**
 * Resolve flattened permissions array for a given role name
 */
export function getPermissionsForRole(roleName?: string): string[] {
  if (!roleName) return [...BUILT_IN_ROLE_PERMISSIONS.viewer];
  const normalized = roleName.toLowerCase().trim();
  if (normalized.includes("admin")) return [...BUILT_IN_ROLE_PERMISSIONS.admin];
  if (normalized.includes("dev")) return [...BUILT_IN_ROLE_PERMISSIONS.developer];
  if (normalized.includes("member")) return [...BUILT_IN_ROLE_PERMISSIONS.member];
  if (normalized in BUILT_IN_ROLE_PERMISSIONS) {
    return [...BUILT_IN_ROLE_PERMISSIONS[normalized as BuiltInRole]];
  }
  return [...BUILT_IN_ROLE_PERMISSIONS.viewer];
}

/**
 * Check if user possesses a specific permission string (supports wildcard '*:*' and 'resource:*')
 */
export function hasPermission(
  user: VntezUser | null | undefined,
  requiredPermission: string
): boolean {
  if (!user) return false;

  const perms = user.permissions || getPermissionsForRole(user.role);
  if (!perms || perms.length === 0) return false;

  // Super-admin wildcard
  if (perms.includes("*:*")) return true;

  // Exact permission match
  if (perms.includes(requiredPermission)) return true;

  // Resource-level wildcard match (e.g. "users:*" matches "users:read:all")
  const [resource] = requiredPermission.split(":");
  if (resource && perms.includes(`${resource}:*`)) return true;

  return false;
}
