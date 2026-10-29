"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/ThemeToggle";
import { buttonVariants } from "@workspace/ui/components/button";
import { VntezLogo } from "@workspace/ui/components/vntez-logo";
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  KeyRound,
  Terminal,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const MASTER_AI_INTEGRATION_PROMPT = `Bạn là AI chuyên gia bảo mật và fullstack developer. Hãy tích hợp tính năng đăng nhập Single Sign-On (SSO) bằng VNTEZ ID qua giao thức chuẩn OAuth 2.0 PKCE (RFC 7636 & RFC 6749) vào dự án này theo quy trình dưới đây:

=== 1. YÊU CẦU BẮT BUỘC TRƯỚC KHI TÍCH HỢP ===
- Client ID (và Client Secret nếu là ứng dụng server bí mật) BẮT BUỘC phải được tạo và quản lý tại VNTEZ Console: https://vntez-console.vercel.app
- Khi tạo Client trên VNTEZ Console, bạn phải đăng ký đúng Redirect URI của ứng dụng (ví dụ: https://your-domain.com/auth/callback hoặc http://localhost:3000/auth/callback khi phát triển local).
- Điền Client ID đã được cấp vào biến môi trường VNTEZ_CLIENT_ID. KHÔNG ĐƯỢC để lộ Client Secret ở frontend/client.

=== 2. CỔNG XÁC THỰC VNTEZ ID & CÁC ENDPOINT OAUTH 2.0 ===
Cổng xác thực định danh VNTEZ ID Gateway:
- Gateway Base URL: https://vntez-id.vercel.app

1. Endpoint Chuyển hướng Xác thực (GET):
   URL: https://vntez-id.vercel.app/oauth/authorize
   Tham số: client_id, redirect_uri, response_type="code", state, code_challenge (SHA-256 base64url), code_challenge_method="S256"

2. Endpoint Đổi Token (POST):
   URL: https://vntez-id.vercel.app/oauth/token
   Payload: { grant_type: "authorization_code", code, client_id, code_verifier, redirect_uri }
   Response: { access_token, token_type: "Bearer", expires_in: 3600, scope: "openid profile email" }

3. Endpoint Lấy Thông Tin Người Dùng (GET):
   URL: https://vntez-id.vercel.app/oauth/userinfo
   Header: Authorization: Bearer <access_token>
   Response: { sub, email, name, avatar }

4. OpenID Connect Discovery:
   URL: https://vntez-id.vercel.app/.well-known/openid-configuration

=== 3. QUY TRÌNH 4 BƯỚC THỰC HIỆN ===
Bước 1: Sinh 'code_verifier' ngẫu nhiên (43-128 ký tự) và băm SHA-256 để sinh 'code_challenge'. Sinh 'state' ngẫu nhiên (32 ký tự).
Bước 2: Chuyển hướng trình duyệt tới https://vntez-id.vercel.app/oauth/authorize kèm các tham số trên.
Bước 3: Tại callback URL, kiểm tra 'state' khớp với session/cookie, sau đó gửi POST tới https://vntez-id.vercel.app/oauth/token kèm 'code' và 'code_verifier'.
Bước 4: Gửi GET tới https://vntez-id.vercel.app/oauth/userinfo với Bearer token để lấy thông tin hồ sơ và tạo session đăng nhập cho ứng dụng.`;

