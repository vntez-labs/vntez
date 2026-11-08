"use client";

import React, { useState, useRef, useMemo } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import {
  IconCheck,
  IconCopy,
  IconSparkles,
  IconAlertCircle,
  IconCode,
} from "@tabler/icons-react";

interface JsonCodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  readOnly?: boolean;
  minHeight?: string;
  className?: string;
}

export function JsonCodeEditor({
  value,
  onChange,
  readOnly = false,
  minHeight = "280px",
  className = "",
}: JsonCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  // Validate JSON in real-time
  const validation = useMemo(() => {
    if (!value.trim()) {
      return { isValid: true, error: null };
    }
    try {
      JSON.parse(value);
      return { isValid: true, error: null };
    } catch (err: unknown) {
      return {
        isValid: false,
        error: err instanceof Error ? err.message : "Cú pháp JSON không hợp lệ",
      };
    }
  }, [value]);

  // Synchronize scrolling between textarea and highlighted <pre>
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Syntax highlighting via PrismJS
  const highlightedCode = useMemo(() => {
    try {
      const grammar = Prism.languages.json;
      if (!grammar) return value;
      return Prism.highlight(value || " ", grammar, "json");
    } catch {
      return value;
    }
  }, [value]);

  // Format / Pretty-print JSON
  const handleFormat = () => {
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(formatted);
    } catch {
      // Keep as-is if invalid
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Line numbers calculation
  const linesCount = useMemo(() => {
    return Math.max(1, value.split("\n").length);
  }, [value]);

  return (
    <div
      className={`relative rounded-2xl border border-border bg-zinc-950 text-zinc-100 shadow-sm overflow-hidden flex flex-col ${className}`}
    >
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs">
          <IconCode className="h-4 w-4 text-primary" />
          <span className="font-mono font-semibold text-zinc-300">
            JSON Editor
          </span>
          <span className="text-zinc-600">•</span>
          {validation.isValid ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <IconCheck className="h-3 w-3" />
              <span>Hợp lệ</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-400 truncate max-w-[200px] sm:max-w-xs"
              title={validation.error || ""}
            >
              <IconAlertCircle className="h-3 w-3 shrink-0" />
              <span>{validation.error}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {!readOnly && (
            <button
              type="button"
              onClick={handleFormat}
              disabled={!validation.isValid}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Tự động căn lề và làm đẹp JSON"
            >
              <IconSparkles className="h-3 w-3 text-amber-400" />
              <span>Format</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
            title="Sao chép nội dung"
          >
            {copied ? (
              <>
                <IconCheck className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Đã chép</span>
              </>
            ) : (
              <>
                <IconCopy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Body: Line numbers + Synchronized Syntax Highlighting */}
      <div className="relative flex flex-1 overflow-hidden" style={{ minHeight }}>
        {/* Line Numbers Gutter */}
        <div
          className="select-none py-3 pl-3 pr-2 font-mono text-xs text-zinc-600 bg-zinc-950/60 border-r border-zinc-850 text-right shrink-0"
          aria-hidden="true"
        >
          {Array.from({ length: linesCount }).map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Editor Area */}
        <div className="relative flex-1 overflow-hidden">
          {/* Syntax highlighted pre layer */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 m-0 overflow-hidden p-3 font-mono text-xs leading-6 text-zinc-200 whitespace-pre tab-2"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />

          {/* Editable Transparent Textarea Layer */}
          <textarea
            ref={textareaRef}
            value={value}
            readOnly={readOnly}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="absolute inset-0 m-0 h-full w-full resize-none border-0 bg-transparent p-3 font-mono text-xs leading-6 text-transparent caret-white outline-none selection:bg-primary/30 whitespace-pre tab-2"
            placeholder={'{\n  "key": "value"\n}'}
          />
        </div>
      </div>
    </div>
  );
}
