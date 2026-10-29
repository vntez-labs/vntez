import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://placeholder-vntez-id.supabase.co";
const DEFAULT_SUPABASE_KEY = "placeholder-anon-key";

let _supabaseAdmin: SupabaseClient | null = null;
let _cachedUrl = "";

/**
 * Lấy hoặc khởi tạo Supabase Admin Client an toàn.
 * Tự động sử dụng SUPABASE_SERVICE_ROLE_KEY nếu có, hoặc fallback về PUBLISHABLE_KEY.
 * Phòng ngừa crash khi build tĩnh trên Vercel nếu biến môi trường chưa được nạp.
 */
export function getAdminClient(): SupabaseClient {
  const currentUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;

  const currentKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_KEY;

  if (!_supabaseAdmin || _cachedUrl !== currentUrl) {
    _cachedUrl = currentUrl;
    _supabaseAdmin = createSupabaseClient(currentUrl, currentKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _supabaseAdmin;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getAdminClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export interface OAuthClientRecord {
  client_id: string;
  client_secret_hash: string | null;
  name: string;
  redirect_uris: string[];
  logo_url?: string | null;
  description?: string | null;
  is_internal?: boolean;
  created_at?: string;
}

export interface OAuthCodeRecord {
  code: string;
  client_id: string;
  user_id: string;
  code_challenge: string | null;
  code_challenge_method: string | null;
  redirect_uri: string;
  expires_at: string;
  used: boolean;
  created_at?: string;
}

/**
 * Tìm ứng dụng OAuth theo client_id
 */
export async function getOAuthClient(
  clientId: string,
): Promise<OAuthClientRecord | null> {
  const { data, error } = await supabaseAdmin
    .from("oauth_clients")
    .select("*")
    .eq("client_id", clientId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return data as OAuthClientRecord;
}

/**
 * Lấy danh sách các ứng dụng OAuth đã đăng ký
 */
export async function listOAuthClients(): Promise<OAuthClientRecord[]> {
  const { data, error } = await supabaseAdmin
    .from("oauth_clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }
  return data as OAuthClientRecord[];
}

/**
 * Tạo mới ứng dụng OAuth client
 */
export async function createOAuthClient(client: {
  client_id: string;
  name: string;
  redirect_uris: string[];
  client_secret_hash?: string | null;
  logo_url?: string | null;
  description?: string | null;
  is_internal?: boolean;
}): Promise<{ data: OAuthClientRecord | null; error: string | null }> {
  // Chỉ đưa vào các trường có giá trị, tránh gửi null/undefined gây lỗi schema cache PostgREST nếu bảng chưa migrate đủ cột
  const payload: Record<string, any> = {
    client_id: client.client_id,
    name: client.name,
    redirect_uris: client.redirect_uris,
  };

  if (client.client_secret_hash) {
    payload.client_secret_hash = client.client_secret_hash;
  }
  if (client.logo_url) {
    payload.logo_url = client.logo_url;
  }
  if (client.description) {
    payload.description = client.description;
  }
  if (client.is_internal === true) {
    payload.is_internal = true;
  }

  const attemptPayload = { ...payload };

  // Tự động retry loại bỏ cột nếu bảng Supabase chưa migrate cột đó (tránh văng lỗi schema cache)
  for (let attempt = 0; attempt < 4; attempt++) {
    const { data, error } = await supabaseAdmin
      .from("oauth_clients")
      .insert([attemptPayload])
      .select()
      .single();

    if (!error && data) {
      return { data: data as OAuthClientRecord, error: null };
    }

    if (error) {
      // Bắt lỗi schema cache của PostgREST: "Could not find the 'xyz' column of 'oauth_clients' in the schema cache"
      const match = error.message.match(
        /Could not find the '([^']+)' column of 'oauth_clients'/i,
      );
      if (match && match[1] && attemptPayload[match[1]] !== undefined) {
        delete attemptPayload[match[1]];
        continue;
      }
      return { data: null, error: error.message };
    }
  }

  return { data: null, error: "Không thể tạo ứng dụng OAuth" };
}

/**
 * Xóa ứng dụng OAuth
 */
export async function deleteOAuthClient(clientId: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("oauth_clients")
    .delete()
    .eq("client_id", clientId);

  return !error;
}

/**
 * Lưu Authorization Code tạm thời (hạn 5 phút)
 */
export async function saveOAuthCode(codeData: {
  code: string;
  client_id: string;
  user_id: string;
  code_challenge?: string | null;
  code_challenge_method?: string | null;
  redirect_uri: string;
  expires_at: string;
}): Promise<boolean> {
  const { error } = await supabaseAdmin.from("oauth_codes").insert([
    {
      ...codeData,
      used: false,
    },
  ]);

  if (error) {
    console.error("[saveOAuthCode] Lỗi ghi auth code:", error);
    return false;
  }
  return true;
}

/**
 * Tìm Auth Code hợp lệ (chưa dùng và chưa hết hạn)
 */
export async function getValidOAuthCode(
  code: string,
  clientId: string,
): Promise<OAuthCodeRecord | null> {
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("oauth_codes")
    .select("*")
    .eq("code", code)
    .eq("client_id", clientId)
    .eq("used", false)
    .gt("expires_at", now)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return data as OAuthCodeRecord;
}

/**
 * Đánh dấu Code đã dùng (chống Replay Attack)
 */
export async function markOAuthCodeUsed(code: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("oauth_codes")
    .update({ used: true })
    .eq("code", code);

  return !error;
}

/**
 * Lấy thông tin User theo ID từ Supabase Auth
 */
export async function getUserById(userId: string) {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (!error && data?.user) {
      return data.user;
    }
  }

  // Fallback nếu không có service_role_key: đọc từ public/users hoặc metadata
  return null;
}
