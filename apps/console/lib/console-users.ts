import { fixVietnameseEncoding } from "@workspace/auth/encoding";
import type { VntezUser } from "@workspace/auth/types";
import { listRootIamUsers, listRootUserRoles } from "@/lib/root-iam-users";

export interface SupabaseAuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  providers: string[];
  role: string;
  roles?: string[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  lastSignInAt: string | null;
  isCurrentUser: boolean;
  rawUser: Record<string, unknown>;
}

export async function listConsoleUsers(user: VntezUser): Promise<SupabaseAuthUser[]> {
  const [authUsers, rolesMap] = await Promise.all([listRootIamUsers(), listRootUserRoles()]);

  const users: SupabaseAuthUser[] = [];

  for (const u of authUsers) {
    const rawName =
      u.user_metadata?.full_name ||
      u.user_metadata?.name ||
      u.email?.split("@")[0] ||
      "Người dùng";
    const cleanName = fixVietnameseEncoding(rawName);

    const avatar =
      u.user_metadata?.avatar_url ||
      u.user_metadata?.picture ||
      (u.id === user.sub ? user.avatar : undefined);

    const providers: string[] =
      u.app_metadata?.providers ||
      (u.app_metadata?.provider ? [u.app_metadata.provider] : ["email"]);

    const isCurrent = u.id === user.sub;

    const userRoles = rolesMap.get(u.id) || [];
    const hasAdminRole = userRoles.includes("admin");

    const primaryRole =
      (hasAdminRole ? "admin" : null) ||
      userRoles[0] ||
      u.user_metadata?.role ||
      u.app_metadata?.role ||
      "viewer";

    const displayRole =
      hasAdminRole
        ? "Quản trị viên (Super Admin)"
        : String(primaryRole).toLowerCase().includes("dev")
          ? "Lập trình viên (Developer)"
          : String(primaryRole).toLowerCase().includes("oper")
            ? "Vận hành (Operator)"
            : "Người xem (Viewer)";

    const isBanned = Boolean(u.banned_until && new Date(u.banned_until) > new Date());
    const accountStatus: "active" | "inactive" =
      isBanned || u.user_metadata?.status === "inactive" ? "inactive" : "active";

    users.push({
      id: u.id,
      name: cleanName,
      email: u.email || "",
      avatar,
      phone: u.phone || "-",
      providers,
      role: displayRole,
      roles: userRoles.length > 0 ? userRoles : ["viewer"],
      status: accountStatus,
      createdAt: u.created_at,
      updatedAt: u.updated_at || u.created_at || new Date().toISOString(),
      confirmedAt: u.confirmed_at || u.email_confirmed_at || null,
      lastSignInAt: u.last_sign_in_at || null,
      isCurrentUser: isCurrent,
      rawUser: u as unknown as Record<string, unknown>,
    });
  }

  return users;
}
