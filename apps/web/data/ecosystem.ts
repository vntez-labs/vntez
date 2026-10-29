import {
  IconShieldCheck,
  IconServer2,
  IconActivity,
  IconShoppingCart,
  IconBrandSpeedtest,
  IconLockCheck,
  IconBook2,
  IconClockHour4,
  IconDeviceLaptop,
  IconBuildingWarehouse,
  IconTruckDelivery,
} from "@tabler/icons-react"
import type React from "react"

export interface ProductItem {
  id: string
  name: string
  role: string
  problemSolved: string
  valueDelivered: string
  capabilities: string[]
  icon: React.ComponentType<{ className?: string }>
}

export interface EcosystemPillar {
  id: string
  title: string
  category: string
  summary: string
  problemStatement: string
  borderColor: string
  badgeColor: string
  iconColor: string
  products: ProductItem[]
  quickLinks: {
    label: string
    href: string
  }[]
}

export const ECOSYSTEM_PILLARS: EcosystemPillar[] = [
  {
    id: "core",
    title: "Hạ tầng & Định danh",
    category: "Core & Infrastructure",
    summary: "Xác thực người dùng an toàn và lưu trữ dữ liệu không lo phát sinh chi phí băng thông.",
    problemStatement: "Giải quyết chi phí xuất băng thông đắt đỏ của các đám mây ngoại và sự phức tạp khi đồng bộ tài khoản người dùng đa ứng dụng.",
    borderColor: "border-[#fb291a]/60 hover:border-[#fb291a]",
    badgeColor: "bg-[#fb291a]/10 text-[#f77241] border-[#fb291a]/30",
    iconColor: "text-[#f77241]",
    products: [
      {
        id: "vntez-id",
        name: "vntez-id",
        role: "Cổng định danh & SSO",
        problemSolved: "Người dùng ngại nhớ mật khẩu; doanh nghiệp mất quyền kiểm soát khi nhân sự đổi thiết bị.",
        valueDelivered: "Đăng nhập một chạm bằng vân tay/khuôn mặt (Passkey). Thu hồi quyền truy cập tức thì trên toàn bộ hệ thống khi cần.",
        capabilities: [
          "Xác thực sinh trắc học FIDO2 không mật khẩu",
          "Cấp quyền tập trung theo chuẩn OAuth 2.0 / OIDC",
          "Hủy phiên làm việc ngay lập tức khi phát hiện rủi ro",
        ],
        icon: IconShieldCheck,
      },
      {
        id: "edge-r2",
        name: "Edge Storage R2",
        role: "Lưu trữ tương thích S3",
        problemSolved: "Hóa đơn đám mây tăng đột biến mỗi tháng do phí xuất băng thông tải ảnh/tệp về máy người dùng.",
        valueDelivered: "Miễn phí 100% chi phí băng thông tải về (Zero Egress). Máy chủ đặt tại Hà Nội và TP.HCM cho tốc độ tải cực nhanh.",
        capabilities: [
          "Tương thích hoàn toàn với AWS S3 SDK và MinIO",
          "Không tính phí băng thông tải xuống cho người dùng",
          "Tự động sao lưu dữ liệu giữa các trung tâm dữ liệu nội địa",
        ],
        icon: IconServer2,
      },
      {
        id: "telemetry",
        name: "Telemetry Pipeline",
        role: "Giám sát dịch vụ phân tán",
        problemSolved: "Khó tìm nguyên nhân khi dịch vụ bị nghẽn hoặc ứng dụng xảy ra lỗi âm thầm giữa nhiều máy chủ.",
        valueDelivered: "Nhìn thấy toàn bộ hành trình gọi API, phát hiện điểm thắt cổ chai và nhận thông báo ngay khi có dấu hiệu bất thường.",
        capabilities: [
          "Thu thập log và vết gọi (tracing) chuẩn OpenTelemetry",
          "Cảnh báo tự động về Telegram, Slack hoặc Webhook",
          "Truy vấn nguyên nhân gốc của lỗi chỉ trong vài giây",
        ],
        icon: IconActivity,
      },
    ],
    quickLinks: [
      { label: "Đăng nhập vntez-id", href: "#vntez-id" },
      { label: "Lưu trữ Edge R2", href: "#edge-r2" },
      { label: "Giám sát Telemetry", href: "#telemetry" },
    ],
  },
  {
    id: "commerce",
    title: "Thương mại & Bán lẻ",
    category: "Commerce & Retail",
    summary: "Hệ thống bán hàng tại quầy không gián đoạn và công cụ quản lý đơn hàng cho các chiến dịch lớn.",
    problemStatement: "Cửa hàng bị tê liệt khi mất kết nối Internet; kho hàng bị bán vượt (overselling) khi chạy Flash Sale triệu đơn.",
    borderColor: "border-cyan-500/60 hover:border-cyan-400",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    iconColor: "text-cyan-400",
    products: [
      {
        id: "bman-pos",
        name: "BMAN POS",
        role: "Điểm bán hàng bán lẻ",
        problemSolved: "Đứt cáp quang hoặc nghẽn mạng khiến nhân viên thu ngân không quét được mã, không in được hóa đơn.",
        valueDelivered: "Bán hàng và tạo đơn bình thường kể cả khi mất mạng hoàn toàn. Dữ liệu tự động đồng bộ lên mây ngay khi có kết nối lại.",
        capabilities: [
          "Vận hành ngoại tuyến 100% nhờ cơ sở dữ liệu SQLite cục bộ",
          "Tạo mã VietQR Pro động cho khách quét thanh toán tức thì",
          "Kết nối trực tiếp máy in nhiệt, máy quét mã vạch và cân",
        ],
        icon: IconShoppingCart,
      },
      {
        id: "inventory-lock",
        name: "Smart Inventory Locking",
        role: "Khóa giữ tồn kho nguyên tử",
        problemSolved: "Nhiều khách cùng bấm mua 1 sản phẩm cuối cùng dẫn đến tình trạng hủy đơn, khách hàng thất vọng.",
        valueDelivered: "Tự động khóa giữ hàng trong giỏ đúng số lượng tồn thực tế. Nếu khách không thanh toán sau 5 phút, kho tự động mở lại.",
        capabilities: [
          "Khóa giữ hàng phân tán loại bỏ 100% nguy cơ bán vượt",
          "Tự động hoàn kho sau thời gian chờ (TTL) định sẵn",
          "Đồng bộ số lượng tồn kho đa kênh theo thời gian thực",
        ],
        icon: IconLockCheck,
      },
      {
        id: "ad-bidding",
        name: "Dynamic Ad Bidding",
        role: "Sàn đấu thầu quảng cáo RTB",
        problemSolved: "Nhà bán lẻ không tối ưu được ngân sách quảng cáo, hiển thị sản phẩm không đúng đối tượng có nhu cầu.",
        valueDelivered: "Đấu giá vị trí hiển thị sản phẩm theo thời gian thực dựa trên hành vi mua hàng, giúp tối ưu chi phí quảng cáo cho từng đơn.",
        capabilities: [
          "Đấu giá hiển thị tốc độ cao theo chuẩn OpenRTB",
          "Dự đoán khả năng mua hàng bằng mô hình học máy",
          "Kiểm soát ngân sách thông minh tránh cạn kiệt sớm",
        ],
        icon: IconBrandSpeedtest,
      },
    ],
    quickLinks: [
      { label: "Điểm bán BMAN POS", href: "#bman-pos" },
      { label: "Khóa kho thông minh", href: "#inventory-lock" },
      { label: "Đấu thầu quảng cáo", href: "#ad-bidding" },
    ],
  },
  {
    id: "logistics",
    title: "Kho vận & Giao nhận",
    category: "Logistics & Fleet",
    summary: "Rút ngắn thời gian nhặt hàng trong kho và tự động tìm cung đường giao hàng tiết kiệm xăng nhất.",
    problemStatement: "Nhân công mất nhiều giờ đi lại tìm hàng trong kho rộng; tài xế đi lòng vòng dẫn đến giao hàng trễ hẹn.",
    borderColor: "border-emerald-500/60 hover:border-emerald-400",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    iconColor: "text-emerald-400",
    products: [
      {
        id: "smart-dispatch",
        name: "Smart Dispatch WMS",
        role: "Hệ thống điều phối kho bãi",
        problemSolved: "Mặt hàng bán chạy lại bị xếp ở góc xa nhất, nhân viên phải đi bộ hàng nghìn bước mỗi ca làm việc.",
        valueDelivered: "Tự động gợi ý xếp hàng bán chạy gần cửa xuất. Thuật toán vạch đường đi ngắn nhất để gom đủ sản phẩm cho một đợt đơn.",
        capabilities: [
          "Phân loại vị trí kho thông minh theo tốc độ bán hàng",
          "Vạch lộ trình nhặt hàng ngắn nhất cho nhân viên kho",
          "Kiểm đếm chính xác từng kiện hàng bằng mã vạch/RFID",
        ],
        icon: IconBuildingWarehouse,
      },
      {
        id: "fleet-delivery",
        name: "Last-Mile Delivery Fleet",
        role: "Định tuyến giao hàng chặng cuối",
        problemSolved: "Tài xế tự chọn đường theo thói quen dễ bị kẹt xe, tốn xăng và khách hàng không biết bao giờ nhận được đồ.",
        valueDelivered: "Tính toán thứ tự giao các điểm sao cho quãng đường ngắn nhất, báo trước giờ nhận chính xác và theo dõi nhiệt độ xe lạnh.",
        capabilities: [
          "Tự động tính lộ trình giao hàng tối ưu đa điểm",
          "Báo giờ giao dự kiến (ETA) chuẩn xác cho người nhận",
          "Theo dõi cảm biến hành trình và nhiệt độ thùng lạnh từ xa",
        ],
        icon: IconTruckDelivery,
      },
    ],
    quickLinks: [
      { label: "Điều phối kho WMS", href: "#smart-dispatch" },
      { label: "Tối ưu giao vận", href: "#fleet-delivery" },
    ],
  },
  {
    id: "consumer",
    title: "Tri thức & Năng suất",
    category: "Productivity & Media",
    summary: "Bộ công cụ làm việc cá nhân và đội nhóm: đọc tài liệu học thuật, làm việc tập trung và truyền dẫn media.",
    problemStatement: "Văn bản tiếng Việt hiển thị trên các ứng dụng ngoại hay bị lỗi dấu, bể phông; lập trình viên hay bị phân tâm ngắt quãng khi làm việc.",
    borderColor: "border-purple-500/60 hover:border-purple-400",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    iconColor: "text-purple-400",
    products: [
      {
        id: "bonsai-reader",
        name: "Bonsai Reader",
        role: "Trình đọc tài liệu & ghi chú",
        problemSolved: "Đọc sách/tài liệu dài bị mỏi mắt, các ký tự tiếng Việt có dấu bị xô lệch hàng hoặc lỗi dấu hỏi, ngã, nặng.",
        valueDelivered: "Trải nghiệm đọc thư thái với Typography tiếng Việt được căn chỉnh hoàn hảo. Đồng bộ ghi chú Markdown hai chiều giữa máy tính và điện thoại.",
        capabilities: [
          "Typography tối ưu riêng cho tiếng Việt không bao giờ lỗi dấu",
          "Chế độ đọc Dark Mode và E-Ink bảo vệ mắt",
          "Ghi chú Markdown liên kết hai chiều theo dạng đồ thị tri thức",
        ],
        icon: IconBook2,
      },
      {
        id: "pomoduo",
        name: "Pomoduo",
        role: "Đồng hồ tập trung theo nhóm",
        problemSolved: "Kỹ sư đang code dở thì bị tin nhắn chen ngang làm mất mạch tư duy (mất 20 phút để lấy lại sự tập trung).",
        valueDelivered: "Đồng bộ phiên làm việc sâu (Deep Work) giữa các thành viên. Hiển thị trạng thái đang tập trung để đồng nghiệp không ngắt quãng.",
        capabilities: [
          "Đồng bộ đồng hồ phiên làm việc thời gian thực",
          "Gắn mốc phiên tập trung với commit Git",
          "Hạn chế thông báo gây xao nhãng trong giờ code",
        ],
        icon: IconClockHour4,
      },
      {
        id: "media-portals",
        name: "Media Portals",
        role: "Truyền dẫn nội dung số",
        problemSolved: "Video bài giảng hoặc sự kiện trực tiếp bị giật lag khi có nhiều người xem cùng lúc.",
        valueDelivered: "Tự động giảm hoặc tăng độ phân giải video mượt mà theo tốc độ mạng người xem, bảo vệ bản quyền bằng dấu chìm số.",
        capabilities: [
          "Phát trực tiếp và phát lại độ trễ thấp chuẩn HLS",
          "Tự động điều chỉnh chất lượng hình ảnh theo đường truyền",
          "Đóng dấu bản quyền video chống sao chép trái phép",
        ],
        icon: IconDeviceLaptop,
      },
    ],
    quickLinks: [
      { label: "Ứng dụng Bonsai Reader", href: "#bonsai-reader" },
      { label: "Làm việc tập trung Pomoduo", href: "#pomoduo" },
      { label: "Cổng truyền thông Media", href: "#media-portals" },
    ],
  },
]
