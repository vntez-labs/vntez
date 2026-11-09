"use client";

import React, { useRef, useState, useMemo } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Check, Copy, Sparkles, Code2, AlertCircle } from "lucide-react";

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
  minHeight = "340px",
  className = "",
}: JsonCodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<any>(null);
  const [copied, setCopied] = useState(false);

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

  return (
    <div
      className={`rounded-2xl border border-border bg-card shadow-xs overflow-hidden flex flex-col ${className}`}
    >
      {/* Editor Header Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-2.5 backdrop-blur-md">
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

        <div className="flex items-center gap-1.5">
          {!readOnly && (
            <button
              type="button"
              onClick={handleFormat}
              disabled={!validation.isValid}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-card border border-border hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-40"
              title="Tự động căn lề và định dạng JSON"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Format</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-card border border-border hover:bg-muted text-foreground transition-colors cursor-pointer"
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
      <div className="w-full relative" style={{ height: minHeight }}>
        <Editor
          height={minHeight}
          language="json"
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          value={value}
          onChange={(val) => onChange(val || "")}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            fontSize: 13,
            fontFamily: "var(--font-mono, 'Fira Code', 'JetBrains Mono', Consolas, monospace)",
            lineHeight: 22,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
}
