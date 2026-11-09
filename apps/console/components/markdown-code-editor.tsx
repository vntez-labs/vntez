"use client";

import React, { useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Check, Copy, FileText, Layers } from "lucide-react";

interface MarkdownCodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  readOnly?: boolean;
  minHeight?: string;
  className?: string;
}

export function MarkdownCodeEditor({
  value,
  onChange,
  readOnly = false,
  minHeight = "480px",
  className = "",
}: MarkdownCodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<any>(null);
  const [copied, setCopied] = useState(false);

  const lineCount = value.split("\n").length;
  const charCount = value.length;

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
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
      {/* Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-muted/40 border-b border-border text-xs">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <span className="font-semibold text-foreground text-xs">
            Trình Soạn Thảo Markdown / MDX
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
            VS Code Engine
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
            <span>{lineCount} dòng</span>
            <span>•</span>
            <span>{charCount} ký tự</span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-card border border-border text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground" />
            )}
            <span>{copied ? "Đã chép" : "Sao chép"}</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="relative w-full flex-1" style={{ minHeight }}>
        <Editor
          height={minHeight}
          language="markdown"
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          value={value}
          onChange={(val) => onChange(val || "")}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            fontSize: 13,
            lineHeight: 20,
            fontFamily:
              "'Fira Code', 'JetBrains Mono', Menlo, Monaco, 'Courier New', monospace",
            minimap: { enabled: false },
            lineNumbers: "on",
            wordWrap: "on",
            wrappingIndent: "indent",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            overviewRulerBorder: false,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            padding: { top: 12, bottom: 12 },
          }}
          loading={
            <div className="h-full flex items-center justify-center p-8 text-xs text-muted-foreground font-mono">
              Đang tải Monaco Markdown Editor...
            </div>
          }
        />
      </div>
    </div>
  );
}
