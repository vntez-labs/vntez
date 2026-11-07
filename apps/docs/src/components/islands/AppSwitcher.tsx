export interface AppInfo {
  id: string;
  name: string;
  badge: string;
  href: string;
}

export const ECOSYSTEM_APPS: AppInfo[] = [
  { id: "workers-hub", name: "Workers Hub", badge: "Edge Cloud", href: "/docs/workers-hub" },
  { id: "vntez-iam", name: "VNTEZ IAM", badge: "SSO & RBAC", href: "/docs/vntez-iam" },
  { id: "solotype", name: "SoloType", badge: "Typing Engine", href: "/docs/solotype" },
  { id: "bonsai-reader", name: "Bonsai Reader", badge: "ePub/MDX", href: "/docs/bonsai-reader" },
  { id: "gitvn", name: "GitVN", badge: "Zero-Friction Git", href: "/docs/gitvn" },
];

interface AppSwitcherProps {
  currentAppId?: string;
}

export function AppSwitcher({ currentAppId = "workers-hub" }: AppSwitcherProps) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800/80 overflow-x-auto">
      {ECOSYSTEM_APPS.map((app) => {
        const isActive = app.id === currentAppId;
        return (
          <a
            key={app.id}
            href={app.href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              isActive
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <span>{app.name}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 font-mono">
              {app.badge}
            </span>
          </a>
        );
      })}
    </div>
  );
}
