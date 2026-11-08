"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Terminal,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import type { DashboardStats } from "./dashboard-types";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface RegisteredClientsCardProps {
  stats: DashboardStats | null;
}

function getClientIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("bman") || n.includes("pos")) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 shrink-0">
        <Smartphone className="h-5 w-5" />
      </div>
    );
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
      <Terminal className="h-5 w-5" />
    </div>
  );
}

export function RegisteredClientsCard({ stats }: RegisteredClientsCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clients = stats?.clients || [];

  return (
    <div className="bg-card shadow-xs rounded-2xl p-6 space-y-4 w-full max-w-full border border-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">
                Ứng Dụng OAuth Clients
              </h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-mono font-medium text-muted-foreground">
                {clients.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/clients"
            className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            <span>Quản lý Clients</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
          <span className="text-muted-foreground/30">•</span>
          <a
            href="https://vntez-iam.vercel.app/developers"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
          >
            <span>Dev Hub</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-3 pt-1">
        {clients.length > 0 ? (
          clients.map((cl) => {
            const hasDesc = cl.description && cl.description !== "N/A" && cl.description.trim() !== "";
            return (
              <div
                key={cl.clientId}
                className="rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/50 p-4 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* Left: App icon, Name, Client ID */}
                <div className="flex items-start gap-3 min-w-0">
                  {getClientIcon(cl.name)}
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-foreground">
                        {cl.name}
                      </span>
                      {hasDesc && (
                        <span className="text-xs text-muted-foreground truncate max-w-xs">
                          — {cl.description}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Hoạt động
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <span>Client ID:</span>
                      <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
                        {cl.clientId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(cl.clientId, cl.clientId)}
                        title="Sao chép Client ID"
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {copiedId === cl.clientId ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Redirect URIs */}
                <div className="flex flex-wrap items-center gap-1.5 md:justify-end shrink-0">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mr-1">
                    <Globe className="h-3 w-3" />
                    <span>Callback:</span>
                  </div>
                  {cl.redirectUris && cl.redirectUris.length > 0 ? (
                    cl.redirectUris.map((u) => (
                      <span
                        key={u}
                        className="rounded-lg bg-white dark:bg-zinc-800 shadow-xs px-2.5 py-1 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 truncate max-w-[240px]"
                        title={u}
                      >
                        {u}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono">-</span>
                  )}
                </div>
              </div>
            );
          })
        ) : !stats ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-muted/40 border border-border/50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-48 rounded" />
                  </div>
                </div>
                <Skeleton className="h-4 w-28 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground text-xs">
            Chưa có ứng dụng OAuth Client nào được đăng ký.
          </div>
        )}
      </div>
    </div>
  );
}
