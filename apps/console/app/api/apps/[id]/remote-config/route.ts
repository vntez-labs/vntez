import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import {
  getFullAppWorkspace,
  saveFullAppWorkspace,
} from "@/lib/apps-storage-service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: Request, { params }: RouteParams) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Thiếu ID ứng dụng" }, { status: 400, headers: CORS_HEADERS });
  }

  const app = await getFullAppWorkspace(id);
  if (!app) {
    return NextResponse.json({ error: "Không tìm thấy ứng dụng" }, { status: 404, headers: CORS_HEADERS });
  }

  return NextResponse.json(
    {
      app_id: app.id,
      name: app.name,
      status: app.status,
      remote_config: app.remoteConfig || {},
      updated_at: app.updatedAt,
    },
    {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
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
    const app = await getFullAppWorkspace(id);
    if (!app) {
      return NextResponse.json({ error: "Không tìm thấy ứng dụng" }, { status: 404 });
    }

    const config = body.remoteConfig || body.remote_config || body;
    if (typeof config !== "object" || config === null) {
      return NextResponse.json({ error: "Cấu hình phải là một đối tượng JSON" }, { status: 400 });
    }

    app.remoteConfig = config;
    app.updatedAt = new Date().toISOString();
    await saveFullAppWorkspace(app);

    return NextResponse.json({
      success: true,
      remoteConfig: app.remoteConfig,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi cập nhật Remote Config";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