const CODE_EXAMPLES = {
  aiPrompt: {
    label: "AI Prompt",
    icon: Sparkles,
    filename: "prompt-cursor-claude.md",
    code: MASTER_AI_INTEGRATION_PROMPT,
  },
  typescript: {
    label: "TypeScript / Next.js",
    icon: Code2,
    filename: "vntez-auth.ts",
    code: `// 1. Tạo URL đăng nhập OAuth 2.0 PKCE
import { generateCodeVerifier, generateCodeChallenge } from './pkce';

export async function getVntezLoginUrl(redirectUri: string) {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  const state = crypto.randomUUID();

  // Lưu verifier & state vào secure HTTP-only cookie
  cookies().set('vntez_verifier', verifier, { httpOnly: true, secure: true });
  cookies().set('vntez_state', state, { httpOnly: true, secure: true });

  const params = new URLSearchParams({
    client_id: process.env.VNTEZ_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    state: state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });

  return \`https://vntez-id.vercel.app/oauth/authorize?\${params.toString()}\`;
}

// 2. Đổi auth code lấy JWT access token tại route callback
export async function exchangeCodeForToken(code: string, verifier: string, redirectUri: string) {
  const res = await fetch('https://vntez-id.vercel.app/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.VNTEZ_CLIENT_ID!,
      code,
      code_verifier: verifier,
      redirect_uri: redirectUri,
    }),
  });

  return res.json(); // { access_token, expires_in, scope }
}`,
  },
  curl: {
    label: "cURL (REST API)",
    icon: Terminal,
    filename: "endpoints.sh",
    code: `# 1. Đổi Authorization Code lấy Access Token
curl -X POST https://vntez-id.vercel.app/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "authorization_code",
    "client_id": "vntez_c18f43a315d368109d4d8aca",
    "code": "AUTH_CODE_RECEIVED",
    "code_verifier": "ORIGINAL_CODE_VERIFIER",
    "redirect_uri": "https://your-app.com/callback"
  }'

# 2. Truy vấn thông tin người dùng với Bearer Token
curl -X GET https://vntez-id.vercel.app/oauth/userinfo \\
  -H "Authorization: Bearer <access_token>"

# 3. Khám phá cấu hình OpenID Connect
curl -X GET https://vntez-id.vercel.app/.well-known/openid-configuration`,
  },
};

