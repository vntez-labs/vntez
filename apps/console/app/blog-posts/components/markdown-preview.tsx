"use client";

import React from "react";
import { Clock, User, Calendar, Eye, Heart, MessageSquare } from "lucide-react";

interface MarkdownPreviewProps {
  title?: string;
  category?: string;
  author?: string;
  date?: string;
  readTime?: string;
  thumbnailUrl?: string;
  content: string;
}

export function MarkdownPreview({
  title,
  category = "Kiến trúc hệ thống",
  author = "Core Engineering Team",
  date,
  readTime = "5 phút đọc",
  thumbnailUrl,
  content,
}: MarkdownPreviewProps) {
  const displayDate = date || new Date().toLocaleDateString("vi-VN");

  return (
    <article className="max-w-3xl mx-auto space-y-6 text-foreground">
      {/* Header Preview */}
      <header className="space-y-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-2xs">
            <span className="size-2 rounded-full bg-primary" />
            {category}
          </span>
          <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
            <Clock className="size-3.5" />
            <span>{readTime}</span>
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
          {title || "Tiêu đề bài viết chưa được nhập..."}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-sans pt-1">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <User className="size-4 opacity-60" />
            <span>{author}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 font-mono">
            <Calendar className="size-4 opacity-60" />
            <span>{displayDate}</span>
          </div>
        </div>
      </header>

      {/* Banner / Thumbnail */}
      {thumbnailUrl && (
        <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumbnailUrl} alt={title} className="size-full object-cover" />
        </div>
      )}

      {/* Rendered Body */}
      <div className="py-2">
        {!content.trim() ? (
          <div className="py-12 text-center text-xs text-muted-foreground italic">
            Chưa có nội dung Markdown. Hãy nhập nội dung ở tab Soạn thảo.
          </div>
        ) : (
          <RenderMarkdownBody content={content} />
        )}
      </div>
    </article>
  );
}

function RenderMarkdownBody({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCode = false;
  let codeLines: string[] = [];
  let codeLang = "";

  lines.forEach((line, idx) => {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        elements.push(
          <div key={`code-${idx}`} className="my-4 rounded-xl bg-zinc-900 text-zinc-100 p-4 font-mono text-xs overflow-x-auto shadow-inner border border-zinc-800">
            {codeLang && <div className="text-[10px] text-zinc-400 uppercase pb-1 mb-2 border-b border-zinc-800">{codeLang}</div>}
            <pre><code>{codeLines.join("\n")}</code></pre>
          </div>
        );
        codeLines = [];
        inCode = false;
        codeLang = "";
      } else {
        inCode = true;
        codeLang = line.trim().slice(3).trim();
      }
      return;
    }

    if (inCode) {
      codeLines.push(line);
      return;
    }

    if (line.startsWith("# ")) {
      elements.push(<h1 key={idx} className="text-xl sm:text-2xl font-bold text-foreground mt-6 mb-3 font-display border-b border-zinc-200/80 dark:border-zinc-800 pb-2">{renderInline(line.slice(2))}</h1>);
      return;
    }
    if (line.startsWith("## ")) {
      elements.push(<h2 key={idx} className="text-lg sm:text-xl font-bold text-foreground mt-5 mb-2.5 font-display">{renderInline(line.slice(3))}</h2>);
      return;
    }
    if (line.startsWith("### ")) {
      elements.push(<h3 key={idx} className="text-base font-bold text-foreground mt-4 mb-2">{renderInline(line.slice(4))}</h3>);
      return;
    }
    if (line.startsWith("> ")) {
      elements.push(<blockquote key={idx} className="my-3 pl-4 py-1.5 border-l-4 border-primary bg-primary/5 rounded-r-lg text-xs sm:text-sm italic text-foreground leading-relaxed">{renderInline(line.slice(2))}</blockquote>);
      return;
    }
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      elements.push(<li key={idx} className="ml-5 list-disc text-xs sm:text-sm text-foreground/90 my-1 leading-relaxed">{renderInline(line.trim().slice(2))}</li>);
      return;
    }

    if (!line.trim()) {
      elements.push(<div key={idx} className="h-2" />);
      return;
    }

    elements.push(<p key={idx} className="text-xs sm:text-sm leading-relaxed text-foreground/90 my-2">{renderInline(line)}</p>);
  });

  return <div className="space-y-1">{elements}</div>;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-primary">{part.slice(1, -1)}</code>;
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return <a key={i} href={linkMatch[2]} target="_blank" rel="noreferrer" className="text-primary underline font-medium hover:underline">{linkMatch[1]}</a>;
    }
    return part;
  });
}
