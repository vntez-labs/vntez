import { create } from "zustand";
import type { AppItem } from "@workspace/ui/lib/content-types";
import type { WorkspaceTab } from "./types";

interface WorkspaceState {
  app: AppItem | null;
  activeTab: WorkspaceTab;
  isLoading: boolean;
  isSaving: boolean;
  isRotatingSecret: boolean;
  isDirty: boolean;
  copiedField: string | null;
  errorMessage: string | null;
  successMessage: string | null;

  setActiveTab: (tab: WorkspaceTab) => void;
  fetchApp: (id: string) => Promise<void>;
  updateApp: (updates: Partial<AppItem>) => void;
  rotateSecret: () => Promise<void>;
  saveChanges: () => Promise<boolean>;
  copyToClipboard: (text: string, fieldId: string) => void;
}

export const useAppWorkspaceStore = create<WorkspaceState>((set, get) => ({
  app: null,
  activeTab: "overview",
  isLoading: true,
  isSaving: false,
  isRotatingSecret: false,
  isDirty: false,
  copiedField: null,
  errorMessage: null,
  successMessage: null,

  setActiveTab: (activeTab) => set({ activeTab }),

  fetchApp: async (id: string) => {
    set({ isLoading: true, errorMessage: null });
    try {
      const res = await fetch(`/api/apps/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể tải dữ liệu ứng dụng");
      }
      set({ app: data.app, isDirty: false });
    } catch (err: unknown) {
      set({ errorMessage: err instanceof Error ? err.message : String(err) });
    } finally {
      set({ isLoading: false });
    }
  },

  updateApp: (updates) => {
    const { app } = get();
    if (!app) return;
    set({
      app: { ...app, ...updates },
      isDirty: true,
      successMessage: null,
    });
  },

  rotateSecret: async () => {
    const { app } = get();
    if (!app) return;
    if (!confirm("Bạn có chắc chắn muốn cấp mới Client Secret? Các dịch vụ đang dùng Secret cũ có thể bị gián đoạn.")) {
      return;
    }

    set({ isRotatingSecret: true, errorMessage: null });
    try {
      const res = await fetch(`/api/apps/${encodeURIComponent(app.id)}/rotate-secret`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể cấp mới secret");
      }
      set({
        app: { ...app, clientSecret: data.clientSecret },
        successMessage: "Đã cấp mới Client Secret thành công",
      });
    } catch (err: unknown) {
      set({ errorMessage: err instanceof Error ? err.message : String(err) });
    } finally {
      set({ isRotatingSecret: false });
    }
  },

  saveChanges: async () => {
    const { app } = get();
    if (!app) return false;

    set({ isSaving: true, errorMessage: null, successMessage: null });
    try {
      const res = await fetch(`/api/apps/${encodeURIComponent(app.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(app),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Lưu thay đổi thất bại");
      }
      set({
        app: data.app,
        isDirty: false,
        successMessage: "Đã lưu toàn bộ cấu hình ứng dụng thành công",
      });
      return true;
    } catch (err: unknown) {
      set({ errorMessage: err instanceof Error ? err.message : String(err) });
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  copyToClipboard: (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    set({ copiedField: fieldId });
    setTimeout(() => {
      if (get().copiedField === fieldId) {
        set({ copiedField: null });
      }
    }, 2000);
  },
}));
