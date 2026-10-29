"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  LogIn,
  FileCode,
  Bot,
  Layers,
} from "lucide-react";
import { ModeToggle } from "@/components/ThemeToggle";
import { Button } from "@workspace/ui/components/button";
import { VntezLogo } from "@workspace/ui/components/vntez-logo";
import { cn } from "@workspace/ui/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

interface DeveloperHubProps {
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
  } | null;
  siteUrl?: string;
}

export function DeveloperHub({ user }: DeveloperHubProps) {
  const [activeTab, setActiveTab] = useState<"api" | "prompts">("api");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const CANONICAL_GATEWAY_URL = "https://vntez-id.vercel.app";

  // Đọc query param ?tab=prompts từ URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "prompts" || tab === "api") {
        setActiveTab(tab);
      }
    }
  }, []);

  const changeTab = (tab: "api" | "prompts") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url.toString());
    }
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1 Prompt chuẩn duy nhất cho mọi AI Assistant
  const masterPrompt = `Bạn là AI chuyên gia bảo mật và fullstack developer. Hãy tích hợp tính năng đăng nhập Single Sign-On (SSO) bằng VNTEZ ID qua giao thức chuẩn OAuth 2.0 PKCE (RFC 7636 & RFC 6749) vào dự án này theo quy trình dưới đây:

=== 1. YÊU CẦU BẮT BUỘC TRƯỚC KHI TÍCH HỢP ===
- Client ID (và Client Secret nếu là ứng dụng server bí mật) BẮT BUỘC phải được tạo và quản lý tại VNTEZ Console: https://vntez-console.vercel.app
- Khi tạo Client trên VNTEZ Console, bạn phải đăng ký đúng Redirect URI của ứng dụng (ví dụ: https://your-domain.com/auth/callback hoặc http://localhost:3000/auth/callback khi phát triển local).
- Điền Client ID đã được cấp vào biến môi trường VNTEZ_CLIENT_ID (thay thế placeholder <YOUR_VNTEZ_CLIENT_ID>). KHÔNG ĐƯỢC để lộ Client Secret ở ứng dụng client/frontend.

=== 2. CỔNG XÁC THỰC VNTEZ ID & CÁC ENDPOINT OAUTH 2.0 ===
Cổng xác thực định danh VNTEZ ID Gateway:
- Base Gateway URL: ${CANONICAL_GATEWAY_URL}

1. Endpoint Chuyển hướng Xác thực (GET):
   URL: ${CANONICAL_GATEWAY_URL}/oauth/authorize
   Tham số Query:
   * client_id: Client ID được cấp từ VNTEZ Console
   * redirect_uri: URL nhận callback đã đăng ký (phải khớp 100%)
   * response_type: "code"
   * state: Chuỗi ngẫu nhiên cryptographically secure (32 ký tự) chống tấn công CSRF
   * code_challenge: Chuỗi base64url của SHA-256(code_verifier)
   * code_challenge_method: "S256"

2. Endpoint Đổi Token (POST):
   URL: ${CANONICAL_GATEWAY_URL}/oauth/token
   Header: Content-Type: application/json (hoặc application/x-www-form-urlencoded)
   Payload Body:
   {
     "grant_type": "authorization_code",
     "code": "<auth_code_nhan_duoc_tu_redirect>",
     "client_id": "<YOUR_VNTEZ_CLIENT_ID>",
     "code_verifier": "<original_code_verifier>",
     "redirect_uri": "<redirect_uri_da_dang_ky>"
   }
   Response (200 OK):
   {
     "access_token": "eyJhbGciOi...",
     "token_type": "Bearer",
     "expires_in": 3600,
     "scope": "openid profile email"
   }

3. Endpoint Lấy Thông Tin Người Dùng (GET):
   URL: ${CANONICAL_GATEWAY_URL}/oauth/userinfo
   Header: Authorization: Bearer <access_token>
   Response (200 OK):
   {
     "sub": "user-uuid",
     "email": "user@example.com",
     "name": "Nguyễn Văn A",
     "avatar": "https://..."
   }

4. OpenID Connect Discovery:
   URL: ${CANONICAL_GATEWAY_URL}/.well-known/openid-configuration

=== 3. QUY TRÌNH 4 BƯỚC CẦN THỰC HIỆN ===
Bước 1: Viết hàm sinh 'code_verifier' ngẫu nhiên (43-128 ký tự base64url) và băm SHA-256 để sinh 'code_challenge'. Sinh thêm 'state' ngẫu nhiên (32 ký tự).
Bước 2: Khi người dùng bấm "Đăng nhập bằng VNTEZ ID":
   - Lưu 'state' và 'code_verifier' vào HTTP-only cookie (hoặc session bảo mật).
   - Chuyển hướng trình duyệt tới URL xác thực của VNTEZ ID:
     ${CANONICAL_GATEWAY_URL}/oauth/authorize?client_id=<YOUR_VNTEZ_CLIENT_ID>&redirect_uri=<REDIRECT_URI>&response_type=code&state=<STATE>&code_challenge=<CODE_CHALLENGE>&code_challenge_method=S256
Bước 3: Tạo route callback nhận 'code' và 'state' từ URL query:
   - So khớp 'state' với state đã lưu trong cookie (nếu không khớp -> từ chối request để chống CSRF).
   - Đọc 'code_verifier' đã lưu.
   - Gửi POST request tới ${CANONICAL_GATEWAY_URL}/oauth/token để nhận 'access_token'.
Bước 4: Gửi GET request tới ${CANONICAL_GATEWAY_URL}/oauth/userinfo với header Authorization: Bearer <access_token> để lấy hồ sơ { sub, email, name, avatar }, sau đó khởi tạo session đăng nhập cho ứng dụng của bạn.`;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors selection:bg-primary/25 selection:text-primary">
      {/* ========================================================= */}
      {/* TOP NAVIGATION BAR                                       */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 gap-3">
          {/* Left: Brand & Breadcrumb */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <a href="/" className="flex items-center gap-2 shrink-0 transition-opacity hover:opacity-85 group">
              <VntezLogo size={24} />
              <span className="font-display font-bold text-base tracking-tight text-foreground group-hover:text-primary transition-colors">
                vntez <span className="text-primary font-mono text-xs">id</span>
              </span>
            </a>
            <span className="text-muted-foreground/30 font-light select-none">/</span>
            <span className="text-xs sm:text-sm font-semibold text-foreground/80 whitespace-nowrap">
              Developers
            </span>
          </div>

          {/* Center Tabs (Desktop) */}
          <div className="hidden md:flex items-center rounded-lg border border-border/60 bg-muted/60 p-1 text-muted-foreground">
            <button
              type="button"
              onClick={() => changeTab("api")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer",
                activeTab === "api"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <FileCode className={cn("h-3.5 w-3.5", activeTab === "api" ? "text-primary" : "text-muted-foreground")} />
              <span>Tài liệu API</span>
            </button>

            <button
              type="button"
              onClick={() => changeTab("prompts")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer",
                activeTab === "prompts"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <Sparkles className={cn("h-3.5 w-3.5", activeTab === "prompts" ? "text-primary" : "text-muted-foreground")} />
              <span>Prompts AI</span>
              <span className="rounded-full bg-primary/10 text-primary px-1.5 py-0.2 text-[10px] font-bold">
                Mới
              </span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <Button variant="ghost" size="sm" asChild className="gap-2 px-2.5 h-8 rounded-lg border border-border/60 hover:bg-secondary/60">
                <a href="https://vntez-console.vercel.app">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-4 w-4 rounded-full object-cover" />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-foreground max-w-[90px] sm:max-w-[120px] truncate">{user.name}</span>
                </a>
              </Button>
            ) : (
              <Button size="sm" asChild className="gap-1.5 rounded-lg text-xs font-semibold h-8">
                <a href="/login">
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Đăng nhập</span>
                </a>
              </Button>
            )}

            <ModeToggle />
          </div>
        </div>

        {/* Mobile Tab Subnav */}
        <div className="flex md:hidden border-t border-border px-4 py-2 overflow-x-auto gap-1.5 bg-muted/40 scrollbar-none">
          <button
            type="button"
            onClick={() => changeTab("api")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
              activeTab === "api"
                ? "bg-background text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FileCode className={cn("h-3.5 w-3.5", activeTab === "api" ? "text-primary" : "text-muted-foreground")} />
            <span>Tài liệu API</span>
          </button>
          <button
            type="button"
            onClick={() => changeTab("prompts")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
              activeTab === "prompts"
                ? "bg-background text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sparkles className={cn("h-3.5 w-3.5", activeTab === "prompts" ? "text-primary" : "text-muted-foreground")} />
            <span>Prompts AI</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN CONTAINER                                           */}
      {/* ========================================================= */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="brand" className="font-mono uppercase tracking-wider text-xs px-3 py-1">
            VNTEZ ID SPECIFICATION
          </Badge>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Tài liệu kỹ thuật & <br />
            <span className="text-primary">OAuth 2.0 PKCE Endpoints.</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans max-w-2xl mx-auto">
            Hướng dẫn chi tiết tích hợp Single Sign-On (SSO) theo chuẩn RFC 6749 và RFC 7636. Kết nối các ứng dụng trong hệ sinh thái an toàn, không cần Client Secret tĩnh ở client.
          </p>

          {/* Quick Links Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <a
              href="#flow"
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
            >
              Sơ đồ luồng PKCE
            </a>
            <a
              href="#ep-authorize"
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
            >
              GET /oauth/authorize
            </a>
            <a
              href="#ep-token"
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
            >
              POST /oauth/token
            </a>
            <a
              href="#ep-userinfo"
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
            >
              GET /oauth/userinfo
            </a>
            <a
              href="#ep-discovery"
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
            >
              Discovery OIDC
            </a>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: API & SƠ ĐỒ LUỒNG                                   */}
        {/* ========================================================= */}
        {activeTab === "api" && (
          <div className="space-y-10">
            {/* 1. SƠ ĐỒ LUỒNG 4 BƯỚC */}
            <div id="flow" className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <Layers className="size-5 text-primary" />
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    1. Sơ đồ Luồng Xác thực OAuth 2.0 PKCE
                  </h2>
                </div>
                <Badge variant="outline" className="font-mono text-xs font-semibold">
                  RFC 7636 & RFC 6749
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Quy trình ủy quyền 4 bước sử dụng mã bảo vệ động (Proof Key for Code Exchange) thay thế hoàn toàn secret tĩnh ở máy khách, triệt tiêu nguy cơ bị đánh chặn mã ủy quyền.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">Bước 1</span>
                    <span className="text-[11px] font-mono text-muted-foreground">Client ➔ Gateway</span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground">Chuyển hướng đăng nhập</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Sinh <code>code_verifier</code> và băm SHA-256 tạo <code>code_challenge</code>, chuyển hướng người dùng tới <code>/oauth/authorize</code>.
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">Bước 2</span>
                    <span className="text-[11px] font-mono text-muted-foreground">VNTEZ ID</span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground">Cấp Authorization Code</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Xác thực người dùng một chạm, trả về mã <code>code</code> qua URL redirect (hết hạn sau 5 phút, chỉ dùng 1 lần).
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">Bước 3</span>
                    <span className="text-[11px] font-mono text-muted-foreground">App ➔ Gateway</span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground">Đổi mã lấy Token</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Gửi POST tới <code>/oauth/token</code> cùng <code>code</code> và <code>code_verifier</code> để nhận JWT Access Token.
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">Bước 4</span>
                    <span className="text-[11px] font-mono text-muted-foreground">Resource API</span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground">Lấy hồ sơ tài khoản</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Đính kèm Bearer token gửi GET tới <code>/oauth/userinfo</code> để nhận thông tin định danh <code>sub</code>, <code>email</code>, <code>name</code>.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. CHI TIẾT 4 ENDPOINTS */}
            <div className="space-y-6">
              {/* ENDPOINT 1 */}
              <div id="ep-authorize" className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold px-2.5 py-1">
                      GET
                    </span>
                    <h3 className="font-mono text-lg sm:text-xl font-bold text-foreground">
                      /oauth/authorize
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[11px]">
                      RFC 6749 §4.1.1
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copy(
                          `${CANONICAL_GATEWAY_URL}/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=https://your-app.com/callback&response_type=code&state=xyz123abc&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&code_challenge_method=S256`,
                          "ep1"
                        )
                      }
                      className="gap-1.5 text-xs h-8"
                    >
                      {copiedKey === "ep1" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === "ep1" ? "Đã sao chép" : "Sao chép URL"}</span>
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                  Màn hình xác thực và phê duyệt ủy quyền. Sau khi người dùng đồng ý, cổng VNTEZ ID phát sinh mã <code>code</code> và chuyển hướng trình duyệt về <code>redirect_uri?code=...&state=...</code>.
                </p>

                {/* Query Parameters Grid */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2.5 text-xs">
                  <div className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">
                    Tham số Query (Query Parameters):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
                    <div><code className="text-foreground font-semibold">client_id</code>: Client ID đã được cấp (bắt buộc)</div>
                    <div><code className="text-foreground font-semibold">redirect_uri</code>: URL callback đã đăng ký (bắt buộc)</div>
                    <div><code className="text-foreground font-semibold">response_type</code>: Cố định là <code>code</code> (bắt buộc)</div>
                    <div><code className="text-foreground font-semibold">state</code>: Chuỗi ngẫu nhiên 32 ký tự chống CSRF (bắt buộc)</div>
                    <div><code className="text-foreground font-semibold">code_challenge</code>: SHA-256 base64url của verifier (bắt buộc)</div>
                    <div><code className="text-foreground font-semibold">code_challenge_method</code>: Cố định là <code>S256</code> (bắt buộc)</div>
                  </div>
                </div>

                {/* Formatted Code Box */}
                <div className="rounded-xl bg-[#080d16] border border-white/[0.08] p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200 overflow-x-auto">
                  <pre className="whitespace-pre">
{`GET https://vntez-id.vercel.app/oauth/authorize
  ?client_id=YOUR_CLIENT_ID
  &redirect_uri=https://your-app.com/callback
  &response_type=code
  &state=xyz123abc
  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
  &code_challenge_method=S256`}
                  </pre>
                </div>
              </div>

              {/* ENDPOINT 2 */}
              <div id="ep-token" className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-primary/10 text-primary font-mono text-xs font-bold px-2.5 py-1">
                      POST
                    </span>
                    <h3 className="font-mono text-lg sm:text-xl font-bold text-foreground">
                      /oauth/token
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[11px]">
                      application/json
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copy(
                          `curl -X POST "https://vntez-id.vercel.app/oauth/token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "authorization_code",
    "client_id": "YOUR_CLIENT_ID",
    "code": "AUTH_CODE_RECEIVED",
    "code_verifier": "ORIGINAL_CODE_VERIFIER",
    "redirect_uri": "https://your-app.com/callback"
  }'`,
                          "ep2"
                        )
                      }
                      className="gap-1.5 text-xs h-8"
                    >
                      {copiedKey === "ep2" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === "ep2" ? "Đã sao chép" : "Sao chép cURL"}</span>
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                  Gửi mã xác thực kèm <code>code_verifier</code> gốc lên server để nhận JWT Access Token. Cổng xác thực sẽ đối soát băm SHA-256 và lập tức thu hồi mã authorization code để chống tấn công phát lại (Replay Attack).
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Request Code Block */}
                  <div className="rounded-xl bg-[#080d16] border border-white/[0.08] p-4 sm:p-5 font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto space-y-2">
                    <span className="text-slate-400 block font-bold text-[11px]">{"// Request cURL:"}</span>
                    <pre className="whitespace-pre">
{`curl -X POST https://vntez-id.vercel.app/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "authorization_code",
    "client_id": "YOUR_CLIENT_ID",
    "code": "AUTH_CODE",
    "code_verifier": "PKCE_VERIFIER",
    "redirect_uri": "https://your-app.com/callback"
  }'`}
                    </pre>
                  </div>

                  {/* Response Code Block */}
                  <div className="rounded-xl bg-[#080d16] border border-white/[0.08] p-4 sm:p-5 font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto space-y-2">
                    <span className="text-emerald-400 block font-bold text-[11px]">{"// Response (200 OK):"}</span>
                    <pre className="whitespace-pre text-emerald-300">
{`{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid profile email"
}`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* ENDPOINT 3 */}
              <div id="ep-userinfo" className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold px-2.5 py-1">
                      GET
                    </span>
                    <h3 className="font-mono text-lg sm:text-xl font-bold text-foreground">
                      /oauth/userinfo
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[11px]">
                      Bearer Token
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copy(
                          `curl -X GET "https://vntez-id.vercel.app/oauth/userinfo" \\
  -H "Authorization: Bearer <access_token>"`,
                          "ep3"
                        )
                      }
                      className="gap-1.5 text-xs h-8"
                    >
                      {copiedKey === "ep3" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === "ep3" ? "Đã sao chép" : "Sao chép cURL"}</span>
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                  Truy vấn thông tin hồ sơ tài khoản người dùng đã được định danh và xác thực qua header <code>Authorization: Bearer &lt;access_token&gt;</code>.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Request Code Block */}
                  <div className="rounded-xl bg-[#080d16] border border-white/[0.08] p-4 sm:p-5 font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto space-y-2">
                    <span className="text-slate-400 block font-bold text-[11px]">{"// Request cURL:"}</span>
                    <pre className="whitespace-pre">
{`curl -X GET https://vntez-id.vercel.app/oauth/userinfo \\
  -H "Authorization: Bearer <access_token>"`}
                    </pre>
                  </div>

                  {/* Response Code Block */}
                  <div className="rounded-xl bg-[#080d16] border border-white/[0.08] p-4 sm:p-5 font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto space-y-2">
                    <span className="text-emerald-400 block font-bold text-[11px]">{"// Profile JSON (200 OK):"}</span>
                    <pre className="whitespace-pre text-emerald-300">
{`{
  "sub": "usr_94e21a8c-7f5b-42b1",
  "email": "developer@vntez.com",
  "name": "Hoàng Nam",
  "avatar": "https://avatars.githubusercontent.com/u/102873"
}`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* ENDPOINT 4 */}
              <div id="ep-discovery" className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold px-2.5 py-1">
                      GET
                    </span>
                    <h3 className="font-mono text-lg sm:text-xl font-bold text-foreground">
                      /.well-known/openid-configuration
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[11px]">
                      OIDC Discovery 1.0
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copy(`https://vntez-id.vercel.app/.well-known/openid-configuration`, "ep4")
                      }
                      className="gap-1.5 text-xs h-8"
                    >
                      {copiedKey === "ep4" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === "ep4" ? "Đã sao chép" : "Sao chép URL"}</span>
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                  Metadata cấu hình chuẩn OpenID Connect. Thư viện OAuth Client (NextAuth, Passport, Auth.js) có thể đọc endpoint này để tự động cấu hình toàn bộ URL xác thực.
                </p>

                <div className="rounded-xl bg-[#080d16] border border-white/[0.08] p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200 overflow-x-auto">
                  <pre className="whitespace-pre">
{`curl -X GET https://vntez-id.vercel.app/.well-known/openid-configuration`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Support / Quick Action Footer Card */}
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center sm:text-left">
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                  Cần mẫu Prompt cho AI để sinh mã tự động?
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Chuyển sang tab "Prompts AI" để copy 1-click prompt tối ưu cho Cursor, Claude Code, Windsurf.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeTab("prompts")}
                  className="rounded-xl font-semibold gap-1.5 h-9"
                >
                  <Sparkles className="size-4 text-primary" />
                  <span>Xem Prompts AI</span>
                </Button>
                <Button size="sm" asChild className="rounded-xl font-semibold shadow-xs h-9">
                  <a href="https://vntez-console.vercel.app" target="_blank" rel="noreferrer" className="gap-1.5">
                    <span>Mở VNTEZ Console</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PROMPTS CHO AI                                     */}
        {/* ========================================================= */}
        {activeTab === "prompts" && (
          <div className="space-y-8">
            <Card className="border-border">
              <CardHeader className="border-b border-border/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-base sm:text-lg">
                        Master Integration Prompt (Dùng cho mọi AI Assistant)
                      </CardTitle>
                      <CardDescription>
                        Copy và dán trực tiếp vào Cursor Composer, Claude Code, Windsurf hoặc ChatGPT
                      </CardDescription>
                    </div>
                  </div>

                  <Button
                    onClick={() => copy(masterPrompt, "master")}
                    size="sm"
                    className="gap-1.5 shrink-0"
                  >
                    {copiedKey === "master" ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span>Đã sao chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Sao chép Prompt</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-3">
                <div className="relative rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-300 border border-slate-800 max-h-96 overflow-y-auto leading-relaxed scrollbar-thin">
                  <pre className="whitespace-pre-wrap">{masterPrompt}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
