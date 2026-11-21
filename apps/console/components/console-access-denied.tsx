"use client";

import React from "react";
import { ShieldAlert, ArrowLeft, LogOut, ExternalLink } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { getPortalBaseUrl } from "@/lib/portal-url";
import type { VntezUser } from "@workspace/auth/types";

interface ConsoleAccessDeniedProps {
  user: VntezUser | null;
  onLogout: () => Promise<void>;
}

export function ConsoleAccessDenied({ user, onLogout }: ConsoleAccessDeniedProps) {
  const portalUrl = getPortalBaseUrl();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-background text-foreground">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl text-center space-y-6">
        {/* Warning Icon with pulsed ring */}
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <div className="absolute inset-0 rounded-2xl bg-amber-500/15 animate-ping" />
          <ShieldAlert className="h-8 w-8 relative z-10" />
        </div>

        {/* Title & Explanations */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-mono font-semibold">
            <span>403 FORBIDDEN</span>
            <span>•</span>
            <span>QUYỀN TRUY CẬP BỊ GIỚI HẠN</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-foreground">
            Khu vực Quản trị Hệ thống
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Bảng điều khiển <span className="font-semibold text-foreground">VNTEZ Console</span> chỉ dành riêng cho Quản trị viên (Super Admin). Tài khoản của bạn chưa được cấp quyền quản trị.
          </p>
        </div>

        {/* User Session Info Card */}
        <div className="rounded-2xl bg-muted/60 border border-border p-4 text-xs font-mono space-y-2.5 text-left">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Tài khoản:</span>
            <span className="font-semibold text-foreground truncate max-w-[220px]">
              {user?.email || "Chưa xác định"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Vai trò hiện tại:</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
              {user?.role || "Người xem (Viewer)"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Yêu cầu quyền:</span>
            <span className="font-semibold text-primary">Super Admin (*:*)</span>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Nếu bạn cần quyền thao tác hệ thống, vui lòng liên hệ Admin phụ trách hệ sinh thái qua email <span className="font-semibold text-foreground font-mono">hnamhocit@gmail.com</span>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={portalUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Về Cổng thông tin</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>

          <Button
            type="button"
            variant="outline"
            onClick={() => onLogout()}
            className="w-full sm:w-auto gap-2 text-xs font-semibold rounded-xl cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-destructive" />
            <span>Đổi tài khoản khác</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
