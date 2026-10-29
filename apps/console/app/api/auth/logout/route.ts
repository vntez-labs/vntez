import { NextRequest, NextResponse } from "next/server";
import { clearServerSession } from "@workspace/auth/server";

export async function POST(request: NextRequest) {
  await clearServerSession();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}

export async function GET(request: NextRequest) {
  await clearServerSession();
  return NextResponse.redirect(new URL("/login", request.url));
}
