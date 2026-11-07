"use client";

import { useState, useEffect, useCallback } from "react";
import type { TableMeta } from "../types";

export function useDatabaseManager() {
  const [tables, setTables] = useState<TableMeta[]>([]);
  const [selectedTableName, setSelectedTableName] = useState<string>("");
  const [isLoadingTables, setIsLoadingTables] = useState(true);

  // Table rows & pagination
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingRows, setIsLoadingRows] = useState(false);

  // Multi-select & Batch Actions
  const [selectedPks, setSelectedPks] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch tables
  const fetchTables = useCallback(async () => {
    setIsLoadingTables(true);
    try {
      const res = await fetch("/api/database/tables");
      const data = await res.json();
      if (data.success && Array.isArray(data.tables)) {
        setTables(data.tables);
        if (data.tables.length > 0 && !selectedTableName) {
          setSelectedTableName(data.tables[0].name);
        }
      }
    } catch (err) {
      console.error("Failed to fetch tables:", err);
    } finally {
      setIsLoadingTables(false);
    }
  }, [selectedTableName]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const currentTableMeta = tables.find((t) => t.name === selectedTableName) || null;

  // 2. Fetch rows
  const fetchRows = useCallback(async () => {
    if (!selectedTableName) return;
    setIsLoadingRows(true);
    setSelectedPks(new Set());
    try {
      const params = new URLSearchParams({
        table: selectedTableName,
        page: String(page),
        limit: String(limit),
        search: searchQuery,
      });
      const res = await fetch(`/api/database/rows?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.rows)) {
        setRows(data.rows);
        setTotalCount(data.totalCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch rows:", err);
    } finally {
      setIsLoadingRows(false);
    }
  }, [selectedTableName, page, limit, searchQuery]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  // 3. Selection Handlers
  const handleToggleSelectRow = (pkVal: string) => {
    setSelectedPks((prev) => {
      const next = new Set(prev);
      if (next.has(pkVal)) next.delete(pkVal);
      else next.add(pkVal);
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (!currentTableMeta) return;
    const pk = currentTableMeta.primaryKey;
    const allPksOnPage = rows.map((r) => String(r[pk]));
    const areAllSelected = allPksOnPage.every((id) => selectedPks.has(id));

    setSelectedPks((prev) => {
      const next = new Set(prev);
      if (areAllSelected) {
        allPksOnPage.forEach((id) => next.delete(id));
      } else {
        allPksOnPage.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // 4. Batch Delete Multiple Rows
  const handleDeleteSelected = async () => {
    if (!currentTableMeta || selectedPks.size === 0) return;
    const count = selectedPks.size;
    if (!confirm(`Bạn có chắc muốn xóa vĩnh viễn ${count} dòng đã chọn trong bảng "${selectedTableName}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch("/api/database/rows", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: selectedTableName,
          pkField: currentTableMeta.primaryKey,
          pks: Array.from(selectedPks),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xóa thất bại");
      setSelectedPks(new Set());
      await fetchRows();
      await fetchTables();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Lỗi khi xóa nhiều dòng");
    } finally {
      setIsDeleting(false);
    }
  };

  // 5. Single Row Delete
  const handleDeleteSingle = async (pkVal: string) => {
    if (!currentTableMeta) return;
    if (!confirm(`Xóa bản ghi có khóa chính: ${pkVal}?`)) return;

    try {
      const res = await fetch("/api/database/rows", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: selectedTableName,
          pkField: currentTableMeta.primaryKey,
          pks: [pkVal],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xóa thất bại");
      await fetchRows();
      await fetchTables();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Lỗi khi xóa dòng");
    }
  };

  // 6. Save Row (Insert or Update)
  const handleSaveRow = async (
    editingRow: Record<string, any> | null,
    formData: Record<string, any>
  ): Promise<boolean> => {
    if (!currentTableMeta) return false;
    const pk = currentTableMeta.primaryKey;
    const isEdit = Boolean(editingRow);

    const res = await fetch("/api/database/rows", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        isEdit
          ? {
              table: selectedTableName,
              pkField: pk,
              pkValue: editingRow?.[pk],
              data: formData,
            }
          : { table: selectedTableName, data: formData }
      ),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Lưu thất bại");
    await fetchRows();
    await fetchTables();
    return true;
  };

  return {
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
  };
}
