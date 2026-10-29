"use client";

import React from "react";
import { AuthGuard } from "@workspace/auth/guard";
import { useAuthStore } from "@workspace/auth/store";
import { ConsoleShell } from "@/components/console-shell";
import { Button } from "@workspace/ui/components/button";
import { Settings, LogOut, ShieldAlert, Database, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <SettingsContent />
      </ConsoleShell>
    </AuthGuard>
  );
}

function SettingsContent() {
  const { logout, user } = useAuthStore();

  return (
    <div className="space-y-6 max-w-4xl min-w-0 w-full">
      <div>
        <h1 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Thiết lập Hệ thống Console
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Quản lý cấu hình phiên làm việc và bảo mật tài khoản
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session Card - Borderless */}
        <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-6 space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
              <Database className="h-4 w-4 text-cyan-500" />
              Phiên Đăng nhập Hiện tại
            </h3>
            <p className="text-xs text-muted-foreground">
              Thông tin phiên làm việc quản trị được cấp bởi VNTEZ ID
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-[#f7f5ef] dark:bg-muted/40">
              <span className="text-muted-foreground">Tài khoản:</span>
              <span className="font-semibold text-foreground">{user?.email || "admin@vntez.com"}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-[#f7f5ef] dark:bg-muted/40">
              <span className="text-muted-foreground">Loại phiên:</span>
              <span className="font-semibold text-foreground">VNTEZ ID SSO (PKCE)</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-[#f7f5ef] dark:bg-muted/40">
              <span className="text-muted-foreground">Thời hạn hiệu lực:</span>
              <span className="font-semibold text-foreground">7 ngày (Auto Refresh)</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="w-full gap-1.5 text-xs border-0 bg-[#f7f5ef] hover:bg-[#eee9df] text-foreground shadow-xs cursor-pointer h-9 rounded-xl"
          >
            <RefreshCw className="h-3.5 w-3.5 text-primary" />
            Đồng bộ dữ liệu phiên
          </Button>
        </div>

        {/* Danger Zone Card - Borderless */}
        <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-6 space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-4 w-4" />
              Khu vực Nguy hiểm
            </h3>
            <p className="text-xs text-muted-foreground">
              Các hành động hủy phiên và vô hiệu hóa quyền truy cập
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-destructive/5 text-destructive/90 text-xs leading-relaxed">
            Khi bạn đăng xuất, toàn bộ cookies HTTP-only chứa token và phiên xác thực sẽ bị xóa khỏi trình duyệt.
            Bạn sẽ cần đăng nhập lại qua VNTEZ ID để tiếp tục truy cập bảng điều khiển.
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => logout()}
            className="w-full gap-2 text-xs font-semibold border-0 shadow-xs cursor-pointer h-9 rounded-xl"
          >
            <LogOut className="h-3.5 w-3.5" />
            Đăng xuất khỏi VNTEZ Console
          </Button>
        </div>
      </div>
    </div>
  );
}
