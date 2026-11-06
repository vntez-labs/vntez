import { IconTerminal2 } from "@tabler/icons-react"
import type { DocSection } from "../types"

export const sdkSection: DocSection = {
  id: "ecosystem",
  appId: "ecosystem",
  title: "vntez SDK & Tools — Bộ công cụ Đa ngôn ngữ",
  category: "Bộ công cụ SDK",
  badge: "Universal SDK",
  icon: IconTerminal2,
  desc: "Bộ thư viện chính thức hỗ trợ TypeScript, Go, C# (.NET) và Python. Tự động xử lý Retry, Exponential Backoff, Rate Limiting và Token Rotation.",
  endpoint: {
    method: "GET",
    path: "https://api.vntez.cloud/v1/health",
  },
  params: [
    {
      name: "Authorization",
      in: "header",
      type: "string",
      required: true,
      description: "Bearer token hoặc API Key hợp lệ được cấp bởi VNTEZ Console.",
      example: "Bearer vntez_live_key_98213",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Hệ sinh thái VNTEZ hoạt động bình thường, latency < 10ms.",
      json: JSON.stringify(
        { status: "ok", cluster: "vn-central-1", uptime_seconds: 3120491 },
        null,
        2,
      ),
    },
    {
      status: 401,
      description: "API Key không hợp lệ hoặc đã bị vô hiệu hóa trong VNTEZ Console.",
      json: JSON.stringify(
        {
          error: "UNAUTHORIZED",
          message: "The provided API Key has expired or lacks sufficient scopes.",
        },
        null,
        2,
      ),
    },
  ],
  subtabs: [
    {
      key: "ts",
      label: "Bun / Node.js",
      lang: "bash",
      code: `bun add @vntez/sdk\n# hoặc\npnpm add @vntez/sdk\n# hoặc\nnpm install @vntez/sdk`,
    },
    {
      key: "py",
      label: "Python (pip)",
      lang: "bash",
      code: `pip install vntez-sdk\n# hoặc\npoetry add vntez-sdk`,
    },
    {
      key: "go",
      label: "Go Module",
      lang: "bash",
      code: `go get github.com/vntez/vntez-go-sdk@v2`,
    },
    {
      key: "csharp",
      label: "C# (.NET NuGet)",
      lang: "bash",
      code: `dotnet add package VNTEZ.Client.SDK`,
    },
    {
      key: "dart",
      label: "Dart (Flutter)",
      lang: "bash",
      code: `flutter pub add vntez_flutter`,
    },
    {
      key: "php",
      label: "PHP (Composer)",
      lang: "bash",
      code: `composer require vntez/vntez-php`,
    },
  ],
}
