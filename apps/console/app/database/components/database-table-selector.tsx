"use client";

import React, { useState } from "react";
import { Table, Search, RefreshCw, FileCode, Database } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { TableMeta } from "../types";

interface DatabaseTableSelectorProps {
  tables: TableMeta[];
  selectedTable: string;
  onSelectTable: (tableName: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenSqlModal: () => void;
}

export function DatabaseTableSelector({
  tables,
  selectedTable,
  onSelectTable,
  onRefresh,
  isLoading,
  onOpenSqlModal,
}: DatabaseTableSelectorProps) {
  const [filterQuery, setFilterQuery] = useState("");

  const filteredTables = tables.filter((t) =>
    t.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="w-full lg:w-72 shrink-0 flex flex-col rounded-3xl bg-white dark:bg-[#0c121e] border border-zinc-200/70 dark:border-zinc-800/70 p-4 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          <h3 className="font-display font-bold text-sm text-foreground">
            Bảng Dữ liệu ({tables.length})
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-7 w-7 p-0 rounded-lg cursor-pointer"
          title="Tải lại danh sách bảng"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Lọc tên bảng..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900/60 text-foreground border border-zinc-200/80 dark:border-zinc-800 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Tables List */}
      <div className="space-y-1 max-h-[460px] overflow-y-auto pr-1">
        {filteredTables.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Không tìm thấy bảng nào
          </div>
        ) : (
          filteredTables.map((t) => {
            const isSelected = t.name === selectedTable;
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => onSelectTable(t.name)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-mono transition-all text-left cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white font-semibold shadow-xs"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Table className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                  <span className="truncate">{t.name}</span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-sans shrink-0 ${
                    isSelected
                      ? "bg-white/20 text-white font-bold"
                      : "bg-zinc-100 dark:bg-zinc-800 text-muted-foreground"
                  }`}
                >
                  {t.rowCount}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* SQL Migration Helper button */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <button
          type="button"
          onClick={onOpenSqlModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-primary hover:bg-primary/10 transition-colors border border-dashed border-primary/30 cursor-pointer"
        >
          <FileCode className="h-3.5 w-3.5" />
          <span>Tạo Bảng (Apps & Blog SQL)</span>
        </button>
      </div>
    </div>
  );
}
