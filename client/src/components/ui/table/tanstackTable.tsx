import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import TablePDF from "./pdf/tablePDF";
import { TableView } from "./tableContainer";
import Icon from "@/components/icons/icon";
import { twMerge } from "@/utils/twMerge";
import TableSheet from "./sheet/tableSheet";
import { CSSProperties, MutableRefObject, useRef } from "react";
import TableBody from "./tableBody";

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
  rowButton?: {
    title: string;
    icon: JSX.Element;
    fn: (row: any) => void;
    disabled?: (row: any) => boolean;
  };
  rowHeight?: number;
  tanstackTableRef: MutableRefObject<Table<any> | null>;
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
  rowButton,
  rowHeight,
  tanstackTableRef,
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
  tanstackTableRef.current = table;
  const tableContainerRef = useRef<HTMLDivElement>(null);

  let actionColSize = 0;
  if (edit) {
    actionColSize += 80;
  }
  if (del) {
    actionColSize += 80;
  }
  if (rowButton) {
    actionColSize += 80;
  }

  return (
    <>
      <TableSheet
        sheetData={sheetData}
        table={table}
        excelTableId={excelTableId}
      />
      {view === "PDF" ? (
        <TablePDF
          name={name}
          data={pdfData}
          table={table}
          loaderText={`Renderizando ${
            table.getRowModel().rows.length
          } filas en PDF...`}
        />
      ) : (
        <div
          ref={tableContainerRef}
          className="w-full relative overflow-x-auto overflow-y-scroll"
        >
          <table className="w-full flex flex-col gap-2 pr-4">
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
                          "px-2 py-2 text-sm font-bold text-primary-900 text-start select-none hover:bg-gray-200 transition-colors duration-300 cursor-pointer",
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
                          className={twMerge(
                            "flex",
                            center && "justify-center"
                          )}
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
                    <th
                      className={twMerge(
                        "text-sm px-2 py-2 font-bold text-primary-900 text-center select-none"
                      )}
                      style={{
                        minWidth: actionColSize,
                        width: actionColSize,
                      }}
                    >
                      Acciones
                    </th>
                  )}
                </tr>
              ))}
            </thead>
            <TableBody
              table={table}
              del={del}
              distinctOn={distinctOn}
              edit={edit}
              onClickRow={onClickRow}
              opacityOn={opacityOn}
              rowButton={rowButton}
              tableContainerRef={tableContainerRef}
              rowHeight={rowHeight}
            />
          </table>
        </div>
      )}
    </>
  );
};

export default TanstackTable;
