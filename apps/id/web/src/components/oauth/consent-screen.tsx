"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  UserCircle,
  AlertTriangle,
  ExternalLink,
  Lock,
} from "lucide-react";
import { authorizeAppAction } from "@/lib/oauth/actions";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

interface ConsentScreenProps {
  client: {
    client_id: string;
    name: string;
    logo_url?: string | null;
    description?: string | null;
  };
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
  };
  params: {
    redirect_uri: string;
    state?: string;
    code_challenge?: string;
    code_challenge_method?: string;
    scope?: string;
  };
}

export function ConsentScreen({ client, user, params }: ConsentScreenProps) {
  const [loading, setLoading] = useState(false);
  const [denying, setDenying] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await authorizeAppAction({
        clientId: client.client_id,
        redirectUri: params.redirect_uri,
        state: params.state,
        codeChallenge: params.code_challenge,
        codeChallengeMethod: params.code_challenge_method,
      });

      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
      }
    } catch (err) {
      console.error("Lỗi khi ủy quyền:", err);
      setLoading(false);
    }
  };

  const handleDeny = () => {
    setDenying(true);
    const url = new URL(params.redirect_uri);
    url.searchParams.set("error", "access_denied");
    url.searchParams.set(
      "error_description",
      "Người dùng đã từ chối yêu cầu truy cập",
    );
    if (params.state) {
      url.searchParams.set("state", params.state);
    }
    window.location.href = url.toString();
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground overflow-hidden">
      {/* Background glowing effects */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-sky-500/10 blur-[120px]" />

      <Card className="relative z-10 w-full max-w-[460px] border-border bg-card/90 shadow-2xl backdrop-blur-xl">
        <CardHeader className="text-center pb-4">
          {/* Header / Brand Connection */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-xs font-bold text-lg">
              {client.logo_url ? (
                <img
                  src={client.logo_url}
                  alt={client.name}
                  className="h-10 w-10 rounded-lg object-contain"
                />
              ) : (
                client.name.slice(0, 2).toUpperCase()
              )}
            </div>

            <div className="flex items-center text-muted-foreground">
              <div className="h-0.5 w-6 bg-border" />
              <ArrowRight className="h-4 w-4 text-primary mx-1" />
              <div className="h-0.5 w-6 bg-border" />
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs font-mono font-bold text-lg">
              V
            </div>
          </div>

          <CardTitle className="text-xl font-bold tracking-tight">
            Ủy quyền cho <span className="text-primary">{client.name}</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm mt-1">
            Ứng dụng yêu cầu quyền truy cập vào danh tính tài khoản VNTEZ ID của bạn.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {/* User Preview Box */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/30">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover border border-border"
              />
            ) : (
              <UserCircle className="h-9 w-9 text-muted-foreground" />
            )}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-foreground truncate">
                {user.name}
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {user.email}
              </div>
            </div>
            <Badge variant="outline" size="sm" className="gap-1 text-[10px]">
              <Lock className="h-2.5 w-2.5 text-emerald-500" />
              Đã xác thực
            </Badge>
          </div>

          {/* Requested Scopes */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quyền được yêu cầu
            </span>

            <div className="rounded-xl border border-border bg-secondary/15 p-3.5 space-y-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    Hồ sơ công khai & Địa chỉ Email
                  </div>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    Cho phép ứng dụng đọc mã định danh, họ tên, email và ảnh đại diện của bạn.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-border/60 pt-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    Xác thực một chạm (OAuth 2.0 PKCE)
                  </div>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    Tự động duy trì phiên đăng nhập an toàn qua hạ tầng Cloudflare Edge toàn cầu.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions with Shadcn Button */}
          <div className="space-y-2 pt-2">
            <Button
              type="button"
              onClick={handleApprove}
              disabled={loading || denying}
              className="w-full h-10 gap-2 font-semibold"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>Cho phép và Tiếp tục</>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleDeny}
              disabled={loading || denying}
              className="w-full h-10 font-semibold"
            >
              {denying ? "Đang hủy..." : "Hủy bỏ"}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="pt-0 flex flex-col text-center text-[11px] text-muted-foreground">
          <div className="flex items-center justify-center gap-1">
            <span>Redirect về:</span>
            <span className="font-mono text-foreground/80 truncate max-w-[240px]">
              {params.redirect_uri}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
