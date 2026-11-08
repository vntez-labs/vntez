"use client";

import React from "react";

interface MdxLivePreviewProps {
  content: string;
}

export function MdxLivePreview({ content }: MdxLivePreviewProps) {
  if (!content || !content.trim()) {
    return (
      <div className="h-full min-h-[300px] flex items-center justify-center p-8 text-center text-xs text-muted-foreground border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30">
        Nội dung rỗng. Hãy nhập văn bản MDX ở bảng soạn thảo bên trái.
      </div>
    );
  }

  // Parse lines for a clean, secure, zero-dependency Markdown/MDX preview
  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBuffer: string[] = [];

  lines.forEach((line, index) => {
    // Handle code fence
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        inCodeBlock = false;
        renderedElements.push(
          <div
            key={`code-${index}`}
            className="my-3 rounded-xl overflow-hidden bg-zinc-900 dark:bg-black/80 border border-zinc-800 text-xs font-mono"
          >
            {codeBlockLang && (
              <div className="px-3.5 py-1.5 bg-zinc-800/80 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider border-b border-zinc-800">
                {codeBlockLang}
              </div>
            )}
            <pre className="p-3.5 text-emerald-400 overflow-x-auto leading-relaxed">
              <code>{codeBuffer.join("\n")}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        codeBlockLang = "";
      } else {
        inCodeBlock = true;
        codeBlockLang = line.replace("```", "").trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    const trimmed = line.trim();

    if (trimmed.startsWith("# ")) {
      renderedElements.push(
        <h1 key={index} className="text-xl sm:text-2xl font-bold font-display text-foreground mt-4 mb-2 tracking-tight">
          {trimmed.substring(2)}
        </h1>
      );
    } else if (trimmed.startsWith("## ")) {
      renderedElements.push(
        <h2 key={index} className="text-base sm:text-lg font-bold font-display text-foreground mt-4 mb-2 pb-1 border-b border-zinc-200/60 dark:border-zinc-800 tracking-tight">
          {trimmed.substring(3)}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      renderedElements.push(
        <h3 key={index} className="text-sm font-bold font-display text-foreground mt-3 mb-1">
          {trimmed.substring(4)}
        </h3>
      );
    } else if (trimmed.startsWith("> ")) {
      renderedElements.push(
        <blockquote key={index} className="pl-3.5 py-1 my-2 border-l-2 border-primary/60 text-xs text-muted-foreground italic bg-primary/5 rounded-r-lg">
          {trimmed.substring(2)}
        </blockquote>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      renderedElements.push(
        <li key={index} className="text-xs text-muted-foreground list-disc ml-5 my-0.5 leading-relaxed">
          {trimmed.substring(2)}
        </li>
      );
    } else if (trimmed.length === 0) {
      renderedElements.push(<div key={index} className="h-2" />);
    } else {
      renderedElements.push(
        <p key={index} className="text-xs text-muted-foreground leading-relaxed my-1">
          {trimmed}
        </p>
      );
    }
  });

  return (
    <div className="p-5 sm:p-6 bg-white dark:bg-card rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xs font-sans min-h-[400px]">
      {renderedElements}
    </div>
  );
}
