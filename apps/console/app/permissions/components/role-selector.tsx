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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h3 className="text-sm font-bold text-foreground">Vai trò trong Hệ thống</h3>

      <div className="flex flex-wrap items-center gap-2">
        {roles.map((r) => {
          const isSelected = r.id === selectedRoleId;
          const permCount = rolePermissions[r.id]?.size || 0;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRoleId(r.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all shadow-xs cursor-pointer ${
                isSelected
                  ? "bg-primary text-white"
                  : "bg-white dark:bg-card text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              <Shield className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-primary"}`} />
              <span className="capitalize">{r.name}</span>
              <Badge
                variant={isSelected ? "secondary" : "outline"}
                className={`text-[10px] px-1.5 py-0 border-0 ${
                  isSelected ? "bg-white/20 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-muted-foreground"
                }`}
              >
                {permCount}
              </Badge>
              {isSelected && <Check className="h-3.5 w-3.5 text-white ml-0.5" />}
            </button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={openCreateRoleModal}
          className="gap-1.5 text-xs rounded-xl bg-white dark:bg-card shadow-xs border-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Tạo Role
        </Button>
      </div>
    </div>
  );
}
