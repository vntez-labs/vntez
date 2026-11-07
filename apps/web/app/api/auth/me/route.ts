import { NextResponse } from "next/server";
import {
  getServerSession,
  refreshServerSessionCookie,
} from "@workspace/auth/server";
import { getPermissionsForRole } from "@workspace/auth/permissions";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { VntezUser } from "@workspace/auth/types";

export async function GET() {
  const { user, accessToken } = await getServerSession();

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  // Fetch real role & metadata from Supabase Auth
  let realRole = (user.role as string) || "viewer";
  let realName = user.name;
  let realAvatar = user.avatar;
  let realPhone = user.phone;

  try {
    const supabase = getSupabaseAdminClient();
    const { data: authData } = await supabase.auth.admin.getUserById(user.sub);
    const u = authData?.user;
    if (u) {
      const meta = u.user_metadata || {};
      const appMeta = u.app_metadata || {};
      realRole = (meta.role || appMeta.role || (u.email === "hnamhocit@gmail.com" ? "admin" : "member")).toLowerCase();
      realName = meta.full_name || meta.name || realName;
      realAvatar = meta.avatar_url || meta.picture || realAvatar;
      realPhone = u.phone || realPhone;
    } else if (user.email === "hnamhocit@gmail.com") {
      realRole = "admin";
    }
  } catch (err) {
    console.warn("Could not fetch user metadata from Supabase Auth admin:", err);
    if (user.email === "hnamhocit@gmail.com") realRole = "admin";
  }

  const permissions = getPermissionsForRole(realRole);

  const enrichedUser: VntezUser = {
    ...user,
    name: realName,
    avatar: realAvatar,
    phone: realPhone,
    role: realRole,
    roles: [realRole],
    permissions,
  };

  // Sliding session: extend persistent cookie lifespan for another 30 days
  await refreshServerSessionCookie(enrichedUser);

  return NextResponse.json({
    authenticated: true,
    user: enrichedUser,
    accessToken: accessToken ? `${accessToken.slice(0, 8)}...` : null,
  });
}
