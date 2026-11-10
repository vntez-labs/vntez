"use client";

import React from "react";
import { Edit2, Trash2, Key } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Skeleton } from "@workspace/ui/components/skeleton";
import type { TableMeta } from "../types";
import { formatDatabaseCell, getColumnTypeBadge } from "./database-cell-formatter";

interface DatabaseGridProps {
  tableMeta: TableMeta;
  rows: Record<string, any>[];
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  selectedPks: Set<string>;
  onToggleSelectRow: (pkValue: string) => void;
  onToggleSelectAll: () => void;
  onEditRow: (row: Record<string, any>) => void;
  onDeleteSingle: (pkValue: string) => void;
  isLoading: boolean;
}

export function DatabaseGrid({
  tableMeta,
  rows,
  totalCount,
  page,
  limit,
  onPageChange,
  selectedPks,
  onToggleSelectRow,
  onToggleSelectAll,
  onEditRow,
  onDeleteSingle,
  isLoading,
}: DatabaseGridProps) {
  const pkField = tableMeta.primaryKey;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const isAllSelected = rows.length > 0 && rows.every((r) => selectedPks.has(String(r[pkField])));

  return (
    <div className="flex-1 flex flex-col min-w-0 rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
      {/* Scrollable Data Table Container */}
      <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[640px]">
        <table className="w-full border-collapse text-left text-sm min-w-full">
          {/* Table Header */}
          <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur-md border-b border-border">
            <tr>
              <th className="w-12 px-3.5 py-3.5 text-center">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={onToggleSelectAll}
                  title="Chọn tất cả các dòng"
                />
              </th>
              {tableMeta.columns.map((col) => (
                <th key={col.name} className="px-4 py-3.5 whitespace-nowrap font-medium text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    {col.isPrimaryKey && (
                      <span title="Khóa chính (Primary Key)">
                        <Key className="h-3.5 w-3.5 text-amber-500" />
                      </span>
                    )}
                    <span className="font-bold text-foreground text-sm tracking-tight">{col.name}</span>
                    {getColumnTypeBadge(col)}
                  </div>
                </th>
              ))}
              <th className="w-24 px-4 py-3.5 text-right font-semibold text-muted-foreground whitespace-nowrap text-sm">
                Thao tác
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, rIdx) => (
                <tr key={rIdx}>
                  <td className="px-3.5 py-3.5 text-center">
                    <Skeleton className="h-4 w-4 rounded mx-auto" />
                  </td>
                  {tableMeta.columns.map((col) => (
                    <td key={col.name} className="px-4 py-3.5">
                      <Skeleton className="h-5 w-28 rounded" />
                    </td>
                  ))}
                  <td className="px-4 py-3.5 text-right">
                    <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
                  </td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={tableMeta.columns.length + 2} className="py-20 text-center text-sm text-muted-foreground">
                  Bảng này hiện chưa có dòng dữ liệu nào.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const pkValue = String(row[pkField]);
                const isSelected = selectedPks.has(pkValue);

                return (
                  <tr
                    key={pkValue}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    <td className="px-3.5 py-3.5 text-center">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelectRow(pkValue)}
                      />
                    </td>
                    {tableMeta.columns.map((col) => (
                      <td key={col.name} className="px-4 py-3.5 whitespace-nowrap max-w-[340px]">
                        {formatDatabaseCell(row[col.name], col.name, col.isPrimaryKey)}
                      </td>
                    ))}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditRow(row)}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Chỉnh sửa dòng"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteSingle(pkValue)}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 dark:hover:bg-rose-950/40 cursor-pointer"
                          title="Xóa dòng này"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-t border-border bg-card text-sm">
        <span className="text-muted-foreground font-medium">
          Trang hiện tại: <strong className="text-foreground font-bold">{rows.length}</strong> dòng / Tổng: <strong className="text-foreground font-bold">{totalCount}</strong> dòng
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
            className="h-8.5 px-3.5 text-xs font-semibold rounded-xl cursor-pointer"
          >
            Trang trước
          </Button>
          <span className="font-mono text-xs px-2 text-muted-foreground font-semibold">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || isLoading}
            onClick={() => onPageChange(page + 1)}
            className="h-8.5 px-3.5 text-xs font-semibold rounded-xl cursor-pointer"
          >
            Trang sau
          </Button>
        </div>
      </div>
    </div>
  );
}
