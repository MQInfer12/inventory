import { Row, Table } from "@tanstack/react-table";
import TableRow from "./tableRow";
import { useVirtualizer } from "@tanstack/react-virtual";
import { RefObject, useEffect, useState } from "react";

interface Props {
  table: Table<any>;
  distinctOn?: string;
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
  tableContainerRef: RefObject<HTMLDivElement>;
  rowHeight?: number;
}

const TableBody = ({
  table,
  del,
  distinctOn,
  edit,
  onClickRow,
  opacityOn,
  rowButton,
  tableContainerRef,
  rowHeight: rh,
}: Props) => {
  const { rows } = table.getRowModel();
  const rowHeight = rh ?? 50;
  const rowGap = 8;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    gap: rowGap,
    estimateSize: () => rowHeight,
    getScrollElement: () => tableContainerRef.current,
    overscan: 3,
  });

  let lastValue = "";
  let counter = 0;

  const [_, setRerender] = useState(0);
  useEffect(() => {
    //* NO SÉ POR QUE PERO EL ROWVIRTUALIZER SE VACÍA POR ALGÚN MOTIVO Y HAY QUE FORZAR UN RERENDER
    setRerender((old) => old + 1);
  }, [rowVirtualizer]);

  return (
    <tbody
      className="flex flex-col gap-2 relative"
      style={{
        height: rowVirtualizer.getTotalSize(),
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index] as Row<any>;
        return (
          <TableRow
            key={row.id}
            counter={counter}
            lastValue={lastValue}
            row={row}
            virtualRow={virtualRow}
            distinctOn={distinctOn}
            onClickRow={onClickRow}
            opacityOn={opacityOn}
            del={del}
            edit={edit}
            rowButton={rowButton}
          />
        );
      })}
      {/* {rows.map((row, i) => {
        return (
          <TableRow
            key={row.id}
            counter={counter}
            lastValue={lastValue}
            row={row}
            distinctOn={distinctOn}
            onClickRow={onClickRow}
            opacityOn={opacityOn}
            index={i}
            del={del}
            edit={edit}
            rowButton={rowButton}
          />
        );
      })} */}
    </tbody>
  );
};

export default TableBody;
