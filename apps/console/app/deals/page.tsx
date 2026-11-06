"use client";

import React, { useEffect } from "react";
import { useDealsStore } from "./deals-store";
import { DealsStatsHeader } from "./components/deals-stats-header";
import { DealsTable } from "./components/deals-table";
import { DealsDetailModal } from "./components/deals-detail-modal";
import { DealsActionModals } from "./components/deals-action-modals";
import { DealsFormModal } from "./components/deals-form-modal";

export default function DealsManagementPage() {
  const fetchRequests = useDealsStore((s) => s.fetchRequests);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="space-y-6">
      <DealsStatsHeader />
      <DealsTable />
      <DealsDetailModal />
      <DealsActionModals />
      <DealsFormModal />
    </div>
  );
}
