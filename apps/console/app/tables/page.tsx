"use client";

import React, { useEffect, useState } from "react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { Database, RefreshCw, ExternalLink } from "lucide-react";
import type { TableResponse } from "./tables-types";
import { TablesSelectorStrip } from "./components/tables-selector-strip";
import { TablesDataView } from "./components/tables-data-view";

export default function TablesExplorerPage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <TablesContent />
      </ConsoleShell>
    </AuthGuard>
  );
}

function TablesContent() {
  const [selectedTable, setSelectedTable] = useState("oauth_clients");
  const [tableData, setTableData] = useState<TableResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTableData = async (tableName: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tables?table=${encodeURIComponent(tableName)}`);
      const data: TableResponse = await res.json();
      setTableData(data);
    } catch (err) {
      console.error("Failed to load table:", err);
      setTableData({
        success: false,
        table: tableName,
        rows: [],
        count: 0,
        columns: [],
        error: "Không thể kết nối tới cơ sở dữ liệu Supabase",
        knownTables: [
          { name: "oauth_clients", label: "OAuth Clients", description: "Danh sách ứng dụng OAuth ID" },
          { name: "oauth_client_requests", label: "OAuth Client Requests", description: "Hồ sơ yêu cầu đăng ký và thẩm định Deal" },
          { name: "oauth_codes", label: "OAuth Codes", description: "Mã Authorization Codes" },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData(selectedTable);
  }, [selectedTable]);

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Cơ sở Dữ liệu & Bảng Supabase
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Xem cấu trúc và dữ liệu thực tế từ các bảng trong project{" "}
            <code className="font-mono text-foreground font-semibold">
              stbswcnsitztbusqrdhi.supabase.co
            </code>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTableData(selectedTable)}
            disabled={isLoading}
            className="gap-1.5 text-xs border-0 bg-white dark:bg-card shadow-xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          <a
            href="https://supabase.com/dashboard/project/stbswcnsitztbusqrdhi/editor"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "gap-1.5 text-xs border-0 shadow-xs",
            })}
          >
            <span>Supabase Studio</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <TablesSelectorStrip
        tableData={tableData}
        selectedTable={selectedTable}
        onSelectTable={setSelectedTable}
      />

      <TablesDataView
        tableData={tableData}
        selectedTable={selectedTable}
        isLoading={isLoading}
      />
    </div>
  );
}
