import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { uploadAssetFile } from "@/lib/storage-content";
import { deleteR2AssetByUrl } from "@/lib/r2-gc";

export async function POST(req: Request) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const oldUrl = formData.get("oldUrl") as string | null;
    const appId = formData.get("appId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Chưa chọn file tải lên" }, { status: 400 });
    }

    // Purge old avatar from R2 if replacing to avoid garbage accumulation
    if (oldUrl) {
      await deleteR2AssetByUrl(oldUrl);
    }

    const publicUrl = await uploadAssetFile("avatars", file, appId);
    if (!publicUrl) {
      return NextResponse.json({ error: "Tải file lên bucket thất bại" }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xử lý upload";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return NextResponse.json({ error: "Thiếu tham số url cần xóa" }, { status: 400 });
    }

    const success = await deleteR2AssetByUrl(targetUrl);
    return NextResponse.json({ success });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xóa file R2";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
