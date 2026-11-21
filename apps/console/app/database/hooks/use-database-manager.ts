"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@workspace/ui/lib/api-client";
import { toast } from "@workspace/ui/components/toaster";
import { useDatabaseRowMutations } from "./use-database-row-mutations";
import { useDatabaseRows } from "./use-database-rows";
import type { TableMeta } from "../types";

export function useDatabaseManager() {
  const [tables, setTables] = useState<TableMeta[]>([]);
  const [selectedTableName, setSelectedTableName] = useState<string>("");
  const [isLoadingTables, setIsLoadingTables] = useState(true);

  // Table rows & pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");
  const { requestKey, rows, totalCount, isLoadingRows, canEditRows, refreshRows } =
    useDatabaseRows(selectedTableName, page, limit, searchQuery);

  const [selection, setSelection] = useState({ key: "", pks: new Set<string>() });
  if (selection.key !== requestKey) setSelection({ key: requestKey, pks: new Set() });
  const selectedPks = selection.key === requestKey && canEditRows ? selection.pks : new Set<string>();
  const setSelectedPks = (update: Set<string> | ((previous: Set<string>) => Set<string>)) => {
    setSelection((previous) => ({
      key: requestKey,
      pks: typeof update === "function"
        ? update(previous.key === requestKey ? previous.pks : new Set<string>())
        : update,
    }));
  };

  // 1. Fetch tables list
  const fetchTables = useCallback(async () => {
    setIsLoadingTables(true);
    try {
      const response = await api.get<any>("/api/database/tables");

      if (!response) {
        throw new Error("Không nhận được phản hồi từ máy chủ");
      }

      // Xử lý linh hoạt: hỗ trợ cả trường hợp api trả về trực tiếp hoặc bọc qua .data
      const payload = response.data !== undefined ? response.data : response;

      if (payload.error) {
        const errorMsg = typeof payload.error === "string" ? payload.error : payload.error.message;
        throw new Error(errorMsg || "Yêu cầu dữ liệu bảng thất bại");
      }

      const rawTables: TableMeta[] = payload.tables || [];

      if (Array.isArray(rawTables) && rawTables.length > 0) {
        setTables(rawTables);
        setSelectedTableName((prev) => {
          if (prev && rawTables.some((t) => t.name === prev)) return prev;
          const tableWithRows = rawTables.find((t) => t.rowCount > 0);
          return tableWithRows?.name || rawTables[0]?.name || "";
        });
      } else {
        setTables([]);
        setSelectedTableName("");
      }
    } catch (err: unknown) {
      // Failed to fetch tables
      const errorMessage = err instanceof Error ? err.message : "Không thể tải danh sách bảng dữ liệu";

      toast.error(errorMessage);

      setTables([]);
      setSelectedTableName("");
    } finally {
      setIsLoadingTables(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const currentTableMeta = tables.find((t) => t.name === selectedTableName) || null;

  // 3. Selection Handlers
  const handleToggleSelectRow = (pkVal: string) => {
    if (!canEditRows) return;
    setSelectedPks((prev) => {
      const next = new Set(prev);
      if (next.has(pkVal)) next.delete(pkVal);
      else next.add(pkVal);
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (!canEditRows || !currentTableMeta) return;
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

  const mutations = useDatabaseRowMutations({
    selectedTableName,
    primaryKey: currentTableMeta?.primaryKey,
    selectedPks,
    canEditRows,
    refreshRows,
    updateRowCount: (delta) => {
      setTables((tables) => tables.map((table) => table.name === selectedTableName
        ? { ...table, rowCount: Math.max(0, table.rowCount + delta) }
        : table));
    },
  });

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
    canEditRows,
    refreshRows,
    selectedPks,
    setSelectedPks,
    handleToggleSelectRow,
    handleToggleSelectAll,
    ...mutations,
  };
}
