"use client";

import React from "react";
import { Users, UserPlus, Search } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useUsersStore } from "../users-store";

export function UsersTableHeader() {
  const {
    users,
    isLoading,
    searchQuery,
    setSearchQuery,
    fetchUsers,
    openAddUserModal,
  } = useUsersStore();

  return (
    <div className="space-y-4">
      {/* Top action strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-display text-foreground">
                Quản trị Người dùng
              </h1>
              <span className="bg-primary/10 text-primary text-xs font-mono font-semibold px-2 py-0.5 rounded-full">
                {users.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              spellCheck={false}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, email, UID, role..."
              className="w-full h-9 pl-8 pr-3 text-xs bg-card text-foreground border border-input shadow-2xs rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/60 transition-all"
            />
          </div>

          <Button
            size="sm"
            onClick={openAddUserModal}
            className="gap-1.5 text-xs shadow-xs cursor-pointer font-semibold bg-emerald-600 hover:bg-emerald-700 text-white h-9"
          >
            <UserPlus className="h-4 w-4" />
            <span>Thêm</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
