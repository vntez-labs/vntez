"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconArrowLeft, IconBook } from "@tabler/icons-react";
import { UserDropdown } from "@/components/user-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import { FloatingQuickActions } from "@/components/floating-quick-actions";
import { ConsoleSidebar, NAV_ITEMS } from "@/components/console-sidebar";
import { getDocsBaseUrl } from "@/lib/portal-url";

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isSubPage =
    pathname.includes("/editor") ||
    pathname.split("/").filter(Boolean).length > 1;

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar with App Submenu */}
      <ConsoleSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-72 min-w-0 w-full">
        {/* Top Header - Fixed & Pinned */}
        <header className="fixed top-0 right-0 left-0 md:left-72 z-20 flex h-16 items-center justify-between border-b border-border bg-card/95 backdrop-blur-md px-6 sm:px-8 lg:px-10 shadow-xs">
          <div className="flex items-center gap-3">
            {isSubPage && (
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer shadow-2xs"
                title="Quay lại trang trước"
              >
                <IconArrowLeft className="h-3.5 w-3.5" />
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
                    : NAV_ITEMS.find((item) => item.href === pathname)?.label ||
                      (pathname.startsWith("/apps/") ? "Chi tiết Ứng dụng" : "Bảng điều khiển")}
              </span>
            </div>
          </div>

          {/* Top Actions: Docs Shortcut, Theme Switcher & User Profile Dropdown */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={getDocsBaseUrl()}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Xem Tài liệu kỹ thuật VNTEZ"
            >
              <IconBook className="h-3.5 w-3.5 text-primary" />
              <span>Tài liệu API</span>
            </a>
            <ThemeToggle />
            <UserDropdown />
          </div>
        </header>

        {/* Header spacer to prevent content overlapping */}
        <div className="h-16 shrink-0" aria-hidden="true" />

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 bg-background min-w-0 w-full max-w-full">
          {children}
        </main>
      </div>

      {/* Floating Action Button (FAB) on Every Screen */}
      <FloatingQuickActions />
    </div>
  );
}
