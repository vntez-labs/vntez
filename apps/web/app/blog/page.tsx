import type { Metadata } from "next";
import Link from "next/link";
import {
  IconCalendar,
  IconUser,
  IconArrowUpRight,
  IconMessageCircle,
  IconHeart,
  IconEye,
} from "@tabler/icons-react";
import {
  IsometricStorageArt,
  IsometricSecurityArt,
  IsometricOfflineArt,
  IsometricSupplyChainArt,
  IsometricTelemetryArt,
  IsometricEcosystemArt,
} from "@/components/landing/card-illustrations";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-14 sm:gap-y-18">
        {posts.map((post) => {
          const ThumbnailComponent = ART_MAP[post.illustrationKey || "ecosystem"] || IsometricEcosystemArt;

          return (
            <article key={post.slug} className="group flex flex-col justify-between">
              <div>
                {/* Thumbnail Frame */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative aspect-[16/10] w-full rounded-2xl bg-slate-50/80 dark:bg-[#0c121e] flex items-center justify-center p-6 sm:p-8 overflow-hidden group-hover:bg-slate-100/80 dark:group-hover:bg-[#0e1626] transition-colors block"
                >
                  {/* Category & Read Time badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-white dark:bg-[#131b2e] text-slate-700 dark:text-slate-300 shadow-xs">
                      <span className="size-1.5 rounded-full" style={{ backgroundColor: post.color || "#fb291a" }} />
                      {post.category}
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5 z-10">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-white/80 dark:bg-[#131b2e]/80 text-slate-500 dark:text-slate-400 backdrop-blur-xs">
                      {post.readTime}
                    </span>
                  </div>

                  {/* Thumbnail: Custom image or Isometric Art */}
                  {post.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="size-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                    />
                  ) : (
                    <div className="relative size-full max-h-32 max-w-44 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 pointer-events-none">
                      <ThumbnailComponent className="size-full object-contain" />
                    </div>
                  )}
                </Link>

                {/* Title */}
                <h2 className="mt-5 font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#fb291a] transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-baseline gap-1.5">
                    <span>{post.title}</span>
                    <IconArrowUpRight className="size-4 shrink-0 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-[#fb291a]" />
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="mt-2.5 text-[13px] text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed font-sans">
                  {post.excerpt}
                </p>
              </div>

              {/* Author, Date & Stats footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-sans">
                <div className="flex items-center gap-2 truncate">
                  <span className="flex items-center gap-1 truncate font-medium text-slate-700 dark:text-slate-300">
                    <IconUser className="size-3.5 shrink-0 opacity-60" />
                    <span className="truncate">{post.author}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 shrink-0 font-mono text-[11px]">
                    <IconCalendar className="size-3.5 shrink-0 opacity-60" />
                    <span>{post.date}</span>
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2.5 font-mono text-[11px] shrink-0">
                  <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400" title="Lượt xem">
                    <IconEye className="size-3.5" />
                    <span>{post.viewsCount || 0}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400" title="Bình luận">
                    <IconMessageCircle className="size-3.5" />
                    <span>{post.commentsCount || (post.comments?.length || 0)}</span>
                  </span>
                  <span className="flex items-center gap-1 text-rose-500" title="Lượt tim">
                    <IconHeart className="size-3.5 fill-rose-500/20" />
                    <span>{post.likesCount || 0}</span>
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
