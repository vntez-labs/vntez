"use client";

import React, { useState, useMemo } from "react";
import { Check, Copy, Terminal } from "lucide-react";
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

interface BlogCodeBlockProps {
  code: string;
  language?: string;
}

export function BlogCodeBlock({ code, language = "typescript" }: BlogCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const cleanLang = (language || "typescript").toLowerCase().trim();
  const prismLang = LANG_MAP[cleanLang] || "typescript";
  const displayLang = cleanLang ? cleanLang.toUpperCase() : "CODE";

  const highlightedHtml = useMemo(() => {
    try {
      const grammar = Prism.languages[prismLang] || Prism.languages.typescript || Prism.languages.javascript;
      if (!grammar) return escapeHtml(code);
      return Prism.highlight(code, grammar, prismLang);
    } catch {
      return escapeHtml(code);
    }
  }, [code, prismLang]);

  const lines = useMemo(() => code.split("\n"), [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  return (
    <div className="my-6 rounded-2xl border border-slate-800 bg-[#0b0f19] shadow-xl overflow-hidden font-mono text-xs text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[11px] font-bold font-mono tracking-wider text-slate-400">
            {displayLang}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Sao chép mã nguồn"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold text-emerald-400">Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[11px]">Sao chép</span>
            </>
          )}
        </button>
      </div>

      {/* Code Display with Line Numbers & Highlighted Tokens */}
      <div className="flex overflow-x-auto p-4 leading-relaxed">
        {lines.length > 1 && (
          <div className="select-none pr-4 text-right text-slate-600 font-mono border-r border-slate-800/80 mr-4 shrink-0">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}

        <pre className="m-0 p-0 !bg-transparent !text-inherit flex-1 overflow-x-visible">
          <code
            className="prism-code !bg-transparent leading-relaxed"
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
