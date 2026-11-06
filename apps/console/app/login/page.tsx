import type { Metadata } from "next";
import { KeyRound, AlertTriangle, ArrowRight, Terminal } from "lucide-react";
import { IsometricConsoleArt } from "@/components/isometric-console-art";

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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 selection:bg-[#fb291a]/15 selection:text-[#fb291a]">
      {/* Immediate script to enforce light mode on this screen */}
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.classList.remove('dark');",
        }}
      />

      {/* ========================================================================= */}
      {/* 1. LEFT PANEL: BaaS Server & Pipeline Visual (Narrower, Vector, Sharp)    */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-[38%] xl:w-[35%] relative min-h-screen bg-[#090d16] flex-col justify-between p-8 xl:p-12 text-white border-r border-slate-900 overflow-hidden">
        {/* Subtle Ambient Glow behind Graphic */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#fb291a]/10 blur-3xl"
          aria-hidden="true"
        />

        {/* Top Brand Pill */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-[#fb291a] flex items-center justify-center text-white">
              <Terminal className="size-4 text-white" strokeWidth={2.2} />
            </div>
            <span className="font-display text-sm font-bold tracking-tight text-white">
              VNTEZ <span className="text-[#fb291a]">CONSOLE</span>
            </span>
          </div>

          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
            BaaS Engine
          </span>
        </div>

        {/* Center: Vector Isometric BaaS Architecture & Pipeline Graphic */}
        <div className="relative z-10 my-auto flex items-center justify-center py-6">
          <IsometricConsoleArt className="w-full max-w-[360px] xl:max-w-[400px] drop-shadow-2xl" />
        </div>

        {/* Bottom Status Indicator */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Pipelines Active</span>
          </div>
          <span>cluster: HAN-01 / SGN-02</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RIGHT PANEL: Spacious Clean Login Form (Light Mode, Flat, No Border)   */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[62%] xl:w-[65%] flex flex-col justify-between p-8 sm:p-14 lg:p-16 xl:p-24 min-h-screen bg-white">
        {/* Top Mobile Brand (visible only when left panel is hidden) */}
        <div className="lg:hidden flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-[#fb291a] flex items-center justify-center text-white">
            <Terminal className="size-4 text-white" strokeWidth={2.2} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-slate-900">
            VNTEZ <span className="text-[#fb291a]">CONSOLE</span>
          </span>
        </div>

        {/* Desktop spacer when top brand is hidden */}
        <div className="hidden lg:block" />

        {/* Center: Login Form */}
        <div className="my-auto py-10 max-w-sm w-full mx-auto space-y-7">
          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Đăng nhập
            </h1>
            <p className="text-sm text-slate-500 font-sans">
              Chào mừng bạn đến với bảng điều khiển quản trị BaaS VNTEZ.
            </p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="size-4 shrink-0 mt-0.5 text-red-600" />
                <div>
                  <span className="font-semibold text-red-800">Đăng nhập không thành công</span>
                  <p className="mt-0.5 text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Primary SSO Action Button with proper padding-x */}
          <div>
            <a
              href={loginActionUrl}
              className="w-full h-12 rounded-xl bg-[#fb291a] hover:bg-[#e02012] text-white font-semibold text-sm flex items-center justify-between px-6 transition-colors cursor-pointer shadow-xs group"
            >
              <div className="flex items-center gap-3">
                <KeyRound className="size-4.5 shrink-0" />
                <span>Đăng nhập bằng VNTEZ ID</span>
              </div>
              <ArrowRight className="size-4.5 shrink-0 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-400 font-mono text-center lg:text-left">
          VNTEZ Ecosystem &copy; 2026
        </div>
      </div>
    </div>
  );
}
