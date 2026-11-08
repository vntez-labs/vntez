"use client";

import React, { useState } from "react";
import { Table, Search, RefreshCw, FileCode, Database, Terminal } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import type { TableMeta } from "../types";

interface DatabaseTableSelectorProps {
  tables: TableMeta[];
  selectedTable: string;
  onSelectTable: (tableName: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenSqlModal: () => void;
  onOpenSqlRunner?: () => void;
}

function getTableDisplayInfo(name: string): { display: string; tag?: string } {
  if (name === "oauth_client_requests") {
    return { display: "app_requests", tag: "oauth_client_requests" };
  }
  if (name === "oauth_clients") {
    return { display: "oauth_clients", tag: "Đã gộp vào apps" };
  }
  if (name === "apps") {
    return { display: "apps", tag: "Apps & OAuth" };
  }
  return { display: name };
}

export function DatabaseTableSelector({
  tables,
  selectedTable,
  onSelectTable,
  onRefresh,
  isLoading,
  onOpenSqlModal,
  onOpenSqlRunner,
}: DatabaseTableSelectorProps) {
  const [filterQuery, setFilterQuery] = useState("");

  const filteredTables = tables.filter((t) =>
    t.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="w-full lg:w-72 shrink-0 flex flex-col rounded-3xl bg-card border border-border p-4 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
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
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-card text-foreground border border-input shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Tables List */}
      <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-xl" />
          ))
        ) : filteredTables.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Không tìm thấy bảng nào
          </div>
        ) : (
          filteredTables.map((t) => {
            const isSelected = t.name === selectedTable;
            const info = getTableDisplayInfo(t.name);
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => onSelectTable(t.name)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-mono transition-all text-left cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white font-semibold shadow-xs"
                    : "text-foreground hover:bg-muted/80"
                }`}
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  <Table className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                  <span className="truncate">{info.display}</span>
                  {info.tag && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-sans shrink-0 truncate max-w-[85px] ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                      title={info.tag}
                    >
                      {info.tag}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-sans shrink-0 ${
                    isSelected
                      ? "bg-white/20 text-white font-bold"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {t.rowCount}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Action Footer Buttons */}
      <div className="pt-2 border-t border-border space-y-2">
        <Button
          type="button"
          onClick={onOpenSqlRunner}
          className="w-full text-xs font-semibold rounded-xl h-9 gap-1.5 cursor-pointer shadow-xs"
        >
          <Terminal className="h-4 w-4" />
          <span>Thực thi SQL Trực tiếp</span>
        </Button>
        <button
          type="button"
          onClick={onOpenSqlModal}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-dashed border-border cursor-pointer"
        >
          <FileCode className="h-3.5 w-3.5 text-primary" />
          <span>Xem Script Tạo Bảng DDL</span>
        </button>
      </div>
    </div>
  );
}
