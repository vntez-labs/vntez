export interface ColumnMeta {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  required: boolean;
  defaultVal?: string | null;
  description?: string;
  format?: string;
}

export interface TableMeta {
  name: string;
  primaryKey: string;
  rowCount: number;
  columns: ColumnMeta[];
}
