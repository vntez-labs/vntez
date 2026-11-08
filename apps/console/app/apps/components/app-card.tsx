"use client";

import React from "react";
import Link from "next/link";
import {
  IconTrash,
  IconExternalLink,
  IconWorld,
  IconApps,
  IconShieldLock,
  IconArrowRight,
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
  const liveUrl = app.url || (app.ctaLink && app.ctaLink.startsWith("http") ? app.ctaLink : null);
  const clientId = app.clientId || `vntez_${app.id.replace(/-/g, "_")}`;

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-card p-5 shadow-xs hover:shadow-md transition-all duration-200 border border-border">
      <div className="space-y-3.5">
        {/* Header: Avatar, Name & Status */}
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold shrink-0 shadow-2xs">
                <IconApps className="h-6 w-6" />
              </div>
            )}
            <div className="min-w-0">
              <Link
                href={`/apps/${app.id}`}
                className="font-bold text-foreground text-sm truncate font-display hover:text-primary transition-colors block"
              >
                {app.name}
              </Link>
              {liveUrl ? (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary truncate block font-mono hover:underline"
                >
                  {liveUrl.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                <span className="text-xs text-muted-foreground/60 block font-mono">Chưa cấu hình URL</span>
              )}
            </div>
          </div>

          <Badge
            variant="outline"
            className={`text-[10px] shrink-0 border-0 ${
              app.status === "active"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {app.status === "active" ? "Hoạt động" : "Bản nháp"}
          </Badge>
        </div>

        {/* OAuth Client ID Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 border border-border/80 text-[11px] font-mono text-muted-foreground w-fit">
          <IconShieldLock className="h-3 w-3 text-primary opacity-80" />
          <span className="text-muted-foreground">OAuth:</span>
          <span className="font-semibold text-foreground">{clientId}</span>
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
              className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
            >
              <IconWorld className="h-2.5 w-2.5 opacity-60" />
              {plat}
            </span>
          ))}
        </div>
      </div>

      {/* Footer: Workspace Link & Actions */}
      <div className="mt-4 pt-3 flex items-center justify-between border-t border-border text-xs">
        <Link
          href={`/apps/${app.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <span>Workspace</span>
          <IconArrowRight className="h-3.5 w-3.5" />
        </Link>

        <div className="flex items-center gap-1">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-7 px-2 items-center gap-1 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              title={`Mở website trực tiếp: ${liveUrl}`}
            >
              <IconExternalLink className="h-3.5 w-3.5" />
              <span className="text-[11px] font-mono">Live Site</span>
            </a>
          )}
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
