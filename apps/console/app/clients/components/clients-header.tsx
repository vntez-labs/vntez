"use client";

import React from "react";
import {
  ShieldCheck,
  Plus,
  RefreshCw,
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
        <div>
          <h1 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Quản lý Client OAuth 2.0 (public.oauth_clients)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Cấp quyền, tạo mới, chỉnh sửa và thu hồi các ứng dụng kết nối SSO qua giao thức chuẩn PKCE S256
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchClients}
            disabled={isLoading}
            className="gap-1.5 text-xs border-0 bg-white dark:bg-card shadow-xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

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
