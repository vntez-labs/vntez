import type { Metadata } from "next";
import Link from "next/link";
import {
  IconCalendar,
  IconUser,
  IconArrowUpRight,
  IconMessageCircle,
  IconHeart,
  IconEye,
  IconClock,
} from "@tabler/icons-react";
import {
  IsometricStorageArt,
  IsometricSecurityArt,
  IsometricOfflineArt,
  IsometricSupplyChainArt,
  IsometricTelemetryArt,
  IsometricEcosystemArt,
} from "@/components/landing/card-illustrations";
import { buttonVariants } from "@workspace/ui/components/button";
import { fetchLiveBlogPosts } from "@workspace/ui/lib/content-service";
import type { BlogPostItem } from "@workspace/ui/lib/content-types";

export const metadata: Metadata = {
  title: "Blog & Kỹ thuật — vntez Engineering",
  description:
    "Chia sẻ kiến trúc hệ thống, nghiên cứu kỹ thuật phân tán, định danh & phân quyền IAM, điện toán Offline-First và cập nhật công nghệ từ đội ngũ vntez.",
};

export const dynamic = "force-dynamic";

const ART_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  storage: IsometricStorageArt,
  security: IsometricSecurityArt,
  offline: IsometricOfflineArt,
  "supply-chain": IsometricSupplyChainArt,
  telemetry: IsometricTelemetryArt,
  ecosystem: IsometricEcosystemArt,
};

export default async function BlogPage() {
  const livePosts = await fetchLiveBlogPosts();
  const posts = livePosts.filter((p) => p.status !== "draft");

  return (
    <div className="mx-auto max-w-6xl px-6 pt-10 sm:pt-14 pb-20 sm:pb-28 space-y-16">
      {/* Blog Posts Grid */}
      {posts.length === 0 ? (
        <div className="py-24 text-center space-y-3 bg-slate-50/50 dark:bg-white/[0.02] rounded-3xl border border-dashed border-slate-200 dark:border-white/[0.06] p-8">
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">Chưa có bài viết nào được xuất bản</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Các bài viết kỹ thuật và kiến trúc hệ thống sẽ hiển thị tại đây sau khi bạn tạo và xuất bản từ VNTEZ Console.
          </p>
          <div className="pt-2">
            <Link
              href="https://vntez-console.vercel.app/blog-posts/editor"
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "font-semibold rounded-xl text-xs",
              })}
            >
              Soạn bài viết trong Console
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-14 sm:gap-y-18">
        {posts.map((post) => {
          const ThumbnailComponent = ART_MAP[post.illustrationKey || "ecosystem"] || IsometricEcosystemArt;

          return (
            <article key={post.slug} className="group flex flex-col justify-between">
              <div>
                {/* Clean Thumbnail Frame with no badge interference */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative aspect-[16/10] w-full rounded-2xl bg-slate-100 dark:bg-[#0c121e] overflow-hidden block"
                >
                  {post.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                    />
                  ) : (
                    <div className="relative size-full flex items-center justify-center p-6 sm:p-8 transition-transform duration-500 group-hover:scale-105 pointer-events-none">
                      <ThumbnailComponent className="size-full object-contain" />
                    </div>
                  )}
                </Link>

                {/* Category & Read Time cleanly separated from image */}
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300">
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: post.color || "#fb291a" }} />
                    {post.category}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                    <IconClock className="size-3 opacity-60" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                {/* Title */}
                <h2 className="mt-2.5 font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#fb291a] transition-colors leading-snug line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-baseline gap-1.5">
                    <span>{post.title}</span>
                    <IconArrowUpRight className="size-4 shrink-0 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-[#fb291a]" />
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="mt-2 text-[13px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
                  {post.excerpt}
                </p>
              </div>

              {/* Author, Date & Stats footer - Spacious and uncrowded */}
              <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-7 rounded-full bg-slate-100 dark:bg-white/[0.08] flex items-center justify-center font-bold text-[11px] text-slate-700 dark:text-slate-300 shrink-0">
                    {post.author ? post.author.slice(0, 1).toUpperCase() : "V"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                      {post.author}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 leading-tight">
                      {post.date}
                    </p>
                  </div>
                </div>

                {/* Metrics Pill Badge */}
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] font-mono text-[11px] shrink-0 text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400" title="Lượt xem">
                    <IconEye className="size-3.5" />
                    <span>{post.viewsCount || 0}</span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="flex items-center gap-1 text-rose-500" title="Lượt tim">
                    <IconHeart className="size-3.5 fill-rose-500/20" />
                    <span>{post.likesCount || 0}</span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="flex items-center gap-1 text-amber-500" title="Bình luận">
                    <IconMessageCircle className="size-3.5" />
                    <span>{post.commentsCount || (post.comments?.length || 0)}</span>
                  </span>
                </div>
              </div>
            </article>
          );
        })}
        </div>
      )}
    </div>
  );
}
