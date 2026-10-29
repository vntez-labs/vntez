import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import crypto from "crypto";
import { getOAuthClient, saveOAuthCode } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ConsentScreen } from "@/components/oauth/consent-screen";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ủy quyền truy cập (OAuth 2.0)",
  description: "Trang xác thực và chấp thuận cấp quyền ứng dụng VNTEZ ID.",
  robots: {
    index: false,
    follow: false,
  },
};

interface AuthorizePageProps {
  searchParams: Promise<{
    client_id?: string;
    redirect_uri?: string;
    response_type?: string;
    state?: string;
    code_challenge?: string;
    code_challenge_method?: string;
    scope?: string;
  }>;
}

async function AuthorizeContent({ searchParams }: AuthorizePageProps) {
  await connection();
  const params = await searchParams;
  const {
    client_id,
    redirect_uri,
    response_type,
    state,
    code_challenge,
    code_challenge_method,
    scope,
  } = params;

  // 1. Kiểm tra tham số bắt buộc
  if (!client_id) {
    return (
      <ErrorBox
        title="Thiếu tham số client_id"
        desc="Yêu cầu OAuth 2.0 phải chứa định danh ứng dụng (client_id)."
      />
    );
  }

  if (!redirect_uri) {
    return (
      <ErrorBox
        title="Thiếu tham số redirect_uri"
        desc="Yêu cầu OAuth 2.0 phải chứa URL phản hồi (redirect_uri)."
      />
    );
  }

  if (response_type !== "code") {
    return (
      <ErrorBox
        title="response_type không được hỗ trợ"
        desc="VNTEZ ID hiện hỗ trợ phương thức phản hồi tiêu chuẩn OAuth 2.0: response_type=code."
      />
    );
  }

  // 2. Tìm kiếm và kiểm tra Client trong bảng oauth_clients
  const client = await getOAuthClient(client_id);
  if (!client) {
    return (
      <ErrorBox
        title="Ứng dụng không tồn tại"
        desc={`Không tìm thấy ứng dụng với client_id: "${client_id}". Vui lòng kiểm tra lại cấu hình client trong VNTEZ Developer Portal.`}
      />
    );
  }

  // Đối chiếu redirect_uri có khớp với danh sách đã đăng ký trong oauth_clients hay không
  const isRedirectAllowed = client.redirect_uris.some((uri) => {
    try {
      const u1 = new URL(uri);
      const u2 = new URL(redirect_uri);
      return u1.origin === u2.origin && u1.pathname === u2.pathname;
    } catch {
      return uri === redirect_uri;
    }
  });

  if (!isRedirectAllowed) {
    return (
      <ErrorBox
        title="Redirect URI không được phép"
        desc={`Địa chỉ "${redirect_uri}" không khớp với bất kỳ Redirect URI nào được đăng ký cho ứng dụng "${client.name}".`}
      />
    );
  }

  // 3. Kiểm tra session hiện tại của user qua Supabase Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Nếu CHƯA ĐĂNG NHẬP: Lưu lại URL authorize và chuyển user đến form login của VNTEZ ID
  if (!user) {
    const currentQuery = new URLSearchParams();
    if (client_id) currentQuery.set("client_id", client_id);
    if (redirect_uri) currentQuery.set("redirect_uri", redirect_uri);
    if (response_type) currentQuery.set("response_type", response_type);
    if (state) currentQuery.set("state", state);
    if (code_challenge) currentQuery.set("code_challenge", code_challenge);
    if (code_challenge_method)
      currentQuery.set("code_challenge_method", code_challenge_method);
    if (scope) currentQuery.set("scope", scope);

    const fullAuthorizeUrl = `/oauth/authorize?${currentQuery.toString()}`;
    redirect(`/login?redirect_url=${encodeURIComponent(fullAuthorizeUrl)}`);
  }

  // Nếu ĐÃ ĐĂNG NHẬP:
  // Tự động bypass nếu là ứng dụng nội bộ thuộc VNTEZ
  if (client.is_internal) {
    const authCode = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await saveOAuthCode({
      code: authCode,
      client_id,
      user_id: user.id,
      code_challenge: code_challenge || null,
      code_challenge_method: code_challenge_method || "S256",
      redirect_uri,
      expires_at: expiresAt,
    });

    const targetUrl = new URL(redirect_uri);
    targetUrl.searchParams.set("code", authCode);
    if (state) targetUrl.searchParams.set("state", state);

    redirect(targetUrl.toString());
  }

  // Màn hình chấp thuận cấp quyền (Consent screen) cho các ứng dụng vệ tinh/bên thứ ba
  const meta = user.user_metadata ?? {};
  const mappedUser = {
    id: user.id,
    name: meta.full_name || meta.name || user.email?.split("@")[0] || "User",
    email: user.email ?? "",
    avatar: meta.avatar_url || meta.picture || null,
  };

  return (
    <ConsentScreen
      client={{
        client_id: client.client_id,
        name: client.name,
        logo_url: client.logo_url,
        description: client.description,
      }}
      user={mappedUser}
      params={{
        redirect_uri,
        state,
        code_challenge,
        code_challenge_method,
        scope,
      }}
    />
  );
}

function ErrorBox({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 p-6 sm:p-8 backdrop-blur-md shadow-xl text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground hover:bg-accent transition-all"
          >
            Quay về Trang chủ VNTEZ ID
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthorizePage(props: AuthorizePageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <AuthorizeContent {...props} />
    </Suspense>
  );
}
