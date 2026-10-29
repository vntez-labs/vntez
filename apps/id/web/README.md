# VNTEZ ID (`vntez-id.vercel.app`) 🚀

> **Hệ thống Định danh & Single Sign-On (SSO) OAuth 2.0 PKCE Hợp nhất cho VNTEZ Cloud.**

VNTEZ ID cung cấp nền tảng xác thực tập trung và quản lý danh tính tiêu chuẩn công nghiệp (OAuth 2.0 RFC 6749 & RFC 7636 PKCE) kết hợp với giao diện Web OS desktop trực quan.

---

## 🌟 Tính Năng Chính

1. **Chuẩn OAuth 2.0 & OIDC Hiện Đại**:
   - **Endpoint 1**: `GET /oauth/authorize` — Trang xác thực & màn hình phê duyệt quyền (Consent Screen).
   - **Endpoint 2**: `POST /oauth/token` — Đổi authorization code lấy JWT access_token an toàn với xác thực PKCE (S256) và chống Replay Attack.
   - **Endpoint 3**: `GET /oauth/userinfo` — Truy vấn profile người dùng qua `Authorization: Bearer <token>`.
   - **Endpoint 4**: `GET /.well-known/openid-configuration` — Discovery endpoint chuẩn cho Auth.js / NextAuth / Keycloak.
2. **VNTEZ Developer Hub & Interactive Playground** (`/developers`):
   - Đăng ký và quản lý ứng dụng Client (Client ID & Client Secret).
   - Trình giả lập OAuth 2.0 PKCE 3 bước trực quan: sinh PKCE, chạy luồng đăng nhập, đổi token và kiểm tra userinfo trực tiếp.
   - Mã mẫu tích hợp sẵn sàng copy cho NextAuth.js, React SPA, Node.js, cURL.
3. **Giao Diện Desktop OS Trực Quan**:
   - Quản lý ứng dụng cá nhân và ứng dụng hệ thống với dock phóng to, kéo thả lưới, ghi chú, thùng rác thông minh.
   - Đăng nhập an toàn qua Supabase Auth (Google, GitHub, Facebook).

---

## 🛠️ Cấu Hình Môi Trường (.env.local)

```env
# Supabase URL & Public Key
NEXT_PUBLIC_SUPABASE_URL=https://stbswcnsitztbusqrdhi.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Pjw68YY4m28WZaTUgiT17A_LZUhMGLx

# Tùy chọn: Service Role Key để cấp toàn quyền admin cho route /oauth/*
SUPABASE_SERVICE_ROLE_KEY=

# Domain chính của hệ thống
NEXT_PUBLIC_SITE_URL=https://vntez-id.vercel.app

# Khóa bí mật ký JWT Token (hoặc RS256 private/public key)
VNTEZ_JWT_SECRET=vntez_identity_jwt_secret_signing_key_2026_super_secure_auth
```

---

## 🗄️ Cấu Trúc Database (PostgreSQL trên Supabase)

Tệp migration nằm tại `supabase/migrations/20261027000000_create_oauth_tables.sql`:

```sql
-- 1. Bảng quản lý ứng dụng client
create table if not exists public.oauth_clients (
  client_id text primary key,
  client_secret_hash text,
  name text not null,
  redirect_uris text[] not null,
  logo_url text,
  description text,
  is_internal boolean default false,
  created_at timestamptz default now()
);

-- 2. Bảng lưu auth code tạm thời
create table if not exists public.oauth_codes (
  code text primary key,
  client_id text references public.oauth_clients(client_id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  code_challenge text,
  code_challenge_method text default 'S256',
  redirect_uri text not null,
  expires_at timestamptz not null,
  used boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_oauth_codes_lookup on public.oauth_codes (code, used, expires_at);

-- Nếu bảng oauth_clients đã tồn tại từ trước, bổ sung các cột mới và reload cache:
alter table public.oauth_clients
  add column if not exists logo_url text,
  add column if not exists description text,
  add column if not exists is_internal boolean default false;

notify pgrst, 'reload schema';
```

---

## ⚡ Hướng Dẫn App Vệ Tinh Tích Hợp

### 1. Nút "Đăng nhập với VNTEZ ID"
Chuyển hướng user đến:
```
https://vntez-id.vercel.app/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_CALLBACK_URL&response_type=code&state=RANDOM_STATE&code_challenge=PKCE_CHALLENGE&code_challenge_method=S256
```

### 2. Xử lý Callback tại App Vệ Tinh
Nhận `code` từ query params và gửi request đổi lấy `access_token`:
```bash
curl -X POST "https://vntez-id.vercel.app/oauth/token" \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "code": "AUTH_CODE",
    "client_id": "YOUR_CLIENT_ID",
    "redirect_uri": "YOUR_CALLBACK_URL",
    "code_verifier": "PKCE_VERIFIER"
  }'
```

### 3. Lấy Thông Tin Người Dùng
```bash
curl "https://vntez-id.vercel.app/oauth/userinfo" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Dữ liệu trả về:
```json
{
  "sub": "b2f67210-91dc-4927-b08e-5915d39ea30e",
  "email": "user@example.com",
  "email_verified": true,
  "name": "Nguyễn Văn A",
  "avatar": "https://..."
}
```

---

## 📦 Phát Triển & Khởi Chạy

```bash
# Cài đặt thư viện
bun install

# Chạy môi trường phát triển (Localhost:3000)
bun dev

# Build kiểm tra sản phẩm
bun run build
```
