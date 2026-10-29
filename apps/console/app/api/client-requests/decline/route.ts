import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { declineClientRequest } from "@/lib/client-requests";

// POST /api/client-requests/decline - Từ chối Deal đối tác kèm lý do thẩm định
export async function POST(req: Request) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, reason } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Thiếu id yêu cầu cần từ chối" },
        { status: 400 }
      );
    }

    const updated = await declineClientRequest(
      id,
      reason || "Hồ sơ dự án chưa đạt tiêu chuẩn thẩm định đối tác của VNTEZ."
    );

    return NextResponse.json({
      success: true,
      message: `Đã từ chối yêu cầu "${id}".`,
      record: updated,
    });
  } catch (err) {
    console.error("POST /api/client-requests/decline error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
