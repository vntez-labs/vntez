import { create } from "zustand";
import type { SupabaseAuthUser } from "@/app/api/users/route";

interface AddUserData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

interface EditUserData {
  name: string;
  role: string;
  status: "active" | "inactive";
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
  editingUser: SupabaseAuthUser | null;
  isSubmitting: boolean;
  formError: string | null;
  addFormData: AddUserData;
  editFormData: EditUserData;

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

  openEditUserModal: (user: SupabaseAuthUser) => void;
  closeEditUserModal: () => void;
  setEditFormData: (data: Partial<EditUserData>) => void;
  handleEditUserSubmit: (e: React.FormEvent) => Promise<void>;

  setDeletingUser: (user: SupabaseAuthUser | null) => void;
  handleDeleteUserSubmit: () => Promise<void>;
}

const initialAddFormData: AddUserData = {
  email: "",
  password: "",
  full_name: "",
  phone: "",
};

const initialEditFormData: EditUserData = {
  name: "",
  role: "Viewer",
  status: "active",
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
  editingUser: null,
  isSubmitting: false,
  formError: null,
  addFormData: initialAddFormData,
  editFormData: initialEditFormData,

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        const users: SupabaseAuthUser[] = data.users || [];
        set({ users });

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

  openEditUserModal: (user: SupabaseAuthUser) =>
    set({
      editingUser: user,
      formError: null,
      editFormData: {
        name: user.name,
        role: user.role.includes("Super Admin")
          ? "Admin"
          : user.role.includes("Dev")
            ? "Developer"
            : user.role.includes("Operator")
              ? "Operator"
              : user.role.includes("Member") || user.role.includes("Viewer")
                ? "Viewer"
                : user.role,
        status: user.status,
      },
    }),

  closeEditUserModal: () => set({ editingUser: null, formError: null }),

  setEditFormData: (data) =>
    set((state) => ({ editFormData: { ...state.editFormData, ...data } })),

  handleEditUserSubmit: async (e: React.FormEvent) => {
    e.preventDefault();
    const { editingUser, editFormData, fetchUsers } = get();
    if (!editingUser) return;

    set({ isSubmitting: true, formError: null });

    try {
      const res = await fetch("/api/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingUser.id,
          name: editFormData.name.trim(),
          role: editFormData.role,
          status: editFormData.status,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể cập nhật người dùng trên Supabase Auth");
      }

      set({ editingUser: null });
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
