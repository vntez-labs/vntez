"use client";

import React from "react";

interface MarkdownToolbarProps {
  onInsert: (prefix: string, suffix?: string) => void;
}

export function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        onClick={() => onInsert("# ")}
        className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-[11px] font-mono cursor-pointer"
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => onInsert("## ")}
        className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-[11px] font-mono cursor-pointer"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => onInsert("**", "**")}
        className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-[11px] font-mono font-bold cursor-pointer"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => onInsert("*", "*")}
        className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-[11px] font-mono italic cursor-pointer"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => onInsert("```typescript\n", "\n```")}
        className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-[11px] font-mono cursor-pointer"
      >
        Code
      </button>
      <button
        type="button"
        onClick={() => onInsert("> ")}
        className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-[11px] font-mono cursor-pointer"
      >
        Quote
      </button>
      <button
        type="button"
        onClick={() => onInsert("- ")}
        className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-[11px] font-mono cursor-pointer"
      >
        List
      </button>
    </div>
  );
}
