"use client";

import React, { useState } from "react";
import {
  Search,
  Table as TableIcon,
  Code,
  AlertCircle,
  Check,
  Copy,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { TableResponse } from "../tables-types";

interface TablesDataViewProps {
  tableData: TableResponse | null;
  selectedTable: string;
  isLoading: boolean;
}

export function TablesDataView({
  tableData,
  selectedTable,
  isLoading,
}: TablesDataViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "json">("table");
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    if (!tableData?.rows) return;
    navigator.clipboard.writeText(JSON.stringify(tableData.rows, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredRows = (tableData?.rows || []).filter((row) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(query)
    );
  });

  const columns = tableData?.columns || [];

  return (
    <div className="border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden w-full max-w-full">
      <div className="p-4 sm:p-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold font-mono flex items-center gap-2 text-foreground">
              <span>public.{selectedTable}</span>
            </h3>
            <span className="border-0 bg-primary/10 text-primary text-xs font-mono font-medium px-2.5 py-0.5 rounded-full">
              {tableData?.count ?? 0} bản ghi
            </span>
            {tableData?.hasServiceRole ? (
              <span className="border-0 bg-emerald-100/70 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Admin Bypass RLS
              </span>
            ) : (
              <span className="border-0 bg-[#f4f1ea] text-[#6e6a61] text-xs font-medium px-2.5 py-0.5 rounded-full">
                Publishable Key (RLS Enforced)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-40 sm:w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Lọc dữ liệu..."
                className="w-full h-8.5 pl-8 pr-2.5 text-xs bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-lg outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground/60"
              />
            </div>

            <div className="flex items-center rounded-lg border-0 p-0.5 bg-[#f7f5ef] dark:bg-muted/30">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer border-0 ${
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Dạng bảng"
              >
                <TableIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("json")}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer border-0 ${
                  viewMode === "json"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Dạng JSON"
              >
                <Code className="h-3.5 w-3.5" />
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyJson}
              className="h-8.5 gap-1 text-xs border-0 bg-[#f7f5ef] hover:bg-[#efebe2] cursor-pointer px-2.5 shadow-xs"
              title="Sao chép JSON"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-0 w-full max-w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-xs text-muted-foreground">
              Đang tải dữ liệu từ Supabase...
            </p>
          </div>
        ) : tableData?.error ? (
          <div className="p-8 text-center space-y-2">
            <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
            <h4 className="text-sm font-semibold text-foreground">
              Không thể đọc bảng &quot;{selectedTable}&quot;
            </h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              {tableData.error}
            </p>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <TableIcon className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <h4 className="text-sm font-semibold text-foreground">
              Chưa có bản ghi nào trong bảng này
            </h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Bảng <code className="font-mono text-primary font-medium">{selectedTable}</code> hiện tại trả về 0 bản ghi.
              {!tableData?.hasServiceRole && (
                <span className="block mt-1 text-[11px] text-muted-foreground/80">
                  Nếu bảng đang bật Row Level Security (RLS) trên Supabase, cần bổ sung biến <code>SUPABASE_SERVICE_ROLE_KEY</code> để cấp quyền Super Admin đọc toàn bộ dữ liệu.
                </span>
              )}
            </p>
          </div>
        ) : viewMode === "json" ? (
          <div className="p-4 bg-[#f8f6f0] dark:bg-muted/20 font-mono text-xs overflow-x-auto max-h-[550px] rounded-b-2xl">
            <pre className="text-foreground/90">
              {JSON.stringify(filteredRows, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="w-full max-w-full overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[720px]">
              <thead className="bg-[#faf8f4] dark:bg-muted/40 text-[#6e6a61] dark:text-slate-300 font-mono uppercase text-xs tracking-wider sticky top-0 z-10">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="py-3 px-4 whitespace-nowrap font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f2eb] dark:divide-border/40 font-mono text-sm">
                {filteredRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#fbf9f5] dark:hover:bg-muted/30 transition-colors"
                  >
                    {columns.map((col) => {
                      const val = row[col];
                      let rendered: React.ReactNode = "";

                      if (val === null || val === undefined) {
                        rendered = (
                          <span className="text-muted-foreground/50 italic text-xs">
                            null
                          </span>
                        );
                      } else if (typeof val === "boolean") {
                        rendered = (
                          <span
                            className={
                              val
                                ? "border-0 text-emerald-800 bg-emerald-100/70 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-sans font-medium"
                                : "border-0 bg-[#f4f1ea] text-[#6e6a61] text-xs px-2.5 py-0.5 rounded-full font-sans font-medium"
                            }
                          >
                            {val ? "true" : "false"}
                          </span>
                        );
                      } else if (Array.isArray(val)) {
                        rendered = (
                          <span
                            className="text-primary/90 font-medium truncate max-w-sm block"
                            title={JSON.stringify(val)}
                          >
                            [{val.join(", ")}]
                          </span>
                        );
                      } else if (typeof val === "object") {
                        rendered = (
                          <span className="text-muted-foreground truncate max-w-sm block">
                            {JSON.stringify(val)}
                          </span>
                        );
                      } else if (
                        typeof val === "string" &&
                        val.includes("T") &&
                        val.endsWith("Z")
                      ) {
                        rendered = (
                          <span className="text-muted-foreground">
                            {new Date(val).toLocaleString("vi-VN")}
                          </span>
                        );
                      } else {
                        rendered = (
                          <span className="text-foreground truncate max-w-sm block">
                            {String(val)}
                          </span>
                        );
                      }

                      return (
                        <td key={col} className="py-3.5 px-4">
                          {rendered}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
