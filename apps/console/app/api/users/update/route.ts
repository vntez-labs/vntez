import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { verifyAdminSession } from "@/lib/admin-guard";

const updateUserSchema = z.object({
  userId: z.string().min(1, "Thiếu userId hợp lệ"),
  name: z.string().optional(),
  role: z.enum(["Admin", "Developer", "Operator", "Viewer"]).default("Viewer"),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});

export async function POST(req: Request) {
  const authCheck = await verifyAdminSession();
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, error: authCheck.error },
      { status: authCheck.status }
    );
  }

  try {
    const raw = await req.json();
    const parsed = updateUserSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const { userId, name, role, status } = parsed.data;
    const supabase = getSupabaseAdminClient();
    const grantAdmin = role === "Admin" && status === "active";
    if (!grantAdmin && userId === authCheck.user.sub) {
      return NextResponse.json({ success: false, error: "Không thể tự thu hồi quyền quản trị" }, { status: 400 });
    }

    const updatePayload: Parameters<typeof supabase.auth.admin.updateUserById>[1] = {
      user_metadata: {
        full_name: name ? String(name).trim() : undefined,
        name: name ? String(name).trim() : undefined,
        role,
        status,
      },
      app_metadata: {
        role: role.toLowerCase(),
      },
      ban_duration: status === "inactive" ? "876000h" : "none",
    };

    // Revoke first so a partial update cannot preserve unwanted privileges.
    if (!grantAdmin) {
      const { error } = await supabase
        .from("iam_user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role_id", "admin")
        .is("app_id", null);
      if (error) throw error;
    }

    const authRes = await supabase.auth.admin.updateUserById(userId, updatePayload);
    if (authRes.error) throw authRes.error;

    if (grantAdmin) {
      const { error } = await supabase.from("iam_user_roles").upsert(
        { user_id: userId, role_id: "admin", app_id: null },
        { onConflict: "user_id,role_id" }
      );
      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật vai trò "${role}" cho người dùng thành công trên Supabase Auth & RBAC`,
      user: authRes.data.user,
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
