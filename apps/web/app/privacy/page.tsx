import type { Metadata } from "next"
import Link from "next/link"
import { IconShieldCheck, IconLock, IconDatabase, IconFileText } from "@tabler/icons-react"

export const metadata: Metadata = {
  title: "Chính sách bảo mật thông tin — vntez",
  description:
    "Cam kết bảo vệ dữ liệu cá nhân, quyền riêng tư và tuân thủ Luật An ninh mạng & Nghị định 13/2023/NĐ-CP của hệ sinh thái vntez.",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-black/[0.06] dark:border-white/[0.06] pb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <IconShieldCheck className="size-4" />
          <span>CHÍNH SÁCH BẢO MẬT & QUYỀN RIÊNG TƯ</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Chính sách Bảo vệ Dữ liệu & Quyền riêng tư
        </h1>

        <p className="text-sm text-slate-500 font-mono">
          Cập nhật lần cuối: Ngày 29 tháng 10 năm 2026 • Tuân thủ Nghị định 13/2023/NĐ-CP
        </p>
      </div>

      {/* Content */}
      <div className="space-y-10 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            1. Nguyên tắc cam kết bảo vệ dữ liệu
          </h2>
          <p>
            Hệ sinh thái công nghệ vntez (thuộc VNTEZ LABS) cam kết tôn trọng tuyệt đối quyền riêng tư và quyền kiểm soát dữ liệu của quý khách hàng, lập trình viên và doanh nghiệp đối tác. Chúng tôi vận hành theo nguyên tắc tối giản dữ liệu (Data Minimization) và Zero-Knowledge Architecture.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            2. Phạm vi dữ liệu thu thập
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
            <li>
              <strong className="text-slate-900 dark:text-white">Dữ liệu định danh vntez-id:</strong> Địa chỉ email, tên hiển thị công khai từ nhà cung cấp Social OAuth (Google, GitHub) khi được bạn cấp quyền. Chúng tôi không bao giờ lưu trữ mật khẩu dạng rõ (plaintext password).
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Dữ liệu lưu trữ Edge S3:</strong> Tệp tin nhị phân và đối tượng do người dùng tải lên được mã hóa khi lưu trữ (Encryption at Rest) bằng thuật toán AES-256 và mã hóa khi truyền tải (TLS 1.3).
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Dữ liệu điểm bán Offline BMAN:</strong> Dữ liệu bán hàng lưu trên SQLite cục bộ tại thiết bị của doanh nghiệp. vntez chỉ nhận bản sao lưu và bản ghi đối soát khi doanh nghiệp chủ động kích hoạt đồng bộ.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            3. Chủ quyền dữ liệu và Lưu trữ nội địa
          </h2>
          <p>
            Toàn bộ máy chủ lưu trữ chính và cơ sở dữ liệu của vntez được đặt tại các trung tâm dữ liệu đạt chuẩn Tier III tại Hà Nội và TP.HCM, đảm bảo tuân thủ đầy đủ các quy định về lưu trữ dữ liệu tại Việt Nam theo Luật An ninh mạng và Nghị định số 53/2022/NĐ-CP.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            4. Quyền của chủ thể dữ liệu
          </h2>
          <p>
            Bạn có toàn quyền yêu cầu trích xuất toàn bộ dữ liệu, cập nhật thông tin hoặc xóa vĩnh viễn tài khoản và các tệp lưu trữ bất kỳ lúc nào thông qua giao diện quản trị hoặc gửi email yêu cầu tới <a href="mailto:privacy@vntez.net" className="text-[#fb291a] font-semibold hover:underline">privacy@vntez.net</a>.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500">
        <Link href="/" className="text-[#fb291a] font-semibold hover:underline">
          ← Quay về trang chủ
        </Link>
        <Link href="/terms" className="hover:underline">
          Xem Điều khoản dịch vụ →
        </Link>
      </div>
    </div>
  )
}
