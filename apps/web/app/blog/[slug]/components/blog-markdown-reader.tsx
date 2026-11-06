"use client";

import React from "react";

interface BlogMarkdownReaderProps {
  content: string;
}

export function BlogMarkdownReader({ content }: BlogMarkdownReaderProps) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";

  lines.forEach((line, idx) => {
    // Code block toggle
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${idx}`} className="my-5 rounded-2xl bg-slate-900 dark:bg-black/80 text-slate-100 p-4 sm:p-5 font-mono text-xs overflow-x-auto shadow-md border border-slate-800">
            {codeLang && (
              <div className="text-[10px] text-slate-400 uppercase tracking-wider pb-2 mb-3 border-b border-slate-800 flex items-center justify-between">
                <span>{codeLang}</span>
              </div>
            )}
            <pre className="leading-relaxed"><code>{codeBuffer.join("\n")}</code></pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
        codeLang = "";
      } else {
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
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
        <h2 key={idx} className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-7 mb-3 tracking-tight">
          {renderInlineText(line.slice(3))}
        </h2>
      );
      return;
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={idx} className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-5 mb-2">
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
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      elements.push(
        <li key={idx} className="ml-5 list-disc text-sm text-slate-700 dark:text-slate-300 my-1 leading-relaxed">
          {renderInlineText(line.trim().slice(2))}
        </li>
      );
      return;
    }

    // Ordered List
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <li key={idx} className="ml-5 list-decimal text-sm text-slate-700 dark:text-slate-300 my-1 leading-relaxed">
          {renderInlineText(numMatch[2] || "")}
        </li>
      );
      return;
    }

    // Empty line spacer
    if (!line.trim()) {
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
