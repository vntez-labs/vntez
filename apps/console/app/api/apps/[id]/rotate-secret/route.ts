import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-guard";
import { generateAppSecret } from "@/lib/apps-repository";
import {
  getFullAppWorkspace,
  saveFullAppWorkspace,
} from "@/lib/apps-storage-service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_req: Request, { params }: RouteParams) {
  const auth = await verifyAdminSession();
  if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Thiếu ID ứng dụng" }, { status: 400 });
  }

  try {
    const app = await getFullAppWorkspace(id);
    if (!app) {
      return NextResponse.json({ error: "Không tìm thấy ứng dụng" }, { status: 404 });
    }

    const newSecret = generateAppSecret();
    app.clientSecret = newSecret;
    app.updatedAt = new Date().toISOString();

    await saveFullAppWorkspace(app);

    return NextResponse.json({
      success: true,
      clientSecret: newSecret,
      message: "Đã tạo mới và cập nhật Client Secret thành công",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi khi cấp mới Client Secret";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
