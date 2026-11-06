"use client";

import React from "react";
import { ArrowUpRight, Monitor, Layers } from "lucide-react";
import type { AppItem } from "@workspace/ui/lib/content-types";

interface ProductCardPreviewProps {
  name: string;
  category: string;
  description: string;
  color: string;
  platforms: string[];
  avatarUrl: string;
  illustrationKey: AppItem["illustrationKey"];
  status: "active" | "draft";
}

export function ProductCardPreview({
  name,
  category,
  description,
  color,
  platforms,
  avatarUrl,
  status,
}: ProductCardPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
          Xem trước chính xác (Trang Sản phẩm /products)
        </label>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
            status === "active"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          }`}
        >
          {status === "active" ? "Hiển thị công khai" : "Bản nháp ẩn"}
        </span>
      </div>

      <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 bg-zinc-50/50 dark:bg-zinc-900/30">
        <article className="max-w-sm mx-auto flex flex-col justify-between group">
          <div>
            {/* Thumbnail Box */}
            <div className="relative aspect-[16/10] w-full rounded-2xl bg-white dark:bg-[#0c121e] flex items-center justify-center p-6 sm:p-8 overflow-hidden shadow-xs border border-zinc-100 dark:border-zinc-800/80">
              {/* Category badge */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-zinc-50 dark:bg-[#131b2e] text-zinc-700 dark:text-zinc-300 shadow-2xs">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: color || "#fb291a" }}
                  />
                  {category || "Danh mục"}
                </span>
              </div>

              {/* Avatar or Isometric Icon */}
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={name || "Preview"}
                  className="size-20 rounded-2xl object-cover shadow-sm pointer-events-none"
                />
              ) : (
                <div
                  className="size-20 rounded-2xl flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: color || "#fb291a" }}
                >
                  <Layers className="size-10 opacity-80" />
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="mt-5 font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              <span className="inline-flex items-center gap-1.5">
                <span>{name || "Tên Ứng dụng / Sản phẩm"}</span>
                <ArrowUpRight className="size-4 text-primary" />
              </span>
            </h3>

            {/* Description */}
            <p className="mt-2 text-xs sm:text-[13px] text-muted-foreground line-clamp-3 leading-relaxed">
              {description ||
                "Mô tả sản phẩm sẽ hiển thị tại đây khi khách hàng truy cập trang chủ hoặc danh mục sản phẩm..."}
            </p>
          </div>

          {/* Platforms Footer */}
          {platforms && platforms.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
              {platforms.map((plat) => (
                <span
                  key={plat}
                  className="inline-flex items-center gap-1 rounded-md bg-white dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 shadow-2xs"
                >
                  <Monitor className="size-2.5 opacity-60" />
                  {plat}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
