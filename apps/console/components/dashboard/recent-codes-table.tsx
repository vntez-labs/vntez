"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import type { DashboardStats } from "./dashboard-types";

interface RecentCodesTableProps {
  stats: DashboardStats | null;
}

export function RecentCodesTable({ stats }: RecentCodesTableProps) {
  return (
    <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden w-full max-w-full">
      <div className="p-4 sm:p-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Nhật ký Mã Xác thực PKCE (public.oauth_codes)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Các sự kiện cấp phát mã xác thực SSO qua luồng PKCE S256 lưu trực tiếp trong Supabase
            </p>
          </div>

          {stats && (stats.evaluation?.totalCodes ?? stats.recentEvents?.length ?? 0) > 0 && (
            <Link
              href="/tables?table=oauth_codes"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
            >
              <span>
                Xem toàn bộ {stats.evaluation?.totalCodes ?? stats.recentEvents?.length} bản ghi trong Table Explorer
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      <div className="w-full max-w-full overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[700px]">
          <thead className="bg-[#faf8f4] dark:bg-muted/40 text-[#6e6a61] dark:text-slate-300 font-mono text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3 px-5 font-semibold whitespace-nowrap">Mã Code Hash</th>
              <th className="py-3 px-5 font-semibold whitespace-nowrap">Client</th>
              <th className="py-3 px-5 font-semibold whitespace-nowrap">PKCE Method</th>
              <th className="py-3 px-5 font-semibold whitespace-nowrap">Redirect URI</th>
              <th className="py-3 px-5 font-semibold whitespace-nowrap">Thời gian tạo</th>
              <th className="py-3 px-5 font-semibold whitespace-nowrap">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f2eb] dark:divide-border/30 font-mono text-sm">
            {!stats ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs font-sans">
                  Đang tải dữ liệu thực tế từ Supabase...
                </td>
              </tr>
            ) : stats.recentEvents && stats.recentEvents.length > 0 ? (
              stats.recentEvents.map((evt, idx) => (
                <tr key={idx} className="hover:bg-[#fbf9f5] dark:hover:bg-muted/20 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-foreground">
                    {evt.codePrefix}
                  </td>
                  <td className="py-3.5 px-5 text-muted-foreground text-xs">
                    {evt.clientId}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="border-0 bg-[#f4f1ea] dark:bg-muted/50 text-[#6b675e] text-xs font-mono px-2 py-0.5 rounded-md">
                      {evt.challengeMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-muted-foreground truncate max-w-xs text-xs font-sans">
                    {evt.redirectUri}
                  </td>
                  <td className="py-3.5 px-5 text-muted-foreground text-xs whitespace-nowrap font-sans">
                    {new Date(evt.createdAt).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    {evt.used ? (
                      <span className="border-0 bg-emerald-100/70 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-medium px-2.5 py-0.5 rounded-full font-sans">
                        Đã đổi Token
                      </span>
                    ) : (
                      <span className="border-0 bg-amber-100/70 text-amber-800 dark:bg-amber-500/10 text-xs font-medium px-2.5 py-0.5 rounded-full font-sans">
                        Chưa dùng
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs font-sans">
                  Chưa có mã xác thực nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
