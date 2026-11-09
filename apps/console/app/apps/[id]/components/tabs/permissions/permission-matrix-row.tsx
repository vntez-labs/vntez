"use client";

import React, { useState } from "react";
import { Check, Plus, CheckCheck, X, Copy, Eye } from "lucide-react";
import {
  formatResourceName,
  getResourceIcon,
  getActionTheme,
} from "./resource-display-utils";

interface PermissionMatrixRowProps {
  appId: string;
  resource: string;
  actions: string[];
  rolePerms: Set<string>;
  onTogglePerm: (resource: string, action: string) => void;
  onGrantAllForResource: (resource: string) => void;
  onRevokeAllForResource: (resource: string) => void;
  onGrantReadOnlyForResource: (resource: string) => void;
}

export function PermissionMatrixRow({
  appId,
  resource,
  actions,
  rolePerms,
  onTogglePerm,
  onGrantAllForResource,
  onRevokeAllForResource,
  onGrantReadOnlyForResource,
}: PermissionMatrixRowProps) {
  const [copiedUrn, setCopiedUrn] = useState(false);

  const hasPerm = (act: string) => {
    const key = `${appId}:${resource}:${act}`;
    return rolePerms.has(key) || rolePerms.has(`${appId}:*:*`);
  };

  const activeCount = actions.filter((a) => hasPerm(a)).length;
  const isAllActive = actions.length > 0 && activeCount === actions.length;
  const urn = `${appId}:${resource}:*`;

  const copyUrn = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(urn);
    setCopiedUrn(true);
    setTimeout(() => setCopiedUrn(false), 2000);
  };

  return (
    <tr className="group/row hover:bg-muted/30 transition-colors">
      {/* 1. Resource Identity Column */}
      <td className="py-3 px-4 min-w-[200px]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60 border border-border/80 shrink-0 group-hover/row:border-primary/40 group-hover/row:bg-primary/5 transition-all">
            {getResourceIcon(resource)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground text-xs">
                {formatResourceName(resource)}
              </span>
              <span
                className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded-full font-semibold ${
                  isAllActive
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : activeCount > 0
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {activeCount}/{actions.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-muted-foreground mt-0.5">
              <span className="truncate max-w-[160px] select-all">{urn}</span>
              <button
                type="button"
                onClick={copyUrn}
                className="opacity-0 group-hover/row:opacity-100 hover:text-foreground transition-opacity cursor-pointer p-0.5"
                title="Sao chép chuỗi định danh URN"
              >
                {copiedUrn ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>
        </div>
      </td>

      {/* 2. Action Matrix Cells */}
      {actions.map((act) => {
        const checked = hasPerm(act);
        const theme = getActionTheme(act);
        const permKey = `${appId}:${resource}:${act}`;

        return (
          <td key={act} className="py-2.5 px-2 text-center">
            <button
              type="button"
              onClick={() => onTogglePerm(resource, act)}
              className={`group/btn relative inline-flex size-8 items-center justify-center rounded-xl transition-all cursor-pointer select-none ${
                checked
                  ? theme.activeClass
                  : "bg-muted/40 hover:bg-muted text-transparent hover:text-muted-foreground border border-border/60 hover:border-primary/40 hover:scale-105"
              }`}
              title={`${checked ? "Thu hồi" : "Cấp quyền"}: ${permKey}`}
              aria-label={`Toggle permission ${permKey}`}
            >
              {checked ? (
                <Check className="h-4 w-4 stroke-[2.5] text-white" />
              ) : (
                <Plus className="h-3.5 w-3.5 stroke-[2] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              )}
            </button>
          </td>
        );
      })}

      {/* 3. Row Quick Actions */}
      <td className="py-2.5 px-3 text-center min-w-[120px]">
        <div className="inline-flex items-center gap-1.5 justify-center">
          {isAllActive ? (
            <button
              type="button"
              onClick={() => onRevokeAllForResource(resource)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer shadow-2xs"
              title="Hủy toàn bộ quyền của tài nguyên này"
            >
              <X className="h-3 w-3" />
              <span>Bỏ chọn</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onGrantAllForResource(resource)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted/80 hover:bg-primary/10 hover:text-primary text-foreground border border-border/60 hover:border-primary/30 transition-all cursor-pointer shadow-2xs"
                title="Cấp toàn bộ 7 quyền cho tài nguyên này"
              >
                <CheckCheck className="h-3 w-3 text-primary" />
                <span>Chọn hết</span>
              </button>
              <button
                type="button"
                onClick={() => onGrantReadOnlyForResource(resource)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Chỉ cấp quyền đọc (Read Self & Read All)"
              >
                <Eye className="h-3 w-3" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
