import { useState, useMemo } from "react";
import { Check, Copy } from "lucide-react";
import Prism from "prismjs";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-json";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-csharp";

export interface CodeTab {
  label: string;
  lang: string;
  code: string;
}

interface TabbedCodeBlockProps {
  tabs: CodeTab[];
  title?: string;
}

const LANG_MAP: Record<string, string> = {
  ts: "typescript",
  typescript: "typescript",
  js: "javascript",
  javascript: "javascript",
  bash: "bash",
  sh: "bash",
  shell: "bash",
  curl: "bash",
  py: "python",
  python: "python",
  go: "go",
  golang: "go",
  rust: "rust",
  rs: "rust",
  json: "json",
  sql: "sql",
  yaml: "yaml",
  yml: "yaml",
  markdown: "markdown",
  md: "markdown",
  dart: "dart",
  cs: "csharp",
  csharp: "csharp",
};

export function TabbedCodeBlock({ tabs, title }: TabbedCodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentTab = tabs[activeTab] || tabs[0];

  const highlightedHtml = useMemo(() => {
    if (!currentTab) return "";
    const cleanLang = (currentTab.lang || "typescript").toLowerCase().trim();
    const prismLang = LANG_MAP[cleanLang] || "typescript";
    try {
      const grammar = Prism.languages[prismLang] || Prism.languages.typescript || Prism.languages.javascript;
      if (!grammar) return escapeHtml(currentTab.code);
      return Prism.highlight(currentTab.code, grammar, prismLang);
    } catch {
      return escapeHtml(currentTab.code);
    }
  }, [currentTab]);

  const lines = useMemo(() => currentTab?.code.split("\n") || [], [currentTab]);

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

      {/* Code Area with Syntax Highlighting & Line Numbers */}
      <div className="flex overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-200">
        {lines.length > 1 && (
          <div className="select-none pr-3.5 text-right text-slate-600 font-mono border-r border-slate-800 mr-3.5 shrink-0">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}

        <pre className="m-0 p-0 !bg-transparent !text-inherit flex-1 overflow-x-visible">
          <code
            className="prism-code !bg-transparent !text-inherit leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      </div>
    </div>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
