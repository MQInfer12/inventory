import { twMerge } from "@/utils/twMerge";
import ControlButton from "./controlButton";
import { flexRender, Row } from "@tanstack/react-table";
import { useCallback } from "react";
import Icon from "@/components/icons/icon";
import { VirtualItem } from "@tanstack/react-virtual";

interface Props {
  virtualRow: VirtualItem<any>;
  row: Row<any>;
  distinctOn?: string;
  counter: number;
  lastValue: string;
  opacityOn?: (row: any) => boolean;
  onClickRow?: { fn: (row: any) => void; disabled?: (row: any) => boolean };
  rowButton?: {
    title: string;
    icon: JSX.Element;
    fn: (row: any) => void;
    disabled?: (row: any) => boolean;
  };
  edit?: { fn: (row: any) => void; disabled?: (row: any) => boolean };
  del?: { fn: (row: any) => void; disabled?: (row: any) => boolean };
}

const TableRow = ({
  distinctOn,
  counter,
  row,
  virtualRow,
  lastValue,
  opacityOn,
  onClickRow,
  rowButton,
  del,
  edit,
}: Props) => {
  const classes = ["bg-primary-600/20", "bg-primary-700/10"];
  if (distinctOn) {
    if (lastValue !== row.original[distinctOn]) counter++;
    lastValue = row.original[distinctOn];
  }
  const withOpacity = !!opacityOn?.(row.original);

  const handleClickRow = useCallback(
    (row: any) => {
      if (onClickRow) {
        if (onClickRow.disabled?.(row)) return;
        onClickRow.fn(row);
      }
    },
    [onClickRow]
  );

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
    <tr
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${virtualRow.size}px`,
        transform: `translateY(${virtualRow.start}px)`,
      }}
      className={twMerge(
        `flex transition-colors duration-300 rounded-lg border shadow-sm min-w-fit`,
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
          <p>{virtualRow.index + 1}</p>
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
                width === undefined ? undefined : isColspan ? undefined : width,
              minWidth:
                width === undefined ? "200px" : isColspan ? undefined : width,
            }}
          >
            <div
              className={twMerge(
                "flex items-center h-full w-full",
                center && "justify-center"
              )}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          </td>
        );
      })}
      {(edit || del) && (
        <td
          className={twMerge(`px-2 py-2 text-sm text-neutral-800`)}
          style={{
            minWidth: actionColSize,
            width: actionColSize,
          }}
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
            {rowButton && (
              <ControlButton
                title={rowButton.title}
                icon={rowButton.icon}
                onClick={() => rowButton.fn(row.original)}
                disabled={rowButton.disabled?.(row.original)}
              />
            )}
          </div>
        </td>
      )}
    </tr>
  );
};

export default TableRow;
