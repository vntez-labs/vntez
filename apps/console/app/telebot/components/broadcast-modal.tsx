"use client";

import React from "react";
import { X, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useTelebotStore } from "../telebot-store";

export function BroadcastModal() {
  const {
    isBroadcastOpen,
    closeBroadcastModal,
    broadcastText,
    setBroadcastText,
    sendBroadcast,
    isSendingBroadcast,
    broadcastResult,
    subscribers,
  } = useTelebotStore();

  React.useEffect(() => {
    if (!isBroadcastOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBroadcastModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isBroadcastOpen, closeBroadcastModal]);

  if (!isBroadcastOpen) return null;

  const activeCount = subscribers.filter((s) => s.status === "active").length;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeBroadcastModal();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in"
    >
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Phát Tin Nhắn Broadcast</h3>
          </div>
          <button
            type="button"
            onClick={closeBroadcastModal}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Tin nhắn sẽ được gửi đồng loạt tới <strong>{activeCount}</strong> subscribers đang hoạt động.</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Nội dung thông báo (Hỗ trợ HTML / Markdown) *
            </label>
            <textarea
              rows={5}
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              placeholder="Nhập nội dung thông báo broadcast tại đây..."
              className="w-full rounded-xl border border-input bg-muted/50 p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {broadcastResult && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{broadcastResult}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" onClick={closeBroadcastModal} className="rounded-xl">
            Đóng
          </Button>
          <Button
            size="sm"
            onClick={sendBroadcast}
            disabled={isSendingBroadcast || !broadcastText.trim()}
            className="gap-2 rounded-xl"
          >
            <Send className="h-3.5 w-3.5" />
            {isSendingBroadcast ? "Đang gửi..." : "Gửi Broadcast ngay"}
          </Button>
        </div>
      </div>
    </div>
  );
}
