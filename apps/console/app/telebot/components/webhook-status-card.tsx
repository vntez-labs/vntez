"use client";

import React from "react";
import { Radio, RefreshCw, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { useTelebotStore } from "../telebot-store";

export function WebhookStatusCard() {
  const { webhook, subscribers, openBroadcastModal, fetchData, isLoading } = useTelebotStore();
  const activeCount = subscribers.filter((s) => s.status === "active").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Subscribers Metric */}
      <div className="rounded-2xl bg-card p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between border border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Subscribers Bot</span>
          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-600 border-0 dark:bg-emerald-950/40">
            Live
          </Badge>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-display text-foreground">{subscribers.length}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{activeCount} đang hoạt động</span>
          </div>
        </div>
        <div className="mt-4 pt-3">
          <Button size="sm" onClick={openBroadcastModal} className="w-full gap-2 rounded-xl text-xs shadow-xs cursor-pointer">
            <Send className="h-3.5 w-3.5" />
            Soạn tin Broadcast
          </Button>
        </div>
      </div>

      {/* Webhook Status */}
      <div className="rounded-2xl bg-card p-5 shadow-xs hover:shadow-sm transition-all md:col-span-2 flex flex-col justify-between border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-foreground">Trạng thái Telegram Webhook</span>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchData} disabled={isLoading} className="h-7 px-2 text-xs">
            <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground">Endpoint</span>
            <div className="font-mono text-xs text-foreground truncate bg-muted/60 border border-border/60 p-2 rounded-xl">
              {webhook?.url || "https://telebot.hnamhocit.workers.dev/api/webhook"}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground">Pending Updates</span>
            <div className="flex items-center gap-2 h-8">
              <span className="font-mono font-bold text-sm text-foreground">{webhook?.pending_update_count ?? 0}</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Đồng bộ Cloudflare Edge
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
