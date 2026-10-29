import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  IconServer2,
  IconShieldCheck,
  IconRefresh,
  IconTruckDelivery,
  IconActivity,
  IconLayersLinked,
  IconCheck,
  IconArrowRight,
  IconCloudUpload,
  IconWifiOff,
  IconBrandGoogle,
  IconBrandGithub,
  IconDatabase,
} from "@tabler/icons-react"

export const metadata: Metadata = {
  title: "Sản phẩm — Hệ sinh thái Công nghệ vntez",
  description:
    "Danh mục các sản phẩm chủ lực của vntez: Lưu trữ Edge S3, Định danh OAuth 2.0 PKCE, Máy bán hàng Offline-First BMAN, Chuỗi cung ứng WMS và Hệ thống Giám sát.",
}

const PRODUCTS = [
  {
    id: "storage",
    badge: "LƯU TRỮ BIÊN // NVME CLUSTER",
    name: "vntez Storage & Edge",
    headline: "Lưu trữ tương thích AWS S3 với tốc độ NVMe nội địa.",
    description:
      "Cụm máy chủ kép tại Hà Nội (HAN-01) và TP.HCM (SGN-02) trang bị 100% ổ NVMe Enterprise. Khởi đầu miễn phí, nâng cấp linh hoạt theo dung lượng thực tế, loại bỏ hoàn toàn nỗi lo chi phí ẩn của các dịch vụ đám mây ngoại.",
    icon: IconServer2,
    color: "#fb291a",
    highlights: [
      "Tương thích 100% chuẩn AWS S3 API (Node, Python, Go, C#)",
      "Hỗ trợ Upload đa phân mảnh (Multipart Upload) cho tệp dung lượng lớn",
      "Độ trễ truy xuất nội địa < 15ms, tối ưu tốc độ cho ứng dụng tại Việt Nam",
      "Mô hình chi phí mở rộng minh bạch, không phụ phí phát sinh bất ngờ",
    ],
    ctaText: "Khởi tạo Bucket lưu trữ",
    ctaLink: "/docs#storage-api",
  },
  {
    id: "vntez-id",
    badge: "ĐỊNH DANH & XÁC THỰC // OAUTH 2.0 & PKCE",
    name: "vntez-id Identity Gateway",
    headline: "Đăng nhập Social một chạm & Bảo mật chuẩn PKCE.",
    description:
      "Cổng định danh bảo mật Zero-Trust hỗ trợ chuẩn RFC 7636 PKCE dành riêng cho ứng dụng di động và web SPA. Đăng nhập nhanh qua Google, GitHub hoặc tài khoản hệ sinh thái, tự động cấp phát token JWT ngắn hạn.",
    icon: IconShieldCheck,
    color: "#fb291a",
    highlights: [
      "Chuẩn PKCE (RFC 7636) bảo vệ mã ủy quyền chống lại việc bị ứng dụng độc hại đánh chặn",
      "Hỗ trợ Social Login: Google Account, GitHub SSO và xác thực đa yếu tố",
      "Token JWT ngắn hạn với chu kỳ thu hồi và làm mới phiên an toàn",
      "Mã hóa đầu cuối, khóa riêng tư được bảo vệ trong Secure Enclave của thiết bị",
    ],
    ctaText: "Tích hợp vntez-id SDK",
    ctaLink: "/docs#oauth-pkce",
  },
  {
    id: "bman-pos",
    badge: "BÁN LẺ & ĐIỂM BÁN // OFFLINE ENGINE",
    name: "BMAN POS & Offline Core",
    headline: "Máy bán hàng chạy trơn tru kể cả khi mất Internet.",
    description:
      "Được thiết kế theo triết lý Offline-First với cơ sở dữ liệu SQLite nhúng tại máy thu ngân. Nhân viên bán hàng tiếp tục quét mã, thêm món và in bill qua mạng LAN bình thường. Dữ liệu tự động đồng bộ và đối soát ngay khi có kết nối trở lại.",
    icon: IconRefresh,
    color: "#06b6d4",
    highlights: [
      "Bán hàng và in hóa đơn qua mạng LAN chỉ mất 15ms không cần Internet",
      "Hàng đợi Write-Ahead Log (WAL) SQLite an toàn chống sập nguồn đột ngột (ACID)",
      "Thuật toán đối soát tự động (Automatic Reconciliation) không gây xung đột số liệu",
      "Khóa tồn kho nguyên tử hỗ trợ chiến dịch bán hàng đa kênh có lượng truy cập lớn",
    ],
    ctaText: "Khám phá kiến trúc POS",
    ctaLink: "/blog/offline-first-pos-architecture",
  },
  {
    id: "supply-chain",
    badge: "KHO VẬN & LOGISTICS // SMART DISPATCH",
    name: "vntez Fleet & Logistics (WMS)",
    headline: "Tối ưu hóa tuyến đường giao nhận & điều phối kho bãi.",
    description:
      "Hệ thống điều phối kho vận thời gian thực tự động sắp xếp vị trí hàng hóa theo tần suất xuất kho và vạch lộ trình giao hàng chặng cuối cho tài xế với sai số dự báo ETA dưới 2 phút.",
    icon: IconTruckDelivery,
    color: "#10b981",
    highlights: [
      "Thuật toán định tuyến đa điểm giảm tới 30% quãng đường di chuyển của đội xe",
      "Tự động tính toán vị trí lưu kho thông minh (Smart Shelf Slotting)",
      "Cập nhật tọa độ GPS và trạng thái đơn hàng theo thời gian thực",
      "Tích hợp chặt chẽ với BMAN POS và hệ thống quản lý xuất nhập tồn",
    ],
    ctaText: "Xem giải pháp Logistics",
    ctaLink: "/docs#logistics-wms",
  },
  {
    id: "telemetry",
    badge: "GIÁM SÁT & QUAN SÁT // OBSERVABILITY",
    name: "vntez Telemetry Engine",
    headline: "Bắt lỗi runtime trên thiết bị trước khi người dùng báo cáo.",
    description:
      "SDK giám sát siêu nhẹ (< 8KB) tự động thu thập lỗi runtime, phân tích stack trace và ghi nhận phễu hành vi của người dùng trên cả nền tảng web, mobile và terminal POS.",
    icon: IconActivity,
    color: "#f77241",
    highlights: [
      "Dung lượng SDK cực nhỏ (< 8KB), không gây ảnh hưởng đến hiệu năng ứng dụng",
      "Tự động bắt lỗi unhandled exception và gửi báo cáo phân tích tức thời",
      "Theo dõi các chỉ số Core Web Vitals (LCP, INP, CLS) theo thời gian thực",
      "Dashboard trực quan với khả năng phân nhóm sự cố theo phiên bản phát hành",
    ],
    ctaText: "Cài đặt Telemetry SDK",
    ctaLink: "/docs#telemetry-sdk",
  },
  {
    id: "ecosystem",
    badge: "HỆ ĐIỀU HÀNH KẾT NỐI // VNTEZ SDK",
    name: "Hệ sinh thái SDK liên thông",
    headline: "Một thư viện duy nhất cho mọi ngôn ngữ và nền tảng.",
    description:
      "Kết nối toàn bộ hạ tầng, định danh và nghiệp vụ bán lẻ qua một thư viện đồng nhất. Hỗ trợ chính thức TypeScript/JavaScript, C# (.NET), Go, Python và cURL CLI.",
    icon: IconLayersLinked,
    color: "#8b5cf6",
    highlights: [
      "Bộ SDK đồng nhất với Type Definition hoàn chỉnh (TypeScript / C# / Go)",
      "Xác thực token và refresh tự động ở tầng ngầm không làm gián đoạn UI",
      "Tài liệu API tương tác với ví dụ thực tế có thể chạy ngay",
      "Cam kết tương thích ngược (Backward Compatibility) và không vendor lock-in",
    ],
    ctaText: "Đọc tài liệu SDK",
    ctaLink: "/docs",
  },
]

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24 space-y-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="brand" className="font-mono uppercase tracking-wider text-xs px-3 py-1">
          HỆ SINH THÁI SẢN PHẨM VNTEZ
        </Badge>

        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Giải pháp đồng nhất cho <br />
          <span className="text-[#fb291a]">Hạ tầng, Bảo mật & Bán lẻ.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          Mỗi sản phẩm được thiết kế để giải quyết dứt điểm một bài toán kỹ thuật trọng yếu, đồng thời kết nối liền mạch thành một hệ điều hành doanh nghiệp thống nhất.
        </p>
      </div>

      {/* Product List */}
      <div className="space-y-16">
        {PRODUCTS.map((prod, idx) => {
          const Icon = prod.icon
          const isEven = idx % 2 === 0

          return (
            <div
              key={prod.id}
              id={prod.id}
              className="scroll-mt-28 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e] p-8 sm:p-10 shadow-sm transition-all hover:border-[#fb291a]/30"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${prod.color}18`, color: prod.color }}
                    >
                      <Icon className="size-6" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: prod.color }}>
                        {prod.badge}
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                        {prod.name}
                      </h2>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {prod.headline}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {prod.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {prod.highlights.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <IconCheck className="size-4 shrink-0 text-emerald-500 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6 lg:border-l lg:border-black/[0.06] lg:dark:border-white/[0.06] lg:pl-8">
                  <div className="space-y-3">
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      Tính khả dụng
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg w-fit">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Production Ready • SLA 99.95%</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Đã triển khai thực tế trên hệ thống chuỗi cửa hàng và doanh nghiệp phân phối tại Việt Nam.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Link
                      href={prod.ctaLink}
                      className={buttonVariants({
                        variant: "default",
                        size: "lg",
                        className: "w-full rounded-xl font-bold gap-2 text-sm shadow-sm",
                      })}
                    >
                      <span>{prod.ctaText}</span>
                      <IconArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Quick Start CTA */}
      <div className="rounded-2xl bg-slate-50 dark:bg-[#070b14] border border-black/[0.06] dark:border-white/[0.06] p-8 sm:p-12 text-center space-y-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Sẵn sàng đưa hệ thống của bạn lên tầm cao mới?
        </h2>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Tích hợp nhanh chóng qua SDK chỉ với vài dòng lệnh. Đội ngũ kỹ sư VNTEZ sẵn sàng hỗ trợ di chuyển dữ liệu miễn phí.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/docs"
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "font-semibold rounded-xl px-6",
            })}
          >
            Đọc tài liệu tích hợp
          </Link>
          <a
            href="mailto:support@vntez.net"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "font-semibold rounded-xl px-6",
            })}
          >
            Liên hệ tư vấn kiến trúc
          </a>
        </div>
      </div>
    </div>
  )
}
