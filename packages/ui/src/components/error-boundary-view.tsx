"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from "lucide-react";

export function ErrorBoundaryView({
  error,
  reset,
  appName = "VNTEZ Ecosystem",
  homeHref = "/",
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  appName?: string;
  homeHref?: string;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("[VNTEZ ErrorBoundary Caught]:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl border border-rose-500/20 bg-white/80 p-8 text-center shadow-2xl backdrop-blur-xl dark:border-rose-500/20 dark:bg-black/60">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 ring-8 ring-rose-500/5 dark:bg-rose-500/20 dark:text-rose-400">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-3">
          <span>Hệ thống gặp sự cố</span>
          {error.digest && <span className="font-mono text-[10px]">• ID: {error.digest.slice(0, 8)}</span>}
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Đã xảy ra lỗi không mong muốn
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Đội ngũ kỹ thuật {appName} đã nhận được cảnh báo tự động. Bạn có thể thử tải lại tác vụ hoặc quay về trang chủ.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {reset && (
            <button
              onClick={() => reset()}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              Thử lại ngay
            </button>
          )}
          <a
            href={homeHref}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
          >
            <Home className="h-4 w-4" />
            Về trang chủ
          </a>
        </div>

        {error.message && (
          <div className="mt-6 border-t border-slate-200/80 pt-4 text-left dark:border-white/10">
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="flex w-full items-center justify-between text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
            >
              <span>Thông tin kỹ thuật (dành cho lập trình viên)</span>
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showDetails && (
              <div className="mt-2 max-h-40 overflow-auto rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-rose-300">
                <p className="font-semibold text-rose-400">{error.name}: {error.message}</p>
                {error.stack && (
                  <pre className="mt-1 text-[10px] text-slate-400 whitespace-pre-wrap">{error.stack}</pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
