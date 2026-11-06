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

const FALLBACK_APPS: AppItem[] = [
  {
    id: "storage",
    name: "vntez Storage & Edge",
    category: "Lưu trữ đối tượng",
    description: "Lưu trữ đối tượng chuẩn AWS S3 API trên cụm NVMe nội địa, tối ưu độ trễ truy xuất và miễn phí băng thông tải về.",
    releaseDate: "10/2024",
    platforms: ["AWS S3 API", "Node.js", "Go", "Python", "CLI"],
    color: "#fb291a",
    ctaLink: "/docs#storage-api",
    avatarUrl: null,
    illustrationKey: "storage",
    status: "active",
    updatedAt: "2026-10-29T12:00:00Z",
  },
  {
    id: "vntez-iam",
    name: "vntez-iam",
    category: "Định danh & Phân quyền IAM",
    description: "Hệ thống IAM toàn diện: Quản lý định danh người dùng, ma trận phân quyền RBAC/ABAC, Single Sign-On (SSO) và xác thực an toàn chuẩn Enterprise.",
    releaseDate: "08/2024",
    platforms: ["Web SPA", "iOS", "Android", "REST API", "OIDC"],
    color: "#fb291a",
    ctaLink: "/docs#vntez-iam",
    avatarUrl: null,
    illustrationKey: "security",
    status: "active",
    updatedAt: "2026-10-29T12:00:00Z",
  },
  {
    id: "bman-pos",
    name: "BMAN POS",
    category: "Bán lẻ & Điểm bán",
    description: "Máy bán lẻ Offline-First chạy cơ sở dữ liệu SQLite cục bộ, duy trì quét mã và in bill trơn tru ngay cả khi mất mạng.",
    releaseDate: "05/2024",
    platforms: ["Windows", "macOS", "Linux", "Android POS"],
    color: "#06b6d4",
    ctaLink: "/blog/offline-first-pos-architecture",
    avatarUrl: null,
    illustrationKey: "offline",
    status: "active",
    updatedAt: "2026-10-29T12:00:00Z",
  },
  {
    id: "supply-chain",
    name: "vntez WMS & Fleet",
    category: "Kho vận & Logistics",
    description: "Hệ thống quản lý kho vận thông minh và thuật toán định tuyến giao hàng chặng cuối theo thời gian thực cho chuỗi phân phối.",
    releaseDate: "03/2024",
    platforms: ["Web Dashboard", "Android", "iOS"],
    color: "#10b981",
    ctaLink: "/docs#logistics-wms",
    avatarUrl: null,
    illustrationKey: "supply-chain",
    status: "active",
    updatedAt: "2026-10-29T12:00:00Z",
  },
  {
    id: "telemetry",
    name: "vntez Telemetry",
    category: "Giám sát & Vết lỗi",
    description: "Bộ công cụ thu thập log, tracing chuẩn OpenTelemetry và bắt lỗi runtime thời gian thực với SDK siêu nhẹ (< 8KB).",
    releaseDate: "01/2024",
    platforms: ["Web", "Node.js", "React Native", "Flutter"],
    color: "#f77241",
    ctaLink: "/docs#telemetry-sdk",
    avatarUrl: null,
    illustrationKey: "telemetry",
    status: "active",
    updatedAt: "2026-10-29T12:00:00Z",
  },
  {
    id: "ecosystem",
    name: "vntez SDK & Tools",
    category: "Bộ công cụ SDK",
    description: "Bộ thư viện đa ngôn ngữ với Type Definition hoàn chỉnh đơn giản hóa việc tích hợp TypeScript, Go, C# (.NET) và Python.",
    releaseDate: "11/2023",
    platforms: ["TypeScript", "Go", "C# (.NET)", "Python"],
    color: "#8b5cf6",
    ctaLink: "/docs",
    avatarUrl: null,
    illustrationKey: "ecosystem",
    status: "active",
    updatedAt: "2026-10-29T12:00:00Z",
  },
];

export default async function ProductsPage() {
  const liveApps = await fetchLiveApps();
  const products = (liveApps.length > 0 ? liveApps : FALLBACK_APPS).filter(
    (p) => p.status !== "draft"
  );

  return (
    <div className="mx-auto max-w-6xl px-6 pt-10 sm:pt-14 pb-20 sm:pb-28 space-y-20">
      {/* Grid Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-16 sm:gap-y-20 lg:gap-y-24">
        {products.map((prod) => {
          const ThumbnailComponent = ART_MAP[prod.illustrationKey || "ecosystem"] || IsometricEcosystemArt;

          return (
            <article key={prod.id} id={prod.id} className="scroll-mt-28 group flex flex-col justify-between">
              <div>
                {/* Thumbnail Frame */}
                <Link
                  href={prod.ctaLink || `/docs#${prod.id}`}
                  className="relative aspect-[16/10] w-full rounded-2xl bg-slate-50/80 dark:bg-[#0c121e] flex items-center justify-center p-6 sm:p-8 overflow-hidden group-hover:bg-slate-100/80 dark:group-hover:bg-[#0e1626] transition-colors block"
                >
                  {/* Category badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-white dark:bg-[#131b2e] text-slate-700 dark:text-slate-300 shadow-xs">
                      <span className="size-1.5 rounded-full" style={{ backgroundColor: prod.color || "#fb291a" }} />
                      {prod.category}
                    </span>
                  </div>

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
                </Link>

                {/* Title & Interactive Arrow */}
                <h2 className="mt-6 font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#fb291a] transition-colors">
                  <Link href={prod.ctaLink || `/docs#${prod.id}`} className="inline-flex items-center gap-1.5">
                    <span>{prod.name}</span>
                    <IconArrowUpRight className="size-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-[#fb291a]" />
                  </Link>
                </h2>

                {/* Description */}
                <p className="mt-2.5 text-[13px] sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  {prod.description}
                </p>
              </div>

              {/* Platforms footer */}
              {prod.platforms && prod.platforms.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
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
            </article>
          );
        })}
      </div>

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
  );
}
