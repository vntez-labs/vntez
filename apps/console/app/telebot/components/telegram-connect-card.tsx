"use client";

import React from "react";
import { Send, CheckCircle2, ExternalLink, Link2, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { CopyButton } from "@workspace/ui/components/copy-button";
import { useAuthStore } from "@workspace/auth/store";
import { useTelebotStore } from "../telebot-store";

export function TelegramConnectCard() {
  const { user } = useAuthStore();
  const { subscribers } = useTelebotStore();

  const userEmail = user?.email || "hnamhocit@gmail.com";
  const userId = user?.sub || "admin";

  const linkedSub = subscribers.find(
    (s) => (s.email && s.email.toLowerCase() === userEmail.toLowerCase()) || s.user_id === userId
  );

  const deepLink = `https://t.me/vntez_bot?start=bind_${userId}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Send className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm text-foreground">
                Liên Kết Telegram Cá Nhân (Deep Link)
              </h3>
              {linkedSub ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Đã liên kết
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Chưa liên kết
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tự động ghép nối tài khoản <strong className="text-foreground">{userEmail}</strong> với Telegram Chat ID để nhận cảnh báo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={deepLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs cursor-pointer transition-colors"
          >
            <span>Mở Telegram (@vntez_bot)</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Deep Link URL Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-muted/60 border border-border/70 text-xs">
        <div className="flex items-center gap-2 min-w-0 font-mono text-[11px] text-muted-foreground">
          <Link2 className="h-3.5 w-3.5 shrink-0 text-sky-500" />
          <span className="truncate">{deepLink}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <CopyButton text={deepLink} label="Chép Link" className="h-7 px-2.5 text-xs" />
        </div>
      </div>

      {/* Linked Status or Mechanism Explainer */}
      {linkedSub ? (
        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
            Chat ID: <strong className="text-foreground font-mono">{linkedSub.chat_id}</strong>
          </span>
          {linkedSub.username && (
            <span>
              Telegram: <strong className="text-foreground font-mono">@{linkedSub.username}</strong>
            </span>
          )}
          <span>
            Email định danh: <strong className="text-foreground">{linkedSub.email}</strong>
          </span>
        </div>
      ) : (
        <div className="text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2 pt-1 border-t border-border/60">
          <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          <span>
            <strong>Cơ chế hoạt động:</strong> Khi bạn nhấp link trên, Telegram sẽ tự động gửi lệnh{" "}
            <code className="px-1.5 py-0.2 rounded bg-muted text-foreground font-mono text-[10px]">
              /start bind_{userId}
            </code>{" "}
            đến bot. Webhook tại Cloudflare Edge sẽ đón bắt `userId`, đối soát email{" "}
            <strong>{userEmail}</strong> và lưu bản ghi vào bảng{" "}
            <code className="px-1.5 py-0.2 rounded bg-muted text-foreground font-mono text-[10px]">
              telebot_subscribers
            </code>.
          </span>
        </div>
      )}
    </div>
  );
}
