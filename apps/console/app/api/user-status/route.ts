import { NextResponse } from "next/server";
import { getVerifiedIamSession } from "@/lib/iam-session";
import { checkUserClientStatus } from "@/lib/client-requests";

// GET /api/user-status - Kiểm tra xem user hiện tại đã có Client nào được duyệt chưa
export async function GET() {
  try {
    const session = await getVerifiedIamSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { user } = session;
    const status = await checkUserClientStatus(user.sub, user.email);

    return NextResponse.json({
      success: true,
      user: {
        id: user.sub,
        email: user.email,
        name: user.name,
      },
      ...status,
    });
  } catch (err) {
    console.error("GET /api/user-status error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
