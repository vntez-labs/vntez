export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "WS";

interface MethodBadgeProps {
  method: HttpMethod | string;
  className?: string;
}

const METHOD_STYLES: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  POST: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  PUT: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  DELETE: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  PATCH: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  WS: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
};

export function MethodBadge({ method, className = "" }: MethodBadgeProps) {
  const upper = method.toUpperCase();
  const style = METHOD_STYLES[upper] || "bg-slate-500/10 text-slate-600 border-slate-500/20";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-wide border uppercase ${style} ${className}`}
    >
      {upper}
    </span>
  );
}
