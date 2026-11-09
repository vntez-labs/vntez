import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@workspace/auth/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

const updateUserSchema = z.object({
  userId: z.string().min(1, "Thiếu userId hợp lệ"),
  name: z.string().optional(),
  role: z.string().optional().default("Viewer"),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});

export async function POST(req: Request) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
