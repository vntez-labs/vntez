"use client";

import React from "react";
import { ShieldCheck, Save } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { usePermissionsStore } from "../permissions-store";

export function MatrixTable() {
  const {
    resources,
    actions,
    roles,
    selectedRoleId,
    togglePermission,
    saveRolePermissions,
    isSaving,
    saveMessage,
    saveError,
  } = usePermissionsStore();

  const currentRole = roles.find((r) => r.id === selectedRoleId);
  const activePerms = new Set(currentRole?.permissions || []);
  const isSuperAdmin = activePerms.has("*:*") || selectedRoleId === "admin";

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-card p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-foreground capitalize">
                {currentRole?.name || "Role"}
              </h4>
              {currentRole?.is_system && (
                <Badge variant="outline" className="text-[10px] bg-slate-100 dark:bg-slate-800 border-0">
                  Hệ thống
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in">
              {saveMessage}
            </span>
          )}
          {saveError && (
            <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {saveError}
            </span>
          )}
          <Button
            size="sm"
            onClick={() => saveRolePermissions(selectedRoleId)}
            disabled={isSaving}
            className="gap-1.5 rounded-xl shadow-xs"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>

      {/* 2D Matrix Table */}
      <div className="overflow-x-auto rounded-2xl bg-white dark:bg-card shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-50/70 dark:bg-zinc-900/40">
              <th className="py-3 px-5 font-semibold text-foreground min-w-[150px]">
                Tài nguyên
              </th>
              {actions.map((act) => (
                <th
                  key={act}
                  className="py-3 px-3 font-mono font-medium text-muted-foreground text-center min-w-[90px]"
                >
                  {act}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100/80 dark:divide-zinc-800/40">
            {resources.map((res) => (
              <tr key={res} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="py-3 px-5 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="font-mono font-semibold">{res}</span>
                  </div>
                </td>
                {actions.map((act) => {
                  const permKey = `${res}:${act}`;
                  const isChecked = isSuperAdmin || activePerms.has(permKey);

                  return (
                    <td key={permKey} className="py-2.5 px-3 text-center">
                      <label className="inline-flex items-center justify-center p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isSuperAdmin}
                          onChange={() => togglePermission(selectedRoleId, permKey)}
                          className="h-4 w-4 rounded accent-primary cursor-pointer disabled:opacity-60"
                        />
                      </label>
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
