"use client";

import React, { useState, useEffect } from "react";
import { X, Play, RotateCcw, Terminal, Database, ExternalLink } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { api } from "@workspace/ui/lib/api-client";
import { SqlSchemaSidebar } from "./sql-schema-sidebar";
import { SqlCodeEditor } from "./sql-code-editor";
import { SqlResultsViewer } from "./sql-results-viewer";
import type { SqlQueryResult } from "@/lib/sql-executor";
import type { TableMeta } from "../types";
import { generateSelectQuery } from "../database-schema-constants";

interface DatabaseSqlRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables?: TableMeta[];
  defaultTable?: string;
  onTableMutated?: () => void;
}

export function DatabaseSqlRunnerModal({
  isOpen,
  onClose,
  tables = [],
  defaultTable,
  onTableMutated,
}: DatabaseSqlRunnerModalProps) {
  const initialSql = defaultTable
    ? generateSelectQuery(defaultTable, 20)
    : generateSelectQuery("apps", 20);

  const [sql, setSql] = useState(initialSql);
  const [result, setResult] = useState<SqlQueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExecute = async (queryToRun?: string) => {
    const q = (queryToRun || sql).trim();
    if (!q) return;
    setIsExecuting(true);
    try {
      const data = await api.post<SqlQueryResult>("/api/database/query", { query: q });
      setResult(data);

      const lower = q.toLowerCase();
      if (lower.startsWith("insert") || lower.startsWith("update") || lower.startsWith("delete")) {
        onTableMutated?.();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể gửi câu truy vấn";
      setResult({ success: false, error: msg });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSelectTableQuery = (tableName: string) => {
    const newQuery = generateSelectQuery(tableName, 20);
    setSql(newQuery);
    handleExecute(newQuery);
  };

  const handleInsertColumn = (columnName: string) => {
    setSql((prev) => `${prev.trimEnd()} ${columnName}`);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-6xl h-[90vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm text-foreground">
                  SQL Query Editor
                </h3>
                <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/60">
                  Postgres 15 NVMe
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://supabase.com/dashboard/project/stbswcnsitztbusqrdhi/sql/new"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 h-8.5 px-3 text-xs font-medium rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Mở Supabase Studio SQL Editor chính thức"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Supabase Studio</span>
            </a>

            <Button
              size="sm"
              onClick={() => handleExecute()}
              disabled={isExecuting || !sql.trim()}
              className="h-8.5 px-3.5 text-xs font-semibold gap-1.5 shadow-xs cursor-pointer bg-primary text-white hover:bg-primary/90"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isExecuting ? "Đang chạy..." : "Thực thi (Ctrl+Enter)"}</span>
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Body: Left Schema Tree + Right Editor & Results */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left: Schema & Tables Explorer */}
          <SqlSchemaSidebar
            tables={tables}
            onSelectTableQuery={handleSelectTableQuery}
            onInsertColumn={handleInsertColumn}
          />

          {/* Right: Workspace Editor & Execution Results */}
          <div className="flex-1 flex flex-col min-w-0 p-4 space-y-3.5 overflow-y-auto">
            {/* SQL Code Editor with Monaco and line numbers */}
            <div className="shrink-0">
              <SqlCodeEditor
                value={sql}
                onChange={setSql}
                onExecute={() => handleExecute()}
                tables={tables}
                height="280px"
              />
            </div>

            {/* Execution Status & Results Viewer */}
            <div className="flex-1 min-h-[220px] flex flex-col space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Kết quả Truy vấn</span>
                {result?.executionTimeMs !== undefined && (
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Thời gian: {result.executionTimeMs}ms • {result.rowCount ?? 0} dòng
                  </span>
                )}
              </div>
              <SqlResultsViewer result={result} isLoading={isExecuting} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
