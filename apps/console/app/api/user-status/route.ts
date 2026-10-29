import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { checkUserClientStatus } from "@/lib/client-requests";

// GET /api/user-status - Kiểm tra xem user hiện tại đã có Client nào được duyệt chưa
export async function GET() {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
