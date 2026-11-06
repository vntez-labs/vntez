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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Hệ sinh thái Cloudflare Workers & Microservices
          </h2>
          <p className="text-xs text-muted-foreground">
            Trung tâm kiểm soát phân quyền IAM, bot thông báo Telegram và lưu trữ tập tin R2
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Card 1: IAM Matrix */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-xl transition-all hover:border-violet-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-violet-700">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> iam-worker
              </span>
            </div>

            <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Ma Trận Phân Quyền (RBAC)
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Quản trị ma trận 2D Resources vs Actions, cấp quyền theo Roles, tích hợp SSO & PKCE.
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <Lock className="h-2.5 w-2.5" /> 4 Roles
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                6 Resources
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                Live Evaluator
              </span>
            </div>
          </div>

          <Link
            href="/permissions"
            className="mt-5 inline-flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700 transition-colors group-hover:bg-violet-50 group-hover:text-violet-700 dark:bg-zinc-800/60 dark:text-zinc-300 dark:group-hover:bg-violet-950/40 dark:group-hover:text-violet-300"
          >
            <span>Mở Bảng Phân Quyền</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Card 2: TeleBot */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-xl transition-all hover:border-sky-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-sky-700">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
                <Send className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> telebot-worker
              </span>
            </div>

            <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              TeleBot Hub & Subscribers
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Giám sát Webhook Telegram bot, quản lý danh sách người nhận và phát sóng tin nhắn tức thì.
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <Users className="h-2.5 w-2.5" /> 4 Subscribers
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                Webhook Sync
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                Broadcast
              </span>
            </div>
          </div>

          <Link
            href="/telebot"
            className="mt-5 inline-flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700 transition-colors group-hover:bg-sky-50 group-hover:text-sky-700 dark:bg-zinc-800/60 dark:text-zinc-300 dark:group-hover:bg-sky-950/40 dark:group-hover:text-sky-300"
          >
            <span>Quản Lý Subscribers</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Card 3: R2 Storage */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-xl transition-all hover:border-orange-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-orange-700">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                <HardDrive className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> upload-worker
              </span>
            </div>

            <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Cloudflare R2 Storage (10 GB Free)
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Lưu trữ tập tin zero-egress, phân mảnh Multipart Uploads, cấp Presigned S3 URLs bảo mật.
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <Database className="h-2.5 w-2.5" /> 10 GB Limit
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                0$ Egress
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                Presigned S3
              </span>
            </div>
          </div>

          <Link
            href="/storage"
            className="mt-5 inline-flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700 transition-colors group-hover:bg-orange-50 group-hover:text-orange-700 dark:bg-zinc-800/60 dark:text-zinc-300 dark:group-hover:bg-orange-950/40 dark:group-hover:text-orange-300"
          >
            <span>Quản Lý Kho Lưu Trữ</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
