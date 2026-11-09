"use client";

import React, { useRef, useState, useMemo } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Check, Copy, Sparkles, Code2, AlertCircle, ZoomIn, ZoomOut } from "lucide-react";

interface JsonCodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  readOnly?: boolean;
  minHeight?: string;
  className?: string;
  borderless?: boolean;
}

export function JsonCodeEditor({
  value,
  onChange,
  readOnly = false,
  minHeight = "340px",
  className = "",
  borderless = false,
}: JsonCodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<any>(null);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(15);

  const validation = useMemo(() => {
    if (!value.trim()) return { isValid: true, error: null };
    try {
      JSON.parse(value);
      return { isValid: true, error: null };
    } catch (err) {
      return {
        isValid: false,
        error: err instanceof Error ? err.message : "Cú pháp JSON không hợp lệ",
      };
    }
  }, [value]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument")?.run();
    } else {
      try {
        const parsed = JSON.parse(value);
        onChange(JSON.stringify(parsed, null, 2));
      } catch {
        // Keep as-is if invalid
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const zoomIn = () => setFontSize((prev) => Math.min(prev + 1, 20));
  const zoomOut = () => setFontSize((prev) => Math.max(prev - 1, 12));

  return (
    <div
      className={`bg-card flex flex-col h-full w-full ${
        borderless
          ? ""
          : "rounded-2xl border border-border shadow-xs overflow-hidden"
      } ${className}`}
    >
      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5 backdrop-blur-xs gap-2 shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="font-mono font-semibold text-foreground">
            JSON Schema & Runtime Payload
          </span>
          <span className="text-muted-foreground/60">•</span>
          {validation.isValid ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              <Check className="h-3 w-3" />
              <span>Hợp lệ</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-500 truncate max-w-xs"
              title={validation.error || ""}
            >
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{validation.error}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Font Size Zoom Controller */}
          <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60 text-[11px] font-mono">
            <button
              type="button"
              onClick={zoomOut}
              className="p-1 rounded hover:bg-card text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="Giảm cỡ chữ (A-)"
            >
              <ZoomOut className="h-3 w-3" />
            </button>
            <span className="px-1 font-semibold text-foreground select-none" title="Cỡ chữ hiện tại">
              {fontSize}px
            </span>
            <button
              type="button"
              onClick={zoomIn}
              className="p-1 rounded hover:bg-card text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="Tăng cỡ chữ (A+)"
            >
              <ZoomIn className="h-3 w-3" />
            </button>
          </div>

          {!readOnly && (
            <button
              type="button"
              onClick={handleFormat}
              disabled={!validation.isValid}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-card border border-border hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-40 shadow-2xs"
              title="Tự động căn lề và định dạng JSON"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Format</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-card border border-border hover:bg-muted text-foreground transition-colors cursor-pointer shadow-2xs"
            title="Sao chép nội dung"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="w-full relative flex-1" style={{ minHeight }}>
        <Editor
          height={minHeight}
          language="json"
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          value={value}
          onChange={(val) => onChange(val || "")}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            fontSize,
            fontFamily: "var(--font-mono, 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace)",
            lineHeight: Math.round(fontSize * 1.65),
            letterSpacing: 0.3,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 14, bottom: 14 },
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>
    </div>
  );
}
