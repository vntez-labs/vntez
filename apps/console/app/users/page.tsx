"use client";

import React, { useEffect } from "react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { useUsersStore } from "./users-store";
import { UsersTableHeader } from "./components/users-table-header";
import { UsersTable } from "./components/users-table";
import { UserDetailDrawer } from "./components/user-detail-drawer";
import { UsersModals } from "./components/users-modals";
import { UserEditModal } from "./components/user-edit-modal";

export default function UsersPage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <UsersContent />
      </ConsoleShell>
    </AuthGuard>
  );
}

function UsersContent() {
  const fetchUsers = useUsersStore((s) => s.fetchUsers);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      <UsersTableHeader />
      <UsersTable />
      <UserDetailDrawer />
      <UsersModals />
      <UserEditModal />
    </div>
  );
}
