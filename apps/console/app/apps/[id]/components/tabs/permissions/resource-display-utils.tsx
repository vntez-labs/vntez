import React from "react";
import {
  KeyRound,
  Ticket,
  Users,
  FileText,
  ShieldCheck,
  User,
  Database,
  FolderArchive,
  Network,
  Sliders,
  Box,
} from "lucide-react";

export function formatResourceName(resource: string): string {
  const map: Record<string, string> = {
    oauth_clients: "OAuth Clients",
    tokens: "Access Tokens",
    identities: "User Identities",
    audit_logs: "Audit Logs",
    security_policies: "Security Policies",
    users: "Users Directory",
    database: "Database Tables",
    files: "File Storage",
    api: "API Gateway",
    settings: "App Settings",
  };

  if (map[resource]) return map[resource];

  return resource
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getResourceIcon(resource: string): React.ReactNode {
  switch (resource.toLowerCase()) {
    case "oauth_clients":
      return <KeyRound className="h-4 w-4 text-indigo-500" />;
    case "tokens":
      return <Ticket className="h-4 w-4 text-cyan-500" />;
    case "identities":
      return <Users className="h-4 w-4 text-emerald-500" />;
    case "audit_logs":
      return <FileText className="h-4 w-4 text-amber-500" />;
    case "security_policies":
      return <ShieldCheck className="h-4 w-4 text-rose-500" />;
    case "users":
      return <User className="h-4 w-4 text-blue-500" />;
    case "database":
      return <Database className="h-4 w-4 text-purple-500" />;
    case "files":
      return <FolderArchive className="h-4 w-4 text-sky-500" />;
    case "api":
      return <Network className="h-4 w-4 text-orange-500" />;
    case "settings":
      return <Sliders className="h-4 w-4 text-zinc-500" />;
    default:
      return <Box className="h-4 w-4 text-primary" />;
  }
}

export interface ActionTheme {
  category: "CREATE" | "READ" | "UPDATE" | "DELETE";
  subLabel: string;
  badgeClass: string;
  activeClass: string;
}

export function getActionTheme(action: string): ActionTheme {
  switch (action) {
    case "create":
      return {
        category: "CREATE",
        subLabel: "Tạo mới",
        badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
        activeClass: "bg-sky-500 hover:bg-sky-600 text-white shadow-xs shadow-sky-500/25 ring-2 ring-sky-500/20",
      };
    case "read:self":
      return {
        category: "READ",
        subLabel: "Self",
        badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        activeClass: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs shadow-emerald-500/25 ring-2 ring-emerald-500/20",
      };
    case "read:all":
      return {
        category: "READ",
        subLabel: "All",
        badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        activeClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-600/25 ring-2 ring-emerald-600/20",
      };
    case "update:self":
      return {
        category: "UPDATE",
        subLabel: "Self",
        badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        activeClass: "bg-amber-500 hover:bg-amber-600 text-white shadow-xs shadow-amber-500/25 ring-2 ring-amber-500/20",
      };
    case "update:all":
      return {
        category: "UPDATE",
        subLabel: "All",
        badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        activeClass: "bg-amber-600 hover:bg-amber-700 text-white shadow-xs shadow-amber-600/25 ring-2 ring-amber-600/20",
      };
    case "delete:self":
      return {
        category: "DELETE",
        subLabel: "Self",
        badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        activeClass: "bg-rose-500 hover:bg-rose-600 text-white shadow-xs shadow-rose-500/25 ring-2 ring-rose-500/20",
      };
    case "delete:all":
      return {
        category: "DELETE",
        subLabel: "All",
        badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        activeClass: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs shadow-rose-600/25 ring-2 ring-rose-600/20",
      };
    default:
      return {
        category: "READ",
        subLabel: action,
        badgeClass: "bg-primary/10 text-primary border-primary/20",
        activeClass: "bg-primary hover:bg-primary/90 text-white shadow-xs",
      };
  }
}
