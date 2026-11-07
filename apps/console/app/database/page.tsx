"use client";

import React, { useState } from "react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { Plus, Search, RefreshCw, Database } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useDatabaseManager } from "./hooks/use-database-manager";
import { DatabaseTableSelector } from "./components/database-table-selector";
import { DatabaseGrid } from "./components/database-grid";
import { DatabaseBatchToolbar } from "./components/database-batch-toolbar";
import { DatabaseRowModal } from "./components/database-row-modal";
import { DatabaseSqlModal } from "./components/database-sql-modal";

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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight text-foreground flex items-center gap-2.5">
            <Database className="h-6 w-6 text-primary" />
            <span>Quản trị Cơ sở Dữ liệu</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Trình quản lý Table Editor trực quan: xem, thêm, sửa và xóa nhiều dòng dữ liệu trực tiếp trong Console.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRows}
            disabled={isLoadingRows}
            className="h-9 px-3 text-xs gap-1.5 rounded-xl cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoadingRows ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditingRow(null);
              setIsRowModalOpen(true);
            }}
            disabled={!currentTableMeta}
            className="h-9 px-4 text-xs font-semibold gap-1.5 rounded-xl shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm Bản ghi</span>
          </Button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left: Table Selector */}
        <DatabaseTableSelector
          tables={tables}
          selectedTable={selectedTableName}
          onSelectTable={(t) => {
            setSelectedTableName(t);
            setPage(1);
            setSearchQuery("");
          }}
          onRefresh={fetchTables}
          isLoading={isLoadingTables}
          onOpenSqlModal={() => setIsSqlModalOpen(true)}
        />

        {/* Right: Search Bar & Grid */}
        <div className="flex-1 w-full min-w-0 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Tìm kiếm trong ${selectedTableName || "bảng"}...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-[#0c121e] text-foreground border border-zinc-200/80 dark:border-zinc-800 focus:outline-none focus:border-primary transition-colors shadow-2xs"
            />
          </div>

          {currentTableMeta && (
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
          )}
        </div>
      </div>

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
    </div>
  );
}
