import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@workspace/ui/components/button";
import { IconArrowUpRight, IconDeviceDesktop } from "@tabler/icons-react";
import {
  IsometricStorageArt,
  IsometricSecurityArt,
  IsometricOfflineArt,
  IsometricSupplyChainArt,
  IsometricTelemetryArt,
  IsometricEcosystemArt,
} from "@/components/landing/card-illustrations";
import { fetchLiveApps } from "@workspace/ui/lib/content-service";
import type { AppItem } from "@workspace/ui/lib/content-types";

export const metadata: Metadata = {
  title: "Sản phẩm — Hệ sinh thái Công nghệ vntez",
  description:
    "Danh mục các sản phẩm chủ lực của vntez: Lưu trữ Edge S3, Định danh & Phân quyền IAM (vntez-iam), Máy bán hàng Offline-First BMAN, Chuỗi cung ứng WMS và Hệ thống Giám sát Telemetry.",
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

export default async function ProductsPage() {
  const liveApps = await fetchLiveApps();
  const products = liveApps.filter((p) => p.status !== "draft");

  return (
    <div className="mx-auto max-w-6xl px-6 pt-10 sm:pt-14 pb-20 sm:pb-28 space-y-20">
      {/* Grid Products */}
      {products.length === 0 ? (
        <div className="py-24 text-center space-y-3 bg-slate-50/50 dark:bg-white/[0.02] rounded-3xl border border-dashed border-slate-200 dark:border-white/[0.06] p-8">
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">Chưa có sản phẩm nào được công bố</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Hệ sinh thái đang sẵn sàng. Hãy tạo sản phẩm đầu tiên trong VNTEZ Console để hiển thị tại đây.
          </p>
          <div className="pt-2">
            <Link
              href="https://vntez-console.vercel.app/apps/editor"
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "font-semibold rounded-xl text-xs",
              })}
            >
              Tạo ứng dụng trong Console
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-16 sm:gap-y-20 lg:gap-y-24">
          {products.map((prod) => {
            const ThumbnailComponent = ART_MAP[prod.illustrationKey || "ecosystem"] || IsometricEcosystemArt;
            const liveUrl = prod.url || (prod.ctaLink && prod.ctaLink.trim().length > 0 ? prod.ctaLink.trim() : undefined);
            const hasLink = Boolean(liveUrl);
            const docsBaseUrl = process.env.NEXT_PUBLIC_DOCS_URL || "https://vntez-docs.vercel.app";
            const targetHref = liveUrl?.startsWith("/docs") ? `${docsBaseUrl}${liveUrl}` : liveUrl;
            const isExternal = Boolean(targetHref && targetHref.startsWith("http"));

            return (
              <article key={prod.id} id={prod.id} className="scroll-mt-28 group flex flex-col justify-between">
                <div>
                  {/* Thumbnail Frame */}
                  {hasLink ? (
                    <a
                      href={targetHref}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer" : undefined}
                      className="relative aspect-[16/10] w-full rounded-2xl bg-slate-50/80 dark:bg-[#0c121e] flex items-center justify-center p-6 sm:p-8 overflow-hidden group-hover:bg-slate-100/80 dark:group-hover:bg-[#0e1626] transition-colors block cursor-pointer"
                    >
                      {/* Category badge */}
                      {prod.category && (
                        <div className="absolute top-3.5 left-3.5 z-10">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-white dark:bg-[#131b2e] text-slate-700 dark:text-slate-300 shadow-xs">
                            <span className="size-1.5 rounded-full" style={{ backgroundColor: prod.color || "#fb291a" }} />
                            {prod.category}
                          </span>
                        </div>
                      )}

                      {/* Thumbnail: Render avatar image or Isometric Illustration */}
                      {prod.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={prod.avatarUrl}
                          alt={prod.name}
                          className="size-24 rounded-2xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                        />
                      ) : (
                        <div className="relative size-full max-h-32 max-w-44 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 pointer-events-none">
                          <ThumbnailComponent className="size-full object-contain" />
                        </div>
                      )}
                    </a>
                  ) : (
                    <div className="relative aspect-[16/10] w-full rounded-2xl bg-slate-50/80 dark:bg-[#0c121e] flex items-center justify-center p-6 sm:p-8 overflow-hidden">
                      {/* Category badge */}
                      <div className="absolute top-3.5 left-3.5 z-10">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-white dark:bg-[#131b2e] text-slate-700 dark:text-slate-300 shadow-xs">
                          <span className="size-1.5 rounded-full" style={{ backgroundColor: prod.color || "#fb291a" }} />
                          {prod.category}
                        </span>
                      </div>

                      {prod.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={prod.avatarUrl}
                          alt={prod.name}
                          className="size-24 rounded-2xl object-cover shadow-sm pointer-events-none"
                        />
                      ) : (
                        <div className="relative size-full max-h-32 max-w-44 flex items-center justify-center pointer-events-none">
                          <ThumbnailComponent className="size-full object-contain" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Title & Interactive Arrow */}
                  <h2 className="mt-6 font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#fb291a] transition-colors">
                    {hasLink ? (
                      <a
                        href={targetHref}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5"
                      >
                        <span>{prod.name}</span>
                        <IconArrowUpRight className="size-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-[#fb291a]" />
                      </a>
                    ) : (
                      <span>{prod.name}</span>
                    )}
                  </h2>

                  {/* Description - Clamped to 3 lines */}
                  <p className="mt-2.5 text-[13px] sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans line-clamp-3">
                    {prod.description}
                  </p>
                </div>

                {/* Platforms & Product Action Links */}
                <div className="space-y-3 pt-4">
                  {prod.platforms && prod.platforms.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {prod.platforms.map((plat) => (
                        <span
                          key={plat}
                          className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 text-[10px] font-mono text-zinc-600 dark:text-zinc-400"
                        >
                          <IconDeviceDesktop className="size-2.5 opacity-60" />
                          {plat}
                        </span>
                      ))}
                    </div>
                  )}

                  {hasLink && (
                    <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs">
                      <a
                        href={targetHref}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noreferrer" : undefined}
                        className="inline-flex items-center gap-1 font-semibold text-[#fb291a] hover:text-[#d91f12] transition-colors"
                      >
                        <span>Khám phá sản phẩm</span>
                        <IconArrowUpRight className="size-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Developer Quick-Access Bar */}
      <div className="rounded-2xl bg-slate-50 dark:bg-[#070b14] border border-slate-200/80 dark:border-white/[0.06] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
            Cần tích hợp hoặc tài liệu API chi tiết?
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Tra cứu hướng dẫn cài đặt SDK hoặc truy cập cổng điều khiển để cấu hình dịch vụ.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={process.env.NEXT_PUBLIC_DOCS_URL || "https://vntez-docs.vercel.app"}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "font-semibold rounded-xl text-xs",
            })}
          >
            Tài liệu kỹ thuật
          </a>
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
  );
}
