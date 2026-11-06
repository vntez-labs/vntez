"use client";

import React, { useEffect } from "react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { useClientsStore } from "./clients-store";
import { ClientsHeader } from "./components/clients-header";
import { ClientsTable } from "./components/clients-table";
import { ClientsFormModal } from "./components/clients-form-modal";
import { ClientsDeleteModal } from "./components/clients-delete-modal";

export default function ClientsPage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <ClientsContent />
      </ConsoleShell>
    </AuthGuard>
  );
}

function ClientsContent() {
  const fetchClients = useClientsStore((s) => s.fetchClients);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      <ClientsHeader />
      <ClientsTable />
      <ClientsFormModal />
      <ClientsDeleteModal />
    </div>
  );
}
