"use client";

import React, { useEffect } from "react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { useTelebotStore } from "./telebot-store";
import { WebhookStatusCard } from "./components/webhook-status-card";
import { SubscribersTable } from "./components/subscribers-table";
import { BroadcastModal } from "./components/broadcast-modal";

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
  const { fetchData } = useTelebotStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-5 max-w-7xl min-w-0 w-full">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-display text-foreground tracking-tight">
          TeleBot Hub
        </h2>
      </div>

      <WebhookStatusCard />
      <SubscribersTable />
      <BroadcastModal />
    </div>
  );
}
