import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { uploadAssetFile } from "@/lib/storage-content";

export async function POST(req: Request) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Chưa chọn file tải lên" }, { status: 400 });
    }

    const publicUrl = await uploadAssetFile("avatars", file);
    if (!publicUrl) {
      return NextResponse.json({ error: "Tải file lên bucket thất bại" }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lỗi xử lý upload" }, { status: 500 });
  }
}
