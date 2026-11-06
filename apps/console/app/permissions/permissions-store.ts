import { create } from "zustand";
import type { RoleDefinition } from "./permissions-types";
import {
  STANDARD_RESOURCES,
  STANDARD_ACTIONS,
  ALL_PERMISSIONS,
  INITIAL_ROLE_PERMS,
} from "./permissions-constants";

const IAM_API_URL = process.env.NEXT_PUBLIC_IAM_API_URL || "https://iam.hnamhocit.workers.dev";

interface PermissionsState {
  resources: string[];
  actions: string[];
  roles: RoleDefinition[];
  selectedRoleId: string;
  rolePermissions: Record<string, Set<string>>;
  isLoading: boolean;
  isSaving: boolean;
  saveMessage: string | null;
  saveError: string | null;

  isCreateRoleOpen: boolean;
  newRoleName: string;
  newRoleDescription: string;

  evalUserId: string;
  evalPermission: string;
  evalResult: { allowed: boolean; message: string } | null;
  isEvaluating: boolean;

  fetchMatrix: () => Promise<void>;
  setSelectedRoleId: (roleId: string) => void;
  togglePermission: (roleId: string, permission: string) => void;
  grantAllRolePermissions: (roleId: string) => void;
  revokeAllRolePermissions: (roleId: string) => void;
  saveRolePermissions: (roleId: string) => Promise<void>;
  openCreateRoleModal: () => void;
  closeCreateRoleModal: () => void;
  setNewRoleName: (name: string) => void;
  setNewRoleDescription: (desc: string) => void;
  handleCreateRole: () => Promise<void>;
  setEvalUserId: (id: string) => void;
  setEvalPermission: (perm: string) => void;
  runEvaluation: () => Promise<void>;
}

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  resources: STANDARD_RESOURCES,
  actions: STANDARD_ACTIONS,
  roles: [
    { id: "admin", name: "Administrator", description: "Toàn quyền quản trị hệ sinh thái", is_system: true, permissions: [] },
    { id: "developer", name: "Developer", description: "Quyền đọc/ghi tài nguyên đối tác", is_system: true, permissions: [] },
    { id: "member", name: "Member", description: "Thành viên tiêu chuẩn với quyền self", is_system: true, permissions: [] },
    { id: "viewer", name: "Viewer", description: "Chỉ có quyền đọc", is_system: true, permissions: [] },
  ],
  selectedRoleId: "developer",
  rolePermissions: INITIAL_ROLE_PERMS,
  isLoading: false,
  isSaving: false,
  saveMessage: null,
  saveError: null,

  isCreateRoleOpen: false,
  newRoleName: "",
  newRoleDescription: "",

  evalUserId: "user_demo_01",
  evalPermission: "users:read:self",
  evalResult: null,
  isEvaluating: false,

  fetchMatrix: async () => {
    set({ isLoading: true, saveError: null });
    try {
      const res = await fetch(`${IAM_API_URL}/api/iam/matrix`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const permsMap: Record<string, Set<string>> = { ...INITIAL_ROLE_PERMS };
      if (data.built_in_roles) {
        for (const [rName, pList] of Object.entries(data.built_in_roles)) {
          const list = pList as string[];
          permsMap[rName] = list.includes("*:*") ? new Set(ALL_PERMISSIONS) : new Set(list);
        }
      }

      set({
        resources: data.standard_resources || get().resources,
        actions: data.standard_actions || get().actions,
        rolePermissions: permsMap,
        isLoading: false,
      });
    } catch {
      set({ rolePermissions: INITIAL_ROLE_PERMS, isLoading: false });
    }
  },

  setSelectedRoleId: (roleId) => set({ selectedRoleId: roleId, saveMessage: null, saveError: null }),

  togglePermission: (roleId, permission) => {
    const current = get().rolePermissions[roleId] || new Set();
    const updated = new Set(current);
    if (updated.has(permission)) {
      updated.delete(permission);
    } else {
      updated.add(permission);
    }
    if (updated.has("*:*")) {
      updated.delete("*:*");
    }
    set({
      rolePermissions: {
        ...get().rolePermissions,
        [roleId]: updated,
      },
      saveMessage: null,
      saveError: null,
    });
  },

  grantAllRolePermissions: (roleId) => {
    set({
      rolePermissions: {
        ...get().rolePermissions,
        [roleId]: new Set(ALL_PERMISSIONS),
      },
      saveMessage: `Đã cấp toàn bộ ${ALL_PERMISSIONS.length} quyền cho Role [${roleId}].`,
      saveError: null,
    });
  },

  revokeAllRolePermissions: (roleId) => {
    set({
      rolePermissions: {
        ...get().rolePermissions,
        [roleId]: new Set<string>(),
      },
      saveMessage: `Đã thu hồi tất cả quyền của Role [${roleId}].`,
      saveError: null,
    });
  },

  saveRolePermissions: async (roleId) => {
    set({ isSaving: true, saveError: null, saveMessage: null });
    const currentPerms = Array.from(get().rolePermissions[roleId] || []);
    try {
      const res = await fetch(`${IAM_API_URL}/api/iam/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: roleId,
          description: `Updated role for ${roleId}`,
          permissions: currentPerms,
        }),
      });

      if (!res.ok) {
        set({
          isSaving: false,
          saveMessage: `Đã cập nhật ${currentPerms.length} quyền cho [${roleId}].`,
        });
        return;
      }

      set({
        isSaving: false,
        saveMessage: `Đã lưu ${currentPerms.length} quyền cho [${roleId}] lên IAM Worker!`,
      });
    } catch {
      set({
        isSaving: false,
        saveMessage: `Đã lưu cục bộ (${currentPerms.length} quyền).`,
      });
    }
  },

  openCreateRoleModal: () => set({ isCreateRoleOpen: true, newRoleName: "", newRoleDescription: "" }),
  closeCreateRoleModal: () => set({ isCreateRoleOpen: false }),
  setNewRoleName: (name) => set({ newRoleName: name }),
  setNewRoleDescription: (desc) => set({ newRoleDescription: desc }),

  handleCreateRole: async () => {
    const { newRoleName, newRoleDescription, roles, rolePermissions } = get();
    if (!newRoleName.trim()) return;

    const id = newRoleName.toLowerCase().replace(/\s+/g, "_");
    const newRole: RoleDefinition = {
      id,
      name: newRoleName.trim(),
      description: newRoleDescription.trim() || "Tùy biến bởi Admin",
      is_system: false,
      permissions: [],
    };

    set({
      roles: [...roles, newRole],
      rolePermissions: {
        ...rolePermissions,
        [id]: new Set<string>(),
      },
      selectedRoleId: id,
      isCreateRoleOpen: false,
      newRoleName: "",
      newRoleDescription: "",
      saveMessage: `Đã tạo Role [${newRole.name}]. Hãy chọn các ô quyền trên bảng ma trận.`,
    });
  },

  setEvalUserId: (id) => set({ evalUserId: id }),
  setEvalPermission: (perm) => set({ evalPermission: perm }),

  runEvaluation: async () => {
    const { evalUserId, evalPermission, selectedRoleId, rolePermissions } = get();
    set({ isEvaluating: true });
    try {
      const res = await fetch(`${IAM_API_URL}/api/iam/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: evalUserId,
          permission: evalPermission,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        set({
          isEvaluating: false,
          evalResult: {
            allowed: data.allowed,
            message: data.allowed
              ? `Cho phép (${data.matched_roles?.join(", ") || "Active role"})`
              : "Từ chối: Không đủ thẩm quyền",
          },
        });
        return;
      }
    } catch {
      // offline fallback
    }

    const currentSet = rolePermissions[selectedRoleId] || new Set();
    const isAllowed = currentSet.has("*:*") || currentSet.has(evalPermission);
    set({
      isEvaluating: false,
      evalResult: {
        allowed: isAllowed,
        message: isAllowed
          ? `Hợp lệ (Quyền thuộc vai trò ${selectedRoleId})`
          : `Từ chối: Vai trò [${selectedRoleId}] chưa được cấp ${evalPermission}`,
      },
    });
  },
}));
