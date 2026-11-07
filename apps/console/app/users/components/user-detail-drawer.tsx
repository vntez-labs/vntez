"use client";

import React, { useState, useEffect } from "react";
import {
  IconX,
  IconCopy,
  IconCheck,
  IconWorld,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { useUsersStore } from "../users-store";
import { JsonCodeView } from "./json-code-view";

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
        className={`bg-white dark:bg-card shadow-2xl w-full max-w-xl h-full flex flex-col p-6 overflow-hidden transform transition-transform duration-200 ease-out border-l border-border/50 ${
          isClosing ? "translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Drawer Header */}
        <div className="shrink-0 flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            {selectedUser.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary font-mono">
                {selectedUser.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-foreground">
                {selectedUser.name}
              </h3>
              <div className="text-xs text-muted-foreground font-mono flex items-center gap-1.5 mt-0.5">
                <span>{selectedUser.email}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedUser.email, "drawer-email")}
                  className="hover:text-foreground cursor-pointer p-0.5"
                >
                  {copiedId === "drawer-email" ? (
                    <IconCheck className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs: Overview & Raw JSON */}
        <div className="shrink-0 flex items-center justify-between gap-2 border-b border-border/60 py-3">
          <div className="flex items-center gap-1.5 bg-secondary/60 dark:bg-zinc-900/60 p-1 rounded-xl border border-border/40">
            <button
              type="button"
              onClick={() => setDrawerTab("overview")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                drawerTab === "overview"
                  ? "bg-white dark:bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview (Tổng quan)
            </button>
            <button
              type="button"
              onClick={() => setDrawerTab("raw")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                drawerTab === "raw"
                  ? "bg-white dark:bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Raw JSON
            </button>
          </div>

          {drawerTab === "raw" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleCopy(
                  JSON.stringify(selectedUser.rawUser, null, 2),
                  "raw-json"
                )
              }
              className="h-8 px-3 text-xs gap-1.5 rounded-xl border-border bg-secondary/40 hover:bg-secondary cursor-pointer"
            >
              {copiedId === "raw-json" ? (
                <>
                  <IconCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Đã sao chép</span>
                </>
              ) : (
                <>
                  <IconCopy className="h-3.5 w-3.5" />
                  <span>Sao chép JSON</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Tab Content */}
        {drawerTab === "overview" ? (
          <div className="flex-1 overflow-y-auto pt-4 space-y-6 text-xs pr-1">
            {/* User UID */}
            <div className="p-4 rounded-2xl bg-secondary/40 dark:bg-zinc-900/40 border border-border/50 space-y-1.5">
              <div className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">
                User UID
              </div>
              <div className="font-mono text-xs font-semibold text-foreground flex items-center justify-between">
                <span className="truncate mr-2">{selectedUser.id}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedUser.id, "drawer-uid")}
                  className="p-1 hover:text-foreground cursor-pointer text-muted-foreground shrink-0"
                >
                  {copiedId === "drawer-uid" ? (
                    <IconCheck className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Metadata Fields */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground font-sans">Created at:</span>
                <span className="text-foreground">{formatDate(selectedUser.createdAt)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground font-sans">Updated at:</span>
                <span className="text-foreground">{formatDate(selectedUser.updatedAt)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground font-sans">Confirmed at:</span>
                <span className="text-foreground">{formatDate(selectedUser.confirmedAt)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground font-sans">Last signed in:</span>
                <span className="text-foreground">{formatDate(selectedUser.lastSignInAt)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground font-sans">Số điện thoại:</span>
                <span className="text-foreground">{selectedUser.phone || "-"}</span>
              </div>
            </div>

            {/* Provider Information */}
            <div className="space-y-3 pt-2">
              <div>
                <h4 className="font-bold text-foreground text-sm">
                  Provider Information
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Các nhà cung cấp định danh xác thực tài khoản này
                </p>
              </div>

              <div className="space-y-2">
                {selectedUser.providers.map((p) => (
                  <div
                    key={p}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/40 dark:bg-zinc-900/40 border border-border/50"
                  >
                    <div className="flex items-center gap-2 font-medium capitalize text-foreground">
                      <IconWorld className="h-4 w-4 text-primary" />
                      <span>{p}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                      ● Enabled
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger zone in drawer */}
            {!selectedUser.isCurrentUser && (
              <div className="pt-4 border-t border-border/60">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeletingUser(selectedUser)}
                  className="w-full gap-2 text-xs font-semibold h-10 rounded-xl cursor-pointer"
                >
                  <IconTrash className="h-4 w-4" />
                  Xóa người dùng này khỏi hệ thống
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col pt-3">
            <JsonCodeView data={selectedUser.rawUser} />
          </div>
        )}
      </div>
    </div>
  );
}
