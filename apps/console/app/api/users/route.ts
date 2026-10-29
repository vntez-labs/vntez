import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { fixVietnameseEncoding } from "@workspace/auth/encoding";
import { getSupabaseAdminClient } from "@/lib/supabase";

export interface SupabaseAuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  providers: string[];
  role: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  lastSignInAt: string | null;
  isCurrentUser: boolean;
  rawUser: Record<string, unknown>;
}

// 1. GET /api/users - Lấy danh sách người dùng đầy đủ các cột từ Supabase Auth
export async function GET() {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseClient = getSupabaseAdminClient();

    // Fetch live users directly from Supabase Auth Admin
    const { data: authData, error: authError } =
      await supabaseClient.auth.admin.listUsers();

    if (authError) {
      throw authError;
    }

    const authUsers = authData?.users || [];
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

      const isCurrent = u.id === user.sub || u.email === user.email;

      users.push({
        id: u.id,
        name: cleanName,
        email: u.email || "",
        avatar,
        phone: u.phone || "-",
        providers,
        role: isCurrent
          ? "Quản trị viên (Super Admin)"
          : "Người dùng ủy quyền (Member)",
        status: "active",
        createdAt: u.created_at,
        updatedAt: u.updated_at || u.created_at || new Date().toISOString(),
        confirmedAt: u.confirmed_at || u.email_confirmed_at || null,
        lastSignInAt: u.last_sign_in_at || null,
        isCurrentUser: isCurrent,
        rawUser: u as unknown as Record<string, unknown>,
      });
    }

    // If current session user is not found in auth.users (e.g. external token), include them at the top
    const hasCurrent = users.some((u) => u.isCurrentUser);
    if (!hasCurrent && user) {
      users.unshift({
        id: user.sub,
        name: fixVietnameseEncoding(user.name || "Nam Nguyễn"),
        email: user.email,
        avatar: user.avatar,
        phone: "-",
        providers: ["vntez-sso"],
        role: "Quản trị viên (Super Admin)",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        confirmedAt: new Date().toISOString(),
        lastSignInAt: new Date().toISOString(),
        isCurrentUser: true,
        rawUser: {
          sub: user.sub,
          email: user.email,
          name: user.name,
          provider: "vntez_id_sso",
        },
      });
    }

    return NextResponse.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (err) {
    console.error("GET /api/users error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

// 2. POST /api/users - Tạo người dùng mới qua Supabase Auth Admin
export async function POST(req: Request) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { email, password, full_name, phone } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Email không hợp lệ" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Mật khẩu tối thiểu 6 ký tự" },
        { status: 400 }
      );
    }

    const supabaseClient = getSupabaseAdminClient();
    const { data, error } = await supabaseClient.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      email_confirm: true,
      phone: phone ? String(phone).trim() : undefined,
      user_metadata: {
        full_name: full_name?.trim() || email.split("@")[0],
        name: full_name?.trim() || email.split("@")[0],
      },
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Tạo tài khoản "${email}" thành công`,
      user: data.user,
    });
  } catch (err) {
    console.error("POST /api/users error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

// 3. DELETE /api/users - Xóa người dùng khỏi Supabase Auth
export async function DELETE(req: Request) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    let userId = searchParams.get("userId");

    if (!userId) {
      try {
        const body = await req.json();
        userId = body.userId || body.id;
      } catch {
        // query param was empty and body not json
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Thiếu userId cần xóa" },
        { status: 400 }
      );
    }

    // Safety check: Prevent deleting currently logged-in admin user
    if (userId === user.sub) {
      return NextResponse.json(
        {
          success: false,
          error: "Không thể xóa chính tài khoản Quản trị viên bạn đang đăng nhập",
        },
        { status: 400 }
      );
    }

    const supabaseClient = getSupabaseAdminClient();

    // 1. Delete associated codes in public.oauth_codes
    await supabaseClient.from("oauth_codes").delete().eq("user_id", userId);

    // 2. Delete the user from Supabase Auth
    const { error } = await supabaseClient.auth.admin.deleteUser(userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Đã xóa người dùng "${userId}" thành công khỏi Supabase`,
    });
  } catch (err) {
    console.error("DELETE /api/users error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
