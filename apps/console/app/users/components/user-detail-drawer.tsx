"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Check, Globe, Trash2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useUsersStore } from "../users-store";

export function UserDetailDrawer() {
  const {
    selectedUser,
    setSelectedUser,
    drawerTab,
    setDrawerTab,
    copiedId,
    handleCopy,
    setDeletingUser,
  } = useUsersStore();

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setSelectedUser(null);
    }, 200);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!selectedUser) return null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-200 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`border-0 bg-white dark:bg-card shadow-2xl w-full max-w-lg h-full flex flex-col p-6 space-y-5 overflow-y-auto transform transition-transform duration-200 ease-out ${
          isClosing ? "translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#f5f2eb] dark:border-border/40">
          <div className="flex items-center gap-3">
            {selectedUser.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                {selectedUser.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-foreground font-display">
                {selectedUser.name}
              </h3>
              <div className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                <span>{selectedUser.email}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedUser.email, "drawer-email")}
                  className="hover:text-foreground cursor-pointer"
                >
                  {copiedId === "drawer-email" ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3 opacity-60 hover:opacity-100" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs: Overview & Raw JSON */}
        <div className="flex items-center gap-2 border-b border-[#f5f2eb] dark:border-border/40 pb-2">
          <button
            type="button"
            onClick={() => setDrawerTab("overview")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              drawerTab === "overview"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-[#f6f3eb] dark:hover:bg-muted"
            }`}
          >
            Overview (Tổng quan)
          </button>
          <button
            type="button"
            onClick={() => setDrawerTab("raw")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              drawerTab === "raw"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-[#f6f3eb] dark:hover:bg-muted"
            }`}
          >
            Raw JSON
          </button>
        </div>

        {drawerTab === "overview" ? (
          <div className="space-y-5 text-xs">
            {/* User UID */}
            <div className="p-3.5 rounded-xl bg-[#f8f6f0] dark:bg-muted/30 space-y-1">
              <div className="text-[11px] text-muted-foreground font-mono uppercase">
                User UID
              </div>
              <div className="font-mono text-xs font-semibold text-foreground flex items-center justify-between">
                <span>{selectedUser.id}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedUser.id, "drawer-uid")}
                  className="p-1 hover:text-foreground cursor-pointer"
                >
                  {copiedId === "drawer-uid" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Metadata Fields */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#f5f2eb] dark:border-border/40">
                <span className="text-muted-foreground font-sans">Created at:</span>
                <span className="text-foreground">{formatDate(selectedUser.createdAt)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f5f2eb] dark:border-border/40">
                <span className="text-muted-foreground font-sans">Updated at:</span>
                <span className="text-foreground">{formatDate(selectedUser.updatedAt)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f5f2eb] dark:border-border/40">
                <span className="text-muted-foreground font-sans">Confirmed at:</span>
                <span className="text-foreground">{formatDate(selectedUser.confirmedAt)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f5f2eb] dark:border-border/40">
                <span className="text-muted-foreground font-sans">Last signed in:</span>
                <span className="text-foreground">{formatDate(selectedUser.lastSignInAt)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f5f2eb] dark:border-border/40">
                <span className="text-muted-foreground font-sans">Số điện thoại:</span>
                <span className="text-foreground">{selectedUser.phone || "-"}</span>
              </div>
            </div>

            {/* Provider Information */}
            <div className="space-y-2.5 pt-2">
              <h4 className="font-bold text-foreground text-sm font-display">
                Provider Information
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Các nhà cung cấp định danh xác thực tài khoản này
              </p>

              <div className="space-y-2">
                {selectedUser.providers.map((p) => (
                  <div
                    key={p}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#f8f6f0] dark:bg-muted/30"
                  >
                    <div className="flex items-center gap-2 font-medium capitalize text-foreground">
                      <Globe className="h-4 w-4 text-primary" />
                      <span>{p}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-[11px] font-semibold">
                      ● Enabled
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger zone in drawer */}
            {!selectedUser.isCurrentUser && (
              <div className="pt-4 border-t border-[#f5f2eb] dark:border-border/40">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeletingUser(selectedUser)}
                  className="w-full gap-2 text-xs font-semibold h-9 rounded-xl"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa người dùng này khỏi Supabase
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2 text-xs">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleCopy(
                    JSON.stringify(selectedUser.rawUser, null, 2),
                    "raw-json"
                  )
                }
                className="text-xs h-8 border-0 bg-[#f7f5ef] shadow-xs cursor-pointer"
              >
                {copiedId === "raw-json" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500 mr-1" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1" />
                )}
                Sao chép JSON
              </Button>
            </div>
            <div className="p-4 rounded-xl bg-[#f8f6f0] dark:bg-muted/20 font-mono text-xs overflow-x-auto max-h-[500px]">
              <pre className="text-foreground/90">
                {JSON.stringify(selectedUser.rawUser, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
