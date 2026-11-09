"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Check, ArrowRight, ShieldAlert, Lock } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

const GLOBAL_CORE_RESOURCES = [
  { id: "apps", name: "Apps & OAuth" },
  { id: "users", name: "Users & Auth" },
  { id: "database", name: "Postgres DB" },
  { id: "storage", name: "Cloudflare R2" },
  { id: "telebot", name: "Telegram Bot" },
  { id: "blog", name: "Blog Posts" },
];

const GLOBAL_CORE_ACTIONS = [
  { key: "create", label: "Tạo" },
  { key: "read:all", label: "Xem" },
  { key: "update:all", label: "Sửa" },
  { key: "delete:all", label: "Xóa" },
];

const ROLE_PREVIEWS = [
  {
    id: "admin",
    name: "Super Admin",
    badge: "*:* Full Access",
    color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    hasPerm: () => true,
  },
  {
    id: "developer",
    name: "Developer",
    badge: "API & Hạ tầng",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    hasPerm: (res: string, act: string) =>
      act !== "delete:all" || res === "apps" || res === "storage",
  },
  {
    id: "operator",
    name: "Operator",
    badge: "Vận hành",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    hasPerm: (res: string, act: string) =>
      act === "read:all" || ((res === "blog" || res === "telebot") && act !== "delete:all"),
  },
  {
    id: "viewer",
    name: "Viewer",
    badge: "Read-only",
    color: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
    hasPerm: (res: string, act: string) => act === "read:all" && res !== "database",
  },
];

export function GlobalPermissionsMatrixCard() {
  const [selectedRole, setSelectedRole] = React.useState("developer");
  const currentRole = ROLE_PREVIEWS.find((r) => r.id === selectedRole) || ROLE_PREVIEWS[1]!;

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-foreground">
                Ma Trận Phân Quyền Toàn Cục (Global IAM)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                app_id: null
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tổng quan ma trận quyền hạn cấp Root áp dụng trên toàn bộ hệ thống VNTEZ
            </p>
          </div>
        </div>

        <Link href="/permissions">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-primary hover:text-primary gap-1 font-semibold group cursor-pointer"
          >
            <span>Quản lý phân quyền IAM</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ROLE_PREVIEWS.map((role) => {
          const isSelected = role.id === selectedRole;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelectedRole(role.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-card border-primary/50 shadow-xs ring-2 ring-primary/10"
                  : "bg-muted/40 hover:bg-muted/70 border-border"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-semibold text-xs text-foreground truncate">{role.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md border ${role.color}`}>
                  {role.badge}
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground block truncate">
                {role.id === "admin"
                  ? "Toàn quyền hệ sinh thái"
                  : role.id === "developer"
                  ? "Quản trị dịch vụ & API"
                  : role.id === "member"
                  ? "Quyền tự phục vụ cơ bản"
                  : "Chỉ xem dữ liệu chung"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Matrix Preview Table */}
      <div className="overflow-x-auto rounded-2xl border border-border/80 bg-muted/20">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-[11px] font-mono text-muted-foreground">
              <th className="py-2.5 px-4 font-semibold text-foreground">Tài nguyên Root</th>
              {GLOBAL_CORE_ACTIONS.map((a) => (
                <th key={a.key} className="py-2.5 px-3 text-center whitespace-nowrap">
                  {a.label} ({a.key})
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-mono">
            {GLOBAL_CORE_RESOURCES.map((res) => (
              <tr key={res.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-2 px-4 font-sans text-xs font-semibold text-foreground">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{res.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">({res.id})</span>
                  </div>
                </td>
                {GLOBAL_CORE_ACTIONS.map((act) => {
                  const allowed = currentRole.hasPerm(res.id, act.key);
                  return (
                    <td key={act.key} className="py-2 px-3 text-center">
                      <div className="inline-flex items-center justify-center h-6 w-6 rounded-lg">
                        {allowed ? (
                          <div className="h-5 w-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Check className="h-3 w-3 stroke-[2.5]" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-md bg-muted text-muted-foreground/30 flex items-center justify-center">
                            <Lock className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
