import { IconKey, IconUserCheck, IconWorldDownload } from "@tabler/icons-react"
import type { DocSection } from "../types"
import { buildUniversalCodeSubtabs } from "../code-samples-generator"

export const vntezIdTokenSection: DocSection = {
  id: "vntez-iam-token",
  appId: "vntez-iam",
  title: "2. Trao đổi Token & Cấp Quyền RBAC (Token Endpoint)",
  category: "Định danh & Phân quyền IAM",
  badge: "POST /oauth/token",
  icon: IconKey,
  desc: "Trao đổi Authorization Code và Code Verifier lấy JWT Access Token và Refresh Token.",
  endpoint: {
    method: "POST",
    path: "https://iam.vntez.cloud/oauth/token",
  },
  params: [
    {
      name: "grant_type",
      in: "body",
      type: "string",
      required: true,
      description: "'authorization_code' hoặc 'refresh_token'.",
      example: "authorization_code",
    },
    {
      name: "client_id",
      in: "body",
      type: "string",
      required: true,
      description: "Client ID được cấp tại Console.",
      example: "vntez_cl_9872134",
    },
    {
      name: "code",
      in: "body",
      type: "string",
      required: true,
      description: "Code nhận từ callback redirect.",
      example: "auth_code_782910321",
    },
    {
      name: "code_verifier",
      in: "body",
      type: "string",
      required: true,
      description: "Chuỗi ngẫu nhiên gốc chưa hash.",
      example: "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Cấp token thành công.",
      json: JSON.stringify(
        {
          access_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
          token_type: "Bearer",
          expires_in: 3600,
          refresh_token: "rt_87d3a82910fd821903",
        },
        null,
        2,
      ),
    },
    {
      status: 400,
      description: "Code verifier không hợp lệ hoặc code đã hết hạn.",
      json: JSON.stringify(
        {
          error: "invalid_grant",
          error_description: "Code verifier does not match challenge.",
        },
        null,
        2,
      ),
    },
    {
      status: 401,
      description: "Xác thực Client thất bại hoặc mã code đã hết hạn sử dụng.",
      json: JSON.stringify(
        {
          error: "invalid_client",
          error_description: "Client authentication failed or code expired.",
        },
        null,
        2,
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "POST",
    url: "https://iam.vntez.cloud/oauth/token",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      {
        grant_type: "authorization_code",
        client_id: "vntez_cl_9872134",
        code: "AUTH_CODE_FROM_CALLBACK",
        code_verifier: "SECRET_CODE_VERIFIER",
        redirect_uri: "https://yourapp.com/auth/callback",
      },
      null,
      2,
    ),
  }),
}

export const vntezIdUserinfoSection: DocSection = {
  id: "vntez-iam-userinfo",
  appId: "vntez-iam",
  title: "3. Lấy hồ sơ người dùng & Phân quyền (Userinfo)",
  category: "Định danh & Phân quyền IAM",
  badge: "GET /oauth/userinfo",
  icon: IconUserCheck,
  desc: "Truy vấn thông tin định danh người dùng (sub, email, tên hiển thị, avatar, vai trò) bằng Bearer token.",
  endpoint: {
    method: "GET",
    path: "https://iam.vntez.cloud/oauth/userinfo",
  },
  params: [
    {
      name: "Authorization",
      in: "header",
      type: "string",
      required: true,
      description: "Bearer <access_token>",
      example: "Bearer eyJhbGciOiJSUzI1NiIs...",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Thông tin hồ sơ người dùng OIDC tiêu chuẩn.",
      json: JSON.stringify(
        {
          sub: "usr_9812401",
          name: "Nguyễn Văn Dev",
          email: "dev@vntez.cloud",
          email_verified: true,
          picture: "https://iam.vntez.cloud/avatars/usr_9812401.png",
          roles: ["developer", "admin"],
        },
        null,
        2,
      ),
    },
    {
      status: 401,
      description: "Access token đã hết hạn hoặc không có chữ ký hợp lệ.",
      json: JSON.stringify(
        {
          error: "invalid_token",
          error_description: "Access token expired or malformed signature.",
        },
        null,
        2,
      ),
    },
    {
      status: 403,
      description: "Token không có quyền truy cập phạm vi (scope) thông tin cá nhân 'profile'.",
      json: JSON.stringify(
        {
          error: "insufficient_scope",
          scope: "profile email",
        },
        null,
        2,
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "GET",
    url: "https://iam.vntez.cloud/oauth/userinfo",
    headers: {
      Authorization: "Bearer eyJhbGciOiJSUzI1NiIs...",
    },
  }),
}

export const vntezIdDiscoverySection: DocSection = {
  id: "vntez-iam-discovery",
  appId: "vntez-iam",
  title: "4. Khám phá OpenID Configuration",
  category: "Định danh & Phân quyền IAM",
  badge: "GET /.well-known",
  icon: IconWorldDownload,
  desc: "Cấu hình OIDC Discovery tự động cho phép mọi thư viện chuẩn (NextAuth, Passport, Auth0 SDK) kết nối không cần cấu hình thủ công.",
  endpoint: {
    method: "GET",
    path: "https://iam.vntez.cloud/.well-known/openid-configuration",
  },
  responses: [
    {
      status: 200,
      description: "OIDC Discovery metadata.",
      json: JSON.stringify(
        {
          issuer: "https://iam.vntez.cloud",
          authorization_endpoint: "https://iam.vntez.cloud/oauth/authorize",
          token_endpoint: "https://iam.vntez.cloud/oauth/token",
          userinfo_endpoint: "https://iam.vntez.cloud/oauth/userinfo",
          jwks_uri: "https://iam.vntez.cloud/.well-known/jwks.json",
          response_types_supported: ["code"],
          code_challenge_methods_supported: ["S256"],
        },
        null,
        2,
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "GET",
    url: "https://iam.vntez.cloud/.well-known/openid-configuration",
    headers: {},
  }),
}
