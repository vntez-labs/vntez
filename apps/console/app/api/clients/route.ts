import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "@workspace/auth/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export interface OAuthClientRecord {
  client_id: string;
  name: string;
  description: string | null;
  redirect_uris: string[];
  created_at: string;
  logo_url: string | null;
  is_internal: boolean;
  codes_count?: number;
}

// 1. GET /api/clients - Lấy toàn bộ danh sách Client OAuth từ Supabase
export async function GET() {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseClient = getSupabaseAdminClient();

    const [clientsRes, codesRes] = await Promise.all([
      supabaseClient
        .from("oauth_clients")
        .select("*")
        .order("created_at", { ascending: false }),
      supabaseClient.from("oauth_codes").select("client_id"),
    ]);

    if (clientsRes.error) {
      throw clientsRes.error;
    }

    const codes = codesRes.data || [];
    const codeCounts: Record<string, number> = {};
    codes.forEach((c) => {
      if (c.client_id) {
        codeCounts[c.client_id] = (codeCounts[c.client_id] || 0) + 1;
      }
    });

    const clients: OAuthClientRecord[] = (clientsRes.data || []).map((cl) => ({
      client_id: cl.client_id,
      name: cl.name,
      description: cl.description,
      redirect_uris: Array.isArray(cl.redirect_uris) ? cl.redirect_uris : [],
      created_at: cl.created_at,
      logo_url: cl.logo_url,
      is_internal: Boolean(cl.is_internal),
      codes_count: codeCounts[cl.client_id] || 0,
    }));

    return NextResponse.json({
      success: true,
      clients,
      total: clients.length,
    });
  } catch (err) {
    console.error("GET /api/clients error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

// 2. POST /api/clients - Thêm mới OAuth Client
export async function POST(req: Request) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, client_id, description, redirect_uris, logo_url, is_internal } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Tên ứng dụng client không được để trống" },
        { status: 400 }
      );
    }

    // Parse & sanitize redirect URIs
    let parsedUris: string[] = [];
    if (Array.isArray(redirect_uris)) {
      parsedUris = redirect_uris
        .map((u) => String(u).trim())
        .filter((u) => u.length > 0);
    } else if (typeof redirect_uris === "string") {
      parsedUris = redirect_uris
        .split(/[\n,]+/)
        .map((u) => u.trim())
        .filter((u) => u.length > 0);
    }

    if (parsedUris.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cần cung cấp ít nhất một Redirect URI hợp lệ" },
        { status: 400 }
      );
    }

    // Auto-generate secure client_id if not provided
    const finalClientId =
      client_id && typeof client_id === "string" && client_id.trim()
        ? client_id.trim()
        : `vntez_${crypto.randomBytes(12).toString("hex")}`;

    const newRecord = {
      client_id: finalClientId,
      name: name.trim(),
      description: description?.trim() || null,
      redirect_uris: parsedUris,
      logo_url: logo_url?.trim() || null,
      is_internal: Boolean(is_internal),
      created_at: new Date().toISOString(),
    };

    const supabaseClient = getSupabaseAdminClient();
    const { data, error } = await supabaseClient
      .from("oauth_clients")
      .insert([newRecord])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Tạo Client OAuth thành công",
      client: data,
    });
  } catch (err) {
    console.error("POST /api/clients error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

// 3. PUT /api/clients - Cập nhật thông tin OAuth Client
export async function PUT(req: Request) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { client_id, name, description, redirect_uris, logo_url, is_internal } = body;

    if (!client_id) {
      return NextResponse.json(
        { success: false, error: "Thiếu client_id cần cập nhật" },
        { status: 400 }
      );
    }

    // Parse & sanitize redirect URIs
    let parsedUris: string[] = [];
    if (Array.isArray(redirect_uris)) {
      parsedUris = redirect_uris
        .map((u) => String(u).trim())
        .filter((u) => u.length > 0);
    } else if (typeof redirect_uris === "string") {
      parsedUris = redirect_uris
        .split(/[\n,]+/)
        .map((u) => u.trim())
        .filter((u) => u.length > 0);
    }

    const updates: Record<string, unknown> = {};
    if (name) updates.name = String(name).trim();
    if (description !== undefined) updates.description = description ? String(description).trim() : null;
    if (parsedUris.length > 0) updates.redirect_uris = parsedUris;
    if (logo_url !== undefined) updates.logo_url = logo_url ? String(logo_url).trim() : null;
    if (is_internal !== undefined) updates.is_internal = Boolean(is_internal);

    const supabaseClient = getSupabaseAdminClient();
    const { data, error } = await supabaseClient
      .from("oauth_clients")
      .update(updates)
      .eq("client_id", client_id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật Client thành công",
      client: data,
    });
  } catch (err) {
    console.error("PUT /api/clients error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

// 4. DELETE /api/clients - Xóa OAuth Client
export async function DELETE(req: Request) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    let clientId = searchParams.get("clientId");

    if (!clientId) {
      try {
        const body = await req.json();
        clientId = body.clientId || body.client_id;
      } catch {
        // query param was empty and body not json
      }
    }

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: "Thiếu client_id cần xóa" },
        { status: 400 }
      );
    }

    const supabaseClient = getSupabaseAdminClient();

    // 1. Delete any cascading auth codes referencing this client
    await supabaseClient.from("oauth_codes").delete().eq("client_id", clientId);

    // 2. Delete the client itself
    const { error } = await supabaseClient
      .from("oauth_clients")
      .delete()
      .eq("client_id", clientId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Đã xóa thành công Client "${clientId}"`,
    });
  } catch (err) {
    console.error("DELETE /api/clients error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
