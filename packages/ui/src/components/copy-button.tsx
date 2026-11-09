"use client";

import React from "react";
import { Check, Copy } from "lucide-react";
import { useClipboard } from "@workspace/ui/hooks/use-clipboard";
import { cn } from "@workspace/ui/lib/utils";

export interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  showToast?: boolean;
  toastMessage?: string;
  className?: string;
  iconSize?: number;
}

export function CopyButton({
  text,
  label,
  copiedLabel,
  showToast = true,
  toastMessage = "Đã sao chép vào bộ nhớ tạm",
  className = "",
  iconSize = 14,
}: CopyButtonProps) {
  const { copy, copied } = useClipboard({ showToast, toastMessage });

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        copy(text);
      }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer",
        copied
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          : "bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border shadow-2xs",
        className
      )}
      title="Sao chép vào bộ nhớ tạm"
      aria-label="Sao chép vào bộ nhớ tạm"
    >
      {copied ? (
        <Check style={{ width: iconSize, height: iconSize }} className="shrink-0 text-emerald-500 animate-in zoom-in-50 duration-150" />
      ) : (
        <Copy style={{ width: iconSize, height: iconSize }} className="shrink-0" />
      )}
      {(label || copiedLabel) && (
        <span className="text-[11px] select-none">
          {copied ? (copiedLabel || label || "Đã sao chép") : label}
        </span>
      )}
    </button>
  );
}
