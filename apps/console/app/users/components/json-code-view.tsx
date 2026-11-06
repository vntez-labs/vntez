"use client";

import React, { useMemo } from "react";

interface JsonCodeViewProps {
  data: unknown;
}

export function JsonCodeView({ data }: JsonCodeViewProps) {
  const jsonString = useMemo(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const lines = useMemo(() => {
    return jsonString.split("\n");
  }, [jsonString]);

  // Tokenize a single line of JSON for syntax highlighting
  const renderLine = (line: string, lineIndex: number) => {
    // Regex for JSON tokens: keys, strings, booleans, null, numbers, punctuation
    const tokenRegex =
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}[\],])/g;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }

      const token = match[0];
      const partKey = `${lineIndex}-${match.index}`;

      if (/^"/.test(token)) {
        if (/:$/.test(token)) {
          // Object key
          const colonIdx = token.lastIndexOf(":");
          const keyPart = token.slice(0, colonIdx);
          parts.push(
            <span key={partKey} className="text-sky-600 dark:text-sky-400 font-semibold">
              {keyPart}
            </span>
          );
          parts.push(
            <span key={`${partKey}-colon`} className="text-muted-foreground">
              :
            </span>
          );
        } else {
          // String value
          parts.push(
            <span key={partKey} className="text-emerald-600 dark:text-emerald-400 font-medium">
              {token}
            </span>
          );
        }
      } else if (/true|false/.test(token)) {
        parts.push(
          <span key={partKey} className="text-primary font-bold">
            {token}
          </span>
        );
      } else if (/null/.test(token)) {
        parts.push(
          <span key={partKey} className="text-rose-500 font-medium italic">
            {token}
          </span>
        );
      } else if (/^-?\d+/.test(token)) {
        parts.push(
          <span key={partKey} className="text-amber-600 dark:text-amber-400 font-medium">
            {token}
          </span>
        );
      } else {
        parts.push(
          <span key={partKey} className="text-muted-foreground/60">
            {token}
          </span>
        );
      }

      lastIndex = match.index + token.length;
    }

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col rounded-2xl bg-secondary/30 dark:bg-zinc-950/60 border border-border/60 overflow-hidden">
      <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed select-text">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-primary/5 transition-colors">
                <td className="w-8 pr-3 text-right text-muted-foreground/40 select-none align-top font-mono text-[11px] border-r border-border/40">
                  {idx + 1}
                </td>
                <td className="pl-4 whitespace-pre font-mono align-top text-foreground">
                  {renderLine(line, idx)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
