import { create } from "zustand";
import type { RoleDefinition } from "./permissions-types";
import {
  STANDARD_RESOURCES,
  STANDARD_ACTIONS,
  ALL_PERMISSIONS,
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
    { id: "admin", name: "Quản trị viên (Admin)", description: "Toàn quyền kiểm soát mọi tài nguyên trên hệ thống", is_system: true, permissions: [] },
    { id: "developer", name: "Lập trình viên (Developer)", description: "Toàn quyền với Storage, TeleBot, OAuth Clients", is_system: true, permissions: [] },
    { id: "member", name: "Thành viên (Member)", description: "Chỉ quản lý tài nguyên của chính mình (Self scope)", is_system: true, permissions: [] },
    { id: "viewer", name: "Người xem (Viewer)", description: "Chỉ được xem thông tin công khai", is_system: true, permissions: [] },
  ],
  selectedRoleId: "developer",
  rolePermissions: {},
  isLoading: false,
  isSaving: false,
  saveMessage: null,
  saveError: null,

  isCreateRoleOpen: false,
  newRoleName: "",
  newRoleDescription: "",

  evalUserId: "admin_user_01",
  evalPermission: "users:read:all",
  evalResult: null,
  isEvaluating: false,

  fetchMatrix: async () => {
    set({ isLoading: true, saveError: null });
    try {
      const res = await fetch(`${IAM_API_URL}/api/iam/matrix`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (json.ok && json.data) {
        const { resources, roles, allActions } = json.data;
        const resKeys = Array.isArray(resources) ? resources.map((r: { id: string }) => r.id) : STANDARD_RESOURCES;
        const actKeys = Array.isArray(allActions) ? allActions.map((a: { key: string }) => a.key) : STANDARD_ACTIONS;

        const roleDefs: RoleDefinition[] = [];
        const permsMap: Record<string, Set<string>> = {};

        if (Array.isArray(roles)) {
          for (const r of roles) {
            roleDefs.push({
              id: r.id,
              name: r.name,
              description: r.description,
              is_system: r.is_system,
              permissions: r.permissions || [],
            });

            const pList: string[] = r.permissions || [];
            if (pList.includes("*:*")) {
              permsMap[r.id] = new Set(ALL_PERMISSIONS);
            } else {
              permsMap[r.id] = new Set(pList);
            }
          }
        }

        set({
          resources: resKeys,
          actions: actKeys,
          roles: roleDefs.length > 0 ? roleDefs : get().roles,
          rolePermissions: permsMap,
          isLoading: false,
        });
        return;
      }
    } catch (err) {
      console.error("Failed to load real IAM matrix:", err);
    }
    set({ isLoading: false });
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
          saveMessage: `Đã lưu cục bộ ${currentPerms.length} quyền cho [${roleId}].`,
        });
        return;
      }

      set({
        isSaving: false,
        saveMessage: `Đã đồng bộ ${currentPerms.length} quyền của [${roleId}] lên IAM Worker!`,
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

    // Split permission into resource and action (e.g. "users:read:self" -> resource="users", action="read:self")
    const parts = evalPermission.split(":");
    const resource = parts[0] || "users";
    const action = parts.slice(1).join(":") || "read:self";

    try {
      const res = await fetch(`${IAM_API_URL}/api/iam/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: evalUserId,
          resource,
          action,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        set({
          isEvaluating: false,
          evalResult: {
            allowed: Boolean(data.allowed),
            message: data.reason || (data.allowed ? "Cho phép: Thẩm quyền hợp lệ" : "Từ chối: Không đủ quyền truy cập"),
          },
        });
        return;
      }
    } catch (err) {
      console.warn("IAM evaluation remote call failed:", err);
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
