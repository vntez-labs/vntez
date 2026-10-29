import { NextResponse } from "next/server";
import { safeReturnTo } from "@/lib/redirect";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const searchParams = requestUrl.searchParams;
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const returnTo = safeReturnTo(searchParams.get("redirect_url"));

  // Detect public origin through reverse proxies (Nginx / Cloudflare / Coolify / Docker / Vercel)
  const forwardedHost =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const forwardedProto =
    request.headers.get("x-forwarded-proto") ||
    (forwardedHost?.includes("localhost") ||
    forwardedHost?.includes("127.0.0.1")
      ? "http"
      : "https");
  const origin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : requestUrl.origin || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // 1. Kiểm tra nếu chính OAuth provider hoặc Supabase trả về lỗi
  if (errorParam) {
    console.error(
      "[Auth Callback] OAuth Provider error:",
      errorParam,
      errorDescription,
    );
    const desc = errorDescription || errorParam;
    return NextResponse.redirect(
      `${origin}/login?error=oauth_error&error_description=${encodeURIComponent(desc)}`,
    );
  }

  // 2. Trao đổi Auth Code lấy phiên làm việc (Session)
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // internal path ("/terms") -> prepend origin; absolute ("https://pomoduo…") -> dùng nguyên; nếu không có -> trực tiếp về VNTEZ Console
      const target = returnTo
        ? returnTo.startsWith("/")
          ? `${origin}${returnTo}`
          : returnTo
        : "https://vntez-console.vercel.app";
      return NextResponse.redirect(target);
    }

    console.error(
      "[Auth Callback] exchangeCodeForSession failed:",
      error.message,
      error,
    );
    return NextResponse.redirect(
      `${origin}/login?error=auth_failed&error_description=${encodeURIComponent(error.message)}`,
    );
  }

  // 3. Không có code và cũng không có error
  console.warn(
    "[Auth Callback] No code provided in callback search parameters",
    requestUrl.search,
  );
  return NextResponse.redirect(
    `${origin}/login?error=no_code&error_description=${encodeURIComponent("Không nhận được mã xác thực (code) từ dịch vụ OAuth.")}`,
  );
}
