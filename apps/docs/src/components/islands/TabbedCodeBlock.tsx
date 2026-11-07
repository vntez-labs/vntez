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
    <div className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs bg-slate-900 text-slate-100">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-3.5 py-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {title && (
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mr-2">
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
                className={`px-3 py-1 text-xs font-mono rounded-md transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-800 text-red-400 font-semibold border border-slate-700 shadow-2xs"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
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
          aria-label="Sao chép mã nguồn"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold text-[11px]">Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[11px] text-slate-400">Sao chép</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-slate-200">
        <pre className="m-0 p-0 !bg-transparent !text-inherit">
          <code className="!text-inherit !bg-transparent">{currentTab?.code}</code>
        </pre>
      </div>
    </div>
  );
}
