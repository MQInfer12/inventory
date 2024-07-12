import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { Row, flexRender } from "@tanstack/react-table";

interface Props {
  rows: Row<any>[];
}

const TablePDFRow = ({ rows }: Props) => {
  return (
    <>
      {rows.map((row) => (
        <View key={row.id} style={styles.row}>
          {row.getVisibleCells().map((cell) => (
            <Text key={cell.id} style={styles.td}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Text>
          ))}
        </View>
      ))}
    </>
  );
};

export default TablePDFRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  td: {
    flex: 1,
    fontSize: 10,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
});
