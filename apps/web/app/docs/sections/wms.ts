import { IconTruckDelivery } from "@tabler/icons-react"
import type { DocSection } from "../types"
import { buildUniversalCodeSubtabs } from "../code-samples-generator"

export const wmsSection: DocSection = {
  id: "supply-chain",
  appId: "supply-chain",
  title: "vntez WMS & Fleet — Quản lý Kho & Định tuyến",
  category: "Kho vận & Logistics",
  badge: "Vehicle Routing API",
  icon: IconTruckDelivery,
  desc: "API tối ưu hóa lộ trình xe tải và quản lý xuất nhập tồn thời gian thực. Hỗ trợ thuật toán VRP (Vehicle Routing Problem) phân chia kiện hàng tự động cho đội xe.",
  endpoint: {
    method: "POST",
    path: "https://fleet.vntez.cloud/api/v1/routes/optimize",
  },
  params: [
    {
      name: "fleet_size",
      in: "body",
      type: "number",
      required: true,
      description: "Số lượng phương tiện sẵn sàng nhận lệnh tại hub.",
      example: "12",
    },
    {
      name: "waypoints",
      in: "body",
      type: "array",
      required: true,
      description: "Danh sách điểm giao hàng, khung giờ nhận và trọng tải gói hàng.",
      example: "[{ lat: 21.0285, lng: 105.8542, weight_kg: 45 }]",
    },
  ],
  responses: [
    {
      status: 200,
      description: "Lộ trình tối ưu hóa chi phí xăng dầu và thời gian di chuyển.",
      json: JSON.stringify(
        {
          total_distance_km: 142.8,
          estimated_duration_min: 310,
          assigned_routes: [
            { vehicle_id: "TRUCK_29C_102", stops_count: 8, eta_completion: "16:45" },
          ],
        },
        null,
        2,
      ),
    },
    {
      status: 400,
      description: "Tọa độ điểm dừng không hợp lệ hoặc nằm ngoài phạm vi địa lý phục vụ.",
      json: JSON.stringify(
        {
          error: "INVALID_WAYPOINT_COORDINATES",
          message: "Waypoint lat 95.0 is out of valid range [-90, 90].",
        },
        null,
        2,
      ),
    },
    {
      status: 422,
      description: "Không thể định tuyến: Tổng tải trọng vượt quá khả năng chuyên chở của đội xe.",
      json: JSON.stringify(
        {
          error: "FLEET_CAPACITY_EXCEEDED",
          message: "Total cargo weight exceeds available fleet payload limit for selected hub.",
        },
        null,
        2,
      ),
    },
  ],
  subtabs: buildUniversalCodeSubtabs({
    method: "POST",
    url: "https://fleet.vntez.cloud/api/v1/routes/optimize",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      {
        fleet_size: 5,
        waypoints: [
          { lat: 21.0285, lng: 105.8542, weight_kg: 45 },
          { lat: 21.0333, lng: 105.8433, weight_kg: 90 },
        ],
      },
      null,
      2,
    ),
  }),
}
