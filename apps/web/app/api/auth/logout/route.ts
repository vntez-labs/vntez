import { NextRequest, NextResponse } from "next/server";
import { clearServerSession } from "@workspace/auth/server";

export async function POST() {
  await clearServerSession();
  return NextResponse.json({ success: true, message: "Đăng xuất thành công" });
}

export async function GET(request: NextRequest) {
  await clearServerSession();
  const searchParams = request.nextUrl.searchParams;
  const redirectUrl = searchParams.get("redirect") || "/";
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
