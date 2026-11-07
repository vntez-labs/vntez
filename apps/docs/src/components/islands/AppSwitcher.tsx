import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, Cpu, Shield, GitBranch, Keyboard, BookOpen, Layers } from "lucide-react";

export interface AppDefinition {
  id: string;
  name: string;
  category: string;
  badge: string;
  href: string;
  description: string;
  icon?: string;
}

export const ALL_APPS: AppDefinition[] = [
  {
    id: "workers-hub",
    name: "Workers Hub",
    category: "Hạ tầng & Dịch vụ Biên",
    badge: "Cloudflare Edge",
    href: "/docs/workers-hub",
    description: "Quản lý cụm Workers, R2, D1, Telemetry & Instant Cache Purge.",
    icon: "⚡",
  },
  {
    id: "vntez-iam",
    name: "VNTEZ IAM",
    category: "Bảo mật & Định danh",
    badge: "OAuth 2.0 PKCE",
    href: "/docs/vntez-iam",
    description: "Single Sign-On (SSO), OIDC Claims và Ma trận Phân quyền RBAC.",
    icon: "🛡️",
  },
  {
    id: "gitvn",
    name: "GitVN",
    category: "Ứng dụng & Hướng dẫn",
    badge: "Zero-Friction Git",
    href: "/docs/gitvn",
    description: "Git repository local-first, tích hợp Kanban Jira và Confluence Markdown.",
    icon: "🌿",
  },
  {
    id: "solotype",
    name: "SoloType",
    category: "Ứng dụng & Hướng dẫn",
    badge: "Typing Engine",
    href: "/docs/solotype",
    description: "Cẩm nang luyện gõ phím 10 ngón tiếng Việt Telex/VNI và từ vựng code.",
    icon: "⌨️",
  },
  {
    id: "bonsai-reader",
    name: "Bonsai Reader",
    category: "Ứng dụng & Hướng dẫn",
    badge: "Minimalist Reader",
    href: "/docs/bonsai-reader",
    description: "Trình đọc sách ePub, PDF & MDX tối giản chuẩn mực typography tiếng Việt.",
    icon: "📖",
  },
];

interface AppSwitcherProps {
  currentAppId?: string;
}

export function AppSwitcher({ currentAppId = "workers-hub" }: AppSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const activeApp = ALL_APPS.find((a) => a.id === currentAppId) || ALL_APPS[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filteredApps = useMemo(() => {
    if (!query.trim()) return ALL_APPS;
    const q = query.toLowerCase();
    return ALL_APPS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.badge.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );
  }, [query]);

  // Group filtered apps by category
  const grouped = useMemo(() => {
    return filteredApps.reduce<Record<string, AppDefinition[]>>((acc, app) => {
      if (!acc[app.category]) acc[app.category] = [];
      acc[app.category].push(app);
      return acc;
    }, {});
  }, [filteredApps]);

  const getAppIcon = (id: string) => {
    switch (id) {
      case "workers-hub":
        return <Cpu className="h-3.5 w-3.5 text-amber-500" />;
      case "vntez-iam":
        return <Shield className="h-3.5 w-3.5 text-red-500" />;
      case "gitvn":
        return <GitBranch className="h-3.5 w-3.5 text-indigo-500" />;
      case "solotype":
        return <Keyboard className="h-3.5 w-3.5 text-sky-500" />;
      case "bonsai-reader":
        return <BookOpen className="h-3.5 w-3.5 text-emerald-500" />;
      default:
        return <Layers className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Compact Switcher Trigger (Scales to 50+ Apps!) */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setQuery("");
        }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-all cursor-pointer shadow-xs"
        aria-label="Chọn ứng dụng tài liệu"
      >
        <span className="flex items-center gap-1.5">
          {getAppIcon(activeApp?.id || "")}
          <span>{activeApp?.name}</span>
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-normal">
          {activeApp?.badge}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Searchable Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 max-h-96 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col">
          {/* Search Input */}
          <div className="relative mb-2 px-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm trong 30+ sản phẩm..."
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-900/80 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-red-500 border border-slate-200 dark:border-slate-800/80"
            />
          </div>

          {/* Grouped App List */}
          <div className="overflow-y-auto max-h-72 space-y-3 px-1 py-1">
            {Object.keys(grouped).length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">
                Không tìm thấy ứng dụng phù hợp
              </div>
            ) : (
              Object.entries(grouped).map(([category, apps]) => (
                <div key={category}>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-400 px-2 block mb-1">
                    {category}
                  </span>
                  <div className="space-y-0.5">
                    {apps.map((app) => {
                      const isSelected = app.id === currentAppId;
                      return (
                        <a
                          key={app.id}
                          href={app.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors ${
                            isSelected
                              ? "bg-red-500/10 text-red-600 dark:text-red-400 font-semibold"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">{getAppIcon(app.id)}</div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="truncate">{app.name}</span>
                              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {app.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-normal mt-0.5">
                              {app.description}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
