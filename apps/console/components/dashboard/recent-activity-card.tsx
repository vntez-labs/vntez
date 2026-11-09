"use client";

import React, { useState } from "react";
import { ShieldCheck, Clock, Key, ArrowRight, CheckCircle2 } from "lucide-react";
import type { DashboardStats } from "./dashboard-types";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface RecentActivityCardProps {
  stats: DashboardStats | null;
}

export function RecentActivityCard({ stats }: RecentActivityCardProps) {
  const [activeTab, setActiveTab] = useState<"friendly" | "raw">("friendly");

  if (!stats) {
    return (
      <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const events = stats.recentEvents || [];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-2xs overflow-hidden">
      {/* Header with Tab Switcher */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Nhật Ký Xác Thực & Hoạt Động Hệ Thống
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ghi nhận các phiên làm việc và yêu cầu chứng thực bảo mật từ các ứng dụng
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/80 border border-border/60 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("friendly")}
            className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-all ${
              activeTab === "friendly"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sự Kiện Vận Hành
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("raw")}
            className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-all ${
              activeTab === "raw"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mã OAuth (Raw)
          </button>
        </div>
      </div>

      {/* Tab 1: Friendly Operational Activity Stream */}
      {activeTab === "friendly" ? (
        <div className="divide-y divide-border">
          {events.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Chưa có phiên xác thực nào được ghi nhận.
            </div>
          ) : (
            events.map((evt, idx) => (
              <div
                key={evt.codePrefix || idx}
                className="p-4 sm:px-6 hover:bg-muted/40 transition-colors flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="font-semibold text-foreground truncate">
                      Xác thực SSO PKCE thành công cho ứng dụng{" "}
                      <span className="font-mono text-primary font-bold">{evt.clientId}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2 truncate">
                      <span>Callback: <span className="font-mono">{evt.redirectUri}</span></span>
                      <span>•</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-muted">
                        {evt.challengeMethod}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-right">
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {new Date(evt.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    {new Date(evt.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Đã hoàn tất
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Tab 2: Raw OAuth Codes Technical Table */
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-muted/60 text-muted-foreground font-mono uppercase tracking-wider border-b border-border">
              <tr>
                <th className="py-2.5 px-5 font-medium">Mã Code</th>
                <th className="py-2.5 px-5 font-medium">Client</th>
                <th className="py-2.5 px-5 font-medium">Method</th>
                <th className="py-2.5 px-5 font-medium">Redirect URI</th>
                <th className="py-2.5 px-5 font-medium">Thời gian</th>
                <th className="py-2.5 px-5 font-medium text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-xs">
              {events.map((evt, idx) => (
                <tr key={evt.codePrefix || idx} className="hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-5 font-semibold text-foreground">{evt.codePrefix}••••••••</td>
                  <td className="py-3 px-5 text-foreground font-sans">{evt.clientId}</td>
                  <td className="py-3 px-5">
                    <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">
                      {evt.challengeMethod || "S256"}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-muted-foreground truncate max-w-[200px]" title={evt.redirectUri}>
                    {evt.redirectUri}
                  </td>
                  <td className="py-3 px-5 text-muted-foreground font-sans">
                    {new Date(evt.createdAt).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-5 text-right font-sans">
                    <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                      {evt.used ? "Đã sử dụng" : "Khả dụng"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
