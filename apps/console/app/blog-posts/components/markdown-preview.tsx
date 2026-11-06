"use client";

import React from "react";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  if (!content.trim()) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground italic">
        Chưa có nội dung Markdown. Hãy nhập nội dung ở tab Soạn thảo.
      </div>
    );
  }

  // Parse lines into structured elements
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";

  lines.forEach((line, idx) => {
    // Code block start / end
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End code block
        elements.push(
          <div key={`code-${idx}`} className="my-3 rounded-xl bg-zinc-900 text-zinc-100 p-3.5 font-mono text-xs overflow-x-auto shadow-inner">
            {codeLang && <div className="text-[10px] text-zinc-400 uppercase pb-1 mb-2 border-b border-zinc-800">{codeLang}</div>}
            <pre><code>{codeBuffer.join("\n")}</code></pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
        codeLang = "";
      } else {
        // Start code block
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
        <h1 key={idx} className="text-xl font-bold text-foreground mt-4 mb-2 pb-1 border-b border-zinc-200 dark:border-zinc-800 font-display">
          {renderInline(line.slice(2))}
        </h1>
      );
      return;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={idx} className="text-lg font-bold text-foreground mt-4 mb-2 font-display">
          {renderInline(line.slice(3))}
        </h2>
      );
      return;
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={idx} className="text-sm font-bold text-foreground mt-3 mb-1">
          {renderInline(line.slice(4))}
        </h3>
      );
      return;
    }

    // Blockquotes
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={idx} className="my-2 pl-3.5 py-1 border-l-3 border-primary bg-primary/5 rounded-r-lg text-xs italic text-foreground">
          {renderInline(line.slice(2))}
        </blockquote>
      );
      return;
    }

    // Unordered List
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      elements.push(
        <li key={idx} className="ml-4 list-disc text-xs text-foreground/90 my-1 leading-relaxed">
          {renderInline(line.trim().slice(2))}
        </li>
      );
      return;
    }

    // Ordered List
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <li key={idx} className="ml-4 list-decimal text-xs text-foreground/90 my-1 leading-relaxed">
          {renderInline(numMatch[2] || "")}
        </li>
      );
      return;
    }

    // Empty lines
    if (!line.trim()) {
      elements.push(<div key={idx} className="h-2" />);
      return;
    }

    // Regular paragraphs
    elements.push(
      <p key={idx} className="text-xs text-foreground/90 leading-relaxed my-1.5">
        {renderInline(line)}
      </p>
    );
  });

  return <div className="space-y-1 text-xs">{elements}</div>;
}

function renderInline(text: string): React.ReactNode {
  // Bold **text**
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 text-[11px] font-mono text-primary">
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noreferrer" className="text-primary underline font-medium">
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}
