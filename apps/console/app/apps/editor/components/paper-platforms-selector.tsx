"use client";

import React, { useState } from "react";
import { Check, Plus } from "lucide-react";

const COMMON_PLATFORMS = [
  "Web",
  "iOS",
  "Android",
  "macOS",
  "Windows",
  "Linux",
  "AWS S3 API",
  "REST API",
  "CLI",
  "Node.js",
  "Go",
  "Python",
];

interface PaperPlatformsSelectorProps {
  platforms: string[];
  setPlatforms: React.Dispatch<React.SetStateAction<string[]>>;
}

export function PaperPlatformsSelector({
  platforms,
  setPlatforms,
}: PaperPlatformsSelectorProps) {
  const [customPlatform, setCustomPlatform] = useState("");

  const togglePlatform = (plat: string) => {
    if (platforms.includes(plat)) {
      setPlatforms(platforms.filter((p) => p !== plat));
    } else {
      setPlatforms([...platforms, plat]);
    }
  };

  const handleAddCustomPlatform = () => {
    const trimmed = customPlatform.trim();
    if (!trimmed) return;
    if (!platforms.includes(trimmed)) {
      setPlatforms([...platforms, trimmed]);
    }
    setCustomPlatform("");
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
        Nền tảng & Hệ thống hỗ trợ
      </label>

      <div className="flex flex-wrap gap-2">
        {COMMON_PLATFORMS.map((plat) => {
          const isSelected = platforms.includes(plat);
          return (
            <button
              key={plat}
              type="button"
              onClick={() => togglePlatform(plat)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-medium cursor-pointer transition-all ${
                isSelected
                  ? "bg-primary text-white shadow-xs"
                  : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-muted-foreground hover:text-foreground"
              }`}
            >
              {isSelected && <Check className="h-3 w-3" />}
              <span>{plat}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <input
          type="text"
          placeholder="Thêm nền tảng tùy biến khác..."
          value={customPlatform}
          onChange={(e) => setCustomPlatform(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddCustomPlatform();
            }
          }}
          className="max-w-xs bg-transparent border-0 border-b border-zinc-200/80 dark:border-zinc-800 focus:border-primary px-0 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors"
        />
        <button
          type="button"
          onClick={handleAddCustomPlatform}
          className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Thêm nền tảng</span>
        </button>
      </div>
    </div>
  );
}
