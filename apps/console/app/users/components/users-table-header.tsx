"use client";

import React from "react";
import { Users, RefreshCw, UserPlus, Search } from "lucide-react";
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
    <div className="space-y-6">
      {/* Top action strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Quản trị Người dùng (Supabase Auth & SSO)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Quản lý tài khoản, danh tính, phương thức đăng nhập và kiểm tra dữ liệu định danh theo thời gian thực
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={isLoading}
            className="gap-1.5 text-xs border-0 bg-white dark:bg-card shadow-xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          <Button
            size="sm"
            onClick={openAddUserModal}
            className="gap-1.5 text-xs border-0 shadow-xs cursor-pointer font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <UserPlus className="h-4 w-4" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Table Title and Search filter */}
      <div className="p-4 sm:p-6 pb-4 border-0 bg-white dark:bg-card shadow-[0_1px_4px_rgba(0,0,0,0.03)] rounded-2xl rounded-b-none">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-base font-bold flex items-center gap-2 text-foreground">
              <span>Danh sách Tài khoản Supabase</span>
              <span className="border-0 bg-primary/10 text-primary text-xs font-mono font-medium px-2.5 py-0.5 rounded-full">
                {users.length} tài khoản
              </span>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              spellCheck={false}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo email, tên, UID, phone..."
              className="w-full h-8.5 pl-8 pr-3 text-xs bg-[#f7f5ef] dark:bg-muted/40 border-0 rounded-xl outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
