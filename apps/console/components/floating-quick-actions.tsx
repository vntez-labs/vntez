"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  IconFeather,
  IconPlus,
  IconX,
  IconArticle,
  IconApps,
  IconCloudUpload,
  IconDatabase,
  IconSend,
  IconChevronRight,
  IconSparkles,
} from "@tabler/icons-react";

interface ActionItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  href: string;
}

const QUICK_ACTIONS: ActionItem[] = [
  {
    id: "blog",
    label: "Viết bài Blog mới",
    description: "Soạn thảo bài viết Markdown & tin tức kỹ thuật",
    icon: IconArticle,
    iconBg: "bg-rose-500/10 dark:bg-rose-500/20",
    iconColor: "text-rose-600 dark:text-rose-400",
    href: "/blog-posts/editor",
  },
  {
    id: "app",
    label: "Tạo Ứng dụng mới",
    description: "Đăng ký App & cấu hình OAuth 2.0 PKCE",
    icon: IconApps,
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    href: "/apps/editor",
  },
  {
    id: "storage",
    label: "Tải tệp lên R2 Storage",
    description: "Quản lý bucket & tải lên tệp tin tĩnh",
    icon: IconCloudUpload,
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    href: "/storage",
  },
  {
    id: "database",
    label: "Thực thi SQL Console",
    description: "Mở trình soạn thảo & chạy truy vấn dữ liệu",
    icon: IconDatabase,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    href: "/database",
  },
  {
    id: "telebot",
    label: "Soạn tin TeleBot",
    description: "Phát thông báo tức thì tới các subscriber",
    icon: IconSend,
    iconBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    href: "/telebot",
  },
];

export function FloatingQuickActions() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleActionClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-40 select-none print:hidden"
    >
      {/* Floating Speed Dial Menu with bidirectional IN & OUT animation */}
      <div
        className={`absolute bottom-16 right-0 mb-2 w-76 sm:w-80 rounded-2xl border border-border bg-card/95 p-2 shadow-2xl backdrop-blur-xl transition-all duration-200 ease-out origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-3 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-3 py-2 pb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <IconSparkles className="h-3.5 w-3.5 text-primary" />
            <span>Thao tác Tạo Nhanh</span>
          </div>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-mono font-medium text-primary">
            vntez
          </span>
        </div>

        {/* Action List */}
        <div className="space-y-0.5 pt-1.5">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => handleActionClick(action.href)}
                className="group flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-muted/80 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${action.iconBg} ${action.iconColor} transition-transform group-hover:scale-105`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {action.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {action.description}
                    </div>
                  </div>
                </div>
                <IconChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Trigger Button: Bút lông + Dấu cộng */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/25 hover:bg-primary-hover hover:shadow-2xl hover:shadow-primary/35 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label={isOpen ? "Đóng menu thao tác" : "Mở menu tạo nhanh"}
        title={isOpen ? "Đóng (Esc)" : "Tạo nhanh (Bút lông +)"}
      >
        {isOpen ? (
          <IconX className="h-6 w-6 transition-transform duration-200 rotate-0" />
        ) : (
          <div className="relative flex items-center justify-center">
            {/* Cây bút lông */}
            <IconFeather className="h-6 w-6 transition-transform duration-200 group-hover:rotate-12" />
            {/* Dấu cộng floating badge */}
            <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-primary text-[10px] font-bold shadow-xs border border-primary/20">
              <IconPlus className="h-3 w-3 stroke-[3]" />
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
