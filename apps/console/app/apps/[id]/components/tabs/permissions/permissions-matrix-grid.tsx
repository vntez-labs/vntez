"use client";

import React, { useState, useMemo } from "react";
import { Search, ShieldAlert, Sparkles, Filter, X } from "lucide-react";
import { STANDARD_APP_ACTIONS } from "@/lib/apps-repository";
import { ActionHeaderCell } from "./action-header-cell";
import { PermissionMatrixRow } from "./permission-matrix-row";
import { formatResourceName } from "./resource-display-utils";

interface PermissionsMatrixGridProps {
  appId: string;
  resources: string[];
  rolePerms: Set<string>;
  onTogglePerm: (resource: string, action: string) => void;
  onGrantAllForResource: (resource: string) => void;
  onRevokeAllForResource: (resource: string) => void;
  onGrantReadOnlyForResource: (resource: string) => void;
  onToggleColumnAction: (action: string) => void;
}

export function PermissionsMatrixGrid({
  appId,
  resources,
  rolePerms,
  onTogglePerm,
  onGrantAllForResource,
  onRevokeAllForResource,
  onGrantReadOnlyForResource,
  onToggleColumnAction,
}: PermissionsMatrixGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const totalPossiblePerms = resources.length * STANDARD_APP_ACTIONS.length;
  
  const activeCountForResource = (res: string) => {
    return STANDARD_APP_ACTIONS.filter((act) => {
      const key = `${appId}:${res}:${act}`;
      return rolePerms.has(key) || rolePerms.has(`${appId}:*:*`);
    }).length;
  };

  const totalActivePerms = useMemo(() => {
    let count = 0;
    resources.forEach((r) => {
      count += activeCountForResource(r);
    });
    return count;
  }, [resources, rolePerms, appId]);

  const coveragePercent = totalPossiblePerms > 0
    ? Math.round((totalActivePerms / totalPossiblePerms) * 100)
    : 0;

  // Filter resources based on search query and status filter
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const formatted = formatResourceName(res).toLowerCase();
      const raw = res.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        formatted.includes(searchQuery.toLowerCase()) ||
        raw.includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      const active = activeCountForResource(res);
      if (statusFilter === "active") return active > 0;
      if (statusFilter === "inactive") return active === 0;
      return true;
    });
  }, [resources, searchQuery, statusFilter, rolePerms, appId]);

  return (
    <div className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden flex flex-col">
      {/* 1. Matrix Control Toolbar: Coverage Progress & Search */}
      <div className="p-4 bg-muted/30 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Coverage Progress Indicator */}
        <div className="space-y-1.5 min-w-[240px]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Độ phủ quyền của Vai trò</span>
            </span>
            <span className="font-mono text-muted-foreground font-semibold">
              <strong className="text-foreground">{totalActivePerms}</strong> / {totalPossiblePerms} ({coveragePercent}%)
            </span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${coveragePercent}%` }}
            />
          </div>
        </div>

        {/* Search & Status Quick Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tài nguyên..."
              className="h-8 pl-8 pr-7 text-xs rounded-xl bg-card border border-border/80 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-40 sm:w-48 placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Status Segmented Pill */}
          <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-xl border border-border/60 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === "all"
                  ? "bg-card text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tất cả ({resources.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === "active"
                  ? "bg-card text-emerald-600 dark:text-emerald-400 font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Đã cấp
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("inactive")}
              className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === "inactive"
                  ? "bg-card text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Chưa có
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Permissions Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-muted/50 text-muted-foreground font-mono uppercase tracking-wider border-b border-border">
            <tr>
              <th className="py-3 px-4 min-w-[200px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Filter className="h-3.5 w-3.5 text-primary" />
                  <span>Tài nguyên (Resource)</span>
                </div>
              </th>
              {STANDARD_APP_ACTIONS.map((action) => {
                const activeCountForColumn = resources.filter((res) => {
                  const key = `${appId}:${res}:${action}`;
                  return rolePerms.has(key) || rolePerms.has(`${appId}:*:*`);
                }).length;

                return (
                  <ActionHeaderCell
                    key={action}
                    action={action}
                    totalResources={resources.length}
                    activeCount={activeCountForColumn}
                    onToggleColumn={onToggleColumnAction}
                  />
                );
              })}
              <th className="py-3 px-3 text-center min-w-[120px]">
                <span className="font-mono text-[10px] font-bold text-muted-foreground">Tác vụ</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/50 font-sans">
            {filteredResources.length === 0 ? (
              <tr>
                <td
                  colSpan={STANDARD_APP_ACTIONS.length + 2}
                  className="py-12 text-center text-xs text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldAlert className="h-8 w-8 text-muted-foreground/60" />
                    <span>Không tìm thấy tài nguyên nào phù hợp với bộ lọc</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredResources.map((resource) => (
                <PermissionMatrixRow
                  key={resource}
                  appId={appId}
                  resource={resource}
                  actions={STANDARD_APP_ACTIONS}
                  rolePerms={rolePerms}
                  onTogglePerm={onTogglePerm}
                  onGrantAllForResource={onGrantAllForResource}
                  onRevokeAllForResource={onRevokeAllForResource}
                  onGrantReadOnlyForResource={onGrantReadOnlyForResource}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
