"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  ChevronDown,
  ChevronUp,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";

export interface ErrorBoundaryViewProps {
  error: Error & { digest?: string };
  reset?: () => void;
  appName?: string;
  homeHref?: string;
  docsHref?: string;
  consoleHref?: string;
}

export function ErrorBoundaryView({
  error,
  reset,
  appName = "VNTEZ Console",
  homeHref = "/",
  docsHref = "https://vntez-docs.vercel.app",
  consoleHref = "https://console.vntez.cloud",
}: ErrorBoundaryViewProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    console.error(`[${appName} ErrorBoundary Caught]:`, error);
  }, [appName, error]);

  const handleCopyError = () => {
    const text = `${error.name}: ${error.message}\nDigest: ${error.digest || "N/A"}\n\nStack:\n${error.stack || ""}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl text-center space-y-6">
        {/* Error Emblem */}
        <div className="relative mx-auto inline-block">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20 shadow-xs dark:bg-rose-500/20 dark:text-rose-400">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <div className="absolute -inset-4 -z-10 rounded-full bg-rose-500/10 blur-2xl" />
        </div>

        {/* Status Pill */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 dark:bg-rose-950/40 px-3.5 py-1 text-xs font-mono font-medium text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40">
            <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Hệ thống gặp sự cố runtime</span>
            {error.digest && (
              <span className="text-muted-foreground/60">• ID: {error.digest.slice(0, 8)}</span>
            )}
          </div>
        </div>

        {/* Heading & Human Description */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
            Đã xảy ra lỗi không mong muốn
          </h1>
          <p className="mx-auto max-w-lg text-sm text-muted-foreground leading-relaxed">
            Tiến trình render của <span className="font-semibold text-foreground">{appName}</span> gặp ngoại lệ không xác định. Bạn có thể làm mới tác vụ hoặc quay về bảng điều khiển.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {reset && (
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-primary/90 active:scale-95 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Thử lại ngay</span>
            </button>
          )}

          <a
            href={homeHref}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#0c121e] px-6 py-2.5 text-xs sm:text-sm font-semibold text-foreground shadow-2xs transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <Home className="h-4 w-4 text-muted-foreground" />
            <span>Về trang chủ</span>
          </a>
        </div>

        {/* Technical Diagnostics Terminal Accordion */}
        {error.message && (
          <div className="pt-6 text-left">
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#0c121e] shadow-xs overflow-hidden">
              <div className="flex items-center justify-between p-3.5 bg-zinc-50/70 dark:bg-zinc-900/40 border-b border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowDetails((v) => !v)}
                  className="flex items-center gap-2 text-xs font-mono font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <Terminal className="h-3.5 w-3.5 text-rose-500" />
                  <span>Thông tin kỹ thuật (dành cho lập trình viên)</span>
                  {showDetails ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyError}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground p-1 px-2 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Sao chép lỗi"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-[11px] text-emerald-500 font-medium">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="text-[11px]">Copy trace</span>
                    </>
                  )}
                </button>
              </div>

              {showDetails && (
                <div className="p-4 bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto max-h-72 space-y-2">
                  <div className="text-rose-400 font-semibold">
                    {error.name}: {error.message}
                  </div>
                  {error.stack && (
                    <pre className="text-[11px] text-zinc-400 whitespace-pre-wrap leading-relaxed">
                      {error.stack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Help Shortcuts */}
        <div className="pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <p className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground mb-3 text-center">
            Lối tắt hỗ trợ
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
            <a
              href={docsHref}
              className="flex items-center gap-3 rounded-xl border border-zinc-200/70 bg-white dark:bg-[#0c121e] p-3 shadow-2xs hover:border-primary/40 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">Tài liệu API</p>
                <p className="text-[10px] text-muted-foreground truncate">Hướng dẫn & SDK</p>
              </div>
            </a>

            <a
              href={consoleHref}
              className="flex items-center gap-3 rounded-xl border border-zinc-200/70 bg-white dark:bg-[#0c121e] p-3 shadow-2xs hover:border-primary/40 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">Console</p>
                <p className="text-[10px] text-muted-foreground truncate">Quản trị hệ thống</p>
              </div>
            </a>

            <a
              href="https://iam.vntez.cloud"
              className="flex items-center gap-3 rounded-xl border border-zinc-200/70 bg-white dark:bg-[#0c121e] p-3 shadow-2xs hover:border-primary/40 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">VNTEZ IAM</p>
                <p className="text-[10px] text-muted-foreground truncate">Định danh & SSO</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
