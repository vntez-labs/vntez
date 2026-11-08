"use client";

import React from "react";
import {
  ShieldCheck,
  Plus,
  Layers,
  Lock,
  Globe,
  Code,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useClientsStore } from "../clients-store";

export function ClientsHeader() {
  const { clients, isLoading, fetchClients, openCreateModal } =
    useClientsStore();

  const internalCount = clients.filter((c) => c.is_internal).length;
  const publicCount = clients.filter((c) => !c.is_internal).length;
  const totalCodes = clients.reduce((acc, c) => acc + (c.codes_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-foreground">
              Quản lý Client OAuth 2.0
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            onClick={openCreateModal}
            className="gap-1.5 text-xs border-0 shadow-xs cursor-pointer font-semibold"
          >
            <Plus className="h-4 w-4" />
            Tạo Client mới
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">Hợp nhất Định danh vào Không gian Ứng dụng</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary text-white font-semibold">Mới</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Mỗi ứng dụng hiện đã tích hợp sẵn Client ID, Client Secret, ma trận phân quyền per-app, tài liệu MDX, và Remote Config.
          </p>
        </div>
        <a
          href="/apps"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:opacity-90 transition-all shrink-0 shadow-xs"
        >
          <span>Khám phá Quản lý Ứng dụng</span>
          <span>→</span>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-5 space-y-1.5">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>Ứng dụng đã Đăng ký</span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-display text-foreground">
            {clients.length} Client
          </div>
          <p className="text-xs text-muted-foreground">
            Hạn mức hệ thống: {clients.length}/10 slots ({Math.round((clients.length / 10) * 100)}%)
          </p>
        </div>

        <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-5 space-y-1.5">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>Ứng dụng Nội bộ</span>
            <Lock className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-display text-foreground">
            {internalCount}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Xác thực nội bộ VNTEZ Ecosystem
          </p>
        </div>

        <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-5 space-y-1.5">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>Ứng dụng Công khai</span>
            <Globe className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold font-display text-foreground">
            {publicCount}
          </div>
          <p className="text-xs text-muted-foreground">
            Bảo vệ với OAuth 2.0 PKCE S256
          </p>
        </div>

        <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-5 space-y-1.5">
          <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>Tổng Giao dịch Mã PKCE</span>
            <Code className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold font-display text-foreground">
            {totalCodes} Mã
          </div>
          <p className="text-xs text-muted-foreground">
            Được ghi nhận tại public.oauth_codes
          </p>
        </div>
      </div>
    </div>
  );
}