export function LandingPage() {
  const [activeTab, setActiveTab] = useState<keyof typeof CODE_EXAMPLES>("aiPrompt");
  const [copied, setCopied] = useState(false);

  const activeSnippet = CODE_EXAMPLES[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors selection:bg-[#fb291a]/20 selection:text-[#fb291a]">
      {/* =================================================================== */}
      {/* 1. HEADER / NAVBAR (Exact Match to apps/web style)                  */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#080c14]/85 backdrop-blur-md border-b border-black/[0.04] dark:border-white/[0.04] transition-all">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <VntezLogo size={28} />
            <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#fb291a] transition-colors">
              vntez <span className="text-[#fb291a] font-mono text-sm ml-0.5">id</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link
              href="/developers"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Tài liệu Developers
            </Link>
            <a
              href="#endpoints"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Endpoints REST
            </a>
            <Link
              href="/terms"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Điều khoản
            </Link>
            <Link
              href="/privacy"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Bảo mật
            </Link>
          </nav>

          {/* Action Buttons & Theme Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "hidden sm:inline-flex font-semibold shadow-xs px-5 rounded-full",
              })}
            >
              Đăng nhập
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. HERO SECTION (Clean, Impactful, No Clutter)                      */}
      {/* =================================================================== */}
      <section className="relative mx-auto max-w-5xl px-6 pt-20 pb-14 text-center">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-[#fb291a]/10 blur-[130px] dark:bg-[#fb291a]/15" />

        {/* Subtle Pill Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 backdrop-blur-xs">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fb291a] opacity-75" />
            <span className="relative inline-flex rounded-full size-2 bg-[#fb291a]" />
          </span>
          <span>Nền tảng Định danh Tập trung & SSO OAuth 2.0 PKCE</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] max-w-4xl mx-auto">
          <span>Một định danh duy nhất cho</span>{" "}
          <span className="text-[#fb291a]">toàn bộ hệ sinh thái.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          Xác thực một chạm bảo mật chuẩn OAuth 2.0 & RFC 7636 PKCE trên hạ tầng phân tán tốc độ cao.
          Kết nối liền mạch toàn bộ ứng dụng Web, Mobile và dịch vụ của bạn chỉ với vài dòng mã.
        </p>

        {/* Action Buttons using Scaled-up Shadcn Button Variants */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/developers"
            className={buttonVariants({
              variant: "default",
              size: "xl",
              className: "rounded-full shadow-md hover:shadow-lg gap-2 text-sm sm:text-base font-bold px-7 py-3",
            })}
          >
            <span>Khám phá Developer Hub</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/login"
            className={buttonVariants({
              variant: "outline",
              size: "xl",
              className: "rounded-full text-sm sm:text-base font-semibold px-7 py-3",
            })}
          >
            Đăng nhập tài khoản
          </Link>
        </div>

        {/* Trust Indicators Strip */}
        <div className="mt-14 pt-8 border-t border-black/[0.04] dark:border-white/[0.06] flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs font-medium text-slate-500 dark:text-slate-400 font-sans">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Chuẩn OAuth 2.0 (RFC 6749)</span>
          </div>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-[#fb291a]" />
            <span>Mã hóa PKCE S256 (RFC 7636)</span>
          </div>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>High-Performance Edge CDN</span>
          </div>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-sky-500" />
            <span>JWT Token RS256 / Ed25519</span>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. CORE FEATURES GRID (Sleek cards matching DuckDbGrid style)       */}
      {/* =================================================================== */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Được thiết kế cho Hệ sinh thái Doanh nghiệp Hiện đại
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Giải quyết triệt để phân mảnh tài khoản, tối ưu trải nghiệm người dùng và bảo đảm toàn vẹn định danh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="group relative rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e]/80 p-7 shadow-xs hover:shadow-md hover:border-[#fb291a]/40 transition-all duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fb291a]/10 text-[#fb291a] mb-5">
              <KeyRound className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#fb291a] transition-colors">
              Single Sign-On (SSO)
            </h3>
            <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Người dùng chỉ cần đăng nhập một lần duy nhất. Phiên làm việc được chia sẻ liền mạch giữa các ứng dụng vệ tinh mà không phải nhập lại mật khẩu.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e]/80 p-7 shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
              Bảo mật PKCE S256
            </h3>
            <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Áp dụng chuẩn RFC 7636 Proof Key for Code Exchange. Mã ủy quyền được thu hồi ngay lập tức sau khi đổi token, triệt tiêu nguy cơ tấn công đánh chặn.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e]/80 p-7 shadow-xs hover:shadow-md hover:border-[#fb291a]/40 transition-all duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fb291a]/10 text-[#fb291a] mb-5">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#fb291a] transition-colors">
              Hạ tầng Edge Tốc độ cao
            </h3>
            <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Xác thực phân phối tốc độ cao với độ trễ phản hồi cực thấp &lt; 20ms, đảm bảo tính sẵn sàng cao và bảo vệ toàn diện hệ sinh thái.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. DEVELOPER EXPERIENCE SECTION (Interactive IDE Code Box)          */}
      {/* =================================================================== */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#fb291a] mb-2">
              Dành cho lập trình viên
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tích hợp chỉ với 3 dòng mã hoặc 1 Prompt AI
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Chọn mẫu mã tích hợp hoặc sao chép Master Prompt cho Cursor, Windsurf, Claude Code để AI tự sinh mã xác thực.
            </p>
          </div>

          <Link
            href="/developers"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "shrink-0 rounded-full gap-1.5 px-4 font-semibold",
            })}
          >
            <span>Vào Developer Hub</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* IDE Container */}
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[#0c121e] shadow-xl overflow-hidden text-slate-200">
          {/* Top Bar: macOS dots + Tabs + Copy */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-[#080d16] px-4 py-2.5">
            <div className="flex items-center gap-3">
              {/* Window dots */}
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded-full bg-rose-500/80" />
                <div className="size-3 rounded-full bg-amber-500/80" />
                <div className="size-3 rounded-full bg-emerald-500/80" />
              </div>

              {/* Language Tabs */}
              <div className="flex items-center gap-1 pl-2">
                {(Object.keys(CODE_EXAMPLES) as (keyof typeof CODE_EXAMPLES)[]).map((key) => {
                  const item = CODE_EXAMPLES[key];
                  const Icon = item.icon;
                  const isActive = activeTab === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      type="button"
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-white/[0.1] text-white font-semibold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Copy Button */}
            <button
              onClick={handleCopy}
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] px-3 py-1 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Sao chép mã</span>
                </>
              )}
            </button>
          </div>

          {/* Code Viewer */}
          <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed max-h-[360px] overflow-y-auto scrollbar-thin">
            <pre className="whitespace-pre-wrap text-slate-300">{activeSnippet.code}</pre>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. REST ENDPOINTS ARCHITECTURE SECTION                              */}
      {/* =================================================================== */}
      <section id="endpoints" className="mx-auto max-w-6xl px-6 py-16 border-t border-black/[0.04] dark:border-white/[0.04]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            3 Endpoints Chuẩn REST Tích hợp Độc lập
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Không cần cài đặt SDK nặng nề. Bất kỳ ngôn ngữ lập trình nào hỗ trợ HTTP request đều có thể kết nối ngay lập tức.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Endpoint 1 */}
          <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e]/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold px-2 py-0.5">
                  GET
                </span>
                <span className="text-[11px] font-mono text-slate-500">Bước 1</span>
              </div>
              <h4 className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                /oauth/authorize
              </h4>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                Chuyển hướng người dùng sang trang cấp quyền kèm <code>client_id</code>, <code>redirect_uri</code> và <code>code_challenge</code> PKCE.
              </p>
            </div>
          </div>

          {/* Endpoint 2 */}
          <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e]/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="rounded-md bg-[#fb291a]/10 text-[#fb291a] font-mono text-xs font-bold px-2 py-0.5">
                  POST
                </span>
                <span className="text-[11px] font-mono text-slate-500">Bước 2</span>
              </div>
              <h4 className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                /oauth/token
              </h4>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                Gửi payload gồm <code>code</code> và <code>code_verifier</code>. Cổng VNTEZ ID xác thực băm SHA-256 và cấp phát JWT Access Token.
              </p>
            </div>
          </div>

          {/* Endpoint 3 */}
          <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e]/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold px-2 py-0.5">
                  GET
                </span>
                <span className="text-[11px] font-mono text-slate-500">Bước 3</span>
              </div>
              <h4 className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                /oauth/userinfo
              </h4>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                Đính kèm header <code>Authorization: Bearer &lt;access_token&gt;</code> để nhận JSON thông tin định danh: <code>sub</code>, <code>email</code>, <code>name</code>, <code>avatar</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. PRE-FOOTER CTA SECTION (Matching apps/web pre-footer-cta)        */}
      {/* =================================================================== */}
      <section className="mx-auto max-w-4xl px-6 py-24 sm:py-28 text-center">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Sẵn sàng kết nối ứng dụng với VNTEZ ID?
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto">
          Tạo tài khoản OAuth Client, cấu hình Redirect URI và bắt đầu xác thực người dùng trong hệ sinh thái VNTEZ trong chưa đầy 5 phút.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/developers"
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "w-full sm:w-auto rounded-full px-8 py-3.5 text-base font-bold shadow-md gap-2",
            })}
          >
            <span>Vào Developer Hub</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full sm:w-auto rounded-full px-8 py-3.5 text-base font-semibold gap-2",
            })}
          >
            Đăng nhập tài khoản
          </Link>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. FOOTER (Matching apps/web footer)                                */}
      {/* =================================================================== */}
      <footer className="bg-slate-50/70 dark:bg-[#060a10] py-16 text-slate-600 dark:text-slate-400 border-t border-black/[0.04] dark:border-white/[0.04] transition-colors">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Col 1: Brand & Status */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2.5 group w-fit">
                <VntezLogo size={26} />
                <span className="font-display text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-[#fb291a] transition-colors">
                  vntez <span className="text-[#fb291a] font-mono text-sm ml-0.5">id</span>
                </span>
              </Link>

              <p className="text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed font-sans text-sm">
                Nền tảng định danh trung tâm và xác thực bảo mật OAuth 2.0 PKCE cho hệ sinh thái công nghệ VNTEZ.
              </p>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
                </span>
                <span>All systems operational</span>
              </div>
            </div>

            {/* Col 2: Developers */}
            <div className="space-y-3">
              <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                Developers
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/developers" className="hover:text-[#fb291a] transition-colors">
                    Developer Hub
                  </Link>
                </li>
                <li>
                  <a href="#endpoints" className="hover:text-[#fb291a] transition-colors">
                    REST API Endpoints
                  </a>
                </li>
                <li>
                  <a
                    href="/.well-known/openid-configuration"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#fb291a] transition-colors"
                  >
                    OpenID Configuration
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Ecosystem */}
            <div className="space-y-3">
              <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                Hệ sinh thái VNTEZ
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a
                    href="https://vntez.net"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#fb291a] transition-colors"
                  >
                    VNTEZ Platform
                  </a>
                </li>
                <li>
                  <a
                    href="https://vntez.net/products#storage"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#fb291a] transition-colors"
                  >
                    Edge S3 Storage
                  </a>
                </li>
                <li>
                  <a
                    href="https://vntez.net/products#bman-pos"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#fb291a] transition-colors"
                  >
                    BMAN POS Core
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal */}
            <div className="space-y-3">
              <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                Chính sách & Pháp lý
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/terms" className="hover:text-[#fb291a] transition-colors">
                    Điều khoản sử dụng
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#fb291a] transition-colors">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/hnamhocit"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#fb291a] transition-colors"
                  >
                    GitHub @hnamhocit
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-black/[0.04] dark:border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} VNTEZ LABS — Single Sign-On Platform</p>
            <p>Hạ tầng định danh phân tán tốc độ cao</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
