import {
  CSSProperties,
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import TableControls from "./tableControls";
import TanstackTable from "./tanstackTable";
import { ColumnDef, Table } from "@tanstack/react-table";
import Loader from "../loader/loader";
import Nothing from "../loader/nothing";

export interface SheetData<T> {
  title: string;
  value: (row: T) => string;
  style?: CSSProperties;
}

interface Props<T> {
  data: T[] | undefined;
  columns: ColumnDef<T, any>[] | ((isPDF: boolean) => ColumnDef<T, any>[]);
  disableButtons?: boolean;
  reports?: boolean;
  reload?: (...props: any) => Promise<any>;
  add?: () => void;
  onClickRow?: { fn: (row: T) => void; disabled?: (row: T) => boolean };
  edit?: { fn: (row: T) => void; disabled?: (row: T) => boolean };
  del?: { fn: (row: T) => void; disabled?: (row: T) => boolean };
  rowHeight?: number;
  button?: {
    text: string;
    icon: JSX.Element;
    fn: () => void;
    type?: "primary" | "secondary";
  };
  rowButton?: {
    title: string;
    icon: JSX.Element;
    fn: (row: T) => void;
    disabled?: (row: T) => boolean;
  };
  distinctOn?: string;
  opacityOn?: (row: T) => boolean;
  name: string;
  pdfData?: {
    title: string;
    value: string;
  }[];
  sheetData?: SheetData<T>[];
  extraJSX?: React.ReactNode;
}

export type TableView = "table" | "PDF";

const TableContainer = <T,>({
  data,
  columns,
  reports = true,
  reload,
  add,
  onClickRow,
  del,
  button,
  edit,
  distinctOn,
  disableButtons = false,
  opacityOn,
  name,
  pdfData = [],
  sheetData,
  extraJSX,
  rowButton,
  rowHeight,
}: Props<T>) => {
  const id = useId();
  const [sorting, setSorting] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const deferedFilter = useDeferredValue(filter);
  const [view, setView] = useState<TableView>("table");
  const [tableCurrentRef, setTableCurrentRef] = useState<HTMLElement | null>(
    null
  );
  const tanstackTableRef = useRef<Table<T> | null>(null);

  const _pdfData = [...pdfData];

  if (filter.trim() !== "") {
    _pdfData.push({
      title: "Búsqueda",
      value: `"${filter}"`,
    });
  }
  if (sorting.length > 0) {
    const str: string = sorting[0].id;
    const formatted = str.split("_").join(" ");
    const capitalized = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    _pdfData.push({
      title: "Orden",
      value: `${capitalized} (${sorting[0].desc ? "desc" : "asc"})`,
    });
  }

  const excelTableId = `table-excel-${id}`;
  useEffect(() => {
    if (data && data.length > 0) {
      const excelTable = document.getElementById(excelTableId);
      if (excelTable) {
        setTableCurrentRef(excelTable);
      }
    }
  }, [data]);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <TableControls
        tableCurrentRef={tableCurrentRef}
        loading={!data}
        filter={[filter, setFilter]}
        reload={reload}
        add={add}
        view={[view, setView]}
        reports={reports}
        show={data ? data.length > 0 : false}
        button={button}
        disableButtons={disableButtons}
        extraJSX={extraJSX}
        tanstackTableRef={tanstackTableRef}
      />
      <div className="flex flex-1 overflow-auto w-full">
        {data ? (
          data.length > 0 ? (
            <TanstackTable
              excelTableId={excelTableId}
              sheetData={sheetData}
              columns={
                Array.isArray(columns) ? columns : columns(view === "PDF")
              }
              data={data}
              filter={deferedFilter}
              setFilter={setFilter}
              sorting={sorting}
              setSorting={setSorting}
              onClickRow={onClickRow}
              view={view}
              del={del}
              edit={edit}
              distinctOn={distinctOn}
              opacityOn={opacityOn}
              name={name}
              pdfData={_pdfData}
              rowButton={rowButton}
              rowHeight={rowHeight}
              tanstackTableRef={tanstackTableRef}
            />
          ) : (
            <Nothing />
          )
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default TableContainer;
