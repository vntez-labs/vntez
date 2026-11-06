export const MASTER_AI_INTEGRATION_PROMPT = `Bạn là AI chuyên gia bảo mật và fullstack developer. Hãy tích hợp tính năng đăng nhập Single Sign-On (SSO) bằng VNTEZ ID qua giao thức chuẩn OAuth 2.0 PKCE (RFC 7636 & RFC 6749) vào dự án này theo quy trình dưới đây:

=== 1. YÊU CẦU BẮT BUỘC TRƯỚC KHI TÍCH HỢP ===
- Client ID (và Client Secret nếu là ứng dụng server bí mật) BẮT BUỘC phải được tạo và quản lý tại VNTEZ Console: https://vntez-console.vercel.app
- Khi tạo Client trên VNTEZ Console, bạn phải đăng ký đúng Redirect URI của ứng dụng (ví dụ: https://your-domain.com/auth/callback hoặc http://localhost:3000/auth/callback khi phát triển local).
- Điền Client ID đã được cấp vào biến môi trường VNTEZ_CLIENT_ID. KHÔNG ĐƯỢC để lộ Client Secret ở frontend/client.

=== 2. CỔNG XÁC THỰC VNTEZ ID & CÁC ENDPOINT OAUTH 2.0 ===
Cổng xác thực định danh VNTEZ ID Gateway:
- Gateway Base URL: https://vntez-id.vercel.app

1. Endpoint Chuyển hướng Xác thực (GET):
   URL: https://vntez-id.vercel.app/oauth/authorize
   Tham số: client_id, redirect_uri, response_type="code", state, code_challenge (SHA-256 base64url), code_challenge_method="S256"

2. Endpoint Đổi Token (POST):
   URL: https://vntez-id.vercel.app/oauth/token
   Payload: { grant_type: "authorization_code", code, client_id, code_verifier, redirect_uri }
   Response: { access_token, token_type: "Bearer", expires_in: 3600, scope: "openid profile email" }

3. Endpoint Lấy Thông Tin Người Dùng (GET):
   URL: https://vntez-id.vercel.app/oauth/userinfo
   Header: Authorization: Bearer <access_token>
   Response: { sub, email, name, avatar }

4. OpenID Connect Discovery:
   URL: https://vntez-id.vercel.app/.well-known/openid-configuration

=== 3. QUY TRÌNH 4 BƯỚC THỰC HIỆN ===
Bước 1: Sinh 'code_verifier' ngẫu nhiên (43-128 ký tự) và băm SHA-256 để sinh 'code_challenge'. Sinh 'state' ngẫu nhiên (32 ký tự).
Bước 2: Chuyển hướng trình duyệt tới https://vntez-id.vercel.app/oauth/authorize kèm các tham số trên.
Bước 3: Tại callback URL, kiểm tra 'state' khớp với session/cookie, sau đó gửi POST tới https://vntez-id.vercel.app/oauth/token kèm 'code' và 'code_verifier'.
Bước 4: Gửi GET tới https://vntez-id.vercel.app/oauth/userinfo với Bearer token để lấy thông tin hồ sơ và tạo session đăng nhập cho ứng dụng.`
