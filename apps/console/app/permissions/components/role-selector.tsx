"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  IconShield,
  IconPlus,
  IconCheck,
  IconChevronDown,
  IconSearch,
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { usePermissionsStore } from "../permissions-store";

export function RoleSelector() {
  const {
    roles,
    selectedRoleId,
    setSelectedRoleId,
    rolePermissions,
    openCreateRoleModal,
  } = usePermissionsStore();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const currentRole = roles.find((r) => r.id === selectedRoleId) || roles[0];
  const currentPerms = currentRole ? rolePermissions[currentRole.id] : null;
  const currentCount = currentPerms?.has("*:*") ? 35 : currentPerms?.size || 0;

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-card p-4 rounded-2xl shadow-xs">
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold text-foreground">Vai trò trong Hệ thống</h3>
        <p className="text-xs text-muted-foreground">
          Chọn vai trò từ danh sách để xem và tùy chỉnh ma trận quyền hạn chi tiết
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Role Searchable Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              setSearchQuery("");
            }}
            className="flex items-center gap-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 hover:bg-zinc-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 px-3.5 py-2 text-xs font-medium text-foreground transition-all cursor-pointer shadow-2xs"
          >
            <IconShield className="h-4 w-4 text-primary shrink-0" />
            <span className="font-semibold capitalize text-foreground">
              {currentRole?.name || "Chọn vai trò"}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 border-0 bg-primary/10 text-primary font-mono"
            >
              {currentCount} quyền
            </Badge>
            <IconChevronDown
              className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Searchable Dropdown Popover */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-[#0c121e] border border-zinc-200/80 dark:border-zinc-800 p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col">
              {/* Search Bar */}
              <div className="relative mb-2">
                <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm vai trò theo tên..."
                  className="w-full bg-zinc-50 dark:bg-zinc-900/60 rounded-xl pl-7 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Roles List */}
              <div className="max-h-56 overflow-y-auto space-y-0.5">
                {filteredRoles.length === 0 ? (
                  <div className="p-3 text-center text-xs text-muted-foreground">
                    Không tìm thấy vai trò phù hợp
                  </div>
                ) : (
                  filteredRoles.map((r) => {
                    const isSelected = r.id === selectedRoleId;
                    const perms = rolePermissions[r.id];
                    const permCount = perms?.has("*:*") ? 35 : perms?.size || 0;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setSelectedRoleId(r.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors cursor-pointer text-left ${
                          isSelected
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <IconShield className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          <div className="truncate">
                            <span className="capitalize">{r.name}</span>
                            {r.description && (
                              <p className="text-[10px] text-muted-foreground truncate font-normal">
                                {r.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {permCount} q
                          </span>
                          {isSelected && <IconCheck className="h-3.5 w-3.5 text-primary" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Create Role Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={openCreateRoleModal}
          className="gap-1.5 text-xs rounded-xl bg-white dark:bg-card shadow-2xs border border-zinc-200/80 dark:border-zinc-800 cursor-pointer h-9 px-3"
        >
          <IconPlus className="h-3.5 w-3.5" />
          <span>Tạo Role</span>
        </Button>
      </div>
    </div>
  );
}
