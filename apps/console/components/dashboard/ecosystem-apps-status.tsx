"use client";

import React from "react";
import Link from "next/link";
import { Layers, ArrowRight, ExternalLink, CheckCircle2, Shield } from "lucide-react";
import type { DashboardStats, AppSummaryItem } from "./dashboard-types";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface EcosystemAppsStatusProps {
  stats: DashboardStats | null;
}

export function EcosystemAppsStatus({ stats }: EcosystemAppsStatusProps) {
  if (!stats) {
    return (
      <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const apps = stats.appsList || [];

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/70">
        <div>
          <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span>Trạng Thái Vận Hành Ứng Dụng ({apps.length})</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Các ứng dụng và sản phẩm đang kết nối và hoạt động trực tiếp trong hệ sinh thái VNTEZ
          </p>
        </div>

        <Link
          href="/apps"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <span>Xem tất cả ứng dụng</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Grid of Apps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {apps.map((app) => (
          <div
            key={app.id}
            className="p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {app.avatarUrl ? (
                  <img
                    src={app.avatarUrl}
                    alt={app.name}
                    className="h-9 w-9 rounded-xl object-cover border border-border shrink-0"
                  />
                ) : (
                  <div
                    style={{ backgroundColor: `${app.color || "#fb291a"}15`, color: app.color || "#fb291a" }}
                    className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0"
                  >
                    {app.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-bold text-xs text-foreground truncate">{app.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{app.category || "Hệ sinh thái VNTEZ"}</div>
                </div>
              </div>

              {/* Status Pill */}
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Trực tuyến</span>
              </span>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
              <span className="font-mono text-muted-foreground truncate max-w-[140px]">
                {app.id}
              </span>
              <div className="flex items-center gap-2">
                {app.url && (
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                    title="Mở ứng dụng"
                  >
                    <span>Mở</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                <Link
                  href={`/apps/${encodeURIComponent(app.id)}`}
                  className="font-medium text-primary hover:underline"
                >
                  Cấu hình
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
