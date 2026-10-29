import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";

export async function GET() {
  const { user, accessToken } = await getServerSession();

  if (!user) {
    return NextResponse.json(
      { authenticated: false, user: null, accessToken: null },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user,
    accessToken: accessToken ? `${accessToken.slice(0, 8)}...` : null, // Masked for safety in client API
  });
}
