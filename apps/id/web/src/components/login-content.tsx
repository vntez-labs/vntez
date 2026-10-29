"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FacebookIcon,
  GithubIcon,
  GoogleIcon,
} from "@/components/icons/oauth-icons";
import { SocialButton } from "@/components/social-button";
import { ModeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { ShieldCheck, Sparkles, Code2, ArrowLeft, Zap } from "lucide-react";

export function LoginContent() {
  const { error, clearError } = useAuthStore();
  const [isOAuthLogin, setIsOAuthLogin] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect_url");
      if (redirectUrl && redirectUrl.includes("/oauth/authorize")) {
        setIsOAuthLogin(true);
      }

      const err = params.get("error");
      const errDesc = params.get("error_description");
      if (err) {
        console.error("[Login Auth Error]", { error: err, description: errDesc });
        if (errDesc) {
          setUrlError(`${err}: ${errDesc}`);
        } else if (err === "auth_failed") {
          setUrlError("Xác thực thất bại (auth_failed): Không thể đổi mã phiên làm việc. Vui lòng kiểm tra cấu hình Redirect URLs trong Supabase.");
        } else {
          setUrlError(`Lỗi xác thực: ${err}`);
        }
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground lg:grid lg:grid-cols-2">
      <div className="absolute right-4 top-4 z-50 lg:right-8 lg:top-8 flex items-center gap-2.5">
        <Button variant="outline" size="sm" asChild className="gap-1.5">
          <Link href="/">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Trang chủ</span>
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="gap-1.5">
          <Link href="/developers">
            <Code2 className="h-3.5 w-3.5 text-primary" />
            <span>Developers & API</span>
          </Link>
        </Button>
        <ModeToggle />
      </div>

      {/* LEFT COLUMN (Brand) */}
      <div className="relative hidden overflow-hidden border-r border-border bg-card/40 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-sky-500/15 blur-[140px]" />

        <Link href="/" className="relative z-10 flex items-center gap-3 transition-opacity hover:opacity-85">
          <img
            src="/logo.svg"
            alt="VNTEZ ID"
            className="h-8 w-8 rounded-lg shadow-md"
          />
          <span className="text-lg font-bold tracking-tight">
            VNTEZ <span className="text-primary font-mono text-sm">ID</span>
          </span>
        </Link>

        <div className="relative z-10 my-auto max-w-md">
          <Badge variant="brand" size="default" className="mb-6 gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Unified Identity & SSO Provider
          </Badge>
          <h2 className="font-display text-3xl font-extrabold leading-snug tracking-tight text-foreground">
            Một định danh cho toàn bộ hệ sinh thái của bạn.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Đăng nhập một lần an toàn bằng chuẩn OAuth 2.0 PKCE để truy cập liền
            mạch vào Console, POS, Docs và mọi ứng dụng vệ tinh khác.
          </p>

          <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Chống Replay Attack</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span>Cloudflare Worker Edge</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 font-mono text-xs text-muted-foreground flex items-center justify-between border-t border-border/60 pt-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cloudflare Edge Network</span>
          </div>
          <span className="text-[11px] text-muted-foreground/80">
            v2.0.0
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="relative flex min-h-screen items-center justify-center p-8 lg:min-h-0 lg:p-16">
        <div className="w-full max-w-[380px] space-y-6">
          <div className="space-y-2">
            <Link href="/" className="mb-6 flex items-center gap-2.5 lg:hidden transition-opacity hover:opacity-85">
              <img
                src="/logo.svg"
                alt="VNTEZ ID"
                className="h-7 w-7 rounded-lg"
              />
              <span className="text-base font-bold">VNTEZ ID</span>
            </Link>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Đăng nhập
            </h1>
            <p className="text-sm text-muted-foreground">
              {isOAuthLogin
                ? "Đăng nhập tài khoản VNTEZ ID để tiếp tục ủy quyền ứng dụng."
                : "Chọn phương thức xác thực an toàn của bạn."}
            </p>
          </div>

          {isOAuthLogin && (
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs text-primary flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Ứng dụng đang yêu cầu bạn xác thực để liên kết quyền truy cập
                tài khoản.
              </span>
            </div>
          )}

          {(urlError || error) && (
            <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive space-y-1">
              <div className="flex justify-between items-start gap-2">
                <span className="font-semibold break-words">{urlError || error}</span>
                <button
                  type="button"
                  onClick={() => {
                    setUrlError(null);
                    clearError();
                  }}
                  className="hover:text-destructive/80 font-bold shrink-0 text-base leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            <SocialButton
              provider="google"
              label="Tiếp tục với Google"
              icon={<GoogleIcon />}
            />
            <SocialButton
              provider="github"
              label="Tiếp tục với GitHub"
              icon={<GithubIcon />}
            />
            <SocialButton
              provider="facebook"
              label="Tiếp tục với Facebook"
              icon={<FacebookIcon />}
            />
          </div>

          {/* Developer quick link card */}
          <Card className="border-border bg-card/60">
            <CardContent className="p-4 text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                Bạn là lập trình viên muốn tích hợp SSO vào ứng dụng?
              </p>
              <Link
                href="/developers"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>Khám phá Developer Hub & Tài liệu API →</span>
              </Link>
            </CardContent>
          </Card>

          <p className="pt-4 text-center text-xs text-muted-foreground">
            Bằng việc tiếp tục, bạn đồng ý với{" "}
            <Link
              href="/terms"
              className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
            >
              Điều khoản
            </Link>{" "}
            và{" "}
            <Link
              href="/privacy"
              className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
            >
              Bảo mật
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
