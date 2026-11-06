export interface TableResponse {
  success: boolean;
  table: string;
  rows: Record<string, unknown>[];
  count: number;
  columns: string[];
  error?: string;
  hasServiceRole?: boolean;
  knownTables: { name: string; label: string; description: string }[];
}
