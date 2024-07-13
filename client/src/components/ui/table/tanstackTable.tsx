import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TablePDF from "./pdf/tablePDF";
import { TableView } from "./tableContainer";
import { forwardRef } from "react";
import Icon from "@/components/icons/icon";
import { twMerge } from "@/utils/twMerge";
import ControlButton from "./controlButton";

interface Props {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  sorting: any[];
  setSorting: React.Dispatch<React.SetStateAction<any[]>>;
  data: any[];
  columns: ColumnDef<any, any>[];
  onClickRow?: (row: any) => void;
  view: TableView;
  edit?: { fn: (row: any) => void; disabled?: (row: any) => boolean };
  del?: { fn: (row: any) => void; disabled?: (row: any) => boolean };
}

const TanstackTable = forwardRef(
  (
    {
      data,
      columns,
      filter,
      setFilter,
      sorting,
      setSorting,
      onClickRow,
      view,
      del,
      edit,
    }: Props,
    tableRef: React.ForwardedRef<HTMLTableElement>
  ) => {
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: { sorting, globalFilter: filter },
      //@ts-ignore
      onSortingChange: setSorting,
      onGlobalFilterChange: setFilter,
    });

    const handleClickRow = (row: any) => {
      if (onClickRow) {
        onClickRow(row);
      }
    };

    if (view === "PDF") {
      return <TablePDF table={table} />;
    }
    return (
      <div className="flex-1 overflow-auto w-full">
        <table ref={tableRef} className="w-full flex flex-col gap-2 relative">
          <thead className="sticky top-0">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id} className="flex bg-bg">
                <th className="text-[12px] w-10 px-2 py-2 font-semibold text-primary-800 text-center select-none">
                  #
                </th>
                {group.headers.map((header) => (
                  <th
                    className="flex-1 px-2 py-2 text-sm font-semibold text-primary-800 text-start select-none hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <div className="h-5 w-5">
                        {
                          {
                            none: <></>,
                            asc: <Icon type="up" />,
                            desc: <Icon type="down" />,
                          }[header.column.getIsSorted() || "none"]
                        }
                      </div>
                    </div>
                  </th>
                ))}
                {(edit || del) && (
                  <th className="text-sm w-40 px-2 py-2 font-semibold text-primary-800 text-center select-none">
                    Acciones
                  </th>
                )}
              </tr>
            ))}
          </thead>
          <tbody className="flex flex-col gap-2">
            {table.getRowModel().rows.map((row, i) => (
              <tr
                className={`flex transition-all duration-300 bg-white rounded-lg border hover:bg-primary-700/10`}
                key={row.id}
              >
                <td
                  className={twMerge(
                    `w-10 px-2 py-2 text-[12px] text-center text-neutral-800`,
                    onClickRow ? "cursor-pointer" : ""
                  )}
                >
                  <div className="flex items-center h-full w-full justify-center">
                    <p>{i + 1}</p>
                  </div>
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td
                    className={twMerge(
                      `flex-1 px-2 py-2 text-sm text-neutral-800`,
                      onClickRow ? "cursor-pointer" : ""
                    )}
                    key={cell.id}
                    onClick={() => handleClickRow(row.original)}
                  >
                    <div className="flex items-center h-full w-full">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  </td>
                ))}
                {(edit || del) && (
                  <td className={`w-40 px-2 py-2 text-sm text-neutral-800`}>
                    <div className="flex gap-2 justify-center items-center w-full h-full">
                      {edit && (
                        <ControlButton
                          title="Editar"
                          btnType="primary"
                          icon={<Icon type="edit" />}
                          onClick={() => edit.fn(row.original)}
                          disabled={edit.disabled?.(row.original)}
                        />
                      )}
                      {del && (
                        <ControlButton
                          title="Eliminar"
                          icon={<Icon type="delete" />}
                          onClick={() => del.fn(row.original)}
                          disabled={del.disabled?.(row.original)}
                        />
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

export default TanstackTable;
