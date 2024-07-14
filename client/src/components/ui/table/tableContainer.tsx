import { useRef, useState } from "react";
import TableControls from "./tableControls";
import TanstackTable from "./tanstackTable";
import { ColumnDef } from "@tanstack/react-table";
import Loader from "../loader/loader";
import Nothing from "../loader/nothing";

interface Props {
  data: any[] | undefined;
  columns: ColumnDef<any, any>[];
  reports?: boolean;
  reload?: () => void;
  add?: () => void;
  onClickRow?: { fn: (row: any) => void; disabled?: (row: any) => boolean };
  edit?: { fn: (row: any) => void; disabled?: (row: any) => boolean };
  del?: { fn: (row: any) => void; disabled?: (row: any) => boolean };
}

export type TableView = "table" | "PDF";

const TableContainer = ({
  data,
  columns,
  reports = true,
  reload,
  add,
  onClickRow,
  del,
  edit,
}: Props) => {
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
