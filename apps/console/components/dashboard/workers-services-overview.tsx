"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Send,
  HardDrive,
  ArrowRight,
  CheckCircle2,
  Lock,
  Users,
  Database,
} from "lucide-react";

export function WorkersServicesOverview() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">
          Dịch Vụ Cloudflare Workers
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Card 1: IAM Matrix */}
        <div className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-card p-5 shadow-xs transition-all hover:shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> iam-worker
              </span>
            </div>

            <h3 className="mt-4 text-sm font-bold text-foreground">
              Ma Trận Phân Quyền (IAM)
            </h3>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                <Lock className="h-2.5 w-2.5" /> 4 Roles
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                6 Resources
              </span>
            </div>
          </div>

          <Link
            href="/permissions"
            className="mt-4 inline-flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-zinc-900/40 px-3 py-2 text-xs font-medium text-foreground transition-colors group-hover:bg-violet-50 group-hover:text-violet-700 dark:group-hover:bg-violet-950/40 dark:group-hover:text-violet-300"
          >
            <span>Mở Bảng Phân Quyền</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Card 2: TeleBot */}
        <div className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-card p-5 shadow-xs transition-all hover:shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
                <Send className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> telebot-worker
              </span>
            </div>

            <h3 className="mt-4 text-sm font-bold text-foreground">
              TeleBot Hub & Subscribers
            </h3>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                <Users className="h-2.5 w-2.5" /> 4 Subscribers
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                Broadcast Ready
              </span>
            </div>
          </div>

          <Link
            href="/telebot"
            className="mt-4 inline-flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-zinc-900/40 px-3 py-2 text-xs font-medium text-foreground transition-colors group-hover:bg-sky-50 group-hover:text-sky-700 dark:group-hover:bg-sky-950/40 dark:group-hover:text-sky-300"
          >
            <span>Quản Lý Subscribers</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Card 3: R2 Storage */}
        <div className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-card p-5 shadow-xs transition-all hover:shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                <HardDrive className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> upload-worker
              </span>
            </div>

            <h3 className="mt-4 text-sm font-bold text-foreground">
              Cloudflare R2 Storage
            </h3>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                <Database className="h-2.5 w-2.5" /> 10 GB Free
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                $0 Egress
              </span>
            </div>
          </div>

          <Link
            href="/storage"
            className="mt-4 inline-flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-zinc-900/40 px-3 py-2 text-xs font-medium text-foreground transition-colors group-hover:bg-orange-50 group-hover:text-orange-700 dark:group-hover:bg-orange-950/40 dark:group-hover:text-orange-300"
          >
            <span>Quản Lý Kho Lưu Trữ</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
