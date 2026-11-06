"use client";

import React from "react";
import { Check, Save, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { usePermissionsStore } from "../permissions-store";

export function MatrixTable() {
  const {
    resources,
    actions,
    selectedRoleId,
    roles,
    rolePermissions,
    togglePermission,
    saveRolePermissions,
    isSaving,
    saveMessage,
    saveError,
  } = usePermissionsStore();

  const currentRole = roles.find((r) => r.id === selectedRoleId) || roles[0];
  const activePerms = rolePermissions[selectedRoleId] || new Set();
  const isSuperAdmin = activePerms.has("*:*") || selectedRoleId === "admin";

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0c121e] p-4 rounded-2xl border border-[#ebe7df] dark:border-border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-foreground capitalize">{currentRole?.name || "Role"}</h4>
              {currentRole?.is_system && (
                <Badge variant="outline" className="text-[10px] bg-slate-100 dark:bg-slate-800">
                  Hệ thống
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{currentRole?.description || ""}</p>
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
            {isSaving ? "Đang lưu..." : "Lưu thay đổi ma trận"}
          </Button>
        </div>
      </div>

      {/* 2D Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#ebe7df] dark:border-border bg-white dark:bg-[#0c121e] shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#ebe7df] dark:border-border bg-[#faf8f4] dark:bg-[#111726]/60">
              <th className="py-3.5 px-4 font-semibold text-foreground min-w-[160px]">
                Tài nguyên (Resources)
              </th>
              {actions.map((act) => (
                <th key={act} className="py-3.5 px-3 font-mono font-medium text-muted-foreground text-center min-w-[100px]">
                  {act}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ebe7df] dark:divide-border font-sans">
            {resources.map((res) => (
              <tr key={res} className="hover:bg-[#fbf9f5] dark:hover:bg-muted/40 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary/60" />
                    <span className="font-mono font-semibold">{res}</span>
                  </div>
                </td>
                {actions.map((act) => {
                  const permKey = `${res}:${act}`;
                  const isChecked = isSuperAdmin || activePerms.has(permKey);

                  return (
                    <td key={permKey} className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        disabled={isSuperAdmin}
                        onClick={() => togglePermission(selectedRoleId, permKey)}
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-lg transition-all ${
                          isChecked
                            ? "bg-primary text-white shadow-xs scale-105"
                            : "bg-slate-100 dark:bg-slate-800 text-transparent hover:bg-slate-200 dark:hover:bg-slate-700"
                        } ${isSuperAdmin ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}`}
                        title={permKey}
                      >
                        <Check className={`h-3.5 w-3.5 stroke-[3] ${isChecked ? "text-white" : "opacity-0"}`} />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
        <span>💡 Mẹo: Nhấn vào ô để bật/tắt quyền tương ứng. Role Admin mặc định sở hữu toàn quyền (*:*).</span>
        <span>{activePerms.size} quyền đang được gán</span>
      </div>
    </div>
  );
}
