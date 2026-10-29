import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { getSupabaseAdminClient, SUPABASE_SERVICE_ROLE_KEY } from "@/lib/supabase";

export const KNOWN_TABLES = [
  { name: "oauth_clients", label: "OAuth Clients", description: "Danh sách ứng dụng Client ID đã đăng ký trên VNTEZ ID" },
  { name: "oauth_client_requests", label: "OAuth Client Requests", description: "Hồ sơ yêu cầu đăng ký và thẩm định Deal đối tác" },
  { name: "oauth_codes", label: "OAuth Authorization Codes", description: "Mã xác thực authorization_code phát hành qua luồng PKCE" },
];

export async function GET(request: NextRequest) {
  const { user } = await getServerSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const table = searchParams.get("table") || "oauth_clients";
  const limit = Math.min(Number(searchParams.get("limit") || 50), 100);

  // Validate table name to prevent invalid input
  if (!/^[a-zA-Z0-9_]+$/.test(table)) {
    return NextResponse.json(
      { error: "Tên bảng không hợp lệ. Chỉ chấp nhận chữ cái, số và dấu gạch dưới." },
      { status: 400 }
    );
  }

  try {
    const supabaseClient = getSupabaseAdminClient();
    const { data, error, count } = await supabaseClient
      .from(table)
      .select("*", { count: "exact" })
      .limit(limit);

    const isServiceRoleActive = Boolean(
      process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY
    );

    if (error) {
      return NextResponse.json({
        success: false,
        table,
        error: error.message,
        code: error.code,
        hasServiceRole: isServiceRoleActive,
        knownTables: KNOWN_TABLES,
        rows: [],
        count: 0,
      });
    }

    // Extract dynamic column names from data or return known columns
    const columns = data && data.length > 0
      ? Object.keys(data[0]!)
      : table === "oauth_clients"
      ? ["client_id", "name", "redirect_uris", "created_at", "logo_url", "description"]
      : table === "oauth_codes"
      ? ["client_id", "redirect_uri", "created_at", "user_id", "code", "code_challenge", "code_challenge_method", "expires_at", "used"]
      : [];

    return NextResponse.json({
      success: true,
      table,
      rows: data || [],
      count: count || (data ? data.length : 0),
      columns,
      hasServiceRole: isServiceRoleActive,
      knownTables: KNOWN_TABLES,
    });
  } catch (err) {
    const isServiceRoleActive = Boolean(
      process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY
    );
    return NextResponse.json(
      {
        success: false,
        table,
        error: err instanceof Error ? err.message : String(err),
        hasServiceRole: isServiceRoleActive,
        rows: [],
        count: 0,
        knownTables: KNOWN_TABLES,
      },
      { status: 500 }
    );
  }
}
