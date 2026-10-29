"use client";

import { motion } from "framer-motion";
import { safeReturnTo } from "@/lib/redirect";
import { cn } from "@workspace/ui/lib/utils";
import { type Provider, useAuthStore } from "@/stores/auth.store";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@workspace/ui/components/button";

interface SocialButtonProps {
  provider: Provider;
  label: string;
  icon: React.ReactNode;
  className?: string;
}

export function SocialButton({
  provider,
  label,
  icon,
  className,
}: SocialButtonProps) {
  const { isLoading, startLoading, stopLoading, setError, clearError } =
    useAuthStore();
  const isThisLoading = isLoading === provider;
  const isAnyLoading = isLoading !== null;

  const handleClick = async () => {
    if (isAnyLoading) return;
    clearError();
    startLoading(provider);
    try {
      const raw = new URLSearchParams(window.location.search).get(
        "redirect_url",
      );
      const returnTo = safeReturnTo(raw);

      // Khởi tạo Supabase client chuẩn trình duyệt để lưu PKCE verifier trực tiếp vào cookie trình duyệt
      const supabase = createClient();
      const redirectUri = new URL(`${window.location.origin}/auth/callback`);
      if (returnTo) {
        redirectUri.searchParams.set("redirect_url", returnTo);
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUri.toString(),
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }
    } catch (err: any) {
      console.error(`[SocialButton] OAuth ${provider} error:`, err);
      stopLoading();
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi đăng nhập.",
      );
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={isAnyLoading}
      className={cn(
        "relative flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-all hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      <span>{label}</span>
      {isThisLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </Button>
  );
}
