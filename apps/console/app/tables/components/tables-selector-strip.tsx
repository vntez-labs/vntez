"use client";

import React, { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Layers, ArrowRight } from "lucide-react";
import type { TableResponse } from "../tables-types";

interface TablesSelectorStripProps {
  tableData: TableResponse | null;
  selectedTable: string;
  onSelectTable: (name: string) => void;
}

export function TablesSelectorStrip({
  tableData,
  selectedTable,
  onSelectTable,
}: TablesSelectorStripProps) {
  const [customTableInput, setCustomTableInput] = useState("");

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTableInput.trim()) {
      const cleanName = customTableInput.trim().toLowerCase();
      onSelectTable(cleanName);
      setCustomTableInput("");
    }
  };

  const known = tableData?.knownTables || [
    { name: "oauth_clients", label: "OAuth Clients" },
    { name: "oauth_codes", label: "OAuth Codes" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground mr-1">
          Các bảng sẵn có:
        </span>
        {known.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => onSelectTable(item.name)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer border-0 shadow-xs ${
              selectedTable === item.name
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-white dark:bg-card text-muted-foreground hover:bg-[#f6f3eb] dark:hover:bg-muted hover:text-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleCustomSubmit} className="flex items-center gap-1.5">
        <input
          type="text"
          value={customTableInput}
          onChange={(e) => setCustomTableInput(e.target.value)}
          placeholder="Khám phá bảng khác..."
          className="h-8.5 w-40 sm:w-52 px-3 text-xs bg-white dark:bg-card border-0 shadow-xs rounded-xl outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground/60"
        />
        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="h-8.5 px-3 text-xs border-0 bg-white dark:bg-card shadow-xs"
        >
          Xem
          <ArrowRight className="h-3 w-3" />
        </Button>
      </form>
    </div>
  );
}
