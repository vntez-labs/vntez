"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@workspace/auth/store";
import { fixVietnameseEncoding } from "@workspace/auth/encoding";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  IconUser,
  IconChevronDown,
  IconLayoutDashboard,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";

export function HeaderUserMenu() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  if (isLoading) {
    return (
      <div className="h-8 w-20 rounded-full bg-slate-100 dark:bg-white/[0.05] animate-pulse" />
    );
  }

  if (!isAuthenticated || !user) {
    const loginUrl = `/api/auth/login?redirect=${encodeURIComponent(pathname || "/")}`;
    return (
      <Link
        href={loginUrl}
        className={buttonVariants({
          variant: "default",
          size: "sm",
          className: "font-semibold shadow-sm px-4 rounded-full",
        })}
      >
        Đăng nhập
      </Link>
    );
  }

  const displayName = fixVietnameseEncoding(user.name) || "Thành viên";
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    window.location.reload();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full p-1 pl-1.5 pr-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#131b2e] dark:hover:bg-[#19243d] transition-colors cursor-pointer border-0"
        aria-expanded={isOpen}
      >
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt={displayName}
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold font-mono">
            {initials}
          </div>
        )}
        <span className="hidden sm:inline-block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[110px] truncate">
          {displayName}
        </span>
        <IconChevronDown
          className={`size-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-[#0c121e] border border-slate-200/80 dark:border-white/[0.08] p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
          {/* User Info Header */}
          <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-white/[0.06]">
            <p className="font-bold text-slate-900 dark:text-white truncate">
              {displayName}
            </p>
            <p className="text-[11px] text-slate-400 truncate font-mono mt-0.5">
              {user.email || "user@vntez.com"}
            </p>
          </div>

          {/* Links */}
          <div className="py-1 space-y-0.5">
            <a
              href="https://vntez-console.vercel.app"
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <IconLayoutDashboard className="size-4 text-primary" />
              <span>Console Quản trị</span>
            </a>

            <a
              href="https://vntez-console.vercel.app/settings"
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <IconSettings className="size-4" />
              <span>Cài đặt & Hồ sơ</span>
            </a>
          </div>

          {/* Logout */}
          <div className="pt-1 border-t border-slate-100 dark:border-white/[0.06]">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <IconLogout className="size-4" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
