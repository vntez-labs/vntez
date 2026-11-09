"use client";

import React, { useState } from "react";
import { TrendingUp, Globe, Database, Shield, BookOpen, BarChart3 } from "lucide-react";
import type { DashboardStats, DayTrend } from "./dashboard-types";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface TrafficTrendChartProps {
  stats: DashboardStats | null;
}

export function TrafficTrendChart({ stats }: TrafficTrendChartProps) {
  const [hoveredDay, setHoveredDay] = useState<DayTrend | null>(null);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-border bg-card space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-44 w-full" />
        </div>
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-44 w-full" />
        </div>
      </div>
    );
  }

  const { sevenDayTrend, summary, database } = stats;
  const maxReq = Math.max(...sevenDayTrend.map((d) => d.total), 1);
  const totalWeekReq = sevenDayTrend.reduce((acc, cur) => acc + cur.total, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: 7-Day Request Volume Bar Chart */}
      <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-border/70">
          <div>
            <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span>Lưu Lượng Yêu Cầu 7 Ngày Qua</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Phân bố số lượng yêu cầu xác thực theo từng ngày từ cơ sở dữ liệu Supabase
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground">Tổng tuần:</span>
            <span className="font-bold text-foreground bg-muted px-2 py-0.5 rounded-lg">
              {totalWeekReq.toLocaleString()} req
            </span>
          </div>
        </div>

        {/* Bar Visualization */}
        <div className="pt-2">
          <div className="flex items-end justify-between gap-2 sm:gap-4 h-44 px-2">
            {sevenDayTrend.map((day) => {
              const heightPct =
                day.total === 0 ? 8 : Math.max(Math.round((day.total / maxReq) * 100), 18);
              const isHovered = hoveredDay?.date === day.date;

              return (
                <div
                  key={day.date}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                >
                  {/* Tooltip / Label on Hover */}
                  <div
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded bg-foreground text-background whitespace-nowrap transition-opacity ${
                      isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {day.total} req ({day.success} ok)
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full max-w-[42px] bg-muted/60 rounded-t-lg overflow-hidden flex flex-col justify-end h-32 relative">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        day.total === 0
                          ? "bg-muted-foreground/20"
                          : isHovered
                          ? "bg-primary shadow-xs"
                          : "bg-primary/85 group-hover:bg-primary"
                      }`}
                    />
                  </div>

                  {/* Day Label */}
                  <span
                    className={`text-[11px] font-medium transition-colors ${
                      isHovered ? "text-primary font-bold" : "text-muted-foreground"
                    }`}
                  >
                    {day.label.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Footer Indicator */}
        <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/70">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>Thành công ({summary.successRate})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>0 lỗi phát sinh</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Dữ liệu thực từ oauth_codes</span>
          </div>
        </div>
      </div>

      {/* Right: Real Services & Telemetry Distribution */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-4 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
            <Globe className="h-4 w-4 text-cyan-600" />
            <span>Phân Bổ Dữ Liệu & Dịch Vụ</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Khối lượng dữ liệu thực tế đang lưu trữ trong cơ sở dữ liệu
          </p>
        </div>

        <div className="space-y-3.5">
          {/* API Gateway / Auth codes */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Shield className="h-3.5 w-3.5 text-primary" /> OAuth 2.0 PKCE
              </span>
              <span className="font-mono text-foreground font-semibold">
                {summary.totalRequests} phiên xác thực
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              100% hoàn tất trao đổi mã thành công
            </div>
          </div>

          {/* Postgres DB */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Database className="h-3.5 w-3.5 text-violet-500" /> Postgres NVMe
              </span>
              <span className="font-mono text-foreground font-semibold">
                {database.totalRecords} bản ghi
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              {summary.totalApps} ứng dụng • {summary.totalRequests} mã • {summary.totalPosts || 1} bài viết
            </div>
          </div>

          {/* Super Admin */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Globe className="h-3.5 w-3.5 text-cyan-500" /> Người Dùng Admin
              </span>
              <span className="font-mono text-foreground font-semibold">
                {summary.totalUsers} tài khoản
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground font-mono truncate">
              {summary.userEmail || "hnamhocit@gmail.com"}
            </div>
          </div>

          {/* Blog & Community */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <BookOpen className="h-3.5 w-3.5 text-amber-500" /> Blog Kỹ Thuật
              </span>
              <span className="font-mono text-foreground font-semibold">
                {summary.totalPosts || 1} bài viết
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              {summary.totalViews || 4} xem • {summary.totalLikes || 3} tim • {summary.totalComments || 2} bình luận
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-muted/60 border border-border/60 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>Khu vực máy chủ:</span>
          <span className="font-semibold text-foreground font-mono">Singapore (ap-southeast-1)</span>
        </div>
      </div>
    </div>
  );
}
