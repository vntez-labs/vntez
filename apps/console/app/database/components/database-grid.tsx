"use client";

import React from "react";
import { Edit2, Trash2, Key, Check, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { TableMeta } from "../types";

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

  const formatCellValue = (val: any) => {
    if (val === null || val === undefined) {
      return <span className="text-[11px] font-mono text-zinc-400 italic">NULL</span>;
    }
    if (typeof val === "boolean") {
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
            val ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          }`}
        >
          {val ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          {String(val)}
        </span>
      );
    }
    if (typeof val === "object") {
      const isArr = Array.isArray(val);
      return (
        <span
          className="inline-flex items-center px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-600 dark:text-zinc-300 max-w-[140px] truncate"
          title={JSON.stringify(val, null, 2)}
        >
          {isArr ? `[${val.length} items]` : "{...}"}
        </span>
      );
    }
    return (
      <span className="font-mono text-xs text-foreground truncate block max-w-[200px]" title={String(val)}>
        {String(val)}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 rounded-3xl bg-white dark:bg-[#0c121e] border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden shadow-xs">
      {/* Scrollable Data Table Container */}
      <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[600px]">
        <table className="w-full border-collapse text-left text-xs min-w-full">
          {/* Table Header */}
          <thead className="sticky top-0 z-10 bg-zinc-50 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800">
            <tr>
              <th className="w-10 px-3 py-3 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-zinc-300 text-primary focus:ring-primary cursor-pointer size-4"
                  title="Chọn tất cả các dòng"
                />
              </th>
              {tableMeta.columns.map((col) => (
                <th key={col.name} className="px-4 py-3 whitespace-nowrap font-medium text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-mono">
                    {col.isPrimaryKey && (
                      <span title="Primary Key">
                        <Key className="h-3 w-3 text-amber-500" />
                      </span>
                    )}
                    <span className="font-semibold text-foreground text-xs">{col.name}</span>
                    <span className="text-[10px] text-muted-foreground/60">({col.format || col.type})</span>
                  </div>
                </th>
              ))}
              <th className="w-24 px-4 py-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                Thao tác
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {isLoading ? (
              <tr>
                <td colSpan={tableMeta.columns.length + 2} className="py-20 text-center text-muted-foreground">
                  Đang tải dữ liệu bảng {tableMeta.name}...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={tableMeta.columns.length + 2} className="py-20 text-center text-muted-foreground">
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
                        : "hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    <td className="px-3 py-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(pkValue)}
                        className="rounded border-zinc-300 text-primary focus:ring-primary cursor-pointer size-4"
                      />
                    </td>
                    {tableMeta.columns.map((col) => (
                      <td key={col.name} className="px-4 py-2.5 whitespace-nowrap max-w-[220px]">
                        {formatCellValue(row[col.name])}
                      </td>
                    ))}
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditRow(row)}
                          className="h-7 w-7 p-0 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Chỉnh sửa dòng"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteSingle(pkValue)}
                          className="h-7 w-7 p-0 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-600 dark:hover:bg-rose-950/40 cursor-pointer"
                          title="Xóa dòng này"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs">
        <span className="text-muted-foreground font-mono">
          Hiển thị <strong>{rows.length}</strong> / <strong>{totalCount}</strong> dòng
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
            className="h-8 px-3 rounded-xl cursor-pointer"
          >
            Trang trước
          </Button>
          <span className="font-mono px-2 text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || isLoading}
            onClick={() => onPageChange(page + 1)}
            className="h-8 px-3 rounded-xl cursor-pointer"
          >
            Trang sau
          </Button>
        </div>
      </div>
    </div>
  );
}
