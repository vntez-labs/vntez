import { IconShieldCheck, IconSparkles } from "@tabler/icons-react"
import { MASTER_AI_INTEGRATION_PROMPT } from "../ai-prompt-data"
import type { DocSection } from "../types"
import { buildUniversalCodeSubtabs } from "../code-samples-generator"

export {
  vntezIdTokenSection,
  vntezIdUserinfoSection,
  vntezIdDiscoverySection,
} from "./vntez-id-endpoints"

export const vntezIdOverviewSection: DocSection = {
  id: "vntez-id-overview",
  appId: "vntez-id",
  title: "1. Tổng quan & Chuẩn OAuth 2.0 PKCE",
  category: "Định danh & SSO",
  badge: "RFC 7636 & OIDC",
  icon: IconShieldCheck,
  desc: "Cổng định danh tập trung (SSO) sử dụng luồng Authorization Code kết hợp Proof Key for Code Exchange (PKCE S256). Tuyệt đối bảo mật, không cần lưu trữ hay gửi Client Secret trên client.",
  endpoint: {
    method: "GET",
    path: "https://id.vntez.cloud/oauth/authorize",
  },
  params: [
    {
      name: "client_id",
      in: "query",
      type: "string",
      required: true,
      description: "Client ID được cấp tại VNTEZ Console.",
      example: "vntez_cl_9872134",
    },
    {
      name: "redirect_uri",
      in: "query",
      type: "string",
      required: true,
      description: "Địa chỉ callback đã đăng ký chính xác trên VNTEZ Console.",
      example: "https://yourapp.com/auth/callback",
    },
    {
      name: "response_type",
      in: "query",
      type: "string",
      required: true,
      description: "Luôn là 'code'.",
      example: "code",
    },
    {
      name: "code_challenge",
      in: "query",
      type: "string",
      required: true,
      description: "Base64URL SHA-256 hash của code_verifier bí mật.",
      example: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
    },
    {
      name: "code_challenge_method",
      in: "query",
      type: "string",
      required: true,
      description: "Phương thức hash bảo mật, luôn sử dụng 'S256'.",
      example: "S256",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Chuyển hướng người dùng về redirect_uri với mã code và state.",
      json: JSON.stringify(
        {
          code: "auth_code_98210391203",
          state: "usr_session_random_uuid",
        },
        null,
        2,
      ),
    },
    {
      status: 400,
      description: "Client ID không tồn tại hoặc redirect_uri không khớp với cấu hình.",
      json: JSON.stringify(
        {
          error: "invalid_request",
          error_description: "redirect_uri mismatch or client_id is not registered in VNTEZ Console.",
        },
        null,
        2,
      ),
    },
    {
      status: 403,
      description: "Ứng dụng Client bị vô hiệu hóa hoặc chưa được duyệt trên VNTEZ Console.",
      json: JSON.stringify(
        {
          error: "unauthorized_client",
          error_description: "Client ID vntez_cl_9872134 is suspended or pending approval.",
        },
        null,
        2,
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "GET",
    url: "https://id.vntez.cloud/oauth/authorize?client_id=vntez_cl_9872134&redirect_uri=https%3A%2F%2Fyourapp.com%2Fcallback&response_type=code&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&code_challenge_method=S256",
    headers: {},
  }),
}

export const vntezIdAiPromptSection: DocSection = {
  id: "vntez-id-ai-prompt",
  appId: "vntez-id",
  title: "5. Prompt Tích hợp AI (Cursor / Claude Code)",
  category: "Tích hợp Tự động",
  badge: "One-Click Prompt",
  icon: IconSparkles,
  desc: "Dán prompt hoàn chỉnh này vào Cursor Composer hoặc Claude Code để AI tự động tạo mã nguồn xác thực OAuth 2.0 PKCE, lưu trữ token an toàn và gắn guard bảo vệ route.",
  subtabs: [
    {
      key: "prompt",
      label: "AI Master Prompt",
      lang: "markdown",
      code: MASTER_AI_INTEGRATION_PROMPT,
    },
  ],
}
