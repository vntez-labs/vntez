"use client";

import { ArrowLeft, Home, BookOpen, LayoutDashboard, ShieldCheck } from "lucide-react";

export function NotFoundView({
  appName = "VNTEZ Ecosystem",
  homeHref = "/",
  docsHref = "/docs",
  consoleHref = "https://console.vntez.cloud",
  idHref = "https://vntez-iam.vercel.app",
}: {
  appName?: string;
  homeHref?: string;
  docsHref?: string;
  consoleHref?: string;
  idHref?: string;
}) {
  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center p-6">
      <div className="w-full max-w-2xl text-center">
        {/* Glowing 404 Badge */}
        <div className="relative mx-auto mb-4 inline-block">
          <span className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-rose-500 to-indigo-600 select-none">
            404
          </span>
          <div className="absolute -inset-4 -z-10 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Không tìm thấy trang yêu cầu
        </h1>
        <p className="mx-auto mt-2.5 max-w-md text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Đường dẫn bạn truy cập có thể đã thay đổi, bị xóa hoặc tạm thời không khả dụng trong hệ sinh thái {appName}.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = homeHref;
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại trang trước
          </button>
          <a
            href={homeHref}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
          >
            <Home className="h-4 w-4" />
            Trang chủ VNTEZ
          </a>
        </div>

        {/* Quick Links Suggestions */}
        <div className="mt-10 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Lối tắt gợi ý
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
            <a
              href={docsHref}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs hover:border-primary/50 transition-colors dark:border-white/10 dark:bg-black/30"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-white">Tài liệu API</p>
                <p className="text-[10px] text-slate-400 truncate">Hướng dẫn tích hợp</p>
              </div>
            </a>

            <a
              href={consoleHref}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs hover:border-primary/50 transition-colors dark:border-white/10 dark:bg-black/30"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-white">Console</p>
                <p className="text-[10px] text-slate-400 truncate">Quản trị hạ tầng</p>
              </div>
            </a>

            <a
              href={idHref}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs hover:border-primary/50 transition-colors dark:border-white/10 dark:bg-black/30"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-white">VNTEZ IAM</p>
                <p className="text-[10px] text-slate-400 truncate">Định danh & Phân quyền</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
