export interface ColumnMeta {
  name: string;
  type: string;
  format?: string;
  isPrimaryKey: boolean;
  required: boolean;
  defaultVal?: string;
}

export interface TableMeta {
  name: string;
  primaryKey: string;
  rowCount: number;
  columns: ColumnMeta[];
}
