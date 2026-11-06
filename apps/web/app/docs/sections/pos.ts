import { IconDevices } from "@tabler/icons-react"
import type { DocSection } from "../types"
import { buildUniversalCodeSubtabs } from "../code-samples-generator"

export const posSection: DocSection = {
  id: "bman-pos",
  appId: "bman-pos",
  title: "BMAN POS — Offline-First SQLite & Sync",
  category: "Bán lẻ & Điểm bán",
  badge: "Offline-First SQLite",
  icon: IconDevices,
  desc: "Kiến trúc điểm bán hàng offline-first: Giao dịch được lưu trực tiếp vào cơ sở dữ liệu SQLite cục bộ trên máy POS, in bill ngay cả khi rớt mạng, và tự động đồng bộ 2 chiều lên Cloud.",
  endpoint: {
    method: "POST",
    path: "https://pos.vntez.cloud/api/v1/sync/transactions",
  },
  params: [
    {
      name: "X-Device-Id",
      in: "header",
      type: "string",
      required: true,
      description: "Mã phần cứng máy POS đã đăng ký tại cửa hàng.",
      example: "POS_HN_01_TERM",
    },
    {
      name: "transactions",
      in: "body",
      type: "array",
      required: true,
      description: "Danh sách đơn hàng Offline kèm UUID và timestamp cục bộ.",
      example: "[{ id: 'tx_102', total: 450000 }]",
    },
    {
      name: "last_sync_timestamp",
      in: "body",
      type: "number",
      required: true,
      description: "Mốc thời gian đồng bộ thành công gần nhất (Unix millisecond).",
      example: "1730372000000",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Tất cả giao dịch offline đã được reconcile và ghi nhận vào kho dữ liệu.",
      json: JSON.stringify(
        {
          synced_count: 14,
          server_timestamp: 1730372500000,
          inventory_conflicts: [],
          status: "SUCCESS_RECONCILED",
        },
        null,
        2,
      ),
    },
    {
      status: 400,
      description: "Payload đồng bộ không hợp lệ hoặc thiết bị POS chưa được kích hoạt.",
      json: JSON.stringify(
        {
          error: "INVALID_SYNC_PAYLOAD",
          message: "device_id POS_HN_01_TERM is unauthorized or transaction list is malformed.",
        },
        null,
        2,
      ),
    },
    {
      status: 409,
      description: "Xung đột tồn kho: Một số mặt hàng trong đơn hàng offline đã hết tồn kho thực tế.",
      json: JSON.stringify(
        {
          error: "INVENTORY_CONFLICT",
          conflicts: [
            { item_id: "sku_iphone16_256", requested: 2, available: 0 },
          ],
        },
        null,
        2,
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "POST",
    url: "https://pos.vntez.cloud/api/v1/sync/transactions",
    headers: {
      "X-Device-Id": "POS_HN_01_TERM",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      {
        transactions: [
          { id: "tx_offline_01", items: 3, total: 240000 },
          { id: "tx_offline_02", items: 1, total: 85000 },
        ],
        last_sync_timestamp: 1730372000000,
      },
      null,
      2,
    ),
  }),
}
