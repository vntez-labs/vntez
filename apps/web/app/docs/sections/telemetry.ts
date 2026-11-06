import { IconCpu } from "@tabler/icons-react"
import type { DocSection } from "../types"
import { buildUniversalCodeSubtabs } from "../code-samples-generator"

export const telemetrySection: DocSection = {
  id: "telemetry",
  appId: "telemetry",
  title: "vntez Telemetry — Giám sát & Vết lỗi",
  category: "Giám sát & Vết lỗi",
  badge: "OpenTelemetry v1.28",
  icon: IconCpu,
  desc: "SDK siêu nhẹ (< 8KB) bắt ngoại lệ runtime, gửi trace spans và log chuẩn OpenTelemetry (OTLP) về cụm ClickHouse với độ nén cực đại.",
  endpoint: {
    method: "POST",
    path: "https://telemetry.vntez.cloud/v1/traces",
  },
  params: [
    {
      name: "resourceSpans",
      in: "body",
      type: "array",
      required: true,
      description: "Cấu trúc OTLP standard spans kèm duration, status code và metadata.",
      example: "[{ scopeSpans: [...] }]",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Traces được tiếp nhận vào memory buffer thành công.",
      json: JSON.stringify({ partialSuccess: {} }, null, 2),
    },
    {
      status: 400,
      description: "ResourceSpans không đúng định dạng chuẩn OpenTelemetry hoặc payload rỗng.",
      json: JSON.stringify(
        {
          error: "INVALID_OTLP_SPANS",
          message: "resourceSpans array cannot be empty or contain invalid span_id hex.",
        },
        null,
        2,
      ),
    },
    {
      status: 429,
      description: "Vượt ngưỡng giới hạn tần suất gửi trace spans (Rate limit: 10,000 spans/sec).",
      json: JSON.stringify(
        {
          error: "RATE_LIMIT_EXCEEDED",
          retry_after_seconds: 3,
        },
        null,
        2,
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "POST",
    url: "https://telemetry.vntez.cloud/v1/traces",
    headers: {
      "Authorization": "Bearer vntez_telemetry_token_102",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      {
        resourceSpans: [
          {
            resource: {
              attributes: [
                { key: "service.name", value: { stringValue: "payment-api" } },
              ],
            },
            scopeSpans: [
              {
                spans: [
                  {
                    traceId: "4bf92f3577b34da6a3ce929d0e0e4736",
                    name: "CheckoutSession",
                  },
                ],
              },
            ],
          },
        ],
      },
      null,
      2,
    ),
  }),
}
