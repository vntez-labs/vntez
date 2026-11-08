import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import {
  getFullAppWorkspace,
  saveFullAppWorkspace,
} from "@/lib/apps-storage-service";
import { getStoredApps, saveStoredApps } from "@/lib/storage-content";
import { deleteR2AssetByUrl } from "@/lib/r2-gc";
import type { AppItem } from "@workspace/ui/lib/content-types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Thiếu ID ứng dụng" }, { status: 400 });
  }

  const app = await getFullAppWorkspace(id);
  if (!app) {
    return NextResponse.json({ error: "Không tìm thấy ứng dụng" }, { status: 404 });
  }

  return NextResponse.json({ success: true, app });
}

export async function PUT(req: Request, { params }: RouteParams) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Thiếu ID ứng dụng" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const current = await getFullAppWorkspace(id);
    if (!current) {
      return NextResponse.json({ error: "Không tìm thấy ứng dụng" }, { status: 404 });
    }

    // Purge old avatar from R2 if avatarUrl is modified
    if (current.avatarUrl && body.avatarUrl !== undefined && body.avatarUrl !== current.avatarUrl) {
      await deleteR2AssetByUrl(current.avatarUrl);
    }

    const updated: AppItem = {
      ...current,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveFullAppWorkspace(updated);
    if (!saved) throw new Error("Lưu ứng dụng thất bại");

    return NextResponse.json({ success: true, app: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi cập nhật ứng dụng";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Thiếu ID ứng dụng" }, { status: 400 });
  }

  try {
    const apps = await getStoredApps();
    const target = apps.find((a) => a.id === id);
    if (target?.avatarUrl) {
      await deleteR2AssetByUrl(target.avatarUrl);
    }

    const remaining = apps.filter((a) => a.id !== id);
    await saveStoredApps(remaining);

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xóa ứng dụng";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
