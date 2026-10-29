export const ADMIN_USER_ID =
  process.env.ADMIN_USER_ID || "f71976bd-8001-4f39-8b12-d54cd09957a2";

export function isUserAdmin(userId?: string | null): boolean {
  if (!userId) return false;
  return userId === ADMIN_USER_ID;
}
