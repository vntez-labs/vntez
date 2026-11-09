"use client";

import React from "react";
import { Activity, Layers, Users, Server, ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { DashboardStats } from "./dashboard-types";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface DashboardKpisProps {
  stats: DashboardStats | null;
}

export function DashboardKpis({ stats }: DashboardKpisProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl border border-border bg-card space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-36" />
          </div>
        ))}
      </div>
    );
  }

  const { summary, infrastructure } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Requests KPI */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-2xs hover:shadow-xs transition-all space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Tổng Yêu Cầu (Requests)</span>
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Activity className="h-4 w-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-foreground tracking-tight">
            {summary.totalRequests.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
            <span>{summary.requestsThisWeek ?? summary.totalRequests} req trong 7 ngày</span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-muted-foreground font-normal">{summary.latencyMs}ms</span>
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/60 flex items-center justify-between">
          <span>Tỷ lệ hoàn tất</span>
          <span className="font-semibold text-foreground">{summary.successRate} thành công</span>
        </div>
      </div>

      {/* 2. Apps KPI */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-2xs hover:shadow-xs transition-all space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Ứng Dụng Hoạt Động</span>
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Layers className="h-4 w-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-foreground tracking-tight">
            {summary.totalApps}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>{summary.activeApps}/{summary.totalApps} Đang trực tuyến</span>
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/60 flex items-center justify-between">
          <span>Trạng thái dịch vụ</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% Khả dụng</span>
        </div>
      </div>

      {/* 3. Users / Customers KPI */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-2xs hover:shadow-xs transition-all space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Người Dùng & Khách Hàng</span>
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-foreground tracking-tight">
            {summary.totalUsers}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mt-1 truncate">
            <span className="truncate">{summary.userEmail || "Quản trị viên"}</span>
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/60 flex items-center justify-between">
          <span>Phân quyền</span>
          <span className="font-semibold text-foreground">Super Admin</span>
        </div>
      </div>

      {/* 4. Infrastructure Health KPI */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-2xs hover:shadow-xs transition-all space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Hạ Tầng Cloud & Database</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Server className="h-4 w-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-extrabold font-display text-foreground tracking-tight">
            Singapore
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mt-1">
            <span>CPU: <strong className="text-foreground">{infrastructure.compute.cpuPct}%</strong></span>
            <span>•</span>
            <span>RAM: <strong className="text-foreground">{infrastructure.compute.ramPct}%</strong></span>
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/60 flex items-center justify-between">
          <span>Postgres NVMe</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Khỏe mạnh (Healthy)</span>
        </div>
      </div>
    </div>
  );
}
