"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@workspace/auth/store";
import { fixVietnameseEncoding } from "@workspace/auth/encoding";
import { LogOut, Settings, Users, Database, ChevronDown, ShieldCheck, Handshake } from "lucide-react";

export function UserDropdown() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 rounded-full p-1 pl-1.5 pr-2.5 hover:bg-[#f6f3eb] dark:hover:bg-muted/80 transition-colors cursor-pointer border-0"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt={user.name || "User Avatar"}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
          </div>
        )}
        <span className="hidden sm:inline-block text-xs font-semibold text-foreground max-w-[120px] truncate">
          {fixVietnameseEncoding(user?.name) || "Administrator"}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-2xl border-0 bg-white dark:bg-card p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] z-50">
          {/* User Profile Header */}
          <div className="px-3 py-2.5 border-b border-[#f5f2eb] dark:border-border/60">
            <p className="text-xs font-semibold text-foreground truncate">
              {fixVietnameseEncoding(user?.name) || "Administrator"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate font-mono mt-0.5">
              {user?.email || "admin@vntez.com"}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1 space-y-0.5">
            <Link
              href="/deals"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-[#f6f3eb] dark:hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <Handshake className="h-4 w-4" />
              <span>Xét duyệt Deal Đối tác</span>
            </Link>

            <Link
              href="/clients"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-[#f6f3eb] dark:hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Quản lý Client OAuth</span>
            </Link>

            <Link
              href="/users"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-[#f6f3eb] dark:hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <Users className="h-4 w-4" />
              <span>Quản trị Người dùng</span>
            </Link>

            <Link
              href="/tables"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-[#f6f3eb] dark:hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <Database className="h-4 w-4" />
              <span>Cơ sở Dữ liệu & Bảng</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-[#f6f3eb] dark:hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              <span>Cài đặt Hệ thống</span>
            </Link>
          </div>

          {/* Logout Section */}
          <div className="pt-1 border-t border-[#f5f2eb] dark:border-border/60">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
