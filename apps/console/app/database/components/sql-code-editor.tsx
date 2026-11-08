"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-sql";
import { Table, Key, Sparkles, Hash } from "lucide-react";
import { getSqlSuggestions, type SqlSuggestion } from "./sql-autocomplete";

interface SqlCodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  onExecute: () => void;
  customTables?: Record<string, string[]>;
}

export function SqlCodeEditor({
  value,
  onChange,
  onExecute,
  customTables,
}: SqlCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const [suggestions, setSuggestions] = useState<SqlSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  // Sync scrolling between textarea and pre layer
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Syntax highlighting
  const highlightedCode = useMemo(() => {
    try {
      const grammar = Prism.languages.sql;
      if (!grammar) return value;
      return Prism.highlight(value || " ", grammar, "sql");
    } catch {
      return value;
    }
  }, [value]);

  // Extract current typing word for autocomplete
  const updateAutocomplete = (text: string, cursorPos: number) => {
    const textBeforeCursor = text.slice(0, cursorPos);
    const match = textBeforeCursor.match(/([a-zA-Z0-9_*]+)$/);
    if (match && match[1] && match[1].length >= 1) {
      const currentWord = match[1];
      const list = getSqlSuggestions(currentWord, customTables);
      if (list.length > 0) {
        setSuggestions(list);
        setSelectedIndex(0);
        setShowAutocomplete(true);
        return;
      }
    }
    setShowAutocomplete(false);
  };

  const applySuggestion = (s: SqlSuggestion) => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const text = value;
    const textBefore = text.slice(0, pos);
    const textAfter = text.slice(pos);
    const wordMatch = textBefore.match(/([a-zA-Z0-9_*]+)$/);

    if (wordMatch && wordMatch[1]) {
      const prefix = textBefore.slice(0, -wordMatch[1].length);
      const newText = prefix + s.insertText + textAfter;
      onChange(newText);
      setShowAutocomplete(false);

      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = prefix.length + s.insertText.length;
          textareaRef.current.selectionStart = newPos;
          textareaRef.current.selectionEnd = newPos;
          textareaRef.current.focus();
        }
      }, 10);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl + Enter or Cmd + Enter to execute query
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onExecute();
      return;
    }

    if (showAutocomplete && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const selected = suggestions[selectedIndex];
        if (selected) applySuggestion(selected);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowAutocomplete(false);
        return;
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    onChange(newVal);
    updateAutocomplete(newVal, e.target.selectionStart);
  };

  const getSuggestionIcon = (type: SqlSuggestion["type"]) => {
    switch (type) {
      case "table":
        return <Table className="h-3 w-3 text-cyan-400" />;
      case "column":
        return <Key className="h-3 w-3 text-amber-400" />;
      case "function":
        return <Sparkles className="h-3 w-3 text-purple-400" />;
      default:
        return <Hash className="h-3 w-3 text-pink-400" />;
    }
  };

  return (
    <div className="relative rounded-2xl border border-zinc-800 bg-[#090d16] shadow-inner overflow-hidden">
      {/* Code Area with Synchronized Overlay */}
      <div className="relative min-h-[160px] max-h-[300px] overflow-hidden">
        {/* Syntax Highlighted Layer (Background) */}
        <pre
          ref={preRef}
          aria-hidden="true"
          className="prism-code language-sql absolute inset-0 m-0 p-4 font-mono text-xs leading-relaxed text-zinc-100 overflow-auto pointer-events-none whitespace-pre-wrap break-words select-none"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />

        {/* Real Transparent Textarea (Foreground) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          onClick={(e) => updateAutocomplete(value, (e.target as any).selectionStart)}
          spellCheck={false}
          placeholder="Nhập câu lệnh SQL tại đây... (Ví dụ: SELECT * FROM apps LIMIT 10;)"
          className="relative z-10 w-full min-h-[160px] max-h-[300px] p-4 font-mono text-xs leading-relaxed bg-transparent text-transparent caret-white outline-none resize-y whitespace-pre-wrap break-words selection:bg-primary/30"
        />
      </div>

      {/* Autocomplete Popup */}
      {showAutocomplete && suggestions.length > 0 && (
        <div className="absolute left-6 bottom-4 z-30 w-72 rounded-xl bg-zinc-900/95 backdrop-blur-md border border-zinc-700 shadow-2xl p-1 text-xs font-mono space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1 text-[10px] text-zinc-400 uppercase tracking-wider font-sans flex items-center justify-between border-b border-zinc-800">
            <span>Gợi ý tự động ({suggestions.length})</span>
            <span>Tab / ↵</span>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {suggestions.map((item, idx) => (
              <button
                key={`${item.label}-${idx}`}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applySuggestion(item);
                }}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  idx === selectedIndex
                    ? "bg-primary text-white font-semibold"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {getSuggestionIcon(item.type)}
                  <span className="truncate">{item.label}</span>
                </div>
                <span
                  className={`text-[10px] uppercase font-sans ${
                    idx === selectedIndex ? "text-white/80" : "text-zinc-500"
                  }`}
                >
                  {item.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
