"use client";

import React, { useEffect } from "react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { usePermissionsStore } from "./permissions-store";
import { TableSkeleton } from "@workspace/ui/components/skeleton";
import { RoleSelector } from "./components/role-selector";
import { MatrixTable } from "./components/matrix-table";
import { CreateRoleModal } from "./components/create-role-modal";

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
      <div>
        <h2 className="text-xl font-bold font-display text-foreground tracking-tight">
          Ma Trận Phân Quyền (IAM)
        </h2>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : (
        <>
          <RoleSelector />
          <MatrixTable />
          <CreateRoleModal />
        </>
      )}
    </div>
  );
}
