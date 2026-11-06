"use client";

import React from "react";
import { Shield, Plus, Check } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { usePermissionsStore } from "../permissions-store";

export function RoleSelector() {
  const {
    roles,
    selectedRoleId,
    setSelectedRoleId,
    rolePermissions,
    openCreateRoleModal,
  } = usePermissionsStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebe7df] dark:border-border pb-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Vai trò trong Hệ thống (Roles)</h3>
        <p className="text-xs text-muted-foreground">Chọn vai trò để xem và tick chỉnh sửa ma trận quyền bên dưới</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {roles.map((r) => {
          const isSelected = r.id === selectedRoleId;
          const permCount = rolePermissions[r.id]?.size || 0;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRoleId(r.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                isSelected
                  ? "bg-primary text-white shadow-sm ring-2 ring-primary/30"
                  : "bg-white dark:bg-[#0c121e] border border-[#ebe7df] dark:border-border text-foreground hover:bg-[#f5f2ea] dark:hover:bg-muted"
              }`}
            >
              <Shield className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-primary"}`} />
              <span className="capitalize">{r.name}</span>
              <Badge
                variant={isSelected ? "secondary" : "outline"}
                className={`text-[10px] px-1.5 py-0 ${isSelected ? "bg-white/20 text-white border-transparent" : ""}`}
              >
                {permCount} quyền
              </Badge>
              {isSelected && <Check className="h-3.5 w-3.5 text-white ml-0.5" />}
            </button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={openCreateRoleModal}
          className="gap-1.5 text-xs rounded-xl"
        >
          <Plus className="h-3.5 w-3.5" />
          Tạo Role mới
        </Button>
      </div>
    </div>
  );
}
