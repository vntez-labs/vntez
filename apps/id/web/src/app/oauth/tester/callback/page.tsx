"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Key,
  User,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

function CallbackContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenResult, setTokenResult] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Lấy code_verifier đã lưu trong sessionStorage lúc tạo request (nếu có)
  const [codeVerifier, setCodeVerifier] = useState<string>("");

  useEffect(() => {
    const savedVerifier =
      sessionStorage.getItem("vntez_oauth_tester_verifier") || "";
    setCodeVerifier(savedVerifier);
  }, []);

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExchangeToken = async () => {
    if (!code) return;
    setLoading(true);
    setTokenError(null);

    const clientId =
      sessionStorage.getItem("vntez_oauth_tester_client_id") ||
      "vntez-demo-client";
    const redirectUri = window.location.origin + "/oauth/tester/callback";

    try {
      const res = await fetch("/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          code,
          client_id: clientId,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setTokenError(
          data.error_description || data.error || "Lỗi khi đổi token",
        );
        setLoading(false);
        return;
      }

      setTokenResult(data);

      // Nếu có access_token, tự động gọi tiếp /oauth/userinfo
      if (data.access_token) {
        const userRes = await fetch("/oauth/userinfo", {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });
        const userData = await userRes.json();
        setUserInfo(userData);
      }
    } catch (err: any) {
      setTokenError(err.message || "Lỗi mạng hoặc không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              OAuth 2.0 Callback Tester
            </h1>
            <p className="text-xs text-muted-foreground">
              Nhận phản hồi từ VNTEZ ID Authorization Server
            </p>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-xs text-destructive space-y-1">
            <div className="font-semibold text-sm">
              Ủy quyền thất bại: {error}
            </div>
            <p>{errorDescription}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Step 1: Received Code */}
            <div className="rounded-xl border border-border bg-secondary/40 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Mã Authorization Code nhận được:
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copied ? "Đã chép" : "Sao chép code"}
                </button>
              </div>
              <div className="font-mono text-xs break-all bg-background/80 p-2.5 rounded-lg border border-border/60 text-foreground">
                {code || "Không có code trong query params"}
              </div>
              {state && (
                <div className="text-[11px] text-muted-foreground">
                  State:{" "}
                  <span className="font-mono text-foreground">{state}</span>
                </div>
              )}
            </div>

            {/* Code Verifier Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                PKCE Code Verifier (nếu có):
              </label>
              <input
                type="text"
                value={codeVerifier}
                onChange={(e) => setCodeVerifier(e.target.value)}
                placeholder="Nhập code_verifier..."
                className="w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Step 2: Exchange Token Button */}
            {!tokenResult && (
              <button
                type="button"
                onClick={handleExchangeToken}
                disabled={loading || !code}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 px-4 font-medium text-primary-foreground text-sm shadow transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <>
                    <Key className="h-4 w-4" />
                    Đổi Authorization Code lấy Access Token (/oauth/token)
                  </>
                )}
              </button>
            )}

            {tokenError && (
              <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
                {tokenError}
              </div>
            )}

            {/* Step 3: Token Result */}
            {tokenResult && (
              <div className="rounded-xl border border-border bg-secondary/40 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4" />
                  Đã nhận Access Token thành công
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] text-muted-foreground">
                    Access Token (JWT):
                  </div>
                  <div className="font-mono text-[11px] break-all bg-background/80 p-2.5 rounded-lg border border-border/60 max-h-24 overflow-y-auto">
                    {tokenResult.access_token}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-background/50 p-2 border border-border/40">
                    <span className="text-muted-foreground block text-[10px]">
                      Loại Token
                    </span>
                    <span className="font-semibold">
                      {tokenResult.token_type}
                    </span>
                  </div>
                  <div className="rounded-lg bg-background/50 p-2 border border-border/40">
                    <span className="text-muted-foreground block text-[10px]">
                      Thời hạn (giây)
                    </span>
                    <span className="font-semibold">
                      {tokenResult.expires_in}s
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: User Info Result */}
            {userInfo && (
              <div className="rounded-xl border border-border bg-secondary/40 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                  <User className="h-4 w-4" />
                  Thông tin User từ /oauth/userinfo
                </div>
                <pre className="font-mono text-xs bg-background/80 p-3 rounded-lg border border-border/60 overflow-x-auto text-foreground">
                  {JSON.stringify(userInfo, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
          <Link
            href="/developers"
            className="text-primary hover:underline font-medium"
          >
            ← Quay lại Developer Hub & Playground
          </Link>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground"
          >
            Trang chủ VNTEZ ID
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
