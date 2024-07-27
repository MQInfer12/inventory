import { flexRender, Table } from "@tanstack/react-table";
import { CSSProperties } from "react";

interface Props {
  table: Table<any>;
  sheetData?: {
    title: string;
    value: (row: any) => string;
    style?: CSSProperties;
  }[];
  excelTableId: string;
}

const TableSheet = ({ table, sheetData, excelTableId }: Props) => {
  return (
    <div className="hidden">
      <table id={excelTableId}>
        <thead>
          {sheetData ? (
            <tr>
              {sheetData.map((v, i) => (
                <th
                  style={{
                    color: "red",
                    textDecoration: "underline",
                    border: "1px solid black",
                  }}
                  key={i}
                >
                  {v.title}
                </th>
              ))}
            </tr>
          ) : (
            table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th
                    style={{
                      color: "red",
                      textDecoration: "underline",
                      border: "1px solid black",
                    }}
                    key={header.id}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))
          )}
        </thead>
        <tbody>
          {sheetData
            ? table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {sheetData.map((v, i) => {
                    const style = v.style || {};
                    return (
                      <td
                        style={{
                          border: "1px solid black",
                          ...style,
                        }}
                        key={i}
                      >
                        {v.value(row.original)}
                      </td>
                    );
                  })}
                </tr>
              ))
            : table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const showPDF = cell.column.columnDef.meta?.showPDF ?? true;
                    if (!showPDF) return null;
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSheet;
