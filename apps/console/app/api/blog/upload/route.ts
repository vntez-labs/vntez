import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-guard";
import { uploadAssetFile } from "@/lib/storage-content";

export async function POST(req: Request) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Chưa chọn file tải lên" }, { status: 400 });
    }

    const publicUrl = await uploadAssetFile("thumbnails", file);
    if (!publicUrl) {
      return NextResponse.json({ error: "Tải file lên bucket thất bại" }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lỗi xử lý upload" }, { status: 500 });
  }
}
