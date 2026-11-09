import { create } from "zustand";
import { toast } from "@workspace/ui/components/toaster";
import { api } from "@workspace/ui/lib/api-client";
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
      const data = await api.get<{ success: boolean; app: AppItem }>(
        `/api/apps/${encodeURIComponent(id)}`
      );
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
      const data = await api.post<{ success: boolean; clientSecret: string }>(
        `/api/apps/${encodeURIComponent(app.id)}/rotate-secret`
      );
      set({
        app: { ...app, clientSecret: data.clientSecret },
        successMessage: "Đã cấp mới Client Secret thành công",
      });
      toast.success("Đã cấp mới Client Secret thành công");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ errorMessage: msg });
    } finally {
      set({ isRotatingSecret: false });
    }
  },

  saveChanges: async () => {
    const { app } = get();
    if (!app) return false;

    set({ isSaving: true, errorMessage: null, successMessage: null });
    try {
      const data = await api.put<{ success: boolean; app: AppItem }>(
        `/api/apps/${encodeURIComponent(app.id)}`,
        app
      );
      set({
        app: data.app,
        isDirty: false,
        successMessage: "Đã lưu toàn bộ cấu hình ứng dụng thành công",
      });
      toast.success("Đã lưu toàn bộ cấu hình ứng dụng thành công");
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ errorMessage: msg });
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  copyToClipboard: (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    set({ copiedField: fieldId });
    toast.success("Đã sao chép vào bộ nhớ tạm");
    setTimeout(() => {
      if (get().copiedField === fieldId) {
        set({ copiedField: null });
      }
    }, 2000);
  },
}));
