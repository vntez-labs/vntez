"use client";

import React from "react";
import { getActionTheme } from "./resource-display-utils";

interface ActionHeaderCellProps {
  action: string;
  totalResources: number;
  activeCount: number;
  onToggleColumn: (action: string) => void;
}

export function ActionHeaderCell({
  action,
  totalResources,
  activeCount,
  onToggleColumn,
}: ActionHeaderCellProps) {
  const theme = getActionTheme(action);
  const isAllActive = totalResources > 0 && activeCount === totalResources;
  const isPartial = activeCount > 0 && activeCount < totalResources;

  return (
    <th className="py-3 px-2 text-center min-w-[92px] select-none">
      <button
        type="button"
        onClick={() => onToggleColumn(action)}
        className="group inline-flex flex-col items-center gap-1 p-1 rounded-xl hover:bg-muted/60 transition-all cursor-pointer w-full"
        title={`Bấm để ${isAllActive ? "hủy chọn" : "chọn tất cả"} cho cột [${action}]`}
      >
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider border transition-transform group-hover:scale-105 ${theme.badgeClass}`}
        >
          {theme.category}
        </span>
        <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground group-hover:text-foreground">
          <span>{theme.subLabel}</span>
          <span
            className={`text-[9px] px-1 py-0.2 rounded-full font-semibold ${
              isAllActive
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                : isPartial
                ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                : "bg-muted text-muted-foreground/70"
            }`}
          >
            {activeCount}/{totalResources}
          </span>
        </div>
      </button>
    </th>
  );
}
