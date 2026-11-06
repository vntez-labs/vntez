"use client";

import React from "react";
import { HardDrive, ArrowUpRight, Activity, Database, CheckCircle2 } from "lucide-react";
import { useStorageStore } from "../storage-store";

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
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
    <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/60">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/60 pb-5 dark:border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
            <HardDrive className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Cloudflare R2 Bucket Quota
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> Free Tier Active
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Zero-egress object storage &bull; Hono S3 upload worker endpoint
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {formatBytes(metrics.total_bytes)}
            <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
              {" "}
              / {formatBytes(metrics.storage_limit_bytes, 0)}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {usedPercentage.toFixed(2)}% đã dùng &bull; {metrics.total_files} files
          </p>
        </div>
      </div>

      {/* Main Storage Bar */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <span>Dung lượng lưu trữ</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-200">
            {usedPercentage < 0.1 ? "<0.1%" : `${usedPercentage.toFixed(1)}%`}
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
            style={{ width: `${Math.max(usedPercentage, 2)}%` }}
          />
        </div>
      </div>

      {/* Grid Specs */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Class A Operations */}
        <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-950/40">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Class A Ops (Put / List)</span>
            <Activity className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <div className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {metrics.monthly_operations.class_a.toLocaleString()}
            <span className="text-xs font-normal text-zinc-500"> / 1M</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-sky-500"
              style={{ width: `${Math.max(classAPercent, 1)}%` }}
            />
          </div>
        </div>

        {/* Class B Operations */}
        <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-950/40">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Class B Ops (Get / Head)</span>
            <Database className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <div className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {metrics.monthly_operations.class_b.toLocaleString()}
            <span className="text-xs font-normal text-zinc-500"> / 10M</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-violet-500"
              style={{ width: `${Math.max(classBPercent, 1)}%` }}
            />
          </div>
        </div>

        {/* Bandwidth Egress */}
        <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-950/40">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Egress Bandwidth</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {formatBytes(metrics.bandwidth_egress_bytes)}
            <span className="ml-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              (Free $0)
            </span>
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Không tính phí băng thông tải ra ngoài
          </p>
        </div>
      </div>
    </div>
  );
}
