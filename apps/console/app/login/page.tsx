import type { Metadata } from "next";
import { KeyRound, AlertTriangle, ArrowRight, Terminal } from "lucide-react";
import { buttonVariants } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";

export const metadata: Metadata = {
  title: "Đăng nhập | VNTEZ Console",
  description: "Xác thực danh tính qua VNTEZ ID Single Sign-On",
};

interface LoginPageProps {
  searchParams: Promise<{
    error?: string;
    redirect?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, redirect } = await searchParams;

  const loginActionUrl = redirect
    ? `/api/auth/login?redirect=${encodeURIComponent(redirect)}`
    : "/api/auth/login";

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4 sm:p-6 lg:p-8">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 tech-grid-pattern opacity-30" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Main Card */}
        <Card className="border border-border/80 bg-card/90 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center space-y-3 pb-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-600 border border-primary/30">
              <Terminal className="h-7 w-7 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold font-display tracking-tight text-foreground">
                VNTEZ <span className="text-primary">CONSOLE</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Đăng nhập để truy cập bảng điều khiển và quản trị hệ thống
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error Notification */}
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Đăng nhập không thành công</span>
                    <p className="mt-0.5 opacity-90">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* SSO Action Button */}
            <div className="pt-2">
              <a
                href={loginActionUrl}
                className={buttonVariants({
                  variant: "default",
                  className:
                    "w-full h-12 text-sm font-semibold gap-2.5 transition-colors cursor-pointer",
                })}
              >
                <KeyRound className="h-4 w-4" />
                <span>Đăng nhập bằng VNTEZ ID</span>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </a>
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-6 text-center justify-center">
            <p className="text-[11px] text-muted-foreground">
              Hệ thống yêu cầu tài khoản ủy quyền VNTEZ ID để truy cập.
            </p>
          </CardFooter>
        </Card>

        {/* Footer info */}
        <div className="text-center text-[11px] text-muted-foreground/50 font-mono">
          VNTEZ Ecosystem &copy; 2026. All rights reserved.
        </div>
      </div>
    </div>
  );
}
