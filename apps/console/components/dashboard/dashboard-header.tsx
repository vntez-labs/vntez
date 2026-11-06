"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Check, Copy, ExternalLink } from "lucide-react";
import { useAuthStore } from "@workspace/auth/store";
import { fixVietnameseEncoding } from "@workspace/auth/encoding";
import { buttonVariants } from "@workspace/ui/components/button";
import type { DashboardStats } from "./dashboard-types";

interface DashboardHeaderProps {
  stats: DashboardStats | null;
}

export function DashboardHeader({ stats }: DashboardHeaderProps) {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const cleanName = fixVietnameseEncoding(user?.name);
  const displayName = cleanName ? cleanName.trim().split(/\s+/)[0] : "Nam";

  const projectUrl =
    stats?.database.url || "https://stbswcnsitztbusqrdhi.supabase.co";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(projectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-base sm:text-lg font-medium text-foreground/80">
          <span>Hi, {displayName}!</span>
          <span className="text-xl sm:text-2xl select-none">👋</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
          What are we working on today?
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground pt-0.5">
          <span>
            Dự án: <strong className="text-foreground font-semibold">vntez</strong>
          </span>
          <span>•</span>
          <span className="font-mono text-xs">{projectUrl}</span>
          <button
            type="button"
            onClick={handleCopyUrl}
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            <span>{copied ? "Đã chép" : "Chép"}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Link
          href="/permissions"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className:
              "gap-1.5 text-xs bg-white dark:bg-card border-0 text-foreground hover:bg-[#f6f3eb] h-9 shadow-xs",
          })}
        >
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Ma trận Phân quyền</span>
        </Link>

        <a
          href="https://supabase.com/dashboard/project/stbswcnsitztbusqrdhi"
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({
            variant: "default",
            size: "sm",
            className: "gap-1.5 text-xs h-9 border-0 shadow-xs",
          })}
        >
          <span>Supabase Studio</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
