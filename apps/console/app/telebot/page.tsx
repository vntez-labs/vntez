"use client";

import React, { useEffect } from "react";
import { Send } from "lucide-react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { useTelebotStore } from "./telebot-store";
import { WebhookStatusCard } from "./components/webhook-status-card";
import { TelegramConnectCard } from "./components/telegram-connect-card";
import { SubscribersTable } from "./components/subscribers-table";
import { BroadcastModal } from "./components/broadcast-modal";
import { AddSubscriberModal } from "./components/add-subscriber-modal";

export default function TelebotPage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <TelebotContent />
      </ConsoleShell>
    </AuthGuard>
  );
}

function TelebotContent() {
  const { fetchData, fetchSubscribers, isAddModalOpen, closeAddModal } = useTelebotStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-5 max-w-7xl min-w-0 w-full">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Send className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-display text-foreground tracking-tight">
            TeleBot Hub
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản trị webhook Telegram, thông báo broadcast và liên kết danh tính subscribers
          </p>
        </div>
      </div>

      <WebhookStatusCard />
      <TelegramConnectCard />
      <SubscribersTable />
      <BroadcastModal />
      <AddSubscriberModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSuccess={fetchSubscribers}
      />
    </div>
  );
}
