"use client";

import React from "react";
import { Clock } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import type { DashboardStats } from "./dashboard-types";

interface RecentCodesTableProps {
  stats: DashboardStats | null;
}

export function RecentCodesTable({ stats }: RecentCodesTableProps) {
  const events = stats?.recentEvents || [];

  return (
    <div className="bg-card shadow-xs rounded-2xl overflow-hidden w-full max-w-full border border-border">
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">
              Nhật Ký Xác Thực Gần Đây
            </h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-mono font-medium text-muted-foreground">
              {events.length}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-full overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[640px]">
          <thead className="bg-muted/60 text-muted-foreground font-mono uppercase tracking-wider border-b border-border">
            <tr>
              <th className="py-3 px-5 font-medium whitespace-nowrap">Mã Code</th>
              <th className="py-3 px-5 font-medium whitespace-nowrap">Client</th>
              <th className="py-3 px-5 font-medium whitespace-nowrap">Method</th>
              <th className="py-3 px-5 font-medium whitespace-nowrap">Redirect URI</th>
              <th className="py-3 px-5 font-medium whitespace-nowrap">Thời gian</th>
              <th className="py-3 px-5 font-medium whitespace-nowrap text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono text-xs">
            {!stats ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-5"><Skeleton className="h-4 w-24 rounded" /></td>
                  <td className="py-3 px-5"><Skeleton className="h-4 w-28 rounded" /></td>
                  <td className="py-3 px-5"><Skeleton className="h-4 w-12 rounded" /></td>
                  <td className="py-3 px-5"><Skeleton className="h-4 w-36 rounded" /></td>
                  <td className="py-3 px-5"><Skeleton className="h-4 w-20 rounded" /></td>
                  <td className="py-3 px-5 text-right"><Skeleton className="h-4 w-16 rounded-full ml-auto" /></td>
                </tr>
              ))
            ) : events.length > 0 ? (
              events.map((evt, idx) => (
                <tr
                  key={evt.codePrefix || idx}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-5 font-semibold text-foreground">
                    {evt.codePrefix}••••••••
                  </td>
                  <td className="py-3 px-5 text-foreground font-sans">
                    {evt.clientId}
                  </td>
                  <td className="py-3 px-5">
                    <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">
                      {evt.challengeMethod || "S256"}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-muted-foreground truncate max-w-[200px]" title={evt.redirectUri}>
                    {evt.redirectUri}
                  </td>
                  <td className="py-3 px-5 text-muted-foreground whitespace-nowrap font-sans">
                    {new Date(evt.createdAt).toLocaleDateString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-5 text-right whitespace-nowrap font-sans">
                    {evt.used ? (
                      <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                        Đã sử dụng
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Khả dụng
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground font-sans">
                  Chưa có sự kiện cấp mã xác thực nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
