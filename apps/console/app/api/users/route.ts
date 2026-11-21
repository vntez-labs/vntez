import { NextResponse } from "next/server";
import { listConsoleUsers } from "@/lib/console-users";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { verifyAdminSession } from "@/lib/admin-guard";

// 1. GET /api/users - Lấy danh sách người dùng đầy đủ các cột từ Supabase Auth
export async function GET() {
  const authCheck = await verifyAdminSession();
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, error: authCheck.error },
      { status: authCheck.status }
    );
  }
  const user = authCheck.user;

  try {
    const users = await listConsoleUsers(user);

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
  const authCheck = await verifyAdminSession();
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, error: authCheck.error },
      { status: authCheck.status }
    );
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
  const authCheck = await verifyAdminSession();
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, error: authCheck.error },
      { status: authCheck.status }
    );
  }
  const user = authCheck.user;

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

    // Delete associated codes and user in Supabase Auth concurrently
    const [, deleteUserRes] = await Promise.all([
      supabaseClient.from("oauth_codes").delete().eq("user_id", userId),
      supabaseClient.auth.admin.deleteUser(userId),
    ]);

    if (deleteUserRes.error) {
      throw deleteUserRes.error;
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
