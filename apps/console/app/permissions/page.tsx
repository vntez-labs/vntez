"use client";

import React, { useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { usePermissionsStore } from "./permissions-store";
import { TableSkeleton } from "@workspace/ui/components/skeleton";
import { RoleSelector } from "./components/role-selector";
import { MatrixTable } from "./components/matrix-table";
import { CreateRoleModal } from "./components/create-role-modal";
import { CreateResourceModal } from "./components/create-resource-modal";

export default function PermissionsPage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <PermissionsContent />
      </ConsoleShell>
    </AuthGuard>
  );
}

function PermissionsContent() {
  const { fetchMatrix, isLoading } = usePermissionsStore();

  useEffect(() => {
    fetchMatrix();
  }, [fetchMatrix]);

  return (
    <div className="space-y-5 max-w-7xl min-w-0 w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-display text-foreground tracking-tight">
                Ma Trận Phân Quyền (IAM)
              </h1>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Cấp Root (app_id: null)
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Quản trị ma trận phân quyền hệ thống toàn cục cho các tài nguyên cốt lõi VNTEZ
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : (
        <>
          <RoleSelector />
          <MatrixTable />
          <CreateRoleModal />
          <CreateResourceModal />
        </>
      )}
    </div>
  );
}
