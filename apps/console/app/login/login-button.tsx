"use client";

import { useState } from "react";
import { KeyRound, ArrowRight, Loader2 } from "lucide-react";
import { getVntezClient } from "@workspace/auth/sdk";

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const vntez = getVntezClient();
      await vntez.auth.signIn({
        redirectUri: `${window.location.origin}/auth/callback`,
      });
    } catch (err) {
      console.error("VNTEZ IAM sign in failed:", err);
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isLoading}
      className="w-full h-12 rounded-xl bg-[#fb291a] hover:bg-[#e02012] disabled:opacity-75 text-white font-semibold text-sm flex items-center justify-between px-6 transition-colors cursor-pointer shadow-xs group"
    >
      <div className="flex items-center gap-3">
        {isLoading ? (
          <Loader2 className="size-4.5 shrink-0 animate-spin" />
        ) : (
          <KeyRound className="size-4.5 shrink-0" />
        )}
        <span>{isLoading ? "Đang chuyển hướng tới VNTEZ IAM..." : "Đăng nhập bằng VNTEZ IAM"}</span>
      </div>
      <ArrowRight className="size-4.5 shrink-0 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
