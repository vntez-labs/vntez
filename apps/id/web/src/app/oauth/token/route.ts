import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { signAccessToken } from "@/lib/oauth/jwt";

// CORS headers cho phép app vệ tinh (kể cả SPA trên domain khác) gọi API
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

function verifySecret(clientSecret: string, clientSecretHash: string): boolean {
  if (!clientSecret || !clientSecretHash) return false;

  // Hỗ trợ kiểm tra hash SHA256 hoặc so khớp trực tiếp nếu dev lưu plain
  const sha256 = crypto.createHash("sha256").update(clientSecret).digest("hex");
  if (sha256 === clientSecretHash) return true;

  return clientSecret === clientSecretHash;
}

export async function POST(req: Request) {
  try {
    let body: Record<string, any> = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      for (const [key, value] of params.entries()) {
        body[key] = value;
      }
    } else {
      body = await req.json().catch(() => ({}));
    }

    const {
      grant_type,
      code,
      client_id,
      client_secret,
      code_verifier,
      redirect_uri,
    } = body;

    // Kiểm tra grant_type
    if (grant_type !== "authorization_code") {
      return NextResponse.json(
        {
          error: "unsupported_grant_type",
          error_description: "grant_type phải là authorization_code",
        },
        { status: 400, headers: corsHeaders },
      );
    }

    if (!code || !client_id) {
      return NextResponse.json(
        {
          error: "invalid_request",
          error_description: "Thiếu code hoặc client_id",
        },
        { status: 400, headers: corsHeaders },
      );
    }

    // 1. Kiểm tra Client
    const { data: client, error: clientErr } = await supabaseAdmin
      .from("oauth_clients")
      .select("*")
      .eq("client_id", client_id)
      .maybeSingle();

    if (clientErr || !client) {
      return NextResponse.json(
        {
          error: "invalid_client",
          error_description: "Client không hợp lệ hoặc chưa đăng ký",
        },
        { status: 401, headers: corsHeaders },
      );
    }

    // Nếu client có secret, phải verify hash
    if (client.client_secret_hash) {
      const isValid = verifySecret(client_secret, client.client_secret_hash);
      if (!isValid) {
        return NextResponse.json(
          {
            error: "unauthorized_client",
            error_description: "client_secret không chính xác",
          },
          { status: 401, headers: corsHeaders },
        );
      }
    }

    // 2. Kiểm tra Auth Code
    const { data: codeRecord, error: codeErr } = await supabaseAdmin
      .from("oauth_codes")
      .select("*")
      .eq("code", code)
      .eq("client_id", client_id)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (codeErr || !codeRecord || codeRecord.redirect_uri !== redirect_uri) {
      return NextResponse.json(
        {
          error: "invalid_grant",
          error_description:
            "Auth code không hợp lệ, đã hết hạn hoặc redirect_uri không khớp",
        },
        { status: 400, headers: corsHeaders },
      );
    }

    // 3. Verify PKCE nếu có code_challenge
    if (codeRecord.code_challenge) {
      if (!code_verifier) {
        return NextResponse.json(
          {
            error: "code_verifier_required",
            error_description:
              "Yêu cầu cung cấp code_verifier để xác thực PKCE",
          },
          { status: 400, headers: corsHeaders },
        );
      }

      // S256: BASE64URL-ENCODE(SHA256(ASCII(code_verifier)))
      const hash = crypto
        .createHash("sha256")
        .update(code_verifier)
        .digest("base64url");

      if (hash !== codeRecord.code_challenge) {
        return NextResponse.json(
          {
            error: "invalid_code_verifier",
            error_description:
              "code_verifier không khớp với code_challenge đã đăng ký",
          },
          { status: 400, headers: corsHeaders },
        );
      }
    }

    // 4. Đánh dấu code đã dùng ngay lập tức (Chống tấn công Replay Attack)
    await supabaseAdmin
      .from("oauth_codes")
      .update({ used: true })
      .eq("code", code);

    // 5. Cấp Access Token (JWT được ký bởi VNTEZ ID Key)
    const { accessToken, expiresIn } = signAccessToken({
      userId: codeRecord.user_id,
      clientId: client_id,
    });

    return NextResponse.json(
      {
        access_token: accessToken,
        token_type: "Bearer",
        expires_in: expiresIn,
        scope: "openid profile email",
      },
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Cache-Control": "no-store",
          Pragma: "no-cache",
        },
      },
    );
  } catch (err: any) {
    console.error("[/oauth/token] Lỗi hệ thống:", err);
    return NextResponse.json(
      {
        error: "server_error",
        error_description: err?.message || "Đã xảy ra lỗi nội bộ",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
