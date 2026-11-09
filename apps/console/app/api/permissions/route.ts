import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import {
  fetchRootPermissionsMatrix,
  saveRootPermissionsMatrix,
  type StoredPermissionsMatrix,
} from "@/lib/permissions-storage-service";

export async function GET() {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const matrix = await fetchRootPermissionsMatrix();
    return NextResponse.json({
      ok: true,
      data: matrix,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || "Failed to fetch matrix" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const current = await fetchRootPermissionsMatrix();

    let updatedRoles = [...current.roles];
    let updatedResources = [...current.resources];
    const updatedPerms = { ...current.rolePermissions };

    // 1. Update permissions for a specific role
    if (body.roleId && Array.isArray(body.permissions)) {
      updatedPerms[body.roleId] = body.permissions;
    }

    // 2. Add or update role definition
    if (body.role && body.role.id) {
      const idx = updatedRoles.findIndex((r) => r.id === body.role.id);
      if (idx >= 0) {
        updatedRoles[idx] = { ...updatedRoles[idx], ...body.role };
      } else {
        updatedRoles.push(body.role);
      }
    }

    // 3. Add resource
    if (body.resource && typeof body.resource === "string") {
      const cleanRes = body.resource.toLowerCase().trim();
      if (!updatedResources.includes(cleanRes)) {
        updatedResources.push(cleanRes);
      }
    }

    // 4. Batch full update
    if (body.roles && Array.isArray(body.roles)) {
      updatedRoles = body.roles;
    }
    if (body.resources && Array.isArray(body.resources)) {
      updatedResources = body.resources;
    }
    if (body.rolePermissions && typeof body.rolePermissions === "object") {
      Object.assign(updatedPerms, body.rolePermissions);
    }

    const saved = await saveRootPermissionsMatrix({
      roles: updatedRoles,
      resources: updatedResources,
      rolePermissions: updatedPerms,
    });

    if (!saved) {
      return NextResponse.json(
        { ok: false, error: "Lưu ma trận phân quyền thất bại" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Đã lưu ma trận phân quyền thành công vào R2",
      data: saved,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || "Lỗi xử lý yêu cầu" },
      { status: 500 }
    );
  }
}
