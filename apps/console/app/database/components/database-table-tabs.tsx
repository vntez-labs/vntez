"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Table, ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import type { TableMeta } from "../types";
import { getTableDisplayInfo } from "../database-schema-constants";
import { TableSearchCombobox } from "./table-search-combobox";

interface DatabaseTableTabsProps {
  tables: TableMeta[];
  selectedTable: string;
  onSelectTable: (tableName: string) => void;
  isLoading: boolean;
}

export function DatabaseTableTabs({
  tables,
  selectedTable,
  onSelectTable,
  isLoading,
}: DatabaseTableTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isWrapMode, setIsWrapMode] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Scroll check for scroll mode
  const checkScroll = useCallback(() => {
    if (!scrollRef.current || isWrapMode) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, [isWrapMode]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [tables, isWrapMode, checkScroll]);

  useEffect(() => {
    if (!scrollRef.current || isWrapMode) return;
    const activeEl = scrollRef.current.querySelector<HTMLElement>('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      setTimeout(checkScroll, 200);
    }
  }, [selectedTable, isWrapMode, checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -220 : 220;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    setTimeout(checkScroll, 250);
  };

  if (isLoading && tables.length === 0) {
    return (
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border/70 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8.5 w-24 rounded-xl shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      {/* Top Controls: Dropdown Autocomplete + Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <TableSearchCombobox
            tables={tables}
            selectedTable={selectedTable}
            onSelectTable={onSelectTable}
          />
          <span className="text-xs text-muted-foreground hidden sm:inline">
            (hoặc bấm nhanh thẻ bên dưới)
          </span>
        </div>

        {/* Layout Mode Toggle */}
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-xl border border-border/60">
          <button
            type="button"
            onClick={() => setIsWrapMode(true)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              isWrapMode
                ? "bg-card text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Hiển thị tất cả dạng Flex Wrap (tự xuống dòng, không cần cuộn)"
          >
            <LayoutGrid className="h-3 w-3" />
            <span>Tất cả (Flex)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsWrapMode(false)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              !isWrapMode
                ? "bg-card text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Hiển thị 1 hàng cuộn ngang"
          >
            <List className="h-3 w-3" />
            <span>Cuộn ngang</span>
          </button>
        </div>
      </div>

      {/* Table Pills Container (Flex Wrap or Scrollable) */}
      <div className="relative w-full flex items-center group">
        {!isWrapMode && canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="absolute left-1 z-10 h-7 w-7 rounded-lg bg-card/90 hover:bg-card border border-border shadow-md flex items-center justify-center text-foreground cursor-pointer transition-all hover:scale-105"
            aria-label="Cuộn sang trái"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className={`w-full ${
            isWrapMode
              ? ""
              : "overflow-x-auto scroll-smooth scrollbar-none py-0.5"
          }`}
        >
          <div
            className={`p-1 rounded-2xl bg-muted/60 border border-border/70 shadow-2xs ${
              isWrapMode
                ? "flex flex-wrap items-center gap-1.5"
                : "inline-flex items-center gap-1"
            }`}
          >
            {tables.map((t) => {
              const isSelected = t.name === selectedTable;
              const info = getTableDisplayInfo(t.name);

              return (
                <button
                  key={t.name}
                  type="button"
                  data-active={isSelected ? "true" : "false"}
                  onClick={() => onSelectTable(t.name)}
                  title={info.description}
                  className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-primary text-white font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/70 border border-transparent font-medium"
                  }`}
                >
                  <Table
                    className={`h-3.5 w-3.5 shrink-0 ${
                      isSelected
                        ? "text-white"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <span className="font-semibold tracking-tight">{t.name}</span>

                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full shrink-0 transition-colors ${
                      isSelected
                        ? "bg-white/20 text-white font-bold"
                        : "bg-muted text-muted-foreground font-semibold group-hover:bg-card border border-border/40"
                    }`}
                  >
                    {t.rowCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {!isWrapMode && canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="absolute right-1 z-10 h-7 w-7 rounded-lg bg-card/90 hover:bg-card border border-border shadow-md flex items-center justify-center text-foreground cursor-pointer transition-all hover:scale-105"
            aria-label="Cuộn sang phải"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
