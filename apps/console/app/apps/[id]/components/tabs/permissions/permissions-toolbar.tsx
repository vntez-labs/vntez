"use client";

import React from "react";
import {
  IconShieldCheck,
  IconPlus,
  IconChecks,
  IconEye,
  IconCircleX,
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import type { AppRole } from "@workspace/ui/lib/content-types";

interface PermissionsToolbarProps {
  appId: string;
  roles: AppRole[];
  currentRole: AppRole;
  rolePerms: Record<string, string[]>;
  onSelectRole: (roleId: string) => void;
  onOpenCreateRole: () => void;
  onGrantAll: () => void;
  onGrantReadOnly: () => void;
  onRevokeAll: () => void;
}

export function PermissionsToolbar({
  appId,
  roles,
  currentRole,
  rolePerms,
  onSelectRole,
  onOpenCreateRole,
  onGrantAll,
  onGrantReadOnly,
  onRevokeAll,
}: PermissionsToolbarProps) {
  const activeCount = (rolePerms[currentRole.id] || []).length;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-card border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <IconShieldCheck className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold font-display text-foreground uppercase tracking-wider">
              Chọn Vai Trò (Role) Để Cấu Hình
            </h3>
          </div>
          <p className="text-xs text-muted-foreground pt-0.5">
            Phân quyền tài nguyên theo chuẩn Enterprise:{" "}
            <code className="text-primary font-mono text-[11px]">
              {appId}:&lt;tài_nguyên&gt;:&lt;hành_động&gt;
            </code>
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={onOpenCreateRole}
          className="h-8 px-3 text-xs font-semibold rounded-xl cursor-pointer shrink-0"
        >
          <IconPlus className="h-3.5 w-3.5 mr-1" />
          Tạo vai trò mới
        </Button>
      </div>

      {/* Roles Pill Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
        {roles.map((r) => {
          const isSelected = r.id === currentRole.id;
          const count = (rolePerms[r.id] || []).length;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRole(r.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary text-white font-semibold shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-800/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{r.name}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                  isSelected ? "bg-white/20 text-white" : "bg-zinc-200 dark:bg-zinc-700 text-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Batch buttons for current role */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <div className="text-muted-foreground text-xs">
          Đang cấu hình: <strong className="text-foreground">{currentRole.name}</strong> ({activeCount} quyền kích hoạt)
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onGrantAll}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium text-foreground hover:bg-zinc-200 cursor-pointer"
          >
            <IconChecks className="h-3 w-3 text-primary" />
            <span>Cấp tất cả</span>
          </button>
          <button
            type="button"
            onClick={onGrantReadOnly}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium text-foreground hover:bg-zinc-200 cursor-pointer"
          >
            <IconEye className="h-3 w-3 text-cyan-500" />
            <span>Chỉ đọc</span>
          </button>
          <button
            type="button"
            onClick={onRevokeAll}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium text-rose-500 hover:bg-rose-500/10 cursor-pointer"
          >
            <IconCircleX className="h-3 w-3" />
            <span>Xóa toàn quyền</span>
          </button>
        </div>
      </div>
    </div>
  );
}
