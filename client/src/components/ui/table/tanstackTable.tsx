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
import Icon from "@/components/icons/icon";
import { twMerge } from "@/utils/twMerge";
import ControlButton from "./controlButton";
import TableSheet from "./sheet/tableSheet";
import { CSSProperties } from "react";

interface Props {
  name: string;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  sorting: any[];
  setSorting: React.Dispatch<React.SetStateAction<any[]>>;
  data: any[];
  columns: ColumnDef<any, any>[];
  view: TableView;
  onClickRow?: { fn: (row: any) => void; disabled?: (row: any) => boolean };
  edit?: { fn: (row: any) => void; disabled?: (row: any) => boolean };
  del?: { fn: (row: any) => void; disabled?: (row: any) => boolean };
  distinctOn?: string;
  opacityOn?: (row: any) => boolean;
  pdfData: {
    title: string;
    value: string;
  }[];
  sheetData?: {
    title: string;
    value: (row: any) => string;
    style?: CSSProperties;
  }[];
  excelTableId: string;
}

const TanstackTable = ({
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
  distinctOn,
  opacityOn,
  name,
  pdfData,
  sheetData,
  excelTableId,
}: Props) => {
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
      if (onClickRow.disabled?.(row)) return;
      onClickRow.fn(row);
    }
  };

  let lastValue = "";
  let counter = 0;
  const classes = ["bg-primary-600/20", "bg-primary-700/10"];

  return (
    <>
      <TableSheet
        sheetData={sheetData}
        table={table}
        excelTableId={excelTableId}
      />
      {view === "PDF" ? (
        <TablePDF name={name} data={pdfData} table={table} />
      ) : (
        <table className="w-full flex flex-col gap-2 relative overflow-x-auto overflow-y-scroll pr-4">
          <thead className="sticky top-0 z-20">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id} className="flex bg-bg min-w-fit">
                <th className="text-[12px] min-w-10 w-10 px-2 py-2 font-bold text-primary-900 text-center select-none">
                  #
                </th>
                {group.headers.map((header) => {
                  const width = header.column.columnDef.meta?.width;
                  const center = !!header.column.columnDef.meta?.center;
                  const sticky = !!header.column.columnDef.meta?.sticky;
                  const isColspan = typeof width === "number";
                  return (
                    <th
                      className={twMerge(
                        "px-2 py-2 text-sm font-bold text-primary-900 text-start select-none hover:bg-gray-200 transition-all duration-300 cursor-pointer",
                        sticky && "sticky left-0 bg-bg border-r"
                      )}
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        flex:
                          width === undefined
                            ? `1 1 0%`
                            : isColspan
                            ? `${width} 1 0%`
                            : undefined,
                        width:
                          width === undefined
                            ? undefined
                            : isColspan
                            ? undefined
                            : width,
                        minWidth:
                          width === undefined
                            ? "200px"
                            : isColspan
                            ? undefined
                            : width,
                      }}
                      title={header.column.columnDef.header?.toString()}
                    >
                      <div
                        className={twMerge("flex", center && "justify-center")}
                      >
                        <p className="line-clamp-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </p>
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
                  );
                })}
                {(edit || del) && (
                  <th className="min-w-40 w-40 text-sm px-2 py-2 font-bold text-primary-900 text-center select-none">
                    Acciones
                  </th>
                )}
              </tr>
            ))}
          </thead>
          <tbody className="flex flex-col gap-2">
            {table.getRowModel().rows.map((row, i) => {
              if (distinctOn) {
                if (lastValue !== row.original[distinctOn]) counter++;
                lastValue = row.original[distinctOn];
              }
              const withOpacity = !!opacityOn?.(row.original);
              return (
                <tr
                  className={twMerge(
                    `flex transition-all duration-300 rounded-lg border shadow-sm min-w-fit`,
                    onClickRow
                      ? onClickRow.disabled?.(row)
                        ? ""
                        : "hover:bg-primary-50 cursor-pointer"
                      : "",
                    distinctOn ? classes[counter % classes.length] : "bg-white",
                    withOpacity && "opacity-40"
                  )}
                  key={row.id}
                >
                  <td
                    className={twMerge(
                      `min-w-10 w-10 px-2 py-2 text-[12px] text-center text-neutral-800`
                    )}
                  >
                    <div className="flex items-center h-full w-full justify-center">
                      <p>{i + 1}</p>
                    </div>
                  </td>
                  {row.getVisibleCells().map((cell) => {
                    const width = cell.column.columnDef.meta?.width;
                    const center = !!cell.column.columnDef.meta?.center;
                    const sticky = !!cell.column.columnDef.meta?.sticky;
                    const isColspan = typeof width === "number";
                    return (
                      <td
                        className={twMerge(
                          `px-2 py-2 text-sm text-neutral-800`,
                          sticky && "sticky left-0 bg-inherit z-10 border-r"
                        )}
                        key={cell.id}
                        onClick={() => handleClickRow(row.original)}
                        style={{
                          flex:
                            width === undefined
                              ? `1 1 0%`
                              : isColspan
                              ? `${width} 1 0%`
                              : undefined,
                          width:
                            width === undefined
                              ? undefined
                              : isColspan
                              ? undefined
                              : width,
                          minWidth:
                            width === undefined
                              ? "200px"
                              : isColspan
                              ? undefined
                              : width,
                        }}
                      >
                        <div
                          className={twMerge(
                            "flex items-center h-full w-full",
                            center && "justify-center"
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </td>
                    );
                  })}
                  {(edit || del) && (
                    <td
                      className={`min-w-40 w-40 px-2 py-2 text-sm text-neutral-800`}
                    >
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
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};

export default TanstackTable;
