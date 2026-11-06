"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import { Handshake, Plus, RefreshCw } from "lucide-react";
import { useDealsStore } from "../deals-store";
import { DealsTableRow } from "./deals-table-row";

export { getDealTypeBadge, getStatusBadge } from "./deals-badges";

export function DealsTable() {
  const {
    requests,
    isLoading,
    searchQuery,
    statusFilter,
    dealTypeFilter,
    openCreateModal,
  } = useDealsStore();

  const filteredRequests = requests.filter((req) => {
    if (statusFilter !== "all" && req.status !== statusFilter) return false;
    if (dealTypeFilter !== "all" && req.deal_type !== dealTypeFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchProject = req.project_name.toLowerCase().includes(q);
      const matchName = req.applicant_name.toLowerCase().includes(q);
      const matchEmail = req.applicant_email.toLowerCase().includes(q);
      const matchPhone = (req.applicant_phone || "").toLowerCase().includes(q);
      const matchIdea = req.project_idea.toLowerCase().includes(q);
      const matchIdProof = (req.identity_proof || "").toLowerCase().includes(q);
      const matchClientId = (req.approved_client_id || "").toLowerCase().includes(q);

      return (
        matchProject ||
        matchName ||
        matchEmail ||
        matchPhone ||
        matchIdea ||
        matchIdProof ||
        matchClientId
      );
    }

    return true;
  });

  return (
    <div className="rounded-2xl border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="overflow-x-auto min-w-full">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#f5f2eb] dark:border-border/60 bg-[#fcfbfa] dark:bg-muted/20">
              <th className="py-3.5 pl-6 pr-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                Dự án & Đối tác
              </th>
              <th className="py-3.5 px-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                Người đại diện / Liên hệ
              </th>
              <th className="py-3.5 px-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                Pháp nhân / Chứng minh
              </th>
              <th className="py-3.5 px-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                Ý tưởng & Redirects
              </th>
              <th className="py-3.5 px-4 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                Trạng thái Thẩm định
              </th>
              <th className="py-3.5 pl-4 pr-6 text-right font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f7f5ef] dark:divide-border/40">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                    <span>Đang tải danh sách hồ sơ Deal đối tác...</span>
                  </div>
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Handshake className="h-8 w-8 text-muted-foreground/40" />
                    <p className="font-medium text-foreground">Chưa có Deal đối tác nào</p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      {searchQuery
                        ? "Không có hồ sơ nào khớp với từ khóa tìm kiếm của bạn."
                        : "Hiện tại chưa có hồ sơ đăng ký đối tác nào trong cơ sở dữ liệu Supabase."}
                    </p>
                    <Button
                      size="sm"
                      onClick={openCreateModal}
                      className="mt-2 rounded-xl bg-primary text-white text-xs h-8"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Tạo Deal mới
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => (
                <DealsTableRow key={req.id} req={req} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
