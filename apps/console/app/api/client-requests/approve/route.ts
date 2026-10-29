import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { approveClientRequest } from "@/lib/client-requests";

// POST /api/client-requests/approve - Phê duyệt Deal & Tự động tạo OAuth Client trong Supabase
export async function POST(req: Request) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, admin_notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Thiếu id yêu cầu cần phê duyệt" },
        { status: 400 }
      );
    }

    const result = await approveClientRequest(id, admin_notes);

    return NextResponse.json({
      success: true,
      message: `Đã phê duyệt thành công! Đã cấp phát Client ID: "${result.client_id}" vào Supabase.`,
      client_id: result.client_id,
      record: result.record,
    });
  } catch (err) {
    console.error("POST /api/client-requests/approve error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
