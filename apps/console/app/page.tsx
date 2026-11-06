"use client";

import React, { useEffect, useState } from "react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import type { DashboardStats } from "@/components/dashboard/dashboard-types";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { WorkersServicesOverview } from "@/components/dashboard/workers-services-overview";
import { RecentCodesTable } from "@/components/dashboard/recent-codes-table";
import { RegisteredClientsCard } from "@/components/dashboard/registered-clients-card";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <DashboardContent />
      </ConsoleShell>
    </AuthGuard>
  );
}

function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data);
        }
      })
      .catch((err) => console.error("Failed to load dashboard stats:", err));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl min-w-0 w-full max-w-full">
      <DashboardHeader stats={stats} />
      <WorkersServicesOverview />
      <RecentCodesTable stats={stats} />
      <RegisteredClientsCard stats={stats} />
    </div>
  );
}
