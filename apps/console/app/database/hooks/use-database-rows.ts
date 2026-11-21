import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@workspace/ui/lib/api-client";
import { toast } from "@workspace/ui/components/toaster";

interface TableRows {
  rows: Record<string, unknown>[];
  totalCount: number;
}

export function useDatabaseRows(table: string, page: number, limit: number, search: string) {
  const [revision, setRevision] = useState(0);
  const latestRevision = useRef(0);
  const cache = useRef(new Map<string, TableRows>());
  const query = new URLSearchParams({
    table, page: String(page), limit: String(limit), search,
  }).toString();
  const requestKey = `${revision}:${query}`;
  const [result, setResult] = useState<{ key: string; data?: TableRows }>();

  const refreshRows = useCallback(() => {
    cache.current.clear();
    latestRevision.current += 1;
    setRevision(latestRevision.current);
  }, []);

  useEffect(() => {
    if (!table) return;
    let active = true;
    const cached = cache.current.get(query);
    if (cached) {
      setResult({ key: requestKey, data: cached });
      return;
    }

    async function loadRows() {
      try {
        const response = await api.get<TableRows & { success: boolean }>(`/api/database/rows?${query}`, { silent: true });
        if (!active || latestRevision.current !== revision) return;
        if (!response.success || !Array.isArray(response.rows)) {
          throw new Error("Phản hồi tải bản ghi không hợp lệ");
        }
        const data = { rows: response.rows, totalCount: response.totalCount };
        cache.current.set(query, data);
        setResult({ key: requestKey, data });
      } catch (error) {
        if (!active || latestRevision.current !== revision) return;
        setResult({ key: requestKey });
        toast.error(error instanceof Error ? error.message : "Không thể tải bản ghi");
      }
    }

    void loadRows();
    return () => { active = false; };
  }, [table, query, requestKey, revision]);

  const data = result?.key === requestKey ? result.data : undefined;
  return {
    requestKey,
    rows: data?.rows ?? [],
    totalCount: data?.totalCount ?? 0,
    isLoadingRows: Boolean(table) && result?.key !== requestKey,
    canEditRows: Boolean(data),
    refreshRows,
  };
}
