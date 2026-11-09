"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

export interface UseClipboardOptions {
  timeout?: number;
  showToast?: boolean;
  toastMessage?: string;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const {
    timeout = 2000,
    showToast = true,
    toastMessage = "Đã sao chép vào bộ nhớ tạm",
  } = options;

  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text) return false;

      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for older browsers or non-secure contexts
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }

        setCopied(true);

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
          setCopied(false);
        }, timeout);

        if (showToast) {
          toast.success(toastMessage);
        }

        return true;
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
        if (showToast) {
          toast.error("Không thể sao chép vào bộ nhớ tạm");
        }
        return false;
      }
    },
    [timeout, showToast, toastMessage]
  );

  return { copy, copied };
}
