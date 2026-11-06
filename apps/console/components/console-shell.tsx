"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  Terminal,
  ShieldCheck,
  KeyRound,
  Send,
  HardDrive,
  Layers,
  Newspaper,
  ArrowLeft,
} from "lucide-react";
import { UserDropdown } from "@/components/user-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";

export const NAV_ITEMS = [
  { href: "/", label: "Bảng điều khiển", icon: LayoutDashboard },
  { href: "/apps", label: "Quản lý Ứng dụng", icon: Layers },
  { href: "/blog-posts", label: "Quản trị Blog", icon: Newspaper },
  { href: "/permissions", label: "Ma trận Phân quyền", icon: KeyRound },
  { href: "/telebot", label: "TeleBot Subscribers", icon: Send },
  { href: "/storage", label: "R2 Storage & Uploads", icon: HardDrive },
  { href: "/clients", label: "Quản lý Client OAuth", icon: ShieldCheck },
  { href: "/users", label: "Quản trị Người dùng", icon: Users },
  { href: "/settings", label: "Cài đặt Hệ thống", icon: Settings },
];

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isSubPage = pathname.includes("/editor") || pathname.split("/").filter(Boolean).length > 1;

  return (
    <div className="flex min-h-screen w-full bg-[#fbf9f5] dark:bg-[#080c14] text-foreground overflow-x-hidden">
      {/* Sidebar - Solid pure white on warm ivory background */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-[#0c121e] md:flex shadow-xs">
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b border-zinc-200/70 dark:border-zinc-800/70 px-6 bg-white dark:bg-[#0c121e]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
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
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 hover:text-foreground"
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
        {/* Top Header - Solid pure white */}
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-zinc-200/70 dark:border-zinc-800/70 bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-md px-6 sm:px-8 lg:px-10 shadow-2xs">
          <div className="flex items-center gap-3">
            {isSubPage && (
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-foreground transition-all cursor-pointer shadow-2xs"
                title="Quay lại trang trước"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Quay lại</span>
              </button>
            )}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Console</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="font-semibold text-foreground">
                {pathname.includes("/apps/editor")
                  ? "Soạn thảo Ứng dụng"
                  : pathname.includes("/blog-posts/editor")
                    ? "Soạn thảo Bài viết"
                    : NAV_ITEMS.find((item) => item.href === pathname)?.label || "Bảng điều khiển"}
              </span>
            </div>
          </div>

          {/* Top Actions: Theme Switcher & User Profile Dropdown */}
          <div className="flex items-center gap-2.5 shrink-0">
            <ThemeToggle />
            <UserDropdown />
          </div>
        </header>

        {/* Page Content - Warm ivory canvas */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 bg-[#fbf9f5] dark:bg-[#080c14] min-w-0 w-full max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
