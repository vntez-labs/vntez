import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { executeSqlQuery } from "@/lib/sql-executor";

export async function POST(req: NextRequest) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Tham số câu lệnh SQL (query) không hợp lệ" }, { status: 400 });
    }

    const result = await executeSqlQuery(query);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xử lý câu truy vấn SQL";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
