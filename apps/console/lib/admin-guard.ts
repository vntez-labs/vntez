import { getSupabaseAdminClient } from "@/lib/supabase";
import { getVerifiedIamSession } from "@/lib/iam-session";
import type { VntezUser } from "@workspace/auth/types";

type AdminSessionResult =
  | { authorized: true; user: VntezUser }
  | { authorized: false; status: number; error: string };

export async function verifyAdminSession(): Promise<AdminSessionResult> {
  try {
    const session = await getVerifiedIamSession();
    if (!session) {
      return { authorized: false, status: 401, error: "Vui lòng đăng nhập qua VNTEZ IAM" };
    }

    const { user } = session;
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("iam_user_roles")
      .select("role_id")
      .eq("user_id", user.sub)
      .eq("role_id", "admin")
      .is("app_id", null)
      .limit(1);
    if (error) throw error;
    if (data.length > 0) return { authorized: true, user };

    return {
      authorized: false,
      status: 403,
      error: "Bảng điều khiển Console chỉ dành riêng cho Quản trị viên",
    };
  } catch (error) {
    console.error("Không thể kiểm tra quyền Root IAM:", error);
    return { authorized: false, status: 503, error: "Không thể kiểm tra quyền quản trị" };
  }
}
