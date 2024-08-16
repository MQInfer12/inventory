import { StyleSheet, View } from "@react-pdf/renderer";
import TablePDFRow from "./tablePDFRow";
import TablePDFHeader from "./tablePDFHeader";
import { Table } from "@tanstack/react-table";
import PDFLayout from "./pdfLayout";

interface Props {
  name: string;
  table: Table<any>;
  data: {
    title: string;
    value: string;
  }[];
}

const TablePDF = ({ table, data, name }: Props) => {
  return (
    <PDFLayout data={data} title={name}>
      <View style={styles.tableContainer}>
        {table.getHeaderGroups().map((group) => (
          <TablePDFHeader key={group.id} headers={group.headers} />
        ))}
        <TablePDFRow rows={table.getRowModel().rows} />
      </View>
    </PDFLayout>
  );
};

export default TablePDF;

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
});
