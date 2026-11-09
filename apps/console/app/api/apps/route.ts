import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@workspace/auth/server";
import { getStoredApps } from "@/lib/storage-content";
import {
  fetchAppMetadataMap,
  saveFullAppWorkspace,
} from "@/lib/apps-storage-service";
import { generateAppClientId, generateAppSecret } from "@/lib/apps-repository";
import type { AppItem } from "@workspace/ui/lib/content-types";

const createAppSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Tên ứng dụng không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  category: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  color: z.string().optional(),
  ctaLink: z.string().optional(),
  url: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  illustrationKey: z.enum(["storage", "security", "offline", "supply-chain", "telemetry", "ecosystem", "iam", "sdk"]).optional(),
  status: z.enum(["active", "draft"]).optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  redirectUris: z.array(z.string()).optional(),
  isInternal: z.boolean().optional(),
  releaseDate: z.string().optional(),
});

export async function GET() {
  const [apps, metaMap] = await Promise.all([
    getStoredApps(),
    fetchAppMetadataMap(),
  ]);

  const enriched = apps.map((a) => {
    const meta = metaMap[a.id];
    return {
      ...a,
      clientId: meta?.clientId || generateAppClientId(a.id),
      redirectUris: meta?.redirectUris || [`https://${a.id}.vntez.net/auth/callback`],
      isInternal: meta?.isInternal ?? true,
    };
  });

  return NextResponse.json({ success: true, apps: enriched });
}

export async function POST(req: Request) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawBody = await req.json();
    const parsed = createAppSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const body = parsed.data;
    const { name, category, description, platforms, color, ctaLink, url, avatarUrl, illustrationKey, status } = body;

    const id = body.id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const clientId = body.clientId || generateAppClientId(id);
    const clientSecret = body.clientSecret || generateAppSecret();

    const resolvedUrl = url !== undefined
      ? (url ? String(url).trim() : null)
      : (ctaLink && String(ctaLink).startsWith("http") ? String(ctaLink).trim() : null);

    const newApp: AppItem = {
      id,
      name: name.trim(),
      description: description.trim(),
      url: resolvedUrl,
      category: category?.trim() || "Tiện ích & Hệ sinh thái",
      releaseDate: body.releaseDate || new Date().toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" }),
      platforms: platforms && platforms.length > 0 ? platforms : ["Web"],
      color: color || "#fb291a",
      ctaLink: resolvedUrl || ctaLink || `/docs/${id}`,
      avatarUrl: avatarUrl || null,
      illustrationKey: illustrationKey || "ecosystem",
      status: status === "draft" ? "draft" : "active",
      clientId,
      clientSecret,
      redirectUris: body.redirectUris && body.redirectUris.length > 0
        ? body.redirectUris
        : [`https://${id}.vntez.net/auth/callback`, "http://localhost:3000/auth/callback"],
      isInternal: body.isInternal !== undefined ? Boolean(body.isInternal) : true,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveFullAppWorkspace(newApp);
    if (!saved) throw new Error("Lưu vào cơ sở dữ liệu thất bại");

    return NextResponse.json({ success: true, app: newApp });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi tạo app";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
