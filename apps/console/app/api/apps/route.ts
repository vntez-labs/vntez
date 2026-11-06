import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { getStoredApps, saveStoredApps } from "@/lib/storage-content";
import type { AppItem } from "@workspace/ui/lib/content-types";

export async function GET() {
  const apps = await getStoredApps();
  return NextResponse.json({ success: true, apps });
}

export async function POST(req: Request) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, category, description, platforms, color, ctaLink, avatarUrl, illustrationKey, status } = body;

    if (!name || !description) {
      return NextResponse.json({ error: "Tên và mô tả là bắt buộc" }, { status: 400 });
    }

    const id = body.id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const apps = await getStoredApps();

    if (apps.some((a) => a.id === id)) {
      return NextResponse.json({ error: `App ID [${id}] đã tồn tại` }, { status: 400 });
    }

    const newApp: AppItem = {
      id,
      name: name.trim(),
      category: category?.trim() || "Tiện ích & Hệ sinh thái",
      description: description.trim(),
      releaseDate: body.releaseDate || new Date().toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" }),
      platforms: Array.isArray(platforms) ? platforms : ["Web"],
      color: color || "#fb291a",
      ctaLink: ctaLink || `/docs#${id}`,
      avatarUrl: avatarUrl || null,
      illustrationKey: illustrationKey || "ecosystem",
      status: status === "draft" ? "draft" : "active",
      updatedAt: new Date().toISOString(),
    };

    apps.unshift(newApp);
    const saved = await saveStoredApps(apps);
    if (!saved) throw new Error("Lưu thất bại");

    return NextResponse.json({ success: true, app: newApp });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lỗi tạo app" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "Thiếu ID app" }, { status: 400 });
    }

    const apps = await getStoredApps();
    const index = apps.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Không tìm thấy app" }, { status: 404 });
    }

    apps[index] = {
      ...apps[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveStoredApps(apps);
    if (!saved) throw new Error("Lưu thất bại");

    return NextResponse.json({ success: true, app: apps[index] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lỗi cập nhật app" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Thiếu ID app" }, { status: 400 });
    }

    const apps = await getStoredApps();
    const filtered = apps.filter((a) => a.id !== id);
    const saved = await saveStoredApps(filtered);
    if (!saved) throw new Error("Xóa thất bại");

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lỗi xóa app" }, { status: 500 });
  }
}
