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
    <div className="w-full lg:w-72 xl:w-80 shrink-0 bg-muted/20 flex flex-col divide-y divide-border">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/40">
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

      {/* Document Navigation List */}
      <div className="flex-1 p-2 space-y-1 overflow-y-auto max-h-[600px]">
        {docs.map((d) => {
          const isSelected = d.slug === currentSlug;
          return (
            <div
              key={d.slug}
              onClick={() => onSelectDoc(d.slug)}
              className={`group flex items-center justify-between p-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                isSelected
                  ? "bg-primary text-white font-semibold shadow-xs"
                  : "hover:bg-muted/70 text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="min-w-0 flex-1 pr-2">
                <div className={`text-xs truncate ${isSelected ? "text-white font-bold" : "text-foreground"}`}>
                  {d.title}
                </div>
                <div className={`text-[10px] font-mono truncate ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
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
                  className={`opacity-0 group-hover:opacity-100 p-1 rounded-md cursor-pointer transition-opacity ${
                    isSelected
                      ? "text-white/90 hover:bg-white/20"
                      : "text-rose-500 hover:bg-rose-500/10"
                  }`}
                  title="Xóa văn bản"
                >
                  <IconTrash className="h-3 w-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar Bottom Action */}
      <div className="p-3 bg-muted/30">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenCreateModal}
          className="w-full text-xs rounded-xl cursor-pointer gap-1.5 bg-card border border-border shadow-2xs hover:bg-muted font-medium"
        >
          <IconPlus className="h-3.5 w-3.5" />
          <span>Thêm văn bản pháp lý</span>
        </Button>
      </div>
    </div>
  );
}
