"use client";

import React, { useState } from "react";
import { Table, Key, ChevronRight, ChevronDown, Play, Search, Database } from "lucide-react";
import type { TableMeta } from "../types";
import { getTableDisplayInfo } from "../database-schema-constants";

interface SqlSchemaSidebarProps {
  tables: TableMeta[];
  onSelectTableQuery: (tableName: string) => void;
  onInsertColumn: (columnName: string) => void;
}

export function SqlSchemaSidebar({
  tables,
  onSelectTableQuery,
  onInsertColumn,
}: SqlSchemaSidebarProps) {
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({
    [tables[0]?.name || "apps"]: true,
  });
  const [filterQuery, setFilterQuery] = useState("");

  const toggleExpand = (tableName: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  const filteredTables = tables.filter((t) =>
    t.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="w-64 shrink-0 flex flex-col border-r border-border bg-card/60 h-full overflow-hidden select-none">
      {/* Sidebar Header */}
      <div className="p-3 border-b border-border/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Schema Bảng ({tables.length})</span>
        </div>
      </div>

      {/* Filter Input */}
      <div className="p-2 border-b border-border/60">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Lọc bảng..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 text-[11px] rounded-lg bg-muted/60 text-foreground border border-input focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Tables and Columns Tree List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1 scrollbar-thin">
        {filteredTables.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Không tìm thấy bảng
          </div>
        ) : (
          filteredTables.map((t) => {
            const isExpanded = !!expandedTables[t.name];
            const info = getTableDisplayInfo(t.name);

            return (
              <div key={t.name} className="rounded-xl overflow-hidden">
                {/* Table Header Row */}
                <div
                  className={`group flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    isExpanded ? "bg-muted text-foreground" : "text-foreground hover:bg-muted/60"
                  }`}
                  onClick={() => toggleExpand(t.name)}
                  title={info.description}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    )}
                    <Table className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="font-semibold truncate text-[11px] font-mono">{t.name}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] text-muted-foreground px-1.5 py-0.2 rounded bg-background/80 font-mono">
                      {t.rowCount}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTableQuery(t.name);
                      }}
                      title={`Chạy truy vấn ${t.name}`}
                      className="p-1 rounded hover:bg-primary hover:text-white text-muted-foreground cursor-pointer transition-colors"
                    >
                      <Play className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Columns List (When Expanded) */}
                {isExpanded && (
                  <div className="pl-6 pr-2 py-1 space-y-0.5 border-l border-border/80 ml-3.5 my-0.5">
                    {t.columns.map((col) => (
                      <div
                        key={col.name}
                        onClick={() => onInsertColumn(col.name)}
                        className="group flex items-center justify-between py-1 px-1.5 rounded hover:bg-muted text-[11px] font-mono text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        title={`Bấm để chèn ${col.name} vào câu truy vấn`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {col.isPrimaryKey ? (
                            <span title="Primary Key">
                              <Key className="h-3 w-3 text-amber-500 shrink-0" />
                            </span>
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                          )}
                          <span className={`truncate ${col.isPrimaryKey ? "font-bold text-foreground" : ""}`}>
                            {col.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground/70 group-hover:text-muted-foreground font-sans truncate shrink-0">
                          {col.format || col.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
