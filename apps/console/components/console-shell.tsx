"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  Terminal,
  ShieldCheck,
  KeyRound,
  Send,
  HardDrive,
} from "lucide-react";
import { UserDropdown } from "@/components/user-dropdown";

export const NAV_ITEMS = [
  { href: "/", label: "Bảng điều khiển", icon: LayoutDashboard },
  { href: "/permissions", label: "Ma trận Phân quyền", icon: KeyRound },
  { href: "/telebot", label: "TeleBot Subscribers", icon: Send },
  { href: "/storage", label: "R2 Storage & Uploads", icon: HardDrive },
  { href: "/clients", label: "Quản lý Client OAuth", icon: ShieldCheck },
  { href: "/users", label: "Quản trị Người dùng", icon: Users },
  { href: "/settings", label: "Cài đặt Hệ thống", icon: Settings },
];

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
            Dịch vụ Edge Cloud
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

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64 min-w-0 w-full max-w-full overflow-x-hidden">
        {/* Top Header */}
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

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#fbf9f5] dark:bg-[#080c14] min-w-0 w-full max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
