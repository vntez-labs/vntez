"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertTriangle } from "lucide-react";
import { getVntezClient } from "@workspace/auth/sdk";
import { useAuthStore } from "@workspace/auth/store";
import { COOKIE_NAMES } from "@workspace/auth/cookies";

export default function WebAuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  useEffect(() => {
    let active = true;

    async function processCallback() {
      try {
        const vntez = getVntezClient();
        const callbackUrl = `${window.location.origin}/auth/callback`;
        const { accessToken, user } = await vntez.auth.handleCallback(callbackUrl);

        const maxAge = 60 * 60 * 24 * 30; // 30 days
        document.cookie = `${COOKIE_NAMES.ACCESS_TOKEN}=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
        document.cookie = `${COOKIE_NAMES.USER_SESSION}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`;

        if (active) {
          setAuthenticated(user as any, accessToken);
          router.replace("/");
        }
      } catch (err) {
        if (active) {
          console.error("Web OAuth callback error:", err);
          setError(err instanceof Error ? err.message : "Xác thực danh tính thất bại");
        }
      }
    }

    processCallback();

    return () => {
      active = false;
    };
  }, [router, setAuthenticated]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full p-8 rounded-2xl border border-destructive/20 bg-destructive/5 text-center space-y-5 shadow-xs">
          <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
            <AlertTriangle className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-foreground">Xác thực không thành công</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">{error}</p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-colors shadow-2xs"
            >
              Quay lại Trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">
          Đang hoàn tất đăng nhập qua VNTEZ IAM...
        </p>
      </div>
    </div>
  );
}
