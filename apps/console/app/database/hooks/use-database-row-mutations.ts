import { useState } from "react";
import { api } from "@workspace/ui/lib/api-client";
import { toast } from "@workspace/ui/components/toaster";

interface RowMutationOptions {
  selectedTableName: string;
  primaryKey?: string;
  selectedPks: Set<string>;
  canEditRows: boolean;
  refreshRows: () => void;
  updateRowCount: (delta: number) => void;
}

export function useDatabaseRowMutations({
  selectedTableName, primaryKey, selectedPks, canEditRows, refreshRows, updateRowCount,
}: RowMutationOptions) {
  const [isDeleting, setIsDeleting] = useState(false);

  // 4. Batch Delete Multiple Rows
  const handleDeleteSelected = async () => {
    if (!canEditRows || !primaryKey || selectedPks.size === 0) return;
    const count = selectedPks.size;
    if (!confirm(`Bạn có chắc muốn xóa vĩnh viễn ${count} dòng đã chọn trong bảng "${selectedTableName}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete("/api/database/rows", {
        table: selectedTableName,
        pkField: primaryKey,
        pks: Array.from(selectedPks),
      });
      toast.success(`Đã xóa ${count} bản ghi thành công!`);

      updateRowCount(-count);
      refreshRows();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi xóa nhiều dòng";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // 5. Single Row Delete
  const handleDeleteSingle = async (pkVal: string) => {
    if (!canEditRows || !primaryKey) return;
    if (!confirm(`Xóa bản ghi có khóa chính: ${pkVal}?`)) return;

    try {
      await api.delete("/api/database/rows", {
        table: selectedTableName,
        pkField: primaryKey,
        pks: [pkVal],
      });
      toast.success(`Đã xóa bản ghi [${pkVal}]!`);

      updateRowCount(-1);
      refreshRows();
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
    if (!canEditRows || !primaryKey) return false;
    const pk = primaryKey;
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

      if (!isEdit) updateRowCount(1);
      refreshRows();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lưu thất bại";
      toast.error(msg);
      return false;
    }
  };


  return { isDeleting, handleDeleteSelected, handleDeleteSingle, handleSaveRow };
}
