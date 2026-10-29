"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Database,
  Settings,
  Terminal,
  ShieldCheck,
  Handshake,
} from "lucide-react";
import { UserDropdown } from "@/components/user-dropdown";
import { ClientAccessPendingGate } from "@/components/client-access-gate";

const NAV_ITEMS = [
  { href: "/", label: "Bảng điều khiển", icon: LayoutDashboard },
  { href: "/deals", label: "Xét duyệt Deal Đối tác", icon: Handshake },
  { href: "/clients", label: "Quản lý Client OAuth", icon: ShieldCheck },
  { href: "/users", label: "Quản trị Người dùng", icon: Users },
  { href: "/tables", label: "Cơ sở Dữ liệu & Bảng", icon: Database },
  { href: "/settings", label: "Cài đặt Hệ thống", icon: Settings },
];

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [accessStatus, setAccessStatus] = useState<{
    hasAccess: boolean;
    isSuperAdmin: boolean;
    pendingRequests: any[];
    rejectedRequests: any[];
  } | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkStatus = () => {
    setIsChecking(true);
    fetch("/api/user-status")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAccessStatus(data);
        }
      })
      .catch((err) => console.error("Access check error:", err))
      .finally(() => setIsChecking(false));
  };

  useEffect(() => {
    checkStatus();
  }, []);

  // If user has no approved OAuth client and is not super admin -> Gate to pending approval screen
  if (!isChecking && accessStatus && !accessStatus.hasAccess) {
    return (
      <ClientAccessPendingGate
        pendingRequests={accessStatus.pendingRequests || []}
        rejectedRequests={accessStatus.rejectedRequests || []}
        onRefresh={checkStatus}
      />
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#fbf9f5] dark:bg-[#080c14] overflow-x-hidden">
      {/* Sidebar - Solid White on warm Claude-style ivory background */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#ebe7df] dark:border-border bg-white dark:bg-[#0c121e] md:flex shadow-[1px_0_3px_rgba(0,0,0,0.02)]">
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b border-[#ebe7df] dark:border-border px-6 bg-white dark:bg-[#0c121e]">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-primary">
              Management
            </span>
            <h2 className="text-sm font-bold font-display tracking-tight text-foreground">
              VNTEZ CONSOLE
            </h2>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 space-y-1 px-3 py-4 overflow-y-auto bg-white dark:bg-[#0c121e]">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">
            Menu chính
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-[#f3f0e8] dark:hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area - Constrained with min-w-0 to prevent horizontal flex blowout */}
      <div className="flex flex-1 flex-col md:pl-64 min-w-0 w-full max-w-full overflow-x-hidden">
        {/* Top Header - Solid White with subtle warm border */}
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[#ebe7df] dark:border-border bg-white dark:bg-[#0c121e] px-4 sm:px-6 lg:px-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Console</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="font-medium text-foreground">
              {NAV_ITEMS.find((item) => item.href === pathname)?.label || "Bảng điều khiển"}
            </span>
          </div>

          {/* User Profile Dropdown */}
          <div className="flex items-center shrink-0">
            <UserDropdown />
          </div>
        </header>

        {/* Page Content with Warm Claude Canvas Tone */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#fbf9f5] dark:bg-[#080c14] min-w-0 w-full max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
