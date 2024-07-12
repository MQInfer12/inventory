import {
  Document,
  PDFViewer,
  Page,
  StyleSheet,
  View,
} from "@react-pdf/renderer";
import TablePDFRow from "./tablePDFRow";
import TablePDFHeader from "./tablePDFHeader";
import { Table } from "@tanstack/react-table";

interface Props {
  table: Table<any>;
}

const TablePDF = ({ table }: Props) => {
  return (
    <PDFViewer width={"100%"} height={"100%"}>
      <Document>
        <Page>
          <View style={styles.tableContainer}>
            {table.getHeaderGroups().map((group) => (
              <TablePDFHeader key={group.id} headers={group.headers} />
            ))}
            <TablePDFRow rows={table.getRowModel().rows} />
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default TablePDF;

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20
  },
});
