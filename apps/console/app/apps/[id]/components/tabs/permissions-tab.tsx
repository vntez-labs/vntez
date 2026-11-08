"use client";

import React, { useState } from "react";
import { useAppWorkspaceStore } from "../../app-workspace-store";
import {
  STANDARD_APP_RESOURCES,
  STANDARD_APP_ACTIONS,
  DEFAULT_APP_ROLES,
} from "@/lib/apps-repository";
import { PermissionsToolbar } from "./permissions/permissions-toolbar";
import { PermissionsMatrixGrid } from "./permissions/permissions-matrix-grid";
import { CreateAppRoleModal } from "./create-app-role-modal";
import type { AppRole } from "@workspace/ui/lib/content-types";

export function PermissionsTab() {
  const { app, updateApp } = useAppWorkspaceStore();
  const [selectedRoleId, setSelectedRoleId] = useState("admin");
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!app) return null;

  const roles: AppRole[] = app.roles && app.roles.length > 0 ? app.roles : DEFAULT_APP_ROLES;
  const resources: string[] = app.resources && app.resources.length > 0 ? app.resources : STANDARD_APP_RESOURCES;
  const rolePerms = app.rolePermissions || {};

  const fallbackRole: AppRole = {
    id: "admin",
    name: "Quản trị viên (Admin)",
    description: "Toàn quyền quản trị tài nguyên app",
    isSystem: true,
  };
  const currentRole = roles.find((r) => r.id === selectedRoleId) || roles[0] || fallbackRole;
  const activePermsForRole = new Set(rolePerms[currentRole.id] || []);

  const handleTogglePerm = (resource: string, action: string) => {
    const key = `${app.id}:${resource}:${action}`;
    const nextSet = new Set(activePermsForRole);
    if (nextSet.has(key)) {
      nextSet.delete(key);
    } else {
      nextSet.add(key);
    }

    const updated = {
      ...rolePerms,
      [currentRole.id]: Array.from(nextSet),
    };
    updateApp({ rolePermissions: updated });
  };

  const handleGrantAllForResource = (res: string) => {
    const nextSet = new Set(activePermsForRole);
    STANDARD_APP_ACTIONS.forEach((act) => nextSet.add(`${app.id}:${res}:${act}`));
    updateApp({ rolePermissions: { ...rolePerms, [currentRole.id]: Array.from(nextSet) } });
  };

  const handleGrantAllRole = () => {
    const nextSet = new Set<string>();
    resources.forEach((r) => {
      STANDARD_APP_ACTIONS.forEach((a) => nextSet.add(`${app.id}:${r}:${a}`));
    });
    updateApp({ rolePermissions: { ...rolePerms, [currentRole.id]: Array.from(nextSet) } });
  };

  const handleRevokeAllRole = () => {
    updateApp({ rolePermissions: { ...rolePerms, [currentRole.id]: [] } });
  };

  const handleGrantReadOnly = () => {
    const nextSet = new Set<string>();
    resources.forEach((r) => {
      nextSet.add(`${app.id}:${r}:read:self`);
      nextSet.add(`${app.id}:${r}:read:all`);
    });
    updateApp({ rolePermissions: { ...rolePerms, [currentRole.id]: Array.from(nextSet) } });
  };

  const handleAddRole = (newRole: AppRole) => {
    const updatedRoles = [...roles, newRole];
    const updatedPerms = { ...rolePerms, [newRole.id]: [`${app.id}:users:read:self`] };
    updateApp({ roles: updatedRoles, rolePermissions: updatedPerms });
    setSelectedRoleId(newRole.id);
  };

  return (
    <div className="space-y-6 min-w-0">
      <PermissionsToolbar
        appId={app.id}
        roles={roles}
        currentRole={currentRole}
        rolePerms={rolePerms}
        onSelectRole={setSelectedRoleId}
        onOpenCreateRole={() => setIsModalOpen(true)}
        onGrantAll={handleGrantAllRole}
        onGrantReadOnly={handleGrantReadOnly}
        onRevokeAll={handleRevokeAllRole}
      />

      <PermissionsMatrixGrid
        appId={app.id}
        resources={resources}
        rolePerms={activePermsForRole}
        onTogglePerm={handleTogglePerm}
        onGrantAllForResource={handleGrantAllForResource}
      />

      <CreateAppRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddRole={handleAddRole}
      />
    </div>
  );
}
