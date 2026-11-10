"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@workspace/ui/lib/api-client";
import { toast } from "@workspace/ui/components/toaster";
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

  // In-memory cache for table rows: key = `${tableName}:${page}:${limit}:${search}`
  const rowsCache = useRef<Record<string, { rows: Record<string, any>[]; totalCount: number }>>({});

  // Multi-select & Batch Actions
  const [selectedPks, setSelectedPks] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch tables list (ONLY on mount or explicit user refresh)
  const fetchTables = useCallback(async () => {
    setIsLoadingTables(true);
    try {
      const response = await api.get<{ 
        success: boolean;
        tables?: TableMeta[];
        warning?: string;
        error?: string;
      }>("/api/database/tables");

      console.log('Tables API response:', response);
      
      if (!response) {
        throw new Error("No response from server");
      }

      if (response.error) {
        throw new Error(response.error.message || "API request failed");
      }

      if (!response) {
        console.error('No response from server');
        throw new Error("Không nhận được phản hồi từ máy chủ");
      }

      // Handle case where response.data is missing
      if (!response.data) {
        console.error('Response missing data:', response);
        throw new Error("Dữ liệu phản hồi không hợp lệ");
      }

      // Handle successful response with tables data
      if (response.data.success && response.data.tables) {
        return response.data.tables;
      }

      // Handle error response
      const errorMessage = response.data.error || "Yêu cầu dữ liệu bảng thất bại";
      
      if (response.data.error?.includes("permission denied")) {
        throw new Error("Từ chối truy cập - kiểm tra quyền cơ sở dữ liệu");
      }

      // Try to return basic tables if we have them
      if (response.data.tables) {
        console.warn('Using fallback tables data due to error:', errorMessage);
        return response.data.tables;
      }

      throw new Error(errorMessage);

      // Handle missing or invalid tables data
      if (!response.data.tables || !Array.isArray(response.data.tables)) {
        console.warn("Invalid tables data format:", response.data.tables);
        return []; // Return empty array instead of throwing error
      }

      if (response.data.warning) {
        console.warn("Database tables warning:", response.data.warning);
      }

      const tables = response.data.tables || [];
      
      if (tables.length > 0) {
        setTables(tables);
        setSelectedTableName((prev) => {
          // Preserve selection if still valid
          if (prev && tables.some((t) => t.name === prev)) return prev;
          // Default to first table with rows if available
          const tableWithRows = tables.find(t => t.rowCount > 0);
          return tableWithRows?.name || tables[0]?.name || "";
        });
      } else {
        // Handle empty tables case
        setTables([]);
        setSelectedTableName("");
        console.warn("No tables returned from server");
      }

    } catch (err: unknown) {
      console.error("Failed to fetch tables:", err);
      
      let errorMessage = "Không thể tải danh sách bảng dữ liệu";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      // Show toast only if it's a real error, not empty response
      if (!errorMessage.includes("Không nhận được")) {
        toast.error({
          title: "Lỗi cơ sở dữ liệu",
          description: errorMessage,
          variant: "destructive",
        });
      }

      // Set empty state but don't break the UI
      setTables([]);
      setSelectedTableName("");
      
      // Return empty array to prevent unhandled promise rejection
      return [];
    } finally {
      setIsLoadingTables(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const currentTableMeta = tables.find((t) => t.name === selectedTableName) || null;

  // 2. Fetch rows with in-memory caching to eliminate redundant loading
  const fetchRows = useCallback(async (bypassCache = false) => {
    if (!selectedTableName) return;
    setSelectedPks(new Set());

    const cacheKey = `${selectedTableName}:${page}:${limit}:${searchQuery}`;

    // Instant render from cache if available
    if (!bypassCache && rowsCache.current[cacheKey]) {
      const cached = rowsCache.current[cacheKey];
      setRows(cached.rows);
      setTotalCount(cached.totalCount);
      return;
    }

    setIsLoadingRows(true);
    try {
      const params = new URLSearchParams({
        table: selectedTableName,
        page: String(page),
        limit: String(limit),
        search: searchQuery,
      });
      const data = await api.get<{ success: boolean; rows: Record<string, any>[]; totalCount: number }>(
        `/api/database/rows?${params.toString()}`
      );
      if (data.success && Array.isArray(data.rows)) {
        setRows(data.rows);
        setTotalCount(data.totalCount || 0);
        rowsCache.current[cacheKey] = {
          rows: data.rows,
          totalCount: data.totalCount || 0,
        };
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

  // Invalidate cache for a specific table or all tables
  const invalidateTableCache = useCallback((tableName?: string) => {
    if (!tableName) {
      rowsCache.current = {};
      return;
    }
    Object.keys(rowsCache.current).forEach((k) => {
      if (k.startsWith(`${tableName}:`)) {
        delete rowsCache.current[k];
      }
    });
  }, []);

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
      await api.delete("/api/database/rows", {
        table: selectedTableName,
        pkField: currentTableMeta.primaryKey,
        pks: Array.from(selectedPks),
      });
      toast.success(`Đã xóa ${count} bản ghi thành công!`);
      setSelectedPks(new Set());
      invalidateTableCache(selectedTableName);

      // Optimistic rowCount update
      setTables((prev) =>
        prev.map((t) => (t.name === selectedTableName ? { ...t, rowCount: Math.max(0, t.rowCount - count) } : t))
      );
      await fetchRows(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi xóa nhiều dòng";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // 5. Single Row Delete
  const handleDeleteSingle = async (pkVal: string) => {
    if (!currentTableMeta) return;
    if (!confirm(`Xóa bản ghi có khóa chính: ${pkVal}?`)) return;

    try {
      await api.delete("/api/database/rows", {
        table: selectedTableName,
        pkField: currentTableMeta.primaryKey,
        pks: [pkVal],
      });
      toast.success(`Đã xóa bản ghi [${pkVal}]!`);
      invalidateTableCache(selectedTableName);

      setTables((prev) =>
        prev.map((t) => (t.name === selectedTableName ? { ...t, rowCount: Math.max(0, t.rowCount - 1) } : t))
      );
      await fetchRows(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi xóa dòng";
      toast.error(msg);
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

    const body = isEdit
      ? {
          table: selectedTableName,
          pkField: pk,
          pkValue: editingRow?.[pk],
          data: formData,
        }
      : { table: selectedTableName, data: formData };

    try {
      if (isEdit) {
        await api.patch("/api/database/rows", body);
      } else {
        await api.post("/api/database/rows", body);
      }
      toast.success(isEdit ? "Cập nhật bản ghi thành công!" : "Tạo bản ghi mới thành công!");
      invalidateTableCache(selectedTableName);

      if (!isEdit) {
        setTables((prev) =>
          prev.map((t) => (t.name === selectedTableName ? { ...t, rowCount: t.rowCount + 1 } : t))
        );
      }
      await fetchRows(true);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lưu thất bại";
      toast.error(msg);
      return false;
    }
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
