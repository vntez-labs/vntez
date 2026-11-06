"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useClientsStore } from "../clients-store";

export function ClientsDeleteModal() {
  const { deletingClient, setDeletingClient, handleDeleteSubmit, isSubmitting } =
    useClientsStore();

  if (!deletingClient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="border-0 bg-white dark:bg-card shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-destructive/10 text-destructive">
            <Trash2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Xác nhận xóa Client OAuth
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hành động này sẽ thu hồi quyền đăng nhập SSO của ứng dụng này.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-destructive/5 text-xs text-destructive space-y-1">
          <div>
            Ứng dụng: <strong>{deletingClient.name}</strong>
          </div>
          <div className="font-mono text-[11px] truncate">
            Client ID: {deletingClient.client_id}
          </div>
          <div>
            Đã cấp: <strong>{deletingClient.codes_count || 0}</strong> mã xác thực PKCE
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setDeletingClient(null)}
            className="border-0 bg-[#f7f5ef] hover:bg-[#efebe2] text-xs h-9"
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isSubmitting}
            onClick={handleDeleteSubmit}
            className="text-xs h-9 font-semibold"
          >
            {isSubmitting ? "Đang xóa..." : "Xác nhận Xóa vĩnh viễn"}
          </Button>
        </div>
      </div>
    </div>
  );
}
