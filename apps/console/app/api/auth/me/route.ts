import { NextResponse } from "next/server";
import { getServerSession, updateServerSessionUser } from "@workspace/auth/server";
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

  return NextResponse.json({
    authenticated: true,
    user,
    accessToken: accessToken ? `${accessToken.slice(0, 8)}...` : null, // Masked for safety in client API
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

    // 1. Update Supabase Auth user metadata if sub is a valid UID
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

    // 2. Build updated user session object
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
