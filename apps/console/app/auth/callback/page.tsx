"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, AlertTriangle } from "lucide-react";
import { getVntezClient } from "@workspace/auth/sdk";
import { COOKIE_NAMES } from "@workspace/auth/cookies";

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);

  const callback = useRef<Promise<void> | null>(null);
  useEffect(() => {
    async function storeIamSession() {
      const callbackUrl = `${window.location.origin}/auth/callback`;
      const { accessToken, user } = await getVntezClient().auth.handleCallback(callbackUrl);
      const maxAge = 60 * 60 * 24 * 30;
      document.cookie = `${COOKIE_NAMES.ACCESS_TOKEN}=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `${COOKIE_NAMES.USER_SESSION}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }

    let active = true;
    callback.current ??= storeIamSession();
    callback.current.then(() => {
      if (active) window.location.replace("/");
    }).catch((err: unknown) => {
      if (active) setError(err instanceof Error ? err.message : "Xác thực danh tính thất bại");
    });

    return () => { active = false; };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white selection:bg-[#fb291a]/15">
        <div className="max-w-md w-full p-8 rounded-2xl border border-red-200 bg-red-50 text-center space-y-5 shadow-xs">
          <div className="size-12 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
            <AlertTriangle className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-red-900 font-display">
              Xác thực không thành công
            </h2>
            <p className="text-xs text-red-700 leading-relaxed font-sans">{error}</p>
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold text-white bg-[#fb291a] hover:bg-[#e02012] rounded-xl transition-colors shadow-2xs"
            >
              Quay lại Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-slate-800">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 text-[#fb291a] animate-spin" />
        <p className="text-sm font-medium font-sans text-slate-600">
          Đang hoàn tất đăng nhập qua VNTEZ IAM...
        </p>
      </div>
    </div>
  );
}
