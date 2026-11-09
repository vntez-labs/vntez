"use client";

import React from "react";
import {
  IconShieldCheck,
  IconDeviceFloppy,
  IconCheck,
  IconPlus,
  IconChecks,
  IconCircleX,
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { usePermissionsStore } from "../permissions-store";

export function MatrixTable() {
  const {
    resources,
    actions,
    roles,
    selectedRoleId,
    rolePermissions,
    togglePermission,
    grantAllRolePermissions,
    revokeAllRolePermissions,
    saveRolePermissions,
    isSaving,
    saveMessage,
    saveError,
  } = usePermissionsStore();

  const currentRole = roles.find((r) => r.id === selectedRoleId);
  const activePerms = rolePermissions[selectedRoleId] || new Set<string>();
  const totalCells = resources.length * actions.length;
  const activeCount = activePerms.has("*:*") ? totalCells : activePerms.size;

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl shadow-xs border border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <IconShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-foreground capitalize">
                {currentRole?.name || "Vai trò"}
              </h4>
              <Badge variant="outline" className="text-[10px] bg-muted border-0 text-muted-foreground font-mono">
                {activeCount}/{totalCells} quyền
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {currentRole?.description || "Cấu hình quyền truy cập ma trận tài nguyên"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {saveMessage && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {saveMessage}
            </span>
          )}
          {saveError && (
            <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {saveError}
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => grantAllRolePermissions(selectedRoleId)}
            className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <IconChecks className="h-3.5 w-3.5" />
            <span>Chọn tất cả</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => revokeAllRolePermissions(selectedRoleId)}
            className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <IconCircleX className="h-3.5 w-3.5" />
            <span>Xóa hết</span>
          </Button>

          <Button
            size="sm"
            onClick={() => saveRolePermissions(selectedRoleId)}
            disabled={isSaving}
            className="gap-1.5 rounded-xl shadow-xs cursor-pointer h-8"
          >
            <IconDeviceFloppy className="h-3.5 w-3.5" />
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>

      {/* Modern 2D Interactive Grid */}
      <div className="overflow-x-auto rounded-2xl bg-card shadow-xs p-4 border border-border">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr>
              <th className="pb-3 px-3 font-semibold text-foreground min-w-[140px]">
                Tài nguyên
              </th>
              {actions.map((act) => (
                <th
                  key={act}
                  className="pb-3 px-2 font-mono font-medium text-muted-foreground text-center min-w-[85px]"
                >
                  {act}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {resources.map((res) => (
              <tr key={res} className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-medium text-foreground whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span className="font-mono font-semibold text-xs text-foreground">{res}</span>
                  </div>
                </td>
                {actions.map((act) => {
                  const permKey = `${res}:${act}`;
                  const isChecked = activePerms.has(permKey) || activePerms.has("*:*");

                  return (
                    <td key={permKey} className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => togglePermission(selectedRoleId, permKey)}
                        className={cn(
                          "group relative inline-flex size-7.5 items-center justify-center rounded-lg transition-all cursor-pointer select-none",
                          isChecked
                            ? "bg-primary text-white hover:bg-primary/90 shadow-xs hover:scale-105 active:scale-95"
                            : "bg-muted hover:bg-muted/80 text-muted-foreground/40 hover:text-muted-foreground"
                        )}
                        title={`${selectedRoleId} - ${permKey}`}
                        aria-label={`Toggle ${permKey}`}
                      >
                        {isChecked ? (
                          <IconCheck className="h-4 w-4 stroke-[2.5] text-white" />
                        ) : (
                          <IconPlus className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
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
