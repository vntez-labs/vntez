import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  IconCalendar,
  IconClock,
  IconUser,
  IconArrowRight,
  IconTag,
} from "@tabler/icons-react"

export const metadata: Metadata = {
  title: "Blog & Kỹ thuật — vntez Engineering",
  description:
    "Chia sẻ kiến trúc hệ thống, nghiên cứu kỹ thuật phân tán, bảo mật OAuth 2.0 PKCE, điện toán Offline-First và cập nhật công nghệ từ đội ngũ vntez.",
}

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  featured?: boolean
}

const POSTS: BlogPost[] = [
  {
    slug: "offline-first-pos-architecture",
    title: "Kiến trúc Offline-First với SQLite nhúng: Cách POS vận hành trơn tru khi rớt mạng",
    excerpt:
      "Phân tích chuyên sâu về cách thiết kế cơ sở dữ liệu nhúng SQLite với cơ chế Write-Ahead Log (WAL), in bill tức thời qua mạng LAN trong 15ms và thuật toán tự động đối soát (Reconciliation) khi Internet kết nối trở lại.",
    category: "Kiến trúc hệ thống",
    author: "Core Engineering Team",
    date: "28/10/2026",
    readTime: "8 phút đọc",
    featured: true,
  },
  {
    slug: "optimizing-multipart-upload-nvme",
    title: "Tối ưu hóa Multipart Upload trên cụm lưu trữ NVMe nội địa Hà Nội & TP.HCM",
    excerpt:
      "Tại sao việc đặt máy chủ lưu trữ trong nước với ổ Enterprise NVMe giúp giảm độ trễ từ 120ms xuống dưới 15ms, kết hợp kỹ thuật upload đa luồng song song đạt tốc độ 420 MB/s cho các tệp dữ liệu lớn.",
    category: "Hạ tầng & Lưu trữ",
    author: "Infrastructure Lead",
    date: "25/10/2026",
    readTime: "6 phút đọc",
    featured: true,
  },
  {
    slug: "oauth2-pkce-mobile-security",
    title: "Bảo vệ ứng dụng di động với chuẩn OAuth 2.0 PKCE (RFC 7636)",
    excerpt:
      "Vì sao Client Secret là một sai lầm bảo mật nghiêm trọng trên ứng dụng di động và Single Page App (SPA). Hướng dẫn từng bước triển khai Proof Key for Code Exchange với Code Verifier và Code Challenge SHA-256.",
    category: "Bảo mật & Định danh",
    author: "Security Team",
    date: "21/10/2026",
    readTime: "5 phút đọc",
  },
  {
    slug: "smart-logistics-route-optimization",
    title: "Thuật toán tối ưu hóa tuyến đường đa điểm trong chuỗi cung ứng WMS",
    excerpt:
      "Giải quyết bài toán người giao hàng (TSP) trong điều kiện giao thông thực tế tại các đô thị Việt Nam: Tối ưu 30% lộ trình và giảm sai số dự báo thời gian đến (ETA) xuống dưới 2 phút.",
    category: "Kho vận & Thuật toán",
    author: "Logistics Research",
    date: "17/10/2026",
    readTime: "7 phút đọc",
  },
  {
    slug: "eliminating-cloud-egress-fees",
    title: "Loại bỏ chi phí ẩn trong đám mây: Mô hình Zero-Egress hoạt động ra sao?",
    excerpt:
      "So sánh hóa đơn băng thông thực tế của các nhà cung cấp đám mây truyền thống với mô hình lưu trữ gói cước mở rộng minh bạch của vntez Edge Storage.",
    category: "Vận hành & Chi phí",
    author: "Product Strategy",
    date: "12/10/2026",
    readTime: "6 phút đọc",
  },
  {
    slug: "vietnam-digital-sovereignty-vision",
    title: "Khát vọng chủ quyền số: Vì sao doanh nghiệp Việt cần hạ tầng công nghệ độc lập?",
    excerpt:
      "Tuân thủ Nghị định 13/2023/NĐ-CP và Luật An ninh mạng không chỉ là yêu cầu pháp lý, mà là chiến lược cốt lõi để bảo vệ dữ liệu kinh doanh và giảm thiểu rủi ro đứt cáp quang quốc tế.",
    category: "Chiến lược & Triết lý",
    author: "VNTEZ Founders",
    date: "05/10/2026",
    readTime: "9 phút đọc",
  },
]

export default function BlogPage() {
  const featuredPosts = POSTS.filter((p) => p.featured)
  const regularPosts = POSTS.filter((p) => !p.featured)

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="brand" className="font-mono uppercase tracking-wider text-xs px-3 py-1">
          VNTEZ ENGINEERING BLOG
        </Badge>

        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Chia sẻ kỹ thuật, kiến trúc & <br />
          <span className="text-[#fb291a]">Cập nhật công nghệ thực tế.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          Góc nhìn sâu của đội ngũ kỹ sư vntez về hệ thống phân tán, điện toán biên, bảo mật OAuth 2.0 PKCE và trải nghiệm người dùng thực chiến.
        </p>
      </div>

      {/* Featured Articles */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          <IconTag className="size-4 text-[#fb291a]" />
          <span>Bài viết tiêu điểm</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredPosts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col justify-between rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e] p-8 shadow-sm hover:border-[#fb291a]/40 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <Badge variant="brand" className="font-mono text-[11px] font-semibold">
                    {post.category}
                  </Badge>
                  <span className="text-slate-400 flex items-center gap-1">
                    <IconClock className="size-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#fb291a] transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <IconUser className="size-3.5 text-slate-400" />
                    <span>{post.author}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <IconCalendar className="size-3.5 text-slate-400" />
                    <span>{post.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-semibold text-[#fb291a] group-hover:translate-x-0.5 transition-transform">
                  <span>Đọc tiếp</span>
                  <IconArrowRight className="size-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Recent Posts Grid */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          <IconTag className="size-4" />
          <span>Tất cả bài viết kỹ thuật</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regularPosts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col justify-between rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#0c121e]/60 p-6 hover:bg-white dark:hover:bg-[#0c121e] hover:border-[#fb291a]/30 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    {post.category}
                  </span>
                  <span className="text-slate-400 text-[11px]">{post.readTime}</span>
                </div>

                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#fb291a] transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <IconCalendar className="size-3.5" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-[#fb291a]">
                  <span>Chi tiết</span>
                  <IconArrowRight className="size-3" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter / RSS Box */}
      <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-slate-50 dark:bg-[#070b14] p-8 sm:p-10 text-center space-y-4">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Nhận các bài viết kỹ thuật mới nhất từ vntez
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Cập nhật kiến trúc phân tán, mã nguồn mở và kinh nghiệm vận hành hạ tầng không spam.
        </p>
        <div className="flex max-w-md mx-auto gap-2">
          <input
            type="email"
            placeholder="Nhập email của bạn..."
            className="flex-1 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e] px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#fb291a]"
          />
          <Button variant="default" className="rounded-xl px-5 font-semibold shrink-0">
            Đăng ký
          </Button>
        </div>
      </div>
    </div>
  )
}
