"use client";

import React, { useEffect, useState } from "react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { api } from "@workspace/ui/lib/api-client";
import type { DashboardStats } from "@/components/dashboard/dashboard-types";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardKpis } from "@/components/dashboard/dashboard-kpis";
import { TrafficTrendChart } from "@/components/dashboard/traffic-trend-chart";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";

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
    api
      .get<DashboardStats & { success: boolean }>("/api/dashboard/stats")
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
      <DashboardKpis stats={stats} />
      <TrafficTrendChart stats={stats} />
      <RecentActivityCard stats={stats} />
    </div>
  );
}
