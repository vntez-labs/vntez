"use client";

import React, { useRef, useState, useEffect } from "react";
import { Table, Search, Check, ChevronDown } from "lucide-react";
import type { TableMeta } from "../types";

interface TableSearchComboboxProps {
  tables: TableMeta[];
  selectedTable: string;
  onSelectTable: (tableName: string) => void;
}

export function TableSearchCombobox({
  tables,
  selectedTable,
  onSelectTable,
}: TableSearchComboboxProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  // 1. Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // 2. Ctrl+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredTables = tables.filter((t) =>
    t.name.toLowerCase().includes(filterQuery.toLowerCase())
  );
  const currentTableMeta = tables.find((t) => t.name === selectedTable);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border shadow-2xs hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
        title="Tìm kiếm & chọn nhanh bảng (Phím tắt: Ctrl+K)"
      >
        <Search className="h-3.5 w-3.5 text-primary" />
        <span className="font-mono text-xs font-bold text-foreground">
          {selectedTable || "Chọn bảng dữ liệu..."}
        </span>
        {currentTableMeta && (
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-primary/10 text-primary font-bold">
            {currentTableMeta.rowCount} dòng
          </span>
        )}
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Floating Autocomplete Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-40 w-72 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-xl p-2 space-y-1.5 animate-in fade-in-0 zoom-in-95">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Tìm nhanh bảng (gõ để lọc)..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-muted/60 border border-input focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            />
          </div>
          <div className="max-h-60 overflow-y-auto space-y-0.5 py-1 scrollbar-thin">
            {filteredTables.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                Không tìm thấy bảng phù hợp
              </div>
            ) : (
              filteredTables.map((t) => {
                const isCur = t.name === selectedTable;
                return (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => {
                      onSelectTable(t.name);
                      setIsOpen(false);
                      setFilterQuery("");
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      isCur
                        ? "bg-primary text-white font-semibold"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Table className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      <span className="font-mono text-xs truncate">{t.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          isCur
                            ? "bg-white/20 text-white font-bold"
                            : "bg-muted text-muted-foreground font-semibold"
                        }`}
                      >
                        {t.rowCount}
                      </span>
                      {isCur && <Check className="h-3.5 w-3.5 shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
