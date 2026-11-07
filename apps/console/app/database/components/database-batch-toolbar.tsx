"use client";

import React from "react";
import { Trash2, X, CheckSquare, Loader2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface DatabaseBatchToolbarProps {
  selectedCount: number;
  tableName: string;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  isDeleting: boolean;
}

export function DatabaseBatchToolbar({
  selectedCount,
  tableName,
  onClearSelection,
  onDeleteSelected,
  isDeleting,
}: DatabaseBatchToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-5 py-3 rounded-2xl shadow-2xl border border-zinc-800 dark:border-zinc-200 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2 text-xs font-semibold">
        <CheckSquare className="h-4 w-4 text-primary" />
        <span>
          Đã chọn <strong className="font-mono text-primary">{selectedCount}</strong> dòng trong bảng{" "}
          <strong className="font-mono">{tableName}</strong>
        </span>
      </div>

      <div className="h-4 w-px bg-zinc-700 dark:bg-zinc-300" />

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={isDeleting}
          className="h-8 px-3 rounded-xl text-xs text-zinc-300 hover:text-white dark:text-zinc-600 dark:hover:text-zinc-900 cursor-pointer"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          <span>Bỏ chọn</span>
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={onDeleteSelected}
          disabled={isDeleting}
          className="h-8 px-3.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-sm gap-1.5"
        >
          {isDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
          <span>Xóa {selectedCount} dòng</span>
        </Button>
      </div>
    </div>
  );
}
