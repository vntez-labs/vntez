"use client";

import React from "react";
import { Toaster as SonnerToaster, toast } from "sonner";
import { useTheme } from "next-themes";

export { toast };

export interface ToasterProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
  richColors?: boolean;
}

export function Toaster({
  position = "bottom-right",
  richColors = true,
}: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <SonnerToaster
      theme={theme as "light" | "dark" | "system"}
      position={position}
      richColors={richColors}
      closeButton
      toastOptions={{
        className: "!font-sans !rounded-2xl !border !border-border !shadow-lg !text-xs",
        descriptionClassName: "!text-[11px] !text-muted-foreground",
      }}
    />
  );
}
