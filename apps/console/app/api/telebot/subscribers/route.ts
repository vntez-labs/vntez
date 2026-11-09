import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("telebot_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });

    if (error) {
      // Table may not exist yet in Supabase schema cache before DDL is executed
      return NextResponse.json({
        success: true,
        subscribers: [],
        tableExists: false,
        message: error.message,
      });
    }

    const subscribers = (data || []).map((s: any) => ({
      chat_id: s.chat_id,
      email: s.email || "",
      user_id: s.user_id || null,
      username: s.username || null,
      first_name: s.first_name || null,
      last_name: s.last_name || null,
      joined_at: s.subscribed_at || s.created_at || new Date().toISOString(),
      status: s.status || "active",
      tags: s.tags || ["all"],
    }));

    return NextResponse.json({
      success: true,
      subscribers,
      tableExists: true,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi khi lấy danh sách subscribers";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { chat_id, email, user_id, username, first_name, last_name, status, tags } = body;

    if (!chat_id || !email) {
      return NextResponse.json(
        { error: "Chat ID và Email là bắt buộc để liên kết Telegram" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const payload = {
      chat_id: Number(chat_id),
      email: String(email).trim().toLowerCase(),
      user_id: user_id || user.sub,
      username: username ? String(username).replace(/^@/, "").trim() : null,
      first_name: first_name || null,
      last_name: last_name || null,
      status: status || "active",
      tags: Array.isArray(tags) ? tags : ["all"],
      subscribed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("telebot_subscribers")
      .upsert(payload, { onConflict: "chat_id" })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      subscriber: data,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi lưu thông tin subscriber";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chat_id");

    if (!chatId) {
      return NextResponse.json({ error: "Thiếu tham số chat_id" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from("telebot_subscribers")
      .delete()
      .eq("chat_id", Number(chatId));

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Đã hủy liên kết subscriber" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xóa subscriber";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
