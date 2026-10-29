"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Database,
  Check,
  Copy,
  ExternalLink,
  Key,
  ArrowRight,
  Clock,
} from "lucide-react";
import { AuthGuard } from "@workspace/auth/guard";
import { useAuthStore } from "@workspace/auth/store";
import { fixVietnameseEncoding } from "@workspace/auth/encoding";
import { ConsoleShell } from "@/components/console-shell";
import { buttonVariants } from "@workspace/ui/components/button";

interface DashboardStats {
  database: {
    url: string;
    projectId: string;
    status: string;
    latencyMs: number;
    tablesCount: number;
    totalRecords: number;
    accessMode: string;
  };
  evaluation?: {
    totalCodes?: number;
    [key: string]: any;
  };
  clients: Array<{
    clientId: string;
    name: string;
    description: string;
    redirectUris: string[];
    createdAt: string;
  }>;
  recentEvents: Array<{
    codePrefix: string;
    clientId: string;
    userId: string;
    redirectUri: string;
    challengeMethod: string;
    used: boolean;
    createdAt: string;
    expiresAt: string;
  }>;
}

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
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [copied, setCopied] = useState(false);

  // Friendly first name (e.g. "Nam Nguyễn" -> "Nam")
  const cleanName = fixVietnameseEncoding(user?.name);
  const displayName = cleanName ? cleanName.trim().split(/\s+/)[0] : "Nam";

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

  const projectUrl =
    stats?.database.url || "https://stbswcnsitztbusqrdhi.supabase.co";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(projectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl min-w-0 w-full max-w-full">
      {/* Friendly Conversational Greeting - Clean, borderless header */}
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
            <span>Dự án: <strong className="text-foreground font-semibold">vntez</strong></span>
            <span>•</span>
            <span className="font-mono text-xs">{projectUrl}</span>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? "Đã chép" : "Chép"}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/tables"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "gap-1.5 text-xs bg-white dark:bg-card border-0 text-foreground hover:bg-[#f6f3eb] h-9 shadow-xs",
            })}
          >
            <Database className="h-4 w-4 text-primary" />
            <span>Xem Bảng Dữ liệu</span>
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

      {/* Main Content: Real Authorization Codes Table - Borderless Card */}
      <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden w-full max-w-full">
        <div className="p-4 sm:p-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4 text-primary" />
                Nhật ký Mã Xác thực PKCE (public.oauth_codes)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Các sự kiện cấp phát mã xác thực SSO qua luồng PKCE S256 lưu trực tiếp trong Supabase
              </p>
            </div>

            {stats && (stats.evaluation?.totalCodes ?? stats.recentEvents?.length ?? 0) > 0 && (
              <Link
                href="/tables?table=oauth_codes"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
              >
                <span>
                  Xem toàn bộ {stats.evaluation?.totalCodes ?? stats.recentEvents?.length} bản ghi trong Table Explorer
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        <div className="w-full max-w-full overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-[#faf8f4] dark:bg-muted/40 text-[#6e6a61] dark:text-slate-300 font-mono text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5 font-semibold whitespace-nowrap">Mã Code Hash</th>
                <th className="py-3 px-5 font-semibold whitespace-nowrap">Client</th>
                <th className="py-3 px-5 font-semibold whitespace-nowrap">PKCE Method</th>
                <th className="py-3 px-5 font-semibold whitespace-nowrap">Redirect URI</th>
                <th className="py-3 px-5 font-semibold whitespace-nowrap">Thời gian tạo</th>
                <th className="py-3 px-5 font-semibold whitespace-nowrap">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f2eb] dark:divide-border/30 font-mono text-sm">
              {!stats ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs font-sans">
                    Đang tải dữ liệu thực tế từ Supabase...
                  </td>
                </tr>
              ) : stats.recentEvents && stats.recentEvents.length > 0 ? (
                stats.recentEvents.map((evt, idx) => (
                  <tr key={idx} className="hover:bg-[#fbf9f5] dark:hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-foreground">
                      {evt.codePrefix}
                    </td>
                    <td className="py-3.5 px-5 text-muted-foreground text-xs">
                      {evt.clientId}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="border-0 bg-[#f4f1ea] dark:bg-muted/50 text-[#6b675e] text-xs font-mono px-2 py-0.5 rounded-md">
                        {evt.challengeMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-muted-foreground truncate max-w-xs text-xs font-sans">
                      {evt.redirectUri}
                    </td>
                    <td className="py-3.5 px-5 text-muted-foreground text-xs whitespace-nowrap font-sans">
                      {new Date(evt.createdAt).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {evt.used ? (
                        <span className="border-0 bg-emerald-100/70 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-medium px-2.5 py-0.5 rounded-full font-sans">
                          Đã đổi Token
                        </span>
                      ) : (
                        <span className="border-0 bg-amber-100/70 text-amber-800 dark:bg-amber-500/10 text-xs font-medium px-2.5 py-0.5 rounded-full font-sans">
                          Chưa dùng
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs font-sans">
                    Chưa có mã xác thực nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Application & Capacity Limit Assessment - Borderless Card */}
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
              <div key={cl.clientId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-foreground text-base font-display">
                    {cl.name}
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({cl.description || "N/A"})
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    Client ID: <span className="text-foreground font-semibold">{cl.clientId}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">Redirect URIs:</span>
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
    </div>
  );
}
