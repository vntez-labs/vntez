export interface FlowStep {
  id: string
  stepNum: string
  tabLabel: string
  title: string
  role: string
  desc: string
  highlights: string[]
  payloadPill: string
  telemetry: string
}

export const FLOW_STEPS: FlowStep[] = [
  {
    id: "id",
    stepNum: "01",
    tabLabel: "01 · Xác thực IAM",
    title: "Định danh & Phân quyền IAM",
    role: "IDENTITY & ACCESS",
    desc: "Quản lý định danh người dùng tập trung, hỗ trợ Single Sign-On (SSO) và kiểm soát ma trận phân quyền RBAC/ABAC theo chuẩn RFC 7636.",
    highlights: ["OAuth 2.0 PKCE", "Ma trận RBAC", "Short-lived JWT (15m)"],
    payloadPill: "POST /oauth/token · PKCE Verified · JWT Issued (15m)",
    telemetry: "RFC 7636 PKCE · SHA-256 Code Challenge · Access Token Exp: 900s",
  },
  {
    id: "pos",
    stepNum: "02",
    tabLabel: "02 · Bán hàng POS",
    title: "Bán lẻ & Thu ngân Offline-First",
    role: "OFFLINE-FIRST CLIENT",
    desc: "Vận hành bán hàng không gián đoạn khi mất kết nối mạng. Toàn bộ đơn hàng ghi nhận an toàn vào SQLite cục bộ và in bill LAN chỉ 15ms.",
    highlights: ["SQLite ACID", "In bill LAN 15ms", "Tự động đối soát"],
    payloadPill: "POST /pos/sync · 18 đơn chờ đối soát · SQLite WAL",
    telemetry: "Offline Engine Active · SQLite WAL · Local LAN Print: 14.8ms",
  },
  {
    id: "storage",
    stepNum: "03",
    tabLabel: "03 · Lưu trữ Edge",
    title: "Lưu trữ biên Edge S3 NVMe",
    role: "EDGE S3 CLUSTER",
    desc: "Đồng bộ tệp dữ liệu dung lượng lớn lên cụm máy chủ nội địa tại Hà Nội và TP.HCM với độ trễ dưới 15ms và chi phí cố định không phí ẩn.",
    highlights: ["Độ trễ < 15ms", "Tương thích AWS S3", "Không phí Egress"],
    payloadPill: "PUT /multipart-upload · HAN-01 NVMe · 420 MB/s",
    telemetry: "HAN-01 & SGN-01 Dual Clusters · NVMe SSD · Zero Egress Fee",
  },
  {
    id: "telemetry",
    stepNum: "04",
    tabLabel: "04 · Giám sát lỗi",
    title: "Giám sát & Bắt lỗi Real-Time",
    role: "REAL-TIME OBSERVABILITY",
    desc: "SDK tự động thu thập telemetry, bắt lỗi runtime và phân tích phễu hành vi trên thiết bị trước khi khách hàng kịp gửi phản hồi.",
    highlights: ["OpenTelemetry", "SDK < 8.4 KB", "Cảnh báo tức thời"],
    payloadPill: "OTel Trace · Crash Sentinel · Alert Latency 0.8s",
    telemetry: "OpenTelemetry v1.28 · Error Catch Rate: 100% · SDK: 8.2 KB",
  },
  {
    id: "logistics",
    stepNum: "05",
    tabLabel: "05 · Điều phối kho",
    title: "Chuỗi cung ứng & Kho vận WMS",
    role: "SMART WMS & FLEET",
    desc: "Đồng bộ tồn kho đa kênh theo thời gian thực và tự động tối ưu hóa tuyến đường giao hàng chặng cuối cho tài xế với sai số dưới 3 phút.",
    highlights: ["Khóa tồn kho nguyên tử", "Tối ưu lộ trình TSP", "Sai số < 3 phút"],
    payloadPill: "GRPC /wms/route · TSP Optimized · Stock Lock: 12ms",
    telemetry: "Dynamic Vehicle Routing · TSP Multi-Stop · ETA Deviation < 3m",
  },
  {
    id: "ecosystem",
    stepNum: "06",
    tabLabel: "06 · Hợp nhất Core",
    title: "Hợp nhất qua vntez Core SDK",
    role: "UNIFIED ARCHITECTURE",
    desc: "Kết nối toàn bộ hạ tầng, bán lẻ và vận tải qua một Unified Gateway duy nhất với bộ SDK chính thức cho TypeScript và .NET 8.",
    highlights: ["Unified Gateway", "TypeScript & .NET 8", "Zero Vendor Lock-in"],
    payloadPill: "RPC Event Mesh · Unified Gateway · @vntez/sdk Connected",
    telemetry: "Unified Runtime · HTTP/3 & gRPC · Type-Safe Contracts Active",
  },
]
