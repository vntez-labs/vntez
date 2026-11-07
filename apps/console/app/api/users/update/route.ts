import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { userId, name, role, status } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { success: false, error: "Thiếu userId hợp lệ" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();

    const updatePayload: Parameters<typeof supabase.auth.admin.updateUserById>[1] = {
      user_metadata: {
        full_name: name ? String(name).trim() : undefined,
        name: name ? String(name).trim() : undefined,
        role: role || "Viewer",
        status: status || "active",
      },
      app_metadata: {
        role: (role || "Viewer").toLowerCase(),
      },
      ban_duration: status === "inactive" ? "876000h" : "none",
    };

    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      updatePayload
    );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật vai trò "${role}" cho người dùng thành công trên Supabase Auth`,
      user: data.user,
    });
  } catch (err) {
    console.error("POST /api/users/update error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
