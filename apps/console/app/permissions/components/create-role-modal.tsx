"use client";

import React from "react";
import { X, ShieldPlus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { usePermissionsStore } from "../permissions-store";

export function CreateRoleModal() {
  const {
    isCreateRoleOpen,
    closeCreateRoleModal,
    newRoleName,
    newRoleDescription,
    setNewRoleName,
    setNewRoleDescription,
    handleCreateRole,
  } = usePermissionsStore();

  if (!isCreateRoleOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0c121e] border border-[#ebe7df] dark:border-border p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#ebe7df] dark:border-border pb-3">
          <div className="flex items-center gap-2">
            <ShieldPlus className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Tạo Vai Trò Mới (New Role)</h3>
          </div>
          <button
            type="button"
            onClick={closeCreateRoleModal}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Tên Vai Trò (Role Name) *
            </label>
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="VD: Accountant, Content Manager..."
              className="w-full h-9 rounded-xl border border-[#ebe7df] dark:border-border bg-[#faf8f4] dark:bg-muted/50 px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Mô tả nhiệm vụ
            </label>
            <textarea
              rows={3}
              value={newRoleDescription}
              onChange={(e) => setNewRoleDescription(e.target.value)}
              placeholder="Mô tả phạm vi quyền hạn của vai trò này..."
              className="w-full rounded-xl border border-[#ebe7df] dark:border-border bg-[#faf8f4] dark:bg-muted/50 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#ebe7df] dark:border-border">
          <Button variant="outline" size="sm" onClick={closeCreateRoleModal} className="rounded-xl">
            Hủy
          </Button>
          <Button size="sm" onClick={handleCreateRole} className="rounded-xl">
            Tạo & Cấu hình quyền
          </Button>
        </div>
      </div>
    </div>
  );
}
