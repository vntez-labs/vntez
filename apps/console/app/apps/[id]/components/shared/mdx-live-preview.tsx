"use client";

import React from "react";
import {
  extractFrontmatter,
  parseTabbedCodeBlocks,
  isAsciiDiagramLine,
} from "./mdx-parser-utils";
import {
  CodeFenceBlock,
  AsciiDiagramBlock,
  InteractiveTabbedCodeBlock,
} from "./mdx-preview-blocks";

interface MdxLivePreviewProps {
  content: string;
  borderless?: boolean;
}

export function MdxLivePreview({ content, borderless = false }: MdxLivePreviewProps) {
  if (!content || !content.trim()) {
    return (
      <div className="h-full min-h-[300px] flex items-center justify-center p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-2xl bg-muted/30">
        Nội dung rỗng. Hãy nhập văn bản MDX ở bảng soạn thảo bên trái.
      </div>
    );
  }

  const { frontmatter, cleanContent } = extractFrontmatter(content);
  const { parsedBlocks, replacedContent } = parseTabbedCodeBlocks(cleanContent);

  return (
    <div
      className={`p-5 sm:p-7 font-sans min-h-[450px] w-full max-w-full min-w-0 overflow-y-auto space-y-5 ${
        borderless
          ? "bg-card"
          : "bg-card rounded-2xl border border-border shadow-2xs"
      }`}
    >
      {/* 1. Header Banner from Frontmatter (if present) */}
      {(frontmatter.title || frontmatter.badge || frontmatter.endpoint) && (
        <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {frontmatter.badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                {frontmatter.badge}
              </span>
            )}
            {frontmatter.category && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border/60">
                {frontmatter.category}
              </span>
            )}
            {frontmatter.method && frontmatter.endpoint && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {frontmatter.method} {frontmatter.endpoint}
              </span>
            )}
          </div>
          {frontmatter.title && (
            <h1 className="text-xl sm:text-2xl font-bold font-display text-foreground tracking-tight">
              {frontmatter.title}
            </h1>
          )}
          {frontmatter.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {frontmatter.description}
            </p>
          )}
        </div>
      )}

      {/* 2. Render Markdown Body */}
      <MarkdownContentRenderer content={replacedContent} parsedBlocks={parsedBlocks} />
    </div>
  );
}

function MarkdownContentRenderer({
  content,
  parsedBlocks,
}: {
  content: string;
  parsedBlocks: Record<string, any>;
}) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    // A. Check for TabbedCodeBlock placeholder
    if (trimmed.startsWith("__TABBED_CODE_BLOCK_") && trimmed.endsWith("__")) {
      const blockData = parsedBlocks[trimmed];
      if (blockData) {
        elements.push(<InteractiveTabbedCodeBlock key={`tab-${i}`} data={blockData} />);
      }
      i++;
      continue;
    }

    // B. Code fence ```lang ... ```
    if (trimmed.startsWith("```")) {
      const lang = trimmed.replace("```", "").trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? "").trim().startsWith("```")) {
        codeLines.push(lines[i] ?? "");
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <CodeFenceBlock key={`code-${i}`} lang={lang} code={codeLines.join("\n")} />
      );
      continue;
    }

    // C. Detect ASCII diagram block
    if (isAsciiDiagramLine(trimmed)) {
      const asciiLines: string[] = [];
      while (i < lines.length && (isAsciiDiagramLine(lines[i] ?? "") || (lines[i] ?? "").trim() === "")) {
        asciiLines.push(lines[i] ?? "");
        i++;
      }
      elements.push(
        <AsciiDiagramBlock key={`ascii-${i}`} diagram={asciiLines.join("\n")} />
      );
      continue;
    }

    // D. Headers
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-xl sm:text-2xl font-bold font-display text-foreground mt-6 mb-3 pb-2 border-b border-border/60 tracking-tight">
          {trimmed.substring(2)}
        </h1>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-base sm:text-lg font-bold font-display text-foreground mt-5 mb-2 tracking-tight">
          {trimmed.substring(3)}
        </h2>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-sm sm:text-base font-bold font-display text-foreground mt-4 mb-1.5">
          {trimmed.substring(4)}
        </h3>
      );
      i++;
      continue;
    }

    // E. Blockquote
    if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="pl-4 py-2 my-3 border-l-3 border-primary/70 text-sm text-foreground/80 italic bg-primary/5 rounded-r-lg leading-relaxed">
          {trimmed.substring(2)}
        </blockquote>
      );
      i++;
      continue;
    }

    // F. Bullet list
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <li key={i} className="text-sm sm:text-[14.5px] text-foreground/90 list-disc ml-5 my-1 leading-relaxed">
          {renderInlineFormatting(trimmed.substring(2))}
        </li>
      );
      i++;
      continue;
    }

    // G. Empty line
    if (trimmed.length === 0) {
      elements.push(<div key={i} className="h-2" />);
      i++;
      continue;
    }

    // H. Normal paragraph
    elements.push(
      <p key={i} className="text-sm sm:text-[14.5px] text-foreground/90 leading-relaxed my-2">
        {renderInlineFormatting(trimmed)}
      </p>
    );
    i++;
  }

  return <div className="space-y-1">{elements}</div>;
}

function renderInlineFormatting(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={idx} className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-[13px] font-medium text-foreground border border-border/70">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
