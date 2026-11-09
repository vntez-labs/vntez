"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal, Code2 } from "lucide-react";
import type { TabbedCodeBlockData } from "./mdx-parser-utils";

export function CodeFenceBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 text-xs font-mono shadow-xs">
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-400">
        <span className="font-semibold uppercase tracking-wider">{lang || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? "Đã chép" : "Sao chép"}</span>
        </button>
      </div>
      <pre className="p-3.5 text-zinc-200 overflow-x-auto leading-relaxed whitespace-pre font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function AsciiDiagramBlock({ diagram }: { diagram: string }) {
  return (
    <div className="my-4 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-xs">
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/90 border-b border-zinc-800 text-[10px] text-zinc-400">
        <div className="flex items-center gap-1.5 font-mono text-zinc-300">
          <Terminal className="h-3 w-3 text-primary" />
          <span>Sơ đồ Quy trình Tuần tự (Sequence Flow)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-rose-500/80" />
          <span className="h-2 w-2 rounded-full bg-amber-500/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
        </div>
      </div>
      <pre className="p-4 text-emerald-400 overflow-x-auto whitespace-pre font-mono text-[11px] leading-tight select-all">
        {diagram}
      </pre>
    </div>
  );
}

export function InteractiveTabbedCodeBlock({ data }: { data: TabbedCodeBlockData }) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeTab = data.tabs[activeTabIdx] || data.tabs[0];
  const handleCopy = () => {
    if (!activeTab) return;
    navigator.clipboard.writeText(activeTab.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-xs text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold text-zinc-200 text-[11px]">{data.title}</span>
        </div>

        <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
          {data.tabs.map((tab, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTabIdx(idx)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                idx === activeTabIdx
                  ? "bg-zinc-800 text-white font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? "Đã chép" : "Sao chép"}</span>
        </button>
      </div>

      <pre className="p-3.5 text-zinc-200 overflow-x-auto leading-relaxed whitespace-pre font-mono text-[11px]">
        <code>{activeTab?.code || ""}</code>
      </pre>
    </div>
  );
}
