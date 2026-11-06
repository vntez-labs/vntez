export interface FlowStep {
  id: string
  title: string
  role: string
  desc: string
  metric: string
  color: string
  bgSoft: string
  borderSoft: string
}

export const FLOW_STEPS: FlowStep[] = [
  {
    id: "id",
    title: "1. Định danh & Phân quyền (vntez-iam)",
    role: "IAM & RBAC MATRIX",
    desc: "Quản lý người dùng, ma trận phân quyền chi tiết và xác thực SSO chuẩn Enterprise.",
    metric: "Ma trận RBAC • SSO • Token JWT",
    color: "#fb291a",
    bgSoft: "bg-[#fb291a]/10",
    borderSoft: "border-[#fb291a]/30",
  },
  {
    id: "pos",
    title: "2. Thu ngân & Thiết bị bán lẻ",
    role: "OFFLINE-FIRST CLIENT",
    desc: "Bán hàng và in bill tức thời trên SQLite cục bộ, không lo rớt mạng hay gián đoạn.",
    metric: "Offline 100% • Tự động đối soát",
    color: "#06b6d4",
    bgSoft: "bg-cyan-500/10",
    borderSoft: "border-cyan-500/30",
  },
  {
    id: "storage",
    title: "3. Đồng bộ Lưu trữ biên (Edge S3)",
    role: "EDGE S3 HIGH PERFORMANCE",
    desc: "Đồng bộ hóa đơn và tệp dữ liệu lên cụm máy chủ nội địa tại Hà Nội và TP.HCM với tốc độ cao.",
    metric: "Độ trễ < 15ms • Tương thích AWS S3",
    color: "#fb291a",
    bgSoft: "bg-[#fb291a]/10",
    borderSoft: "border-[#fb291a]/30",
  },
  {
    id: "telemetry",
    title: "4. Giám sát sự cố tự động (Telemetry)",
    role: "REAL-TIME OBSERVABILITY",
    desc: "Bắt lỗi runtime tự động và phân tích sự cố trên thiết bị trước khi khách hàng báo cáo.",
    metric: "Báo lỗi tức thời • SDK < 8KB",
    color: "#f77241",
    bgSoft: "bg-[#f77241]/10",
    borderSoft: "border-[#f77241]/30",
  },
  {
    id: "logistics",
    title: "5. Chuỗi cung ứng & Điều phối WMS",
    role: "WMS & SMART FLEET",
    desc: "Cập nhật tồn kho tự động và tối ưu hóa tuyến đường giao hàng chặng cuối cho tài xế.",
    metric: "Tiết kiệm 30% lộ trình • Real-time",
    color: "#10b981",
    bgSoft: "bg-emerald-500/10",
    borderSoft: "border-emerald-500/30",
  },
  {
    id: "ecosystem",
    title: "6. Hợp nhất qua vntez SDK",
    role: "UNIFIED DEVELOPER EXPERIENCE",
    desc: "Lập trình viên tích hợp mọi dịch vụ qua một bộ SDK duy nhất với Type Definition hoàn chỉnh.",
    metric: "TypeScript, Go, Python, C#",
    color: "#a855f7",
    bgSoft: "bg-purple-500/10",
    borderSoft: "border-purple-500/30",
  },
]
