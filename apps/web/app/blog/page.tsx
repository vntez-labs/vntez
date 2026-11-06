import type { Metadata } from "next"
import Link from "next/link"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  IconCalendar,
  IconUser,
  IconArrowUpRight,
  IconMessageCircle,
  IconHeart,
} from "@tabler/icons-react"
import {
  IsometricStorageArt,
  IsometricSecurityArt,
  IsometricOfflineArt,
  IsometricSupplyChainArt,
  IsometricTelemetryArt,
  IsometricEcosystemArt,
} from "@/components/landing/card-illustrations"

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
  color: string
  author: string
  date: string
  readTime: string
  commentsCount: number
  likesCount: number
  thumbnail: React.ComponentType<{ className?: string }>
}

const POSTS: BlogPost[] = [
  {
    slug: "offline-first-pos-architecture",
    title: "Kiến trúc Offline-First với SQLite nhúng: Cách POS vận hành trơn tru khi rớt mạng",
    excerpt:
      "Phân tích chuyên sâu về cách thiết kế cơ sở dữ liệu nhúng SQLite với cơ chế Write-Ahead Log (WAL), in bill tức thời qua mạng LAN trong 15ms và thuật toán tự động đối soát (Reconciliation) khi Internet kết nối trở lại.",
    category: "Kiến trúc hệ thống",
    color: "#06b6d4",
    author: "Core Engineering Team",
    date: "28/10/2026",
    readTime: "8 phút đọc",
    commentsCount: 24,
    likesCount: 186,
    thumbnail: IsometricOfflineArt,
  },
  {
    slug: "optimizing-multipart-upload-nvme",
    title: "Tối ưu hóa Multipart Upload trên cụm lưu trữ NVMe nội địa Hà Nội & TP.HCM",
    excerpt:
      "Tại sao việc đặt máy chủ lưu trữ trong nước với ổ Enterprise NVMe giúp giảm độ trễ từ 120ms xuống dưới 15ms, kết hợp kỹ thuật upload đa luồng song song đạt tốc độ 420 MB/s cho các tệp dữ liệu lớn.",
    category: "Hạ tầng & Lưu trữ",
    color: "#fb291a",
    author: "Infrastructure Lead",
    date: "25/10/2026",
    readTime: "6 phút đọc",
    commentsCount: 19,
    likesCount: 142,
    thumbnail: IsometricStorageArt,
  },
  {
    slug: "oauth2-pkce-mobile-security",
    title: "Bảo vệ ứng dụng di động với chuẩn OAuth 2.0 PKCE (RFC 7636)",
    excerpt:
      "Vì sao Client Secret là một sai lầm bảo mật nghiêm trọng trên ứng dụng di động và Single Page App (SPA). Hướng dẫn từng bước triển khai Proof Key for Code Exchange với Code Verifier và Code Challenge SHA-256.",
    category: "Bảo mật & Định danh",
    color: "#fb291a",
    author: "Security Team",
    date: "21/10/2026",
    readTime: "5 phút đọc",
    commentsCount: 31,
    likesCount: 256,
    thumbnail: IsometricSecurityArt,
  },
  {
    slug: "smart-logistics-route-optimization",
    title: "Thuật toán tối ưu hóa tuyến đường đa điểm trong chuỗi cung ứng WMS",
    excerpt:
      "Giải quyết bài toán người giao hàng (TSP) trong điều kiện giao thông thực tế tại các đô thị Việt Nam: Tối ưu 30% lộ trình và giảm sai số dự báo thời gian đến (ETA) xuống dưới 2 phút.",
    category: "Kho vận & Thuật toán",
    color: "#10b981",
    author: "Logistics Research",
    date: "17/10/2026",
    readTime: "7 phút đọc",
    commentsCount: 14,
    likesCount: 118,
    thumbnail: IsometricSupplyChainArt,
  },
  {
    slug: "eliminating-cloud-egress-fees",
    title: "Loại bỏ chi phí ẩn trong đám mây: Mô hình Zero-Egress hoạt động ra sao?",
    excerpt:
      "So sánh hóa đơn băng thông thực tế của các nhà cung cấp đám mây truyền thống với mô hình lưu trữ gói cước mở rộng minh bạch của vntez Edge Storage.",
    category: "Vận hành & Chi phí",
    color: "#f59e0b",
    author: "Product Strategy",
    date: "12/10/2026",
    readTime: "6 phút đọc",
    commentsCount: 28,
    likesCount: 203,
    thumbnail: IsometricTelemetryArt,
  },
  {
    slug: "vietnam-digital-sovereignty-vision",
    title: "Khát vọng chủ quyền số: Vì sao doanh nghiệp Việt cần hạ tầng công nghệ độc lập?",
    excerpt:
      "Tuân thủ Nghị định 13/2023/NĐ-CP và Luật An ninh mạng không chỉ là yêu cầu pháp lý, mà là chiến lược cốt lõi để bảo vệ dữ liệu kinh doanh và giảm thiểu rủi ro đứt cáp quang quốc tế.",
    category: "Chiến lược & Triết lý",
    color: "#8b5cf6",
    author: "VNTEZ Founders",
    date: "05/10/2026",
    readTime: "9 phút đọc",
    commentsCount: 45,
    likesCount: 389,
    thumbnail: IsometricEcosystemArt,
  },
]

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-10 sm:pt-14 pb-20 sm:pb-28 space-y-20">
      {/* Grid Blog Posts - Direct, borderless, airy layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-16 sm:gap-y-20 lg:gap-y-24">
        {POSTS.map((post) => {
          const ThumbnailComponent = post.thumbnail

          return (
            <article
              key={post.slug}
              className="scroll-mt-28 group flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Frame (Spacious padding, airy, borderless) */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative aspect-[16/10] w-full rounded-2xl bg-slate-50/80 dark:bg-[#0c121e] flex items-center justify-center p-6 sm:p-8 overflow-hidden group-hover:bg-slate-100/80 dark:group-hover:bg-[#0e1626] transition-colors block"
                >
                  {/* Category badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-white dark:bg-[#131b2e] text-slate-700 dark:text-slate-300 shadow-xs">
                      <span className="size-1.5 rounded-full" style={{ backgroundColor: post.color }} />
                      {post.category}
                    </span>
                  </div>

                  {/* Read time badge */}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-[#131b2e]/80 backdrop-blur-xs">
                      {post.readTime}
                    </span>
                  </div>

                  {/* Isometric Thumbnail Illustration */}
                  <div className="relative size-full max-h-32 max-w-44 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 pointer-events-none">
                    <ThumbnailComponent className="size-full object-contain" />
                  </div>
                </Link>

                {/* Title & Interactive Arrow */}
                <h2 className="mt-6 font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#fb291a] transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5">
                    <span>{post.title}</span>
                    <IconArrowUpRight className="size-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-[#fb291a] shrink-0" />
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="mt-2.5 text-[13px] sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Bottom Metadata Bar: Author, Date, Comments, Hearts */}
              <div className="mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between text-xs">
                {/* Author & Publish Date */}
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium text-[11px] truncate">
                    <IconUser className="size-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{post.author}</span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[11px] shrink-0">
                    <IconCalendar className="size-3.5 text-slate-400" />
                    <span>{post.date}</span>
                  </span>
                </div>

                {/* Interactions: Comments & Likes/Hearts */}
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    title={`${post.commentsCount} bình luận`}
                    className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-[11px] font-mono cursor-pointer"
                  >
                    <IconMessageCircle className="size-3.5 text-slate-400" />
                    <span>{post.commentsCount}</span>
                  </span>
                  <span
                    title={`${post.likesCount} lượt yêu thích`}
                    className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-600 transition-colors text-[11px] font-mono font-medium cursor-pointer"
                  >
                    <IconHeart className="size-3.5 fill-rose-500/20 text-rose-500" />
                    <span>{post.likesCount}</span>
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Developer & Newsletter Quick-Access Bar */}
      <div className="rounded-2xl bg-slate-50 dark:bg-[#070b14] border border-slate-200/80 dark:border-white/[0.06] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
            Muốn cập nhật các bài phân tích kiến trúc mới nhất?
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Theo dõi kênh kỹ thuật của vntez hoặc truy cập kho tài liệu lập trình viên.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/docs"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "font-semibold rounded-xl text-xs",
            })}
          >
            Tài liệu kỹ thuật
          </Link>
          <Link
            href="https://vntez-console.vercel.app"
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "font-semibold rounded-xl text-xs",
            })}
          >
            Vào Bảng điều khiển
          </Link>
        </div>
      </div>
    </div>
  )
}
