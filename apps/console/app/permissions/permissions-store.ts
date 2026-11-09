import { create } from "zustand";
import { api } from "@workspace/ui/lib/api-client";
import { toast } from "@workspace/ui/components/toaster";
import type { RoleDefinition } from "./permissions-types";
import {
  STANDARD_RESOURCES,
  STANDARD_ACTIONS,
  ALL_PERMISSIONS,
  ROOT_DEFAULT_ROLES,
} from "./permissions-constants";

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
  isCreateResourceOpen: boolean;
  newResourceName: string;
  newResourceDescription: string;

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

  openCreateResourceModal: () => void;
  closeCreateResourceModal: () => void;
  setNewResourceName: (name: string) => void;
  setNewResourceDescription: (desc: string) => void;
  handleCreateResource: () => Promise<void>;
}

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  resources: STANDARD_RESOURCES,
  actions: STANDARD_ACTIONS,
  roles: ROOT_DEFAULT_ROLES,
  selectedRoleId: "developer",
  rolePermissions: {},
  isLoading: false,
  isSaving: false,
  saveMessage: null,
  saveError: null,

  isCreateRoleOpen: false,
  newRoleName: "",
  newRoleDescription: "",
  isCreateResourceOpen: false,
  newResourceName: "",
  newResourceDescription: "",

  fetchMatrix: async () => {
    set({ isLoading: true, saveError: null });
    try {
      const res = await api.get<{ ok?: boolean; data?: any }>("/api/permissions");

      if (res.ok && res.data) {
        const { resources, actions, roles, rolePermissions } = res.data;
        const resKeys = Array.isArray(resources) && resources.length > 0 ? resources : STANDARD_RESOURCES;
        const actKeys = Array.isArray(actions) && actions.length > 0 ? actions : STANDARD_ACTIONS;
        const roleDefs: RoleDefinition[] = Array.isArray(roles) && roles.length > 0 ? roles : ROOT_DEFAULT_ROLES;
        const permsMap: Record<string, Set<string>> = {};

        roleDefs.forEach((r) => {
          const list: string[] = rolePermissions?.[r.id] || r.permissions || [];
          permsMap[r.id] = list.includes("*:*") ? new Set(ALL_PERMISSIONS) : new Set(list);
        });

        set({
          resources: resKeys,
          actions: actKeys,
          roles: roleDefs,
          rolePermissions: permsMap,
        });
      }
    } catch (err) {
      console.warn("Failed to load Root permissions matrix:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedRoleId: (roleId) => set({ selectedRoleId: roleId, saveMessage: null, saveError: null }),

  togglePermission: (roleId, permission) => {
    const current = get().rolePermissions[roleId] || new Set();
    const updated = new Set(current);
    if (updated.has(permission)) updated.delete(permission);
    else updated.add(permission);
    if (updated.has("*:*")) updated.delete("*:*");

    set({ rolePermissions: { ...get().rolePermissions, [roleId]: updated } });
  },

  grantAllRolePermissions: (roleId) => {
    const { resources, actions } = get();
    const allPerms: string[] = [];
    resources.forEach((r) => {
      actions.forEach((a) => {
        allPerms.push(`${r}:${a}`);
      });
    });

    set({
      rolePermissions: { ...get().rolePermissions, [roleId]: new Set(allPerms) },
      saveMessage: `Đã cấp tất cả (${allPerms.length} quyền) cho vai trò.`,
    });
  },

  revokeAllRolePermissions: (roleId) => {
    set({
      rolePermissions: { ...get().rolePermissions, [roleId]: new Set<string>() },
      saveMessage: "Đã thu hồi toàn bộ quyền của vai trò.",
    });
  },

  saveRolePermissions: async (roleId) => {
    const { rolePermissions } = get();
    set({ isSaving: true, saveError: null, saveMessage: null });
    const currentPerms = Array.from(rolePermissions[roleId] || []);

    try {
      const res = await api.post<{ ok: boolean; message?: string }>("/api/permissions", {
        roleId,
        permissions: currentPerms,
      });

      if (res.ok) {
        toast.success(`Đã lưu ${currentPerms.length} quyền cho Root Role [${roleId}] vào R2!`);
        set({ isSaving: false, saveMessage: `Đã lưu thành công (${currentPerms.length} quyền)!` });
      } else {
        throw new Error("Lưu thất bại");
      }
    } catch (err: any) {
      toast.error(`Lỗi khi lưu quyền: ${err.message || "Không xác định"}`);
      set({ isSaving: false, saveError: "Lỗi khi lưu ma trận phân quyền." });
    }
  },

  openCreateRoleModal: () => set({ isCreateRoleOpen: true, newRoleName: "", newRoleDescription: "" }),
  closeCreateRoleModal: () => set({ isCreateRoleOpen: false }),
  setNewRoleName: (newRoleName) => set({ newRoleName }),
  setNewRoleDescription: (newRoleDescription) => set({ newRoleDescription }),

  handleCreateRole: async () => {
    const { newRoleName, newRoleDescription, roles, rolePermissions } = get();
    if (!newRoleName.trim()) return;

    const id = newRoleName.toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
    const newRole: RoleDefinition = {
      id,
      name: newRoleName.trim(),
      description: newRoleDescription.trim() || "Vai trò tùy biến cấp Root",
      app_id: null,
      is_system: false,
      permissions: [],
    };

    set({
      roles: [...roles, newRole],
      rolePermissions: { ...rolePermissions, [id]: new Set<string>() },
      selectedRoleId: id,
      isCreateRoleOpen: false,
      newRoleName: "",
      newRoleDescription: "",
    });

    try {
      await api.post("/api/permissions", { role: newRole });
      toast.success(`Đã tạo Root Role "${newRole.name}" thành công!`);
    } catch {
      toast.info(`Đã tạo Root Role "${newRole.name}" cục bộ.`);
    }
  },

  openCreateResourceModal: () => set({ isCreateResourceOpen: true, newResourceName: "", newResourceDescription: "" }),
  closeCreateResourceModal: () => set({ isCreateResourceOpen: false }),
  setNewResourceName: (newResourceName) => set({ newResourceName }),
  setNewResourceDescription: (newResourceDescription) => set({ newResourceDescription }),

  handleCreateResource: async () => {
    const { newResourceName, resources } = get();
    if (!newResourceName.trim()) return;

    const key = newResourceName.toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
    if (resources.includes(key)) {
      toast.error(`Resource "${key}" đã tồn tại!`);
      return;
    }

    set({
      resources: [...resources, key],
      isCreateResourceOpen: false,
      newResourceName: "",
      newResourceDescription: "",
    });

    try {
      await api.post("/api/permissions", { resource: key });
      toast.success(`Đã thêm Resource "${key}" cho Root IAM!`);
    } catch {
      toast.info(`Đã thêm Resource "${key}" cục bộ.`);
    }
  },
}));
