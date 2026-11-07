import { NextResponse } from "next/server";
import {
  getServerSession,
  updateServerSessionUser,
  refreshServerSessionCookie,
} from "@workspace/auth/server";
import { getPermissionsForRole } from "@workspace/auth/permissions";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { VntezUser } from "@workspace/auth/types";

export async function GET() {
  const { user, accessToken } = await getServerSession();

  if (!user) {
    return NextResponse.json(
      { authenticated: false, user: null, accessToken: null },
      { status: 401 }
    );
  }

  // 1. Fetch real role & metadata from Supabase Auth
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

  // 2. Compute 100% real permissions based on role
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

  // 3. Sliding session: extend persistent cookie lifespan for another 30 days
  await refreshServerSessionCookie(enrichedUser);

  return NextResponse.json({
    authenticated: true,
    user: enrichedUser,
    accessToken: accessToken ? `${accessToken.slice(0, 8)}...` : null,
  });
}

export async function PATCH(req: Request) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, avatar, phone } = body;

    const trimmedName = typeof name === "string" ? name.trim() : user.name;
    const trimmedAvatar = typeof avatar === "string" ? avatar.trim() : user.avatar;
    const trimmedPhone = typeof phone === "string" ? phone.trim() : user.phone;

    // 1. Update Supabase Auth user metadata
    try {
      const supabase = getSupabaseAdminClient();
      await supabase.auth.admin.updateUserById(user.sub, {
        phone: trimmedPhone ? String(trimmedPhone) : undefined,
        user_metadata: {
          full_name: trimmedName,
          name: trimmedName,
          avatar_url: trimmedAvatar || null,
        },
      });
    } catch (dbErr) {
      console.warn("Could not sync with Supabase Auth admin, updating session cookie only:", dbErr);
    }

    // 2. Build updated user session object with preserved role & permissions
    const updatedUser: VntezUser = {
      ...user,
      name: trimmedName,
      avatar: trimmedAvatar || undefined,
      phone: trimmedPhone || undefined,
    };

    // 3. Update HTTP-only Session Cookie
    await updateServerSessionUser(updatedUser);

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Cập nhật hồ sơ thành công",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi khi cập nhật hồ sơ";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
