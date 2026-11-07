"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";

export interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
  maxHeight?: number;
}

export const AutoResizeTextarea = forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(function AutoResizeTextarea(
  { minRows = 2, maxHeight, className = "", onChange, value, ...props },
  ref
) {
  const localRef = useRef<HTMLTextAreaElement | null>(null);

  useImperativeHandle(ref, () => localRef.current as HTMLTextAreaElement);

  const resize = useCallback(() => {
    const el = localRef.current;
    if (!el) return;

    // Reset height temporarily so scrollHeight recalculates downward when deleting text
    el.style.height = "auto";
    const newHeight = el.scrollHeight;

    if (maxHeight && newHeight > maxHeight) {
      el.style.height = `${maxHeight}px`;
      el.style.overflowY = "auto";
    } else {
      el.style.height = `${newHeight}px`;
      el.style.overflowY = "hidden";
    }
  }, [maxHeight]);

  useEffect(() => {
    resize();
  }, [value, resize]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    resize();
    onChange?.(e);
  };

  return (
    <textarea
      ref={localRef}
      rows={minRows}
      value={value}
      onChange={handleChange}
      spellCheck={props.spellCheck ?? false}
      autoCorrect="off"
      className={`w-full resize-none overflow-hidden bg-transparent border-0 outline-none transition-[height] duration-75 text-foreground placeholder:text-muted-foreground/50 focus:ring-0 ${className}`}
      {...props}
    />
  );
});

AutoResizeTextarea.displayName = "AutoResizeTextarea";
