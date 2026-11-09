"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "@workspace/ui/lib/api-client";
import {
  IconTerminal2,
  IconLayoutDashboard,
  IconLayoutDashboardFilled,
  IconApps,
  IconAppsFilled,
  IconArticle,
  IconArticleFilled,
  IconDatabase,
  IconDatabaseFilled,
  IconKey,
  IconKeyFilled,
  IconSend,
  IconSendFilled,
  IconCloud,
  IconCloudFilled,
  IconShieldCheck,
  IconShieldCheckFilled,
  IconUser,
  IconUserFilled,
  IconSettings,
  IconSettingsFilled,
  IconChevronDown,
} from "@tabler/icons-react";

export const NAV_ITEMS = [
  {
    href: "/",
    label: "Bảng điều khiển",
    icon: IconLayoutDashboard,
    activeIcon: IconLayoutDashboardFilled,
  },
  {
    href: "/apps",
    label: "Quản lý Ứng dụng & OAuth",
    icon: IconApps,
    activeIcon: IconAppsFilled,
  },
  {
    href: "/blog-posts",
    label: "Quản trị Blog",
    icon: IconArticle,
    activeIcon: IconArticleFilled,
  },
  {
    href: "/database",
    label: "Cơ sở dữ liệu",
    icon: IconDatabase,
    activeIcon: IconDatabaseFilled,
  },
  {
    href: "/permissions",
    label: "Ma trận Phân quyền",
    icon: IconKey,
    activeIcon: IconKeyFilled,
  },
  {
    href: "/telebot",
    label: "TeleBot Subscribers",
    icon: IconSend,
    activeIcon: IconSendFilled,
  },
  {
    href: "/storage",
    label: "R2 Storage & Uploads",
    icon: IconCloud,
    activeIcon: IconCloudFilled,
  },
  {
    href: "/users",
    label: "Quản trị Người dùng",
    icon: IconUser,
    activeIcon: IconUserFilled,
  },
  {
    href: "/settings",
    label: "Cài đặt Hệ thống",
    icon: IconSettings,
    activeIcon: IconSettingsFilled,
  },
];

export function ConsoleSidebar() {
  const pathname = usePathname();

  // Submenu state for Apps & OAuth dropdown
  const [isAppsExpanded, setIsAppsExpanded] = useState(() =>
    pathname.startsWith("/apps")
  );
  const [sidebarApps, setSidebarApps] = useState<
    { id: string; name: string; avatarUrl?: string | null; color?: string }[]
  >([
    { id: "solotype", name: "SoloType", color: "#0ea5e9" },
    { id: "vntez-iam", name: "VNTEZ IAM", color: "#fb291a" },
    { id: "workers-hub", name: "Workers Hub", color: "#f59e0b" },
    { id: "bonsai-reader", name: "Bonsai Reader", color: "#10b981" },
    { id: "gitvn", name: "GitVN", color: "#6366f1" },
  ]);

  // Fetch live apps list for sidebar
  useEffect(() => {
    let mounted = true;
    api
      .get<{ success: boolean; apps: Array<{ id: string; name: string; avatarUrl?: string | null; color?: string }> }>(
        "/api/apps",
        { silent: true }
      )
      .then((data) => {
        if (mounted && data.success && Array.isArray(data.apps) && data.apps.length > 0) {
          setSidebarApps(
            data.apps.map((a) => ({
              id: a.id,
              name: a.name,
              avatarUrl: a.avatarUrl,
              color: a.color,
            }))
          );
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Keep expanded when navigating to an app
  useEffect(() => {
    if (pathname.startsWith("/apps")) {
      setIsAppsExpanded(true);
    }
  }, [pathname]);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-border bg-card md:flex shadow-xs">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3.5 border-b border-border px-6 bg-card">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-xs shrink-0">
          <IconTerminal2 className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary block leading-tight">
            Management
          </span>
          <h2 className="text-base font-bold font-display tracking-tight text-foreground leading-tight">
            VNTEZ CONSOLE
          </h2>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-1.5 px-3.5 py-4 overflow-y-auto bg-card">
        <div className="px-3 pb-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground/70">
          Dịch vụ Edge Cloud
        </div>
        {NAV_ITEMS.map((item) => {
          const isAppsItem = item.href === "/apps";
          const isActive = isAppsItem
            ? pathname === "/apps"
            : pathname === item.href;
          const Icon = isActive ? item.activeIcon : item.icon;

          if (isAppsItem) {
            const isAnyAppActive = pathname.startsWith("/apps");
            return (
              <div key={item.href} className="space-y-1">
                {/* Expandable Apps Header Button (Does NOT navigate to /apps) */}
                <button
                  type="button"
                  onClick={() => setIsAppsExpanded((prev) => !prev)}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                    isAnyAppActive
                      ? "bg-muted/70 text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <IconChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      isAppsExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Submenu with App Logo + Name (Bidirectional IN & OUT animation) */}
                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    isAppsExpanded
                      ? "grid-rows-[1fr] opacity-100 mt-1"
                      : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden pl-5 space-y-1 border-l-2 border-border/70 ml-4.5 py-0.5">
                    {sidebarApps.map((app) => {
                      const isAppActive = pathname === `/apps/${app.id}`;
                      return (
                        <Link
                          key={app.id}
                          href={`/apps/${app.id}`}
                          className={`flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all ${
                            isAppActive
                              ? "bg-primary/10 text-primary font-semibold shadow-2xs"
                              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                          }`}
                        >
                          {/* App Logo */}
                          {app.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={app.avatarUrl}
                              alt={app.name}
                              className={`h-4.5 w-4.5 rounded-md object-cover shrink-0 ring-1 ${
                                isAppActive ? "ring-primary/40" : "ring-border/50"
                              }`}
                            />
                          ) : (
                            <div
                              className="h-4.5 w-4.5 rounded-md flex items-center justify-center text-white text-[9px] font-bold shrink-0 shadow-2xs"
                              style={{
                                backgroundColor: app.color || "#fb291a",
                              }}
                            >
                              {app.name.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                          <span className="truncate">{app.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
