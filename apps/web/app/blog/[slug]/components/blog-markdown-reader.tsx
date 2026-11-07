"use client";

import React from "react";

interface BlogMarkdownReaderProps {
  content: string;
}

export function BlogMarkdownReader({ content }: BlogMarkdownReaderProps) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCode = false;
  let codeBuffer: string[] = [];
  let codeLang = "";
  let tableBuffer: string[] = [];

  const flushTable = (key: string) => {
    if (tableBuffer.length === 0) return;
    const rows = tableBuffer
      .map((r) => r.trim())
      .filter((r) => r.startsWith("|") && r.endsWith("|"))
      .map((r) =>
        r
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim())
      );
    tableBuffer = [];
    if (rows.length === 0) return;

    // Filter out separator row e.g. | :--- | :--- |
    const validRows = rows.filter((r) => !r.every((c) => /^:?-+:?$/.test(c)));
    if (validRows.length === 0) return;

    const [header, ...bodyRows] = validRows;
    elements.push(
      <div key={key} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-2xs">
        <table className="w-full text-left text-xs sm:text-sm font-sans">
          {header && (
            <thead className="bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                {header.map((col, ci) => (
                  <th key={ci} className="px-4 py-3">{renderInlineText(col)}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#070b14]">
            {bodyRows.map((row, ri) => (
              <tr key={ri} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                {row.map((col, ci) => (
                  <td key={ci} className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {renderInlineText(col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const flushCode = (key: string) => {
    if (!inCode && codeBuffer.length === 0) return;
    elements.push(
      <div key={key} className="my-5 rounded-2xl bg-slate-900 dark:bg-black/90 text-slate-100 p-4 sm:p-5 font-mono text-xs overflow-x-auto shadow-md border border-slate-800">
        {codeLang && (
          <div className="text-[10px] text-slate-400 uppercase tracking-wider pb-2 mb-3 border-b border-slate-800 flex items-center justify-between font-semibold">
            <span>{codeLang}</span>
          </div>
        )}
        <pre className="leading-relaxed"><code>{codeBuffer.join("\n")}</code></pre>
      </div>
    );
    codeBuffer = [];
    inCode = false;
    codeLang = "";
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Check code blocks
    if (trimmed.startsWith("```")) {
      flushTable(`table-${idx}`);
      if (inCode) {
        flushCode(`code-${idx}`);
      } else {
        inCode = true;
        codeLang = trimmed.slice(3).trim();
      }
      return;
    }

    if (inCode) {
      // Check if line ends with ``` closing backticks
      if (trimmed.endsWith("```") && trimmed.length > 3) {
        codeBuffer.push(line.replace(/```$/, ""));
        flushCode(`code-${idx}`);
      } else {
        codeBuffer.push(line);
      }
      return;
    }

    // Check tables
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      tableBuffer.push(trimmed);
      return;
    } else {
      flushTable(`table-${idx}`);
    }

    // Dividers
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      elements.push(<hr key={idx} className="my-8 border-slate-200 dark:border-white/[0.08]" />);
      return;
    }

    // Math / Formula block
    if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
      const formula = trimmed.slice(2, -2).trim().replace(/\\text\{([^}]+)\}/g, "$1");
      elements.push(
        <div key={idx} className="my-6 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0c121e] border border-slate-200 dark:border-white/[0.08] text-center font-mono text-sm sm:text-base text-slate-800 dark:text-slate-200 shadow-2xs overflow-x-auto">
          {formula}
        </div>
      );
      return;
    }

    // Headings
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={idx} className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-8 mb-4 tracking-tight">
          {renderInlineText(line.slice(2))}
        </h1>
      );
      return;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={idx} className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-3 tracking-tight">
          {renderInlineText(line.slice(3))}
        </h2>
      );
      return;
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={idx} className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6 mb-2">
          {renderInlineText(line.slice(4))}
        </h3>
      );
      return;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={idx} className="my-4 pl-4 py-2 border-l-4 border-primary bg-primary/5 rounded-r-xl text-sm italic text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          {renderInlineText(line.slice(2))}
        </blockquote>
      );
      return;
    }

    // Unordered List
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <li key={idx} className="ml-5 list-disc text-sm text-slate-700 dark:text-slate-300 my-1 leading-relaxed">
          {renderInlineText(trimmed.slice(2))}
        </li>
      );
      return;
    }

    // Ordered List
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <li key={idx} className="ml-5 list-decimal text-sm text-slate-700 dark:text-slate-300 my-1 leading-relaxed">
          {renderInlineText(numMatch[2] || "")}
        </li>
      );
      return;
    }

    // Empty line spacer
    if (!trimmed) {
      elements.push(<div key={idx} className="h-3" />);
      return;
    }

    // Normal Paragraph
    elements.push(
      <p key={idx} className="text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed my-2 font-sans">
        {renderInlineText(line)}
      </p>
    );
  });

  flushTable("table-end");
  flushCode("code-end");

  return <div className="space-y-1">{elements}</div>;
}

function renderInlineText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded-md bg-slate-100 dark:bg-white/[0.08] px-1.5 py-0.5 font-mono text-[13px] text-primary">
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noreferrer" className="text-primary underline font-medium hover:text-primary/80 transition-colors">
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}
