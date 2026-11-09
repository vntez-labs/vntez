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

  // 1. Fetch real role & metadata from Supabase Auth & iam_user_roles
  let realRole = (user.role as string) || "viewer";
  let realName = user.name;
  let realAvatar = user.avatar;
  let realPhone = user.phone;
  let realRoles: string[] = [];

  try {
    const supabase = getSupabaseAdminClient();
    const [authRes, rolesRes] = await Promise.all([
      supabase.auth.admin.getUserById(user.sub),
      supabase.from("iam_user_roles").select("role_id, app_id").eq("user_id", user.sub).is("app_id", null),
    ]);

    const u = authRes.data?.user;
    if (u) {
      const meta = u.user_metadata || {};
      realName = meta.full_name || meta.name || realName;
      realAvatar = meta.avatar_url || meta.picture || realAvatar;
      realPhone = u.phone || realPhone;
    }

    if (rolesRes.data && rolesRes.data.length > 0) {
      realRoles = rolesRes.data.map((r: { role_id: string }) => r.role_id);
    }

    if (realRoles.length > 0 && realRoles[0]) {
      realRole = realRoles[0];
    } else if (user.email === "hnamhocit@gmail.com") {
      realRole = "admin";
      realRoles = ["admin"];
    } else {
      realRoles = [realRole];
    }
  } catch (err) {
    console.warn("Could not fetch user metadata from Supabase Auth admin:", err);
    if (user.email === "hnamhocit@gmail.com") {
      realRole = "admin";
      realRoles = ["admin"];
    }
  }

  // 2. Compute 100% real permissions based on role
  const permissions = getPermissionsForRole(realRole);

  const enrichedUser: VntezUser = {
    ...user,
    name: realName,
    avatar: realAvatar,
    phone: realPhone,
    app_id: null,
    role: realRole,
    roles: realRoles,
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
