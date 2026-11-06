"use client";

import React, { useEffect } from "react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { usePermissionsStore } from "./permissions-store";
import { RoleSelector } from "./components/role-selector";
import { MatrixTable } from "./components/matrix-table";
import { EvaluatorCard } from "./components/evaluator-card";
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
        <div className="flex h-64 items-center justify-center rounded-2xl bg-white dark:bg-card shadow-xs">
          <span className="text-xs text-muted-foreground animate-pulse">
            Đang tải dữ liệu phân quyền...
          </span>
        </div>
      ) : (
        <>
          <RoleSelector />
          <MatrixTable />
          <EvaluatorCard />
          <CreateRoleModal />
        </>
      )}
    </div>
  );
}
