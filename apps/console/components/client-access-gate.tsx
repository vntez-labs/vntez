"use client";

import React from "react";
import { useAuthStore } from "@workspace/auth/store";
import { fixVietnameseEncoding } from "@workspace/auth/encoding";
import { Button } from "@workspace/ui/components/button";
import { ShieldAlert, Terminal, LogOut, RefreshCw } from "lucide-react";
import type { ClientRequestRecord } from "@/lib/client-requests";
import { ExistingProposalsList } from "./access-gate/existing-proposals-list";
import { PartnerProposalForm } from "./access-gate/partner-proposal-form";

interface ClientAccessGateProps {
  pendingRequests: ClientRequestRecord[];
  rejectedRequests: ClientRequestRecord[];
  onRefresh: () => void;
}

export function ClientAccessPendingGate({
  pendingRequests,
  rejectedRequests,
  onRefresh,
}: ClientAccessGateProps) {
  const { user, logout } = useAuthStore();
  const displayName = fixVietnameseEncoding(user?.name) || "Đối tác";

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#080c14] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-primary">
              Partner Hub
            </span>
            <h2 className="text-sm font-bold font-display tracking-tight text-foreground">
              VNTEZ CONSOLE
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="text-xs border-0 bg-white dark:bg-card shadow-xs cursor-pointer gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Kiểm tra trạng thái
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            className="text-xs border-0 bg-white dark:bg-card shadow-xs text-destructive hover:bg-destructive/10 cursor-pointer gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            Đăng xuất
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full space-y-6 flex-1">
        {/* Welcome & Access Alert Banner */}
        <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold font-display text-foreground">
                Xin chào, {displayName}!
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tài khoản <code className="font-mono text-foreground font-semibold">{user?.email}</code> chưa có Ứng dụng OAuth nào được kích hoạt.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8f6f0] dark:bg-muted/30 text-xs text-muted-foreground leading-relaxed">
            Hệ thống Console yêu cầu đối tác phải có ít nhất <strong>01 OAuth Client</strong> được Ban quản trị thẩm định và phê duyệt trước khi được mở khóa quyền quản trị. Vui lòng gửi hồ sơ đề xuất dự án bên dưới để chúng tôi xét duyệt deal hợp tác.
          </div>
        </div>

        {/* Existing Applications Status */}
        <ExistingProposalsList
          pendingRequests={pendingRequests}
          rejectedRequests={rejectedRequests}
        />

        {/* Application Submission Form */}
        <PartnerProposalForm onSuccess={onRefresh} />
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-muted-foreground/60 font-mono py-4">
        VNTEZ Identity Ecosystem &copy; 2026. Partner Approval Gateway.
      </footer>
    </div>
  );
}
