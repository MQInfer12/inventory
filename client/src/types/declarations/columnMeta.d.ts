import { DateFilter } from "@/components/common/table/tableContainer";
import "@tanstack/react-table";

export interface ShowData<T = any> {
  text: string | ((row: T) => string);
  type?: "success" | "error";
  on?: (row: T) => boolean;
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    width?: number | string;
    center?: boolean;
    sticky?: boolean;
  }
}
