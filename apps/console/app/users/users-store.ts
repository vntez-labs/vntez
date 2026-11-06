import { create } from "zustand";
import type { SupabaseAuthUser } from "@/app/api/users/route";

interface AddUserData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

interface UsersState {
  users: SupabaseAuthUser[];
  isLoading: boolean;
  searchQuery: string;
  copiedId: string | null;

  // Selected user for Slide-over detail drawer
  selectedUser: SupabaseAuthUser | null;
  drawerTab: "overview" | "raw";

  // Modals state
  isAddUserOpen: boolean;
  deletingUser: SupabaseAuthUser | null;
  isSubmitting: boolean;
  formError: string | null;
  addFormData: AddUserData;

  // Actions
  fetchUsers: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  handleCopy: (text: string, id: string) => void;
  setSelectedUser: (user: SupabaseAuthUser | null) => void;
  setDrawerTab: (tab: "overview" | "raw") => void;

  openAddUserModal: () => void;
  closeAddUserModal: () => void;
  setAddFormData: (data: Partial<AddUserData>) => void;
  handleAddUserSubmit: (e: React.FormEvent) => Promise<void>;

  setDeletingUser: (user: SupabaseAuthUser | null) => void;
  handleDeleteUserSubmit: () => Promise<void>;
}

const initialAddFormData: AddUserData = {
  email: "",
  password: "",
  full_name: "",
  phone: "",
};

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  isLoading: true,
  searchQuery: "",
  copiedId: null,

  selectedUser: null,
  drawerTab: "overview",

  isAddUserOpen: false,
  deletingUser: null,
  isSubmitting: false,
  formError: null,
  addFormData: initialAddFormData,

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        const users: SupabaseAuthUser[] = data.users || [];
        set({ users });

        // Update selected user reference if open
        const { selectedUser } = get();
        if (selectedUser) {
          const updated = users.find((u) => u.id === selectedUser.id);
          if (updated) set({ selectedUser: updated });
        }
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
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

  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setDrawerTab: (drawerTab) => set({ drawerTab }),

  openAddUserModal: () =>
    set({
      isAddUserOpen: true,
      formError: null,
      addFormData: initialAddFormData,
    }),

  closeAddUserModal: () => set({ isAddUserOpen: false, formError: null }),

  setAddFormData: (data) =>
    set((state) => ({ addFormData: { ...state.addFormData, ...data } })),

  handleAddUserSubmit: async (e: React.FormEvent) => {
    e.preventDefault();
    const { addFormData, fetchUsers } = get();
    set({ isSubmitting: true, formError: null });

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addFormData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể tạo tài khoản");
      }

      set({ isAddUserOpen: false, addFormData: initialAddFormData });
      await fetchUsers();
    } catch (err) {
      set({ formError: err instanceof Error ? err.message : String(err) });
    } finally {
      set({ isSubmitting: false });
    }
  },

  setDeletingUser: (deletingUser) => set({ deletingUser }),

  handleDeleteUserSubmit: async () => {
    const { deletingUser, selectedUser, fetchUsers } = get();
    if (!deletingUser) return;

    set({ isSubmitting: true });
    try {
      const res = await fetch(
        `/api/users?userId=${encodeURIComponent(deletingUser.id)}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể xóa người dùng");
      }

      if (selectedUser?.id === deletingUser.id) {
        set({ selectedUser: null });
      }
      set({ deletingUser: null });
      await fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa người dùng");
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
