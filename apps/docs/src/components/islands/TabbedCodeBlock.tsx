import { useState } from "react";
import { Check, Copy } from "lucide-react";

export interface CodeTab {
  label: string;
  lang: string;
  code: string;
}

interface TabbedCodeBlockProps {
  tabs: CodeTab[];
  title?: string;
}

export function TabbedCodeBlock({ tabs, title }: TabbedCodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentTab = tabs[activeTab] || tabs[0];

  const handleCopy = async () => {
    if (!currentTab) return;
    try {
      await navigator.clipboard.writeText(currentTab.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (!tabs || tabs.length === 0) return null;

  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c121e] overflow-hidden shadow-sm">
      {/* Tab Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 px-3 py-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {title && (
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-2 uppercase tracking-wider font-mono">
              {title}
            </span>
          )}
          {tabs.map((tab, idx) => {
            const isActive = idx === activeTab;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer font-mono ${
                  isActive
                    ? "bg-white dark:bg-slate-800 text-primary dark:text-red-400 font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Sao chép mã"
          className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-medium text-[11px]">Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="text-[11px]">Sao chép</span>
            </>
          )}
        </button>
      </div>

      {/* Code Container */}
      <div className="p-4 overflow-x-auto bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed">
        <pre className="m-0 p-0">
          <code>{currentTab?.code}</code>
        </pre>
      </div>
    </div>
  );
}
