"use client";

import React, { useRef, useEffect } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Trash2, Terminal } from "lucide-react";
import type { TableMeta } from "../types";
import { SQL_KEYWORDS, getTableDisplayInfo } from "../database-schema-constants";

interface SqlCodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  onExecute: () => void;
  tables?: TableMeta[];
  height?: string;
}

export function SqlCodeEditor({
  value,
  onChange,
  onExecute,
  tables = [],
  height = "280px",
}: SqlCodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<any>(null);
  const providerRef = useRef<any>(null);
  const onExecuteRef = useRef(onExecute);
  onExecuteRef.current = onExecute;

  useEffect(() => {
    return () => {
      providerRef.current?.dispose();
    };
  }, []);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Bind Ctrl+Enter or Cmd+Enter to execute query
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onExecuteRef.current();
    });

    // Dispose prior completion provider if mounted multiple times
    if (providerRef.current) {
      providerRef.current.dispose();
    }

    // Register SQL IntelliSense completion provider with database context
    providerRef.current = monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions: any[] = [];

        // 1. Database Tables Context with centralized metadata
        tables.forEach((t) => {
          const info = getTableDisplayInfo(t.name);
          suggestions.push({
            label: t.name,
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: t.name,
            detail: `Bảng [${info.tag}] (${t.rowCount} dòng)`,
            documentation: `${info.description}\n\nCác cột: ${t.columns.map((c) => c.name).join(", ")}`,
            range,
          });

          // 2. Table.Column Context
          t.columns.forEach((c) => {
            suggestions.push({
              label: `${t.name}.${c.name}`,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: `${t.name}.${c.name}`,
              detail: `${c.format || c.type} ${c.isPrimaryKey ? "(PK)" : ""}`,
              documentation: `Cột thuộc bảng ${t.name} (${c.type})`,
              range,
            });

            suggestions.push({
              label: c.name,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: c.name,
              detail: `${t.name}.${c.name} (${c.type})`,
              range,
            });
          });
        });

        // 3. Centralized SQL Keywords
        SQL_KEYWORDS.forEach((kw) => {
          suggestions.push({
            label: kw,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: kw + " ",
            range,
          });
        });

        // Deduplicate suggestions
        const uniqueMap = new Map<string, any>();
        suggestions.forEach((s) => {
          if (!uniqueMap.has(s.label)) {
            uniqueMap.set(s.label, s);
          }
        });

        return { suggestions: Array.from(uniqueMap.values()) };
      },
    });
  };

  const monacoTheme = resolvedTheme === "dark" ? "vs-dark" : "light";

  return (
    <div className="rounded-2xl border border-border bg-[#1e1e1e] dark:bg-[#1e1e1e] shadow-inner overflow-hidden flex flex-col">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-zinc-800 bg-zinc-900/90 text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold text-zinc-200">Monaco SQL Editor</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-500">Postgres Dialect</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-500 hidden sm:inline">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Ctrl</kbd> +{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Enter</kbd> để chạy
          </span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="hover:text-zinc-200 p-1 rounded transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
            title="Xóa trắng câu truy vấn"
          >
            <Trash2 className="h-3 w-3" />
            <span className="hidden sm:inline">Xóa</span>
          </button>
        </div>
      </div>

      {/* Official Monaco VS Code Editor */}
      <div style={{ height }} className="w-full relative">
        <Editor
          height="100%"
          language="sql"
          theme={monacoTheme}
          value={value}
          onChange={(newVal) => onChange(newVal || "")}
          onMount={handleEditorDidMount}
          loading={
            <div className="h-full w-full bg-[#1e1e1e] flex items-center justify-center text-xs text-zinc-400 font-mono">
              Đang khởi tạo Monaco VS Code Editor...
            </div>
          }
          options={{
            fontSize: 14,
            fontFamily: "var(--font-mono, 'Fira Code', 'JetBrains Mono', Menlo, Consolas, monospace)",
            fontLigatures: true,
            lineNumbers: "on",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: "all",
            suggestOnTriggerCharacters: true,
            quickSuggestions: { other: true, comments: false, strings: true },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
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
