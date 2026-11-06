import { create } from "zustand";
import type { OAuthClientRecord } from "@/app/api/clients/route";

export interface ClientFormData {
  name: string;
  client_id: string;
  description: string;
  redirect_uris: string;
  logo_url: string;
  is_internal: boolean;
}

const initialFormData: ClientFormData = {
  name: "",
  client_id: "",
  description: "",
  redirect_uris: "http://localhost:3000/auth/callback",
  logo_url: "",
  is_internal: false,
};

interface ClientsState {
  clients: OAuthClientRecord[];
  isLoading: boolean;
  searchQuery: string;
  copiedId: string | null;

  isCreateOpen: boolean;
  editingClient: OAuthClientRecord | null;
  deletingClient: OAuthClientRecord | null;
  isSubmitting: boolean;
  formError: string | null;
  formData: ClientFormData;

  // Actions
  fetchClients: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  handleCopy: (text: string, id: string) => void;

  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (client: OAuthClientRecord) => void;
  closeEditModal: () => void;
  setFormData: (data: Partial<ClientFormData>) => void;

  handleCreateSubmit: (e: React.FormEvent) => Promise<void>;
  handleEditSubmit: (e: React.FormEvent) => Promise<void>;

  setDeletingClient: (client: OAuthClientRecord | null) => void;
  handleDeleteSubmit: () => Promise<void>;
}

export const useClientsStore = create<ClientsState>((set, get) => ({
  clients: [],
  isLoading: true,
  searchQuery: "",
  copiedId: null,

  isCreateOpen: false,
  editingClient: null,
  deletingClient: null,
  isSubmitting: false,
  formError: null,
  formData: initialFormData,

  fetchClients: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/clients");
      if (res.ok) {
        const data = await res.json();
        set({ clients: data.clients || [] });
      }
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  handleCopy: (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    set({ copiedId: id });
    setTimeout(() => set({ copiedId: null }), 2000);
  },

  openCreateModal: () => {
    set({
      formData: { ...initialFormData },
      formError: null,
      isCreateOpen: true,
    });
  },

  closeCreateModal: () => set({ isCreateOpen: false, formError: null }),

  openEditModal: (client: OAuthClientRecord) => {
    set({
      editingClient: client,
      formData: {
        name: client.name || "",
        client_id: client.client_id,
        description: client.description || "",
        redirect_uris: client.redirect_uris.join("\n"),
        logo_url: client.logo_url || "",
        is_internal: client.is_internal,
      },
      formError: null,
    });
  },

  closeEditModal: () => set({ editingClient: null, formError: null }),

  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  handleCreateSubmit: async (e: React.FormEvent) => {
    e.preventDefault();
    const { formData, fetchClients } = get();
    set({ isSubmitting: true, formError: null });

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể tạo client");
      }

      set({ isCreateOpen: false });
      await fetchClients();
    } catch (err) {
      set({ formError: err instanceof Error ? err.message : String(err) });
    } finally {
      set({ isSubmitting: false });
    }
  },

  handleEditSubmit: async (e: React.FormEvent) => {
    e.preventDefault();
    const { editingClient, formData, fetchClients } = get();
    if (!editingClient) return;

    set({ isSubmitting: true, formError: null });

    try {
      const res = await fetch("/api/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: editingClient.client_id,
          name: formData.name,
          description: formData.description,
          redirect_uris: formData.redirect_uris,
          logo_url: formData.logo_url,
          is_internal: formData.is_internal,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể cập nhật client");
      }

      set({ editingClient: null });
      await fetchClients();
    } catch (err) {
      set({ formError: err instanceof Error ? err.message : String(err) });
    } finally {
      set({ isSubmitting: false });
    }
  },

  setDeletingClient: (deletingClient) => set({ deletingClient }),

  handleDeleteSubmit: async () => {
    const { deletingClient, fetchClients } = get();
    if (!deletingClient) return;

    set({ isSubmitting: true });
    try {
      const res = await fetch(
        `/api/clients?clientId=${encodeURIComponent(deletingClient.client_id)}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể xóa client");
      }

      set({ deletingClient: null });
      await fetchClients();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa client");
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
