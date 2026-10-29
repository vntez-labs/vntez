import type { Metadata } from "next"
import Link from "next/link"
import { IconFileText, IconCheck, IconServer2 } from "@tabler/icons-react"

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ — vntez",
  description:
    "Điều khoản sử dụng dịch vụ, cam kết mức độ dịch vụ SLA 99.95%, quyền sở hữu trí tuệ và bảo lãnh không vendor lock-in của vntez.",
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-black/[0.06] dark:border-white/[0.06] pb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#fb291a]/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#fb291a]">
          <IconFileText className="size-4" />
          <span>ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Điều khoản Dịch vụ vntez Platform
        </h1>

        <p className="text-sm text-slate-500 font-mono">
          Hiệu lực từ: Ngày 29 tháng 10 năm 2026 • Phiên bản 2.4
        </p>
      </div>

      {/* Content */}
      <div className="space-y-10 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            1. Chấp thuận điều khoản
          </h2>
          <p>
            Bằng việc đăng ký tài khoản vntez-id, sử dụng SDK hoặc tích hợp bất kỳ dịch vụ nào trong hệ sinh thái vntez (bao gồm Storage Edge S3, BMAN POS, Telemetry), bạn đồng ý chịu sự ràng buộc của các điều khoản dưới đây.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            2. Cam kết chất lượng dịch vụ (SLA)
          </h2>
          <p>
            vntez cam kết thời gian hoạt động khả dụng (Uptime SLA) đạt tối thiểu 99.95% đối với các cụm máy chủ lưu trữ Edge S3 và cổng định danh vntez-id. Trong trường hợp hệ thống gián đoạn vượt quá mức cam kết do lỗi hạ tầng của chúng tôi, khách hàng sẽ được hoàn cước tương ứng theo chính sách tín dụng dịch vụ (Service Credits).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            3. Quyền sở hữu dữ liệu & Cam kết không Vendor Lock-in
          </h2>
          <p>
            Bạn giữ 100% quyền sở hữu trí tuệ và quyền tài sản đối với toàn bộ dữ liệu, mã nguồn và tệp tin tải lên vntez. Chúng tôi cam kết sử dụng các chuẩn giao thức mở (Open Standard: AWS S3 API, OAuth 2.0 PKCE, SQLite WAL) để bạn có thể tự do sao lưu, di chuyển hoặc chuyển đổi nhà cung cấp mà không gặp bất kỳ rào cản kỹ thuật hay chi phí phạt nào.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            4. Trách nhiệm người sử dụng
          </h2>
          <p>
            Bạn chịu trách nhiệm bảo quản an toàn thông tin đăng nhập và khóa xác thực API Key của mình. Nghiêm cấm sử dụng hệ thống để lưu trữ hoặc phát tán phần mềm độc hại, vi phạm pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500">
        <Link href="/" className="text-[#fb291a] font-semibold hover:underline">
          ← Quay về trang chủ
        </Link>
        <Link href="/privacy" className="hover:underline">
          Xem Chính sách bảo mật →
        </Link>
      </div>
    </div>
  )
}
