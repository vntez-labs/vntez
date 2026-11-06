"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import {
  RefreshCw,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  X,
} from "lucide-react";
import { useDealsStore } from "../deals-store";

export function DealsStatsHeader() {
  const {
    requests,
    isLoading,
    fetchRequests,
    openCreateModal,
    statusFilter,
    setStatusFilter,
    dealTypeFilter,
    setDealTypeFilter,
    searchQuery,
    setSearchQuery,
  } = useDealsStore();

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-display">
              Xét duyệt & Thẩm định Deal Đối tác
            </h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary font-mono">
              OAuth Gatekeeper
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Đánh giá thông tin người tạo, chứng minh pháp nhân và ý tưởng dự án. Phê duyệt (Approve) sẽ tự động tạo OAuth Client trong Supabase và mở cổng truy cập.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRequests}
            disabled={isLoading}
            className="rounded-xl border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:bg-[#f5f2eb] text-xs h-9 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          <Button
            size="sm"
            onClick={openCreateModal}
            className="rounded-xl bg-primary text-white shadow-xs hover:bg-primary/90 text-xs h-9 font-medium cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Tạo Deal / Yêu cầu mới
          </Button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border-0 bg-white dark:bg-card p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Tổng số Deal
          </span>
          <p className="text-2xl font-bold font-display text-foreground mt-1">
            {counts.all}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5 block">
            Hồ sơ đối tác đã gửi
          </span>
        </div>

        <div className="rounded-2xl border-0 bg-white dark:bg-card p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Chờ thẩm định
          </span>
          <p className="text-2xl font-bold font-display text-amber-600 dark:text-amber-400 mt-1">
            {counts.pending}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5 block">
            Cần admin phê duyệt
          </span>
        </div>

        <div className="rounded-2xl border-0 bg-white dark:bg-card p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3" />
            Đã chấp thuận
          </span>
          <p className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-1">
            {counts.approved}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5 block">
            Đã cấp OAuth Client ID
          </span>
        </div>

        <div className="rounded-2xl border-0 bg-white dark:bg-card p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <XCircle className="h-3 w-3" />
            Đã từ chối
          </span>
          <p className="text-2xl font-bold font-display text-rose-600 dark:text-rose-400 mt-1">
            {counts.rejected}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5 block">
            Không đạt tiêu chuẩn
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border-0 bg-white dark:bg-card p-3 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-0 ${
              statusFilter === "all"
                ? "bg-primary text-white"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Tất cả ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-0 flex items-center gap-1.5 ${
              statusFilter === "pending"
                ? "bg-amber-500 text-white"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20"
            }`}
          >
            <Clock className="h-3 w-3" />
            Chờ thẩm định ({counts.pending})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("approved")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-0 flex items-center gap-1.5 ${
              statusFilter === "approved"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            Đã duyệt ({counts.approved})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("rejected")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-0 flex items-center gap-1.5 ${
              statusFilter === "rejected"
                ? "bg-rose-600 text-white"
                : "bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20"
            }`}
          >
            <XCircle className="h-3 w-3" />
            Từ chối ({counts.rejected})
          </button>
        </div>

        {/* Right Search & Deal Type Selector */}
        <div className="flex items-center gap-2">
          <select
            value={dealTypeFilter}
            onChange={(e) => setDealTypeFilter(e.target.value)}
            className="rounded-xl border-0 bg-[#f7f5ef] dark:bg-[#141b2b] px-3 py-1.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">Mọi loại hình Deal</option>
            <option value="partner">Đối tác chiến lược</option>
            <option value="enterprise">Doanh nghiệp</option>
            <option value="startup">Startup</option>
            <option value="individual">Cá nhân</option>
          </select>

          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              spellCheck={false}
              autoComplete="off"
              placeholder="Tìm dự án, đối tác, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-0 bg-[#f7f5ef] dark:bg-[#141b2b] pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
