export const STANDARD_RESOURCES = [
  "users",
  "files",
  "messages",
  "clients",
  "roles",
];

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

export const INITIAL_ROLE_PERMS: Record<string, Set<string>> = {
  admin: new Set(ALL_PERMISSIONS),
  developer: new Set([
    "users:read:self",
    "clients:create",
    "clients:read:self",
    "clients:update:self",
    "files:create",
    "files:read:all",
    "messages:create",
    "roles:read:all",
  ]),
  member: new Set([
    "users:read:self",
    "users:update:self",
    "files:create",
    "files:read:self",
    "messages:create",
  ]),
  viewer: new Set([
    "users:read:self",
    "files:read:self",
    "clients:read:self",
    "messages:read:self",
  ]),
};
