"use client";

import React from "react";
import {
  IconEdit,
  IconTrash,
  IconExternalLink,
  IconWorld,
  IconApps,
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import type { AppItem } from "@workspace/ui/lib/content-types";

interface AppCardProps {
  app: AppItem;
  onEdit: (app: AppItem) => void;
  onDelete: (id: string) => void;
}

export function AppCard({ app, onEdit, onDelete }: AppCardProps) {
  const hasLink = Boolean(app.ctaLink && app.ctaLink.trim().length > 0);
  const targetUrl = hasLink ? app.ctaLink.trim() : undefined;
  const isExternal = Boolean(targetUrl && targetUrl.startsWith("http"));

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white dark:bg-card p-5 shadow-xs hover:shadow-sm transition-all duration-200">
      <div className="space-y-3.5">
        {/* Header: Avatar, Name, Category & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {app.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={app.avatarUrl}
                alt={app.name}
                className="h-12 w-12 rounded-xl object-cover ring-2 ring-primary/10 shrink-0"
              />
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold shrink-0 shadow-xs"
                style={{ backgroundColor: app.color || "#fb291a" }}
              >
                <IconApps className="h-6 w-6" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-foreground text-sm truncate font-display">
                {app.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{app.category}</p>
            </div>
          </div>

          <Badge
            variant="outline"
            className={`text-[10px] shrink-0 border-0 ${
              app.status === "active"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
            }`}
          >
            {app.status === "active" ? "Hoạt động" : "Bản nháp"}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {app.description}
        </p>

        {/* Platforms pills */}
        <div className="flex flex-wrap gap-1 pt-1">
          {app.platforms?.map((plat) => (
            <span
              key={plat}
              className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 text-[10px] font-mono text-zinc-600 dark:text-zinc-300"
            >
              <IconWorld className="h-2.5 w-2.5 opacity-60" />
              {plat}
            </span>
          ))}
        </div>
      </div>

      {/* Footer: Metadata & Actions */}
      <div className="mt-4 pt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
        <span className="text-[11px] text-muted-foreground font-mono">
          ID: <strong className="text-foreground">{app.id}</strong>
        </span>

        <div className="flex items-center gap-1">
          {hasLink && (
            <a
              href={targetUrl}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-zinc-100 hover:text-foreground dark:hover:bg-zinc-800 cursor-pointer"
              title="Mở liên kết xem riêng sản phẩm"
            >
              <IconExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(app)}
            className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            title="Sửa ứng dụng"
          >
            <IconEdit className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(app.id)}
            className="h-7 w-7 p-0 rounded-lg text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 cursor-pointer"
            title="Xóa ứng dụng"
          >
            <IconTrash className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
