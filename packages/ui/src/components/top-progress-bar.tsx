"use client";

import { useEffect, useState, useRef } from "react";

export function TopProgressBar({
  color = "from-red-600 via-rose-500 to-amber-500",
}: {
  color?: string;
}) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const clearAllTimers = () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };

    const startProgress = () => {
      // Defer state update to next macrotask to prevent React 19 useInsertionEffect error
      setTimeout(() => {
        clearAllTimers();
        setVisible(true);
        setProgress(30);

        const t1 = setTimeout(() => setProgress(75), 120);
        const t2 = setTimeout(() => {
          setProgress(100);
          const t3 = setTimeout(() => {
            setVisible(false);
            setProgress(0);
          }, 280);
          timersRef.current.push(t3);
        }, 300);

        timersRef.current.push(t1, t2);
      }, 0);
    };

    // Monkey-patch pushState & replaceState safely with deferred execution
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      startProgress();
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = function (...args) {
      startProgress();
      return originalReplaceState.apply(this, args);
    };

    const handlePopState = () => startProgress();
    window.addEventListener("popstate", handlePopState);

    // Click interceptor for instantaneous feedback when clicking internal links
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target || !target.href) return;

      const url = new URL(target.href, window.location.href);
      const isInternal = url.origin === window.location.origin;
      const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
      const isSelf = target.target === "" || target.target === "_self";
      const isSamePage =
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash !== "";

      if (isInternal && !isModified && isSelf && !isSamePage) {
        startProgress();
      }
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleClick, { capture: true });
      clearAllTimers();
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[99999] h-[3px] overflow-hidden"
    >
      <div
        className={`h-full bg-gradient-to-r ${color} transition-all duration-300 ease-out shadow-[0_0_12px_rgba(239,68,68,0.8),0_0_6px_rgba(244,63,94,0.6)]`}
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transitionProperty: "width, opacity",
        }}
      />
      <div
        className="absolute top-0 bottom-0 h-full w-24 -translate-x-full bg-gradient-to-r from-transparent to-white/70 blur-[2px] transition-all duration-300"
        style={{ left: `${progress}%`, opacity: visible ? 1 : 0 }}
      />
    </div>
  );
}
