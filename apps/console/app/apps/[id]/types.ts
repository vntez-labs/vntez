export type WorkspaceTab =
  | "overview"
  | "permissions"
  | "docs"
  | "legal"
  | "remote-config";

export interface TabConfig {
  id: WorkspaceTab;
  label: string;
  badge?: string;
}
