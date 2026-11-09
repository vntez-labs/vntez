"use client";

import React, { useState } from "react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { Plus, Search, Database, Terminal, FileCode, RefreshCw } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { TableSkeleton } from "@workspace/ui/components/skeleton";
import { useDatabaseManager } from "./hooks/use-database-manager";
import { DatabaseTableTabs } from "./components/database-table-tabs";
import { DatabaseGrid } from "./components/database-grid";
import { DatabaseBatchToolbar } from "./components/database-batch-toolbar";
import { DatabaseRowModal } from "./components/database-row-modal";
import { DatabaseSqlModal } from "./components/database-sql-modal";
import { DatabaseSqlRunnerModal } from "./components/database-sql-runner-modal";

export default function DatabasePage() {
  return (
    <AuthGuard>
      <ConsoleShell>
        <DatabaseContent />
      </ConsoleShell>
    </AuthGuard>
  );
}

function DatabaseContent() {
  const {
    tables,
    selectedTableName,
    setSelectedTableName,
    isLoadingTables,
    fetchTables,
    currentTableMeta,
    rows,
    totalCount,
    page,
    setPage,
    limit,
    searchQuery,
    setSearchQuery,
    isLoadingRows,
    fetchRows,
    selectedPks,
    setSelectedPks,
    isDeleting,
    handleToggleSelectRow,
    handleToggleSelectAll,
    handleDeleteSelected,
    handleDeleteSingle,
    handleSaveRow,
  } = useDatabaseManager();

  // Modal states
  const [editingRow, setEditingRow] = useState<Record<string, any> | null>(null);
  const [isRowModalOpen, setIsRowModalOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isSqlRunnerOpen, setIsSqlRunnerOpen] = useState(false);

  return (
    <div className="space-y-5 min-w-0 w-full max-w-full">
      {/* Top Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-xl tracking-tight text-foreground">
                Quản trị Cơ sở Dữ liệu
              </h1>
              <span className="bg-primary/10 text-primary text-xs font-mono font-semibold px-2 py-0.5 rounded-full">
                {tables.length} bảng
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Trực quan hóa và quản lý các bảng Postgres trên Supabase
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSqlModalOpen(true)}
            className="h-9 px-3 text-xs gap-1.5 rounded-xl cursor-pointer bg-card border-border shadow-xs"
            title="Xem mã DDL khởi tạo cơ sở dữ liệu"
          >
            <FileCode className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Cấu trúc DDL</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsSqlRunnerOpen(true)}
            className="h-9 px-3.5 text-xs font-semibold gap-1.5 rounded-xl shadow-xs cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900"
            title="Mở trình thực thi truy vấn SQL trực tiếp"
          >
            <Terminal className="h-4 w-4" />
            <span>Thực thi SQL</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={fetchTables}
            disabled={isLoadingTables}
            className="h-9 w-9 p-0 rounded-xl cursor-pointer border border-border bg-card hover:bg-muted text-muted-foreground"
            title="Tải lại danh sách bảng"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoadingTables ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Horizontal Table Tabs placed on top (Column Layout) */}
      <DatabaseTableTabs
        tables={tables}
        selectedTable={selectedTableName}
        onSelectTable={(t) => {
          setSelectedTableName(t);
          setPage(1);
          setSearchQuery("");
        }}
        isLoading={isLoadingTables}
      />

      {/* Full-width Search Bar & Add Row Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Tìm kiếm trong ${selectedTableName || "bảng"}...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-card text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
          />
        </div>
        {currentTableMeta && (
          <Button
            size="sm"
            onClick={() => {
              setEditingRow(null);
              setIsRowModalOpen(true);
            }}
            className="h-9 px-4 text-xs font-semibold gap-1.5 rounded-xl shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm Bản ghi</span>
          </Button>
        )}
      </div>

      {/* Full-width Database Grid */}
      {isLoadingTables || (!currentTableMeta && isLoadingRows) ? (
        <div className="rounded-2xl bg-card border border-border p-4 shadow-xs">
          <TableSkeleton rows={7} columns={6} />
        </div>
      ) : currentTableMeta ? (
        <DatabaseGrid
          tableMeta={currentTableMeta}
          rows={rows}
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={setPage}
          selectedPks={selectedPks}
          onToggleSelectRow={handleToggleSelectRow}
          onToggleSelectAll={handleToggleSelectAll}
          onEditRow={(row) => {
            setEditingRow(row);
            setIsRowModalOpen(true);
          }}
          onDeleteSingle={handleDeleteSingle}
          isLoading={isLoadingRows}
        />
      ) : (
        <div className="rounded-2xl bg-card border border-border p-12 text-center text-xs text-muted-foreground">
          Vui lòng chọn một bảng dữ liệu từ các thẻ phía trên.
        </div>
      )}

      {/* Floating Batch Delete Toolbar */}
      <DatabaseBatchToolbar
        selectedCount={selectedPks.size}
        tableName={selectedTableName}
        onClearSelection={() => setSelectedPks(new Set())}
        onDeleteSelected={handleDeleteSelected}
        isDeleting={isDeleting}
      />

      {/* Modals */}
      {currentTableMeta && (
        <DatabaseRowModal
          isOpen={isRowModalOpen}
          onClose={() => {
            setIsRowModalOpen(false);
            setEditingRow(null);
          }}
          tableMeta={currentTableMeta}
          initialRow={editingRow}
          onSave={(data) => handleSaveRow(editingRow, data)}
        />
      )}

      <DatabaseSqlModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      <DatabaseSqlRunnerModal
        isOpen={isSqlRunnerOpen}
        onClose={() => setIsSqlRunnerOpen(false)}
        tables={tables}
        defaultTable={selectedTableName}
        onTableMutated={fetchRows}
      />
    </div>
  );
}
