"use client";

import React from "react";
import { Plus, Edit, X, AlertTriangle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { useClientsStore } from "../clients-store";

export function ClientsFormModal() {
  const {
    isCreateOpen,
    closeCreateModal,
    editingClient,
    closeEditModal,
    formData,
    setFormData,
    handleCreateSubmit,
    handleEditSubmit,
    isSubmitting,
    formError,
  } = useClientsStore();

  const isOpen = isCreateOpen || Boolean(editingClient);
  if (!isOpen) return null;

  const isEditing = Boolean(editingClient);
  const handleClose = isEditing ? closeEditModal : closeCreateModal;

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
    >
      <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit className="h-4 w-4 text-primary" />
                Chỉnh sửa Client OAuth: {editingClient?.name}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 text-primary" />
                Tạo mới Client OAuth 2.0
              </>
            )}
          </h3>
          <button
            type="button"
            onClick={isEditing ? closeEditModal : closeCreateModal}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form
          onSubmit={isEditing ? handleEditSubmit : handleCreateSubmit}
          className="space-y-4 text-xs"
        >
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Tên ứng dụng / Dự án <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              spellCheck={false}
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder="Ví dụ: BMAN POS Desktop, VNTEZ Portal..."
              className="w-full h-9 px-3 bg-muted/50 border border-input rounded-xl outline-none focus:ring-1 focus:ring-ring text-foreground"
            />
          </div>

          {!isEditing && (
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Client ID tùy chỉnh (Để trống hệ thống sẽ tự sinh)
              </label>
              <input
                type="text"
                spellCheck={false}
                value={formData.client_id}
                onChange={(e) => setFormData({ client_id: e.target.value })}
                placeholder="vntez_bman_pos_client..."
                className="w-full h-9 px-3 font-mono bg-muted/50 border border-input rounded-xl outline-none focus:ring-1 focus:ring-ring text-foreground"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Mô tả ứng dụng</label>
            <input
              type="text"
              spellCheck={false}
              value={formData.description}
              onChange={(e) => setFormData({ description: e.target.value })}
              placeholder="Hệ thống bán lẻ, đồng bộ offline-first..."
              className="w-full h-9 px-3 bg-muted/50 border border-input rounded-xl outline-none focus:ring-1 focus:ring-ring text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Redirect URIs (Mỗi dòng một URI) <span className="text-destructive">*</span>
            </label>
            <textarea
              required
              rows={3}
              spellCheck={false}
              value={formData.redirect_uris}
              onChange={(e) => setFormData({ redirect_uris: e.target.value })}
              placeholder="http://localhost:3000/auth/callback&#10;https://my-app.com/auth/callback"
              className="w-full p-3 font-mono text-xs bg-muted/50 border border-input rounded-xl outline-none focus:ring-1 focus:ring-ring text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Logo URL (Tùy chọn)</label>
            <input
              type="url"
              spellCheck={false}
              value={formData.logo_url}
              onChange={(e) => setFormData({ logo_url: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="w-full h-9 px-3 bg-muted/50 border border-input rounded-xl outline-none focus:ring-1 focus:ring-ring text-foreground"
            />
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <Checkbox
              id="is_internal_check"
              checked={formData.is_internal}
              onCheckedChange={(checked) => setFormData({ is_internal: checked })}
            />
            <label
              htmlFor="is_internal_check"
              className="font-medium text-foreground cursor-pointer select-none"
            >
              Ứng dụng nội bộ hệ sinh thái VNTEZ (Bypass prompt đồng ý nếu muốn)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={isEditing ? closeEditModal : closeCreateModal}
              className="text-xs h-9"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs h-9 font-semibold"
            >
              {isSubmitting
                ? "Đang lưu..."
                : isEditing
                ? "Lưu thay đổi"
                : "Tạo Client"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
