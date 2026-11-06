"use client";

import React from "react";
import { Key, ExternalLink } from "lucide-react";
import type { DashboardStats } from "./dashboard-types";

interface RegisteredClientsCardProps {
  stats: DashboardStats | null;
}

export function RegisteredClientsCard({ stats }: RegisteredClientsCardProps) {
  return (
    <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl p-6 space-y-4 w-full max-w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
          <Key className="h-4 w-4 text-emerald-600" />
          Ứng dụng Client Đã Đăng ký & Giới hạn Hạn mức (public.oauth_clients)
        </h3>
        <a
          href="https://vntez-id.vercel.app/developers"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
        >
          <span>Quản lý tại VNTEZ Dev Hub</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="pt-1">
        {stats?.clients && stats.clients.length > 0 ? (
          stats.clients.map((cl) => (
            <div
              key={cl.clientId}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="font-bold text-foreground text-base font-display">
                  {cl.name}
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    ({cl.description || "N/A"})
                  </span>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  Client ID:{" "}
                  <span className="text-foreground font-semibold">
                    {cl.clientId}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Redirect URIs:
                </span>
                {cl.redirectUris.map((u) => (
                  <span
                    key={u}
                    className="border-0 bg-[#f4f1ea] dark:bg-muted text-[#6e6a61] text-xs font-mono px-2.5 py-1 rounded-md"
                  >
                    {u}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : !stats ? (
          <div className="py-4 text-center text-muted-foreground text-xs">
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground text-xs">
            Chưa có ứng dụng OAuth Client nào.
          </div>
        )}
      </div>
    </div>
  );
}
