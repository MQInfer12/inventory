import { useDownloadExcel } from "react-export-table-to-excel";
import ControlButton from "./controlButton";
import { TableView } from "./tableContainer";
import Icon from "@/components/icons/icon";
import { twMerge } from "@/utils/twMerge";
import { MutableRefObject, useEffect, useId } from "react";
import { toastSuccess } from "@/utils/toasts";
import { Table } from "@tanstack/react-table";
import { pdf } from "@react-pdf/renderer";
import TablePDF from "./pdf/tablePDF";
import { UserContextProvider } from "@/context/userContext";

interface Props {
  filter: [string, React.Dispatch<React.SetStateAction<string>>];
  reload?: (...props: any) => Promise<any>;
  disableButtons: boolean;
  add?: () => void;
  view: [TableView, React.Dispatch<React.SetStateAction<TableView>>];
  loading: boolean;
  tableCurrentRef: HTMLElement | null;
  reports: boolean;
  show: boolean;
  button?: {
    text: string;
    icon: JSX.Element;
    fn: () => void;
    type?: "primary" | "secondary";
  };
  extraJSX?: React.ReactNode;
  tanstackTableRef: MutableRefObject<Table<any> | null>;
  pdfData: {
    title: string;
    value: string;
  }[];
  name: string;
}

const TableControls = ({
  filter,
  reload,
  add,
  view,
  loading,
  tableCurrentRef,
  reports,
  show,
  button,
  disableButtons,
  extraJSX,
  tanstackTableRef,
  pdfData,
  name,
}: Props) => {
  const idSearch = useId();
  const [filterValue, setFilter] = filter;
  const [viewValue, setView] = view;

  const handleEmpty = () => {
    setFilter("");
    const input = document.getElementById(idSearch);
    input?.focus();
  };

  const handleReload = async () => {
    if (!reload) return;
    await reload();
    toastSuccess("Recargado correctamente");
  };

  const { onDownload } = useDownloadExcel({
    filename: "tabla",
    sheet: "Datos",
    currentTableRef: tableCurrentRef,
  });

  useEffect(() => {
    const downloadPDF = async () => {
      if (tanstackTableRef.current) {
        try {
          // Genera el blob del PDF
          const blob = await pdf(
            <UserContextProvider>
              <TablePDF
                table={tanstackTableRef.current}
                data={pdfData}
                name={name}
              />
            </UserContextProvider>
          ).toBlob();

          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0"); // Meses de 0-11, así que sumamos 1 y formateamos
          const day = String(now.getDate()).padStart(2, "0");
          const hours = String(now.getHours()).padStart(2, "0");
          const minutes = String(now.getMinutes()).padStart(2, "0");

          const formattedDateTime = `${year}-${month}-${day}_${hours}-${minutes}`;
          const fileName = `${name}_${formattedDateTime}.pdf`;

          // Crea un enlace y simula un clic para descargar el archivo
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName; // Nombre del archivo PDF a descargar
          document.body.appendChild(link);
          link.click();

          // Limpieza
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          setView("table");
        } catch (error) {
          console.error("Error generating PDF:", error);
        }
      }
    };

    if (viewValue === "PDF") {
      downloadPDF();
    }
  }, [viewValue]);

  return (
    <div className="w-full flex flex-wrap pb-4 gap-4 max-[872px]:gap-2 items-end">
      <div className="flex gap-4 max-[872px]:gap-2 items-center">
        {!!add && (
          <ControlButton
            hideOnScreen
            disabled={disableButtons || viewValue !== "table"}
            title="Añadir dato"
            onClick={add}
            icon={<Icon type="add" />}
            btnType="primary"
            text="Añadir"
          />
        )}
        {button && (
          <ControlButton
            hideOnScreen
            disabled={viewValue !== "table"}
            title={button.text}
            onClick={button.fn}
            icon={button.icon}
            text={button.text}
            btnType={button.type || "secondary"}
          />
        )}
        {extraJSX}
      </div>
      {show && (
        <>
          <div className="flex-[9999_1_0] flex justify-end">
            <div className="flex items-end gap-4 max-[872px]:gap-2">
              {!!reload && (
                <ControlButton
                  disabled={disableButtons || viewValue !== "table"}
                  title="Recargar datos"
                  onClick={handleReload}
                  icon={<Icon type="reload" />}
                />
              )}
              {reports && (
                <>
                  <ControlButton
                    hideOnScreen
                    disabled={disableButtons || loading}
                    title={viewValue === "PDF" ? "Ver tabla" : "Ver PDF"}
                    onClick={() => setView("PDF")}
                    icon={
                      viewValue === "PDF" ? (
                        <Icon type="list" />
                      ) : (
                        <Icon type="pdf" />
                      )
                    }
                    text="PDF"
                  />
                  <ControlButton
                    hideOnScreen
                    disabled={disableButtons || loading}
                    title="Exportar Excel"
                    icon={<Icon type="excel" />}
                    text="Excel"
                    onClick={onDownload}
                  />
                </>
              )}
            </div>
          </div>
          <div className="relative flex-[1_1_0]">
            <div className="absolute left-0 top-2/4 -translate-y-2/4 aspect-square h-full p-2 pointer-events-none text-primary-700">
              <Icon type="search" />
            </div>
            <input
              id={idSearch}
              autoFocus
              disabled={viewValue !== "table"}
              className={twMerge(
                "w-full min-w-80 px-4 pl-8 rounded-lg h-8 outline-none text-sm border border-solid border-slate-300 text-neutral-700 placeholder:text-neutral-400 disabled:bg-slate-200 ring-primary-700/50 transition-all duration-300 ring-inset ring-0 focus:ring-2",
                filterValue !== "" && "pr-8"
              )}
              type="text"
              placeholder="Buscar..."
              value={filterValue}
              onChange={(e) => setFilter(e.target.value)}
            />
            {filterValue !== "" && (
              <div className="absolute right-0 top-2/4 -translate-y-2/4 aspect-square h-full p-1 flex items-center justify-center">
                <button
                  onClick={handleEmpty}
                  className="border rounded-lg bg-black/20 text-white p-1 outline-none ring-0 ring-inset focus:ring-2 transition-all duration-300"
                >
                  <Icon type="x" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TableControls;
