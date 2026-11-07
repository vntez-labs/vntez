"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  className?: string;
  variant?: "underline" | "outline";
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Chọn một tùy chọn...",
  className = "",
  variant = "underline",
  searchable = false,
  searchPlaceholder = "Tìm kiếm...",
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      if (searchable) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, searchable]);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable && query.trim()
    ? options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(query.toLowerCase()) ||
          opt.value.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setQuery("");
          }
        }}
        className={
          variant === "outline"
            ? `w-full h-11 px-4 bg-secondary/30 dark:bg-zinc-900/60 border border-border rounded-xl focus:border-primary text-xs font-medium text-foreground flex items-center justify-between gap-2 transition-all cursor-pointer text-left ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-border/80 focus:ring-2 focus:ring-primary/20"
              }`
            : `w-full flex items-center justify-between gap-2 bg-transparent border-0 border-b border-zinc-200/80 dark:border-zinc-800 focus:border-primary py-2 text-xs text-foreground outline-none transition-colors cursor-pointer text-left ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-zinc-400 dark:hover:border-zinc-600"
              }`
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          <span className={selectedOption ? "font-medium" : "text-muted-foreground/60"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Custom Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-full min-w-[200px] max-h-64 overflow-hidden rounded-2xl bg-white dark:bg-[#0c121e] border border-zinc-200/80 dark:border-zinc-800 p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col">
          {searchable && (
            <div className="relative p-1 border-b border-zinc-100 dark:border-zinc-800 mb-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-zinc-50 dark:bg-zinc-900/60 rounded-xl pl-7 pr-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          <div className="overflow-y-auto max-h-52 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                Không tìm thấy kết quả
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors cursor-pointer text-left ${
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon}
                      <div className="truncate">
                        <div>{opt.label}</div>
                        {opt.description && (
                          <div className="text-[10px] text-muted-foreground font-normal truncate">
                            {opt.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
