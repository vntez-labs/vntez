import {
  IconAlertTriangle,
  IconClockOff,
  IconCoinOff,
  IconCpu,
  IconDeviceFloppy,
  IconLayersLinked,
  IconTopologyStar3,
  IconTrendingUp,
  IconUserCheck,
  IconWorldWww,
} from "@tabler/icons-react"
import type React from "react"

// ============================================================================
// 1. WHY: VẤN ĐỀ THỰC TẾ (TẠI SAO CẦN VNTEZ?)
// ============================================================================

export interface WhyProblem {
  id: string
  title: string
  problem: string
  consequence: string
  icon: React.ComponentType<{ className?: string }>
}

export const WHY_PROBLEMS: WhyProblem[] = [
  {
    id: "cloud-lockin",
    title: "Đám mây ngoại đắt đỏ & phí ẩn",
    problem:
      "Lưu trữ dữ liệu trên các đám mây toàn cầu phát sinh chi phí xuất băng thông (egress) khổng lồ mỗi khi ứng dụng tải tệp/ảnh về thiết bị người dùng.",
    consequence:
      "Chi phí phình to không kiểm soát, phụ thuộc hoàn toàn vào hạ tầng nước ngoài và chịu rủi ro đứt cáp quang biển.",
    icon: IconCoinOff,
  },
  {
    id: "pos-fragility",
    title: "Điểm bán lẻ tê liệt khi rớt mạng",
    problem:
      "Hầu hết các phần mềm bán hàng POS hiện nay hoạt động thuần web (Cloud-Only). Khi mạng cáp quang bị nghẽn, quầy thu ngân không quét được mã, không in được bill.",
    consequence:
      "Khách xếp hàng dài, mất đơn, và trong các đợt Flash Sale thì hệ thống bán vượt tồn kho (overselling) dẫn đến hủy đơn hàng loạt.",
    icon: IconAlertTriangle,
  },
  {
    id: "fragmented-tools",
    title: "Vận hành rời rạc, chắp vá hàng chục công cụ",
    problem:
      "Doanh nghiệp phải mua riêng lẻ: một bên làm đăng nhập SSO, một bên làm kho bãi WMS, một bên làm giao hàng, một bên làm phần mềm nội bộ.",
    consequence:
      "Các hệ thống không thể liên thông dữ liệu. Dữ liệu bị phân mảnh, nhân sự phải sao chép thủ công qua Excel gây sai lệch dây chuyền.",
    icon: IconClockOff,
  },
]

// ============================================================================
// 2. HOW: Ý TƯỞNG & CÁCH TIẾP CẬN CỦA VNTEZ
// ============================================================================

export interface HowPrinciple {
  step: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export const HOW_PRINCIPLES: HowPrinciple[] = [
  {
    step: "01",
    title: "Offline-First: Vận hành độc lập tại biên",
    description:
      "Thiết bị đầu cuối (máy POS bán lẻ, thiết bị kiểm kho) lưu trữ cơ sở dữ liệu SQLite cục bộ. Mạng Internet chỉ là tầng đồng bộ dữ liệu ngầm, không phải điều kiện tiên quyết để hoạt động.",
    icon: IconDeviceFloppy,
  },
  {
    step: "02",
    title: "Zero-Egress: Đặt máy chủ ngay tại Việt Nam",
    description:
      "Kho lưu trữ Edge R2 được đặt tại Hà Nội và TP.HCM, kết nối thẳng tới các nhà mạng nội địa (Viettel, FPT, VNPT). Miễn phí 100% băng thông xuất dữ liệu, triệt tiêu độ trễ mạng ngoại.",
    icon: IconWorldWww,
  },
  {
    step: "03",
    title: "Single Source of Truth: Đồng thuận phân tán",
    description:
      "Khóa tồn kho nguyên tử (Atomic Lock) bằng cụm đồng thuận Raft đảm bảo một sản phẩm chỉ được bán cho một người tại một thời điểm, đồng bộ tức thì giữa quầy offline và sàn online.",
    icon: IconLayersLinked,
  },
  {
    step: "04",
    title: "Bản địa hóa sâu: Tối ưu cho người Việt",
    description:
      "Từ Typography tiếng Việt chuẩn quang học không bao giờ vỡ dấu (Bonsai Reader), đến việc tích hợp sẵn VietQR Pro, Napas và tuân thủ Luật Bảo vệ dữ liệu cá nhân Nghị định 13.",
    icon: IconTopologyStar3,
  },
]

// ============================================================================
// 3. RESULT: GIÁ TRỊ VÀ KẾT QUẢ THỰC TẾ
// ============================================================================

export interface ResultBenefit {
  target: string
  headline: string
  benefits: string[]
  icon: React.ComponentType<{ className?: string }>
}

export const RESULT_BENEFITS: ResultBenefit[] = [
  {
    target: "Doanh nghiệp Bán lẻ & Chuỗi cửa hàng",
    headline: "Bán hàng liên tục 100%, không lo rớt mạng",
    benefits: [
      "Thu ngân thanh toán và in hóa đơn bình thường ngay cả khi đứt mạng cáp quang.",
      "Tự động khóa giữ giỏ hàng trong 5 phút khi chạy khuyến mãi, triệt tiêu 100% rủi ro bán vượt tồn kho.",
      "Tích hợp quét mã VietQR Pro và thẻ ngân hàng Napas hoàn tất trong dưới 0.4 giây.",
    ],
    icon: IconTrendingUp,
  },
  {
    target: "Nhà phát triển & Doanh nghiệp Công nghệ",
    headline: "Hạ tầng biên tự chủ, cắt giảm chi phí lưu trữ",
    benefits: [
      "Không tốn một đồng phí tải dữ liệu ra (Zero Egress) cho kho lưu trữ tương thích S3.",
      "Đăng nhập một chạm bảo mật cao bằng Passkey vân tay/khuôn mặt không cần nhớ mật khẩu.",
      "Hệ thống giám sát phân tán OpenTelemetry giúp phát hiện lỗi hệ thống ngay khi vừa phát sinh.",
    ],
    icon: IconCpu,
  },
  {
    target: "Đơn vị Kho vận & Vận chuyển",
    headline: "Rút ngắn quãng đường, giao hàng đúng hẹn",
    benefits: [
      "Tự động xếp hàng bán chạy gần cửa xuất, giảm hơn 40% quãng đường di chuyển của nhân sự nhặt hàng.",
      "Thuật toán định tuyến tự động tìm đường ngắn nhất cho tài xế giao đa điểm, tiết kiệm nhiên liệu.",
      "Khách hàng nhận được thông báo giờ giao hàng chuẩn xác với sai số dưới 3 phút.",
    ],
    icon: IconUserCheck,
  },
]
