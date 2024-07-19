import { StyleSheet, View } from "@react-pdf/renderer";
import { Header, flexRender } from "@tanstack/react-table";
import FontedText from "./fontedText";

interface Props {
  headers: Header<any, unknown>[];
}

const TablePDFHeader = ({ headers }: Props) => {
  return (
    <View style={styles.row}>
      {headers.map((header) => {
        const showPDF = header.column.columnDef.meta?.showPDF ?? true;
        if (!showPDF) return null;
        return (
          <FontedText key={header.id} style={styles.header}>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </FontedText>
        );
      })}
    </View>
  );
};

export default TablePDFHeader;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#e2e8f0",
  },
  header: {
    flex: 1,
    fontSize: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    color: "#262626",
    fontWeight: 700,
  },
});
