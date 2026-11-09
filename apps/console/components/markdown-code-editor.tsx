"use client";

import React, { useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Check, Copy, FileText, ZoomIn, ZoomOut } from "lucide-react";

interface MarkdownCodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  readOnly?: boolean;
  minHeight?: string;
  className?: string;
  borderless?: boolean;
  editorRef?: React.MutableRefObject<any>;
  onMount?: (editor: any, monaco: any) => void;
}

export function MarkdownCodeEditor({
  value,
  onChange,
  readOnly = false,
  minHeight = "480px",
  className = "",
  borderless = false,
  editorRef,
  onMount,
}: MarkdownCodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const internalEditorRef = useRef<any>(null);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(15);

  const lineCount = value.split("\n").length;
  const charCount = value.length;

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    internalEditorRef.current = editor;
    if (editorRef) {
      editorRef.current = editor;
    }
    onMount?.(editor, monaco);
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
      {/* Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-muted/30 border-b border-border text-xs shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <span className="font-semibold text-foreground text-xs">
            Trình Soạn Thảo Markdown / MDX
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
            VS Code Engine
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground hidden sm:flex">
            <span>{lineCount} dòng</span>
            <span>•</span>
            <span>{charCount} ký tự</span>
          </div>

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

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-card border border-border text-foreground hover:bg-muted transition-colors cursor-pointer shadow-2xs"
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
      <div className="relative w-full flex-1 min-h-[300px]" style={{ minHeight }}>
        <Editor
          height="100%"
          language="markdown"
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          value={value}
          onChange={(val) => onChange(val || "")}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            fontSize,
            lineHeight: Math.round(fontSize * 1.65),
            letterSpacing: 0.3,
            fontFamily:
              "var(--font-mono, 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, Monaco, Consolas, monospace)",
            minimap: { enabled: false },
            lineNumbers: "on",
            wordWrap: "on",
            wrappingIndent: "indent",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            overviewRulerBorder: false,
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
