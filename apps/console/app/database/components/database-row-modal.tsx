"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Key, Loader2, Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { TableMeta } from "../types";

interface DatabaseRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableMeta: TableMeta;
  initialRow: Record<string, any> | null;
  onSave: (data: Record<string, any>) => Promise<boolean>;
}

export function DatabaseRowModal({
  isOpen,
  onClose,
  tableMeta,
  initialRow,
  onSave,
}: DatabaseRowModalProps) {
  const isEditing = Boolean(initialRow);
  const pkField = tableMeta.primaryKey;
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRow) {
      setFormData({ ...initialRow });
    } else {
      const defaultObj: Record<string, any> = {};
      tableMeta.columns.forEach((col) => {
        if (col.type === "boolean") defaultObj[col.name] = false;
        else if (col.type === "array") defaultObj[col.name] = [];
        else if (col.type === "object") defaultObj[col.name] = {};
        else defaultObj[col.name] = "";
      });
      setFormData(defaultObj);
    }
    setError(null);
  }, [initialRow, tableMeta, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (colName: string, rawVal: string, colType: string) => {
    let parsed: any = rawVal;
    if (colType === "integer" || colType === "number") {
      parsed = rawVal === "" ? null : Number(rawVal);
    } else if (colType === "boolean") {
      parsed = rawVal === "true";
    } else if (colType === "array" || colType === "object") {
      try {
        parsed = JSON.parse(rawVal);
      } catch {
        parsed = rawVal;
      }
    }
    setFormData((prev) => ({ ...prev, [colName]: parsed }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const success = await onSave(formData);
      if (success) onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi khi lưu dòng dữ liệu");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-white dark:bg-[#0c121e] border border-zinc-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <div>
            <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
              {isEditing ? <Key className="h-4 w-4 text-primary" /> : <Plus className="h-4 w-4 text-primary" />}
              <span>{isEditing ? "Chỉnh sửa bản ghi" : "Thêm bản ghi mới"}</span>
            </h3>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              Bảng: <strong>{tableMeta.name}</strong>
              {isEditing && (
                <> • Khóa chính: <strong>{String(initialRow?.[pkField])}</strong></>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tableMeta.columns.map((col) => {
              const val = formData[col.name];
              const isPk = col.name === pkField;
              const isComplex = col.type === "object" || col.type === "array";

              return (
                <div
                  key={col.name}
                  className={`space-y-1.5 ${isComplex ? "sm:col-span-2" : ""}`}
                >
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between font-mono">
                    <span className="flex items-center gap-1">
                      {isPk && <Key className="h-3 w-3 text-amber-500" />}
                      {col.name}
                      {col.required && <span className="text-rose-500">*</span>}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 font-sans">
                      {col.format || col.type}
                    </span>
                  </label>

                  {isComplex ? (
                    <textarea
                      rows={3}
                      value={typeof val === "object" ? JSON.stringify(val, null, 2) : String(val ?? "")}
                      onChange={(e) => handleFieldChange(col.name, e.target.value, col.type)}
                      className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/60 p-2.5 text-xs font-mono text-foreground border border-zinc-200/80 dark:border-zinc-800 focus:outline-none focus:border-primary resize-y"
                    />
                  ) : col.type === "boolean" ? (
                    <div className="flex items-center gap-3 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={Boolean(val)}
                          onChange={(e) => setFormData((prev) => ({ ...prev, [col.name]: e.target.checked }))}
                          className="rounded border-zinc-300 text-primary focus:ring-primary size-4"
                        />
                        <span className="font-mono">{Boolean(val) ? "TRUE" : "FALSE"}</span>
                      </label>
                    </div>
                  ) : (
                    <input
                      type={col.type === "number" || col.type === "integer" ? "number" : "text"}
                      disabled={isEditing && isPk}
                      value={val !== null && val !== undefined ? String(val) : ""}
                      onChange={(e) => handleFieldChange(col.name, e.target.value, col.type)}
                      className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900/60 px-3 py-2 text-xs font-mono text-foreground border border-zinc-200/80 dark:border-zinc-800 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving} className="rounded-xl text-xs">
              Hủy
            </Button>
            <Button type="submit" disabled={isSaving} className="rounded-xl text-xs font-semibold gap-1.5 shadow-xs">
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              <span>{isEditing ? "Lưu thay đổi" : "Thêm bản ghi"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
