"use client";

import React from "react";
import { HardDrive, ArrowUpRight, Activity, Database, CheckCircle2 } from "lucide-react";
import { useStorageStore } from "../storage-store";

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function StorageMeterCard() {
  const metrics = useStorageStore((s) => s.metrics);

  const usedPercentage = Math.min(
    100,
    (metrics.total_bytes / metrics.storage_limit_bytes) * 100
  );

  const classAPercent = Math.min(
    100,
    (metrics.monthly_operations.class_a / 1_000_000) * 100
  );

  const classBPercent = Math.min(
    100,
    (metrics.monthly_operations.class_b / 10_000_000) * 100
  );

  return (
    <div className="rounded-2xl bg-white dark:bg-card p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">
                Hạn Mức R2 Storage
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> Free Tier
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-bold font-mono text-foreground">
            {formatBytes(metrics.total_bytes)}
            <span className="text-xs font-normal text-muted-foreground">
              {" "}
              / {formatBytes(metrics.storage_limit_bytes, 0)}
            </span>
          </div>
          <p className="text-[11px] font-mono text-muted-foreground">
            {usedPercentage.toFixed(2)}% &bull; {metrics.total_files} files
          </p>
        </div>
      </div>

      {/* Main Storage Bar */}
      <div className="mt-4 space-y-1.5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
            style={{ width: `${Math.max(usedPercentage, 2)}%` }}
          />
        </div>
      </div>

      {/* Sub metrics: No harsh borders, soft clean surfaces */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Class A Operations */}
        <div className="rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 p-3.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Class A (Put / List)</span>
            <Activity className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <div className="mt-1 text-base font-bold font-mono text-foreground">
            {metrics.monthly_operations.class_a.toLocaleString()}
            <span className="text-xs font-normal text-muted-foreground"> / 1M</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-sky-500"
              style={{ width: `${Math.max(classAPercent, 1)}%` }}
            />
          </div>
        </div>

        {/* Class B Operations */}
        <div className="rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 p-3.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Class B (Get / Head)</span>
            <Database className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <div className="mt-1 text-base font-bold font-mono text-foreground">
            {metrics.monthly_operations.class_b.toLocaleString()}
            <span className="text-xs font-normal text-muted-foreground"> / 10M</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-violet-500"
              style={{ width: `${Math.max(classBPercent, 1)}%` }}
            />
          </div>
        </div>

        {/* Bandwidth Egress */}
        <div className="rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 p-3.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Egress Bandwidth</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="mt-1 text-base font-bold font-mono text-foreground">
            {formatBytes(metrics.bandwidth_egress_bytes)}
            <span className="ml-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              (Miễn phí $0)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
