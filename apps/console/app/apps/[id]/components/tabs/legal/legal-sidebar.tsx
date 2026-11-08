"use client";

import React from "react";
import { IconScale, IconPlus, IconTrash } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import type { AppLegalDocument } from "@workspace/ui/lib/content-types";

interface LegalSidebarProps {
  docs: AppLegalDocument[];
  currentSlug: string;
  onSelectDoc: (slug: string) => void;
  onDeleteDoc: (slug: string) => void;
  onOpenCreateModal: () => void;
}

export function LegalSidebar({
  docs,
  currentSlug,
  onSelectDoc,
  onDeleteDoc,
  onOpenCreateModal,
}: LegalSidebarProps) {
  return (
    <div className="lg:col-span-1 space-y-3">
      <div className="p-4 rounded-2xl bg-white dark:bg-card border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconScale className="h-4 w-4 text-primary" />
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-foreground">
              Văn Bản Pháp Lý ({docs.length})
            </h4>
          </div>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            title="Thêm văn bản mới"
          >
            <IconPlus className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-1">
          {docs.map((d) => {
            const isSelected = d.slug === currentSlug;
            return (
              <div
                key={d.slug}
                onClick={() => onSelectDoc(d.slug)}
                className={`group flex items-center justify-between p-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="text-xs truncate">{d.title}</div>
                  <div className="text-[10px] font-mono text-muted-foreground truncate">
                    /{d.slug} • v{d.version || "1.0"}
                  </div>
                </div>

                {docs.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDoc(d.slug);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-opacity"
                    title="Xóa văn bản"
                  >
                    <IconTrash className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenCreateModal}
          className="w-full text-xs rounded-xl cursor-pointer gap-1.5"
        >
          <IconPlus className="h-3.5 w-3.5" />
          <span>Thêm văn bản pháp lý</span>
        </Button>
      </div>
    </div>
  );
}
