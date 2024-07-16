import { useRef, useState } from "react";
import TableControls from "./tableControls";
import TanstackTable from "./tanstackTable";
import { ColumnDef } from "@tanstack/react-table";
import Loader from "../loader/loader";
import Nothing from "../loader/nothing";

interface Props<T> {
  data: T[] | undefined;
  columns: ColumnDef<T, any>[];
  disableButtons?: boolean;
  reports?: boolean;
  reload?: (...props: any) => Promise<any>;
  add?: () => void;
  onClickRow?: { fn: (row: T) => void; disabled?: (row: T) => boolean };
  edit?: { fn: (row: T) => void; disabled?: (row: T) => boolean };
  del?: { fn: (row: T) => void; disabled?: (row: T) => boolean };
  button?: {
    text: string;
    icon: JSX.Element;
    fn: () => void;
    type?: "primary" | "secondary";
  };
  distinctOn?: string;
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
}: Props<T>) => {
  const [sorting, setSorting] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [view, setView] = useState<TableView>("table");
  const tableRef = useRef<HTMLTableElement>(null);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <TableControls
        tableCurrentRef={tableRef.current}
        loading={!data}
        filter={[filter, setFilter]}
        reload={reload}
        add={add}
        view={[view, setView]}
        reports={reports}
        show={data ? data.length > 0 : false}
        button={button}
        disableButtons={disableButtons}
      />
      <div className="flex flex-1 overflow-auto w-full">
        {data ? (
          data.length > 0 ? (
            <TanstackTable
              ref={tableRef}
              columns={columns}
              data={data}
              filter={filter}
              setFilter={setFilter}
              sorting={sorting}
              setSorting={setSorting}
              onClickRow={onClickRow}
              view={view}
              del={del}
              edit={edit}
              distinctOn={distinctOn}
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
