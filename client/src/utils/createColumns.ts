import { ColumnDef } from "@tanstack/react-table";

export const createColumns = <T,>(cols: ColumnDef<T>[]) => {
  return cols;
}