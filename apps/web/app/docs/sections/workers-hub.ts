import {
  IconCpu,
  IconActivity,
  IconBroadcast,
  IconTrash,
} from "@tabler/icons-react";
import type { DocSection } from "../types";
import { buildUniversalCodeSubtabs } from "../code-samples-generator";

export const workersListSection: DocSection = {
  id: "workers-list",
  appId: "workers-hub",
  title: "1. Danh sách Workers & Hạ tầng Edge",
  category: "Hạ tầng Cloudflare Edge & Serverless",
  badge: "Workers Management",
  icon: IconCpu,
  desc: "Quản lý và truy xuất trạng thái toàn diện các cụm Cloudflare Workers, R2 Buckets, D1 Databases và Queues. Hỗ trợ theo dõi script size, deployment status và các cron trigger đang chạy.",
  endpoint: {
    method: "GET",
    path: "https://workers.vntez.cloud/api/workers/list",
  },
  params: [
    {
      name: "status",
      in: "query",
      type: "string",
      required: false,
      description: "Lọc theo trạng thái triển khai: 'active', 'paused' hoặc 'draft'.",
      example: "active",
    },
    {
      name: "zone_id",
      in: "query",
      type: "string",
      required: false,
      description: "Định danh Cloudflare DNS Zone quản lý.",
      example: "zone_981273918237",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Danh sách các Workers đang triển khai trên mạng lưới Edge.",
      json: JSON.stringify(
        {
          success: true,
          total: 4,
          workers: [
            {
              id: "vntez-iam-worker",
              name: "vntez-iam",
              routes: ["iam.vntez.cloud/*", "id.vntez.net/*"],
              bindings: ["SUPABASE_DB", "R2_UPLOADS", "IAM_KV"],
              cron: ["*/10 * * * *"],
              status: "active",
              modified_at: "2026-11-07T08:00:00Z",
            },
            {
              id: "telebot-worker",
              name: "telebot",
              routes: ["telebot.vntez.cloud/*"],
              bindings: ["TELEGRAM_BOT_TOKEN", "D1_SUBSCRIBERS"],
              status: "active",
              modified_at: "2026-11-06T19:30:00Z",
            },
          ],
        },
        null,
        2
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "GET",
    url: "https://workers.vntez.cloud/api/workers/list?status=active",
  }),
};

export const workersTelemetrySection: DocSection = {
  id: "workers-telemetry",
  appId: "workers-hub",
  title: "2. Giám sát & Telemetry vi mô",
  category: "Hạ tầng Cloudflare Edge & Serverless",
  badge: "Real-time Telemetry",
  icon: IconActivity,
  desc: "Truy xuất chỉ số vi mô thời gian thực của các cụm Cloudflare Workers: thời gian thực thi CPU (CPU Time), độ trễ P99 nội địa tính theo miligiây, tỉ lệ lỗi HTTP 5xx và lưu lượng request.",
  endpoint: {
    method: "GET",
    path: "https://workers.vntez.cloud/api/workers/telemetry",
  },
  params: [
    {
      name: "worker_id",
      in: "query",
      type: "string",
      required: true,
      description: "Định danh Worker cần theo dõi (VD: 'vntez-iam-worker').",
      example: "vntez-iam-worker",
    },
    {
      name: "timeframe",
      in: "query",
      type: "string",
      required: false,
      description: "Khung thời gian phân tích: '1h', '24h' hoặc '7d'. Mặc định '1h'.",
      example: "24h",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Thống kê Telemetry vi mô chi tiết.",
      json: JSON.stringify(
        {
          worker_id: "vntez-iam-worker",
          timeframe: "24h",
          metrics: {
            requests_total: 489210,
            avg_latency_ms: 12.4,
            p99_latency_ms: 28.1,
            cpu_time_median_ms: 4.8,
            error_5xx_rate: "0.002%",
            data_egress_bytes: 142083921,
          },
          health_status: "optimal",
        },
        null,
        2
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "GET",
    url: "https://workers.vntez.cloud/api/workers/telemetry?worker_id=vntez-iam-worker&timeframe=24h",
  }),
};

export const workersDispatchSection: DocSection = {
  id: "workers-dispatch",
  appId: "workers-hub",
  title: "3. Kích hoạt & Phân phối Tác vụ (Dispatch)",
  category: "Hạ tầng Cloudflare Edge & Serverless",
  badge: "Event Dispatcher",
  icon: IconBroadcast,
  desc: "Kích hoạt tác vụ nền, webhook events và gửi thông báo cảnh báo tức thời sang kênh Telegram Bot khi phát hiện lỗi hạ tầng hoặc bất thường.",
  endpoint: {
    method: "POST",
    path: "https://workers.vntez.cloud/api/workers/dispatch",
  },
  params: [
    {
      name: "target_worker",
      in: "body",
      type: "string",
      required: true,
      description: "Tên Worker tiếp nhận tác vụ.",
      example: "telebot-worker",
    },
    {
      name: "event_type",
      in: "body",
      type: "string",
      required: true,
      description: "Loại sự kiện: 'alert_incident', 'sync_cache' hoặc 'daily_digest'.",
      example: "alert_incident",
    },
    {
      name: "payload",
      in: "body",
      type: "object",
      required: true,
      description: "Nội dung dữ liệu chi tiết của tác vụ.",
      example: '{"severity":"warning","message":"P99 latency spike detected"}',
    },
  ],
  responses: [
    {
      status: 202,
      description: "Tác vụ đã được chuyển vào hàng đợi xử lý thành công.",
      json: JSON.stringify(
        {
          success: true,
          task_id: "dispatch_evt_892138",
          queued_at: "2026-11-07T08:05:00Z",
          target: "telebot-worker",
        },
        null,
        2
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "POST",
    url: "https://workers.vntez.cloud/api/workers/dispatch",
    body: {
      target_worker: "telebot-worker",
      event_type: "alert_incident",
      payload: {
        severity: "warning",
        message: "P99 latency spike detected in Singapore POP",
      },
    },
  }),
};

export const workersPurgeCacheSection: DocSection = {
  id: "workers-cache-purge",
  appId: "workers-hub",
  title: "4. Xóa bộ nhớ đệm Edge CDN Tức thời",
  category: "Hạ tầng Cloudflare Edge & Serverless",
  badge: "Cache Management",
  icon: IconTrash,
  desc: "Gửi lệnh giải phóng bộ nhớ đệm (Cache Purge) toàn cầu cho các cụm Cloudflare Edge CDN theo URL cụ thể, Cache-Tag hoặc toàn bộ Zone chỉ trong dưới 150ms.",
  endpoint: {
    method: "POST",
    path: "https://workers.vntez.cloud/api/workers/cache/purge",
  },
  params: [
    {
      name: "purge_everything",
      in: "body",
      type: "boolean",
      required: false,
      description: "Xóa toàn bộ Cache trên Zone (cần thận trọng).",
      example: "false",
    },
    {
      name: "urls",
      in: "body",
      type: "array",
      required: false,
      description: "Danh sách đường dẫn tĩnh cần xóa bộ nhớ đệm tức thì.",
      example: '["https://vntez.net/products", "https://vntez.net/blog"]',
    },
    {
      name: "tags",
      in: "body",
      type: "array",
      required: false,
      description: "Danh sách Cache-Tags.",
      example: '["apps-manifest", "blog-catalog"]',
    },
  ],
  responses: [
    {
      status: 200,
      description: "Cache đã được vô hiệu hóa thành công trên toàn bộ các Edge POPs.",
      json: JSON.stringify(
        {
          success: true,
          purged_items: 2,
          execution_time_ms: 112,
          zone_id: "zone_981273918237",
        },
        null,
        2
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "POST",
    url: "https://workers.vntez.cloud/api/workers/cache/purge",
    body: {
      tags: ["apps-manifest", "blog-catalog"],
    },
  }),
};
