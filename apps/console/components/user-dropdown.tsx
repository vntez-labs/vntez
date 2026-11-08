"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@workspace/auth/store";
import { fixVietnameseEncoding } from "@workspace/auth/encoding";
import {
  LogOut,
  Settings,
  Users,
  ChevronDown,
  ShieldCheck,
  KeyRound,
  HardDrive,
  Send,
  Database,
} from "lucide-react";

export function UserDropdown() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        className="flex items-center gap-2 rounded-full p-1 pl-1.5 pr-2.5 hover:bg-muted transition-colors cursor-pointer border-0"
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

      {/* Dropdown Menu with bidirectional IN & OUT animation */}
      <div
        className={`absolute right-0 mt-2 w-64 rounded-2xl bg-card border border-border p-1.5 shadow-xl z-50 transition-all duration-150 ease-out origin-top-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
          {/* User Profile Header */}
          <div className="px-3.5 py-2.5 border-b border-border">
            <p className="text-xs font-bold text-foreground truncate">
              {fixVietnameseEncoding(user?.name) || "Administrator"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate font-mono mt-0.5">
              {user?.email || "admin@vntez.com"}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1 space-y-0.5">
            <Link
              href="/database"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <Database className="h-4 w-4 text-primary" />
              <span>Cơ sở Dữ liệu Supabase</span>
            </Link>

            <Link
              href="/permissions"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <KeyRound className="h-4 w-4" />
              <span>Ma trận Phân quyền</span>
            </Link>

            <Link
              href="/storage"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <HardDrive className="h-4 w-4" />
              <span>R2 Storage & Uploads</span>
            </Link>

            <Link
              href="/telebot"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>TeleBot Subscribers</span>
            </Link>

            <Link
              href="/clients"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Quản lý Client OAuth</span>
            </Link>

            <Link
              href="/users"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <Users className="h-4 w-4" />
              <span>Quản trị Người dùng</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              <span>Cài đặt Hệ thống</span>
            </Link>
          </div>

          {/* Logout Section */}
          <div className="pt-1 border-t border-border">
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
    </div>
  );
}
