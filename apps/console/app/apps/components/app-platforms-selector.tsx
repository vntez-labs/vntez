"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

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

interface AppPlatformsSelectorProps {
  platforms: string[];
  setPlatforms: React.Dispatch<React.SetStateAction<string[]>>;
}

export function AppPlatformsSelector({ platforms, setPlatforms }: AppPlatformsSelectorProps) {
  const [customPlatform, setCustomPlatform] = useState("");

  const togglePlatform = (plat: string) => {
    if (platforms.includes(plat)) {
      setPlatforms(platforms.filter((p) => p !== plat));
    } else {
      setPlatforms([...platforms, plat]);
    }
  };

  const handleAddCustomPlatform = () => {
    if (!customPlatform.trim()) return;
    if (!platforms.includes(customPlatform.trim())) {
      setPlatforms([...platforms, customPlatform.trim()]);
    }
    setCustomPlatform("");
  };

  return (
    <div className="space-y-1.5">
      <label className="font-semibold text-foreground">Nền tảng hỗ trợ (Chọn nhiều)</label>
      <div className="flex flex-wrap gap-1.5">
        {COMMON_PLATFORMS.map((plat) => {
          const isSelected = platforms.includes(plat);
          return (
            <button
              key={plat}
              type="button"
              onClick={() => togglePlatform(plat)}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer transition-all ${
                isSelected
                  ? "bg-primary text-white"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {isSelected && <Check className="h-3 w-3" />}
              <span>{plat}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          placeholder="Thêm nền tảng khác..."
          value={customPlatform}
          onChange={(e) => setCustomPlatform(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddCustomPlatform();
            }
          }}
          className="rounded-lg bg-zinc-50 dark:bg-zinc-900/50 px-2.5 py-1 text-xs text-foreground ring-1 ring-zinc-200/80 dark:ring-zinc-800"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddCustomPlatform}
          className="h-7 text-xs"
        >
          Thêm
        </Button>
      </div>
    </div>
  );
}
