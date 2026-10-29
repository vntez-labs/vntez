"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import {
  getOAuthClient,
  saveOAuthCode,
  createOAuthClient,
  deleteOAuthClient,
} from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_USER_ID, isUserAdmin } from "./constants";

/**
 * Server Action xử lý người dùng nhấn "Cho phép / Ủy quyền"
 */
export async function authorizeAppAction(params: {
  clientId: string;
  redirectUri: string;
  state?: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Người dùng chưa đăng nhập");
  }

  const client = await getOAuthClient(params.clientId);
  if (!client) {
    throw new Error("Ứng dụng không tồn tại");
  }

  // Đối chiếu redirect_uri có khớp với danh sách đã đăng ký
  const isMatch = client.redirect_uris.some((uri) => {
    try {
      const u1 = new URL(uri);
      const u2 = new URL(params.redirectUri);
      return u1.origin === u2.origin && u1.pathname === u2.pathname;
    } catch {
      return uri === params.redirectUri;
    }
  });

  if (!isMatch) {
    throw new Error("Redirect URI không khớp với cấu hình của ứng dụng");
  }

  // 3. Sinh một mã ngẫu nhiên bảo mật cao (64 bytes hex làm auth_code)
  const authCode = crypto.randomBytes(32).toString("hex");

  // Thời gian hết hạn sau 5 phút
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // 4. Lưu vào bảng oauth_codes
  const saved = await saveOAuthCode({
    code: authCode,
    client_id: params.clientId,
    user_id: user.id,
    code_challenge: params.codeChallenge || null,
    code_challenge_method: params.codeChallengeMethod || "S256",
    redirect_uri: params.redirectUri,
    expires_at: expiresAt,
  });

  if (!saved) {
    throw new Error("Không thể khởi tạo mã xác thực OAuth");
  }

  // 5. Chuẩn bị URL chuyển hướng
  const redirectUrl = new URL(params.redirectUri);
  redirectUrl.searchParams.set("code", authCode);
  if (params.state) {
    redirectUrl.searchParams.set("state", params.state);
  }

  return { redirectUrl: redirectUrl.toString() };
}

/**
 * Server action tạo ứng dụng Client mới (Chỉ dành cho Admin)
 */
export async function createClientAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== ADMIN_USER_ID) {
    return { error: "Chỉ Quản trị viên (Admin) mới có quyền tạo ứng dụng Client." };
  }

  const name = formData.get("name")?.toString().trim();
  const redirectUrisRaw = formData.get("redirect_uris")?.toString().trim();
  const isConfidential = formData.get("is_confidential") === "true";
  const description = formData.get("description")?.toString().trim() || null;

  if (!name || !redirectUrisRaw) {
    return { error: "Vui lòng nhập tên ứng dụng và ít nhất 1 Redirect URI" };
  }

  const redirect_uris = redirectUrisRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  if (redirect_uris.length === 0) {
    return { error: "Redirect URI không hợp lệ" };
  }

  // Sinh client_id
  const clientId = `vntez_${crypto.randomBytes(12).toString("hex")}`;

  // Nếu là confidential client, sinh secret
  let clientSecret: string | null = null;
  let clientSecretHash: string | null = null;

  if (isConfidential) {
    clientSecret = `vntez_sec_${crypto.randomBytes(24).toString("hex")}`;
    // Băm SHA256 để lưu trữ an toàn
    clientSecretHash = crypto
      .createHash("sha256")
      .update(clientSecret)
      .digest("hex");
  }

  const { data, error } = await createOAuthClient({
    client_id: clientId,
    name,
    redirect_uris,
    client_secret_hash: clientSecretHash,
    description: description || undefined,
    is_internal: false,
  });

  if (error || !data) {
    return { error: error || "Không thể tạo ứng dụng OAuth" };
  }

  revalidatePath("/developers");
  revalidatePath("/");

  return {
    success: true,
    client: data,
    generatedSecret: clientSecret,
  };
}

/**
 * Server action xóa ứng dụng OAuth (Chỉ dành cho Admin)
 */
export async function deleteClientAction(clientId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== ADMIN_USER_ID) {
    return { error: "Chỉ Quản trị viên (Admin) mới có quyền xóa ứng dụng Client." };
  }

  const success = await deleteOAuthClient(clientId);
  if (!success) {
    return { error: "Không thể xóa ứng dụng" };
  }

  revalidatePath("/developers");
  revalidatePath("/");

  return { success: true };
}
