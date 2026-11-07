"use client";

import { useState } from "react";
import { Construction, ArrowLeft, Bell, CheckCircle2, Sparkles, Layers } from "lucide-react";

export function UnderConstructionView({
  featureName = "Tính năng này",
  phase = "Beta Testing",
  progressPercent = 75,
  backHref = "/",
  docsHref = "https://vntez-docs.vercel.app",
}: {
  featureName?: string;
  phase?: string;
  progressPercent?: number;
  backHref?: string;
  docsHref?: string;
}) {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6">
      <div className="w-full max-w-xl text-center rounded-3xl border border-amber-500/20 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-amber-500/20 dark:bg-black/60">
        {/* Animated Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 ring-8 ring-amber-500/5 dark:bg-amber-500/20 dark:text-amber-400">
          <Construction className="h-8 w-8 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-3">
          <Sparkles className="h-3 w-3" />
          <span>Đang hoàn thiện • Giai đoạn: {phase}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {featureName} đang được phát triển
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Đội ngũ kỹ sư VNTEZ đang hoàn thiện các pipeline kiến trúc cuối cùng trước khi đưa vào sản xuất thương mại.
        </p>

        {/* Development Progress Bar */}
        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Layers className="h-3.5 w-3.5 text-primary" /> Tiến độ hoàn thiện
            </span>
            <span className="font-mono font-bold text-primary">{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-primary to-emerald-500 transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Notify Me Form */}
        <div className="mt-6">
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Đã lưu! Hệ thống sẽ gửi email ngay khi tính năng ra mắt.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email nhận thông báo ra mắt..."
                required
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:opacity-90 transition-opacity"
              >
                <Bell className="h-3.5 w-3.5" /> Thông báo tôi
              </button>
            </form>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <a
            href={backHref}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Quay về trang trước
          </a>
          <span className="text-slate-300 dark:text-white/20">•</span>
          <a
            href={docsHref}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Xem tài liệu kỹ thuật
          </a>
        </div>
      </div>
    </div>
  );
}
