import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/oauth/jwt";
import { getUserById } from "@/lib/supabase/admin";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

async function handleUserInfo(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        error: "unauthorized",
        error_description:
          "Thiếu Bearer access token trong header Authorization",
      },
      { status: 401, headers: corsHeaders },
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);

    // Query thông tin user từ Supabase auth qua admin API
    const user = await getUserById(payload.sub);

    if (user) {
      return NextResponse.json(
        {
          sub: user.id,
          email: user.email,
          email_verified: Boolean(user.email_confirmed_at),
          name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "",
          avatar:
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            null,
          picture:
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            null,
        },
        { status: 200, headers: corsHeaders },
      );
    }

    // Nếu không có service role key hoặc không tìm thấy user qua admin, fallback từ claims của token
    return NextResponse.json(
      {
        sub: payload.sub,
        email: payload.email || "",
        email_verified: true,
        name: payload.name || "",
        avatar: payload.avatar || null,
        picture: payload.avatar || null,
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (err: any) {
    console.warn("[/oauth/userinfo] Token không hợp lệ:", err?.message);
    return NextResponse.json(
      {
        error: "invalid_token",
        error_description: "Access token đã hết hạn hoặc chữ ký không hợp lệ",
      },
      { status: 401, headers: corsHeaders },
    );
  }
}

export async function GET(req: Request) {
  return handleUserInfo(req);
}

export async function POST(req: Request) {
  return handleUserInfo(req);
}
