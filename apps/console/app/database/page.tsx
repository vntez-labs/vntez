"use client";

import React, { useState } from "react";
import { AuthGuard } from "@workspace/auth/guard";
import { ConsoleShell } from "@/components/console-shell";
import { Plus, Search, Database } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { TableSkeleton } from "@workspace/ui/components/skeleton";
import { useDatabaseManager } from "./hooks/use-database-manager";
import { DatabaseTableSelector } from "./components/database-table-selector";
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="font-display font-extrabold text-2xl tracking-tight text-foreground flex items-center gap-2.5">
          <Database className="h-6 w-6 text-primary" />
          <span>Quản trị Cơ sở Dữ liệu</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Trình quản lý Table Editor trực quan: xem, thêm, sửa và xóa dữ liệu trực tiếp trong Console.
        </p>
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
          onOpenSqlRunner={() => setIsSqlRunnerOpen(true)}
        />

        {/* Right: Search Bar & Grid */}
        <div className="flex-1 w-full min-w-0 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

          {isLoadingTables || (!currentTableMeta && isLoadingRows) ? (
            <div className="rounded-3xl bg-card border border-border p-4 shadow-xs">
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
            <div className="rounded-3xl bg-card border border-border p-12 text-center text-xs text-muted-foreground">
              Vui lòng chọn một bảng dữ liệu từ danh sách bên trái.
            </div>
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

      <DatabaseSqlRunnerModal
        isOpen={isSqlRunnerOpen}
        onClose={() => setIsSqlRunnerOpen(false)}
        defaultTable={selectedTableName}
        onTableMutated={fetchRows}
      />
    </div>
  );
}
