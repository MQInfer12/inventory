import { DownloadTableExcel } from "react-export-table-to-excel";
import ControlButton from "./controlButton";
import { TableView } from "./tableContainer";
import Icon from "@/components/icons/icon";
import { twMerge } from "@/utils/twMerge";
import { useId } from "react";
import { toastSuccess } from "@/utils/toasts";

interface Props {
  filter: [string, React.Dispatch<React.SetStateAction<string>>];
  reload?: (...props: any) => Promise<any>;
  disableButtons: boolean;
  add?: () => void;
  view: [TableView, React.Dispatch<React.SetStateAction<TableView>>];
  loading: boolean;
  tableCurrentRef: HTMLTableElement | null;
  reports: boolean;
  show: boolean;
  button?: {
    text: string;
    icon: JSX.Element;
    fn: () => void;
  };
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

  return (
    <div className="w-full flex pb-4 gap-4 justify-between">
      <div className="flex gap-4">
        {!!add && (
          <ControlButton
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
            disabled={viewValue !== "table"}
            title={button.text}
            onClick={button.fn}
            icon={button.icon}
            text={button.text}
          />
        )}
      </div>
      {show && (
        <div className="flex gap-4">
          <div className="relative">
            <div className="absolute left-0 top-2/4 -translate-y-2/4 aspect-square h-full p-2 pointer-events-none text-primary-700">
              <Icon type="search" />
            </div>
            <input
              id={idSearch}
              autoFocus
              disabled={viewValue !== "table"}
              className={twMerge(
                "w-64 px-4 pl-8 rounded-lg h-8 outline-none text-sm border border-solid border-slate-300 text-neutral-700 placeholder:text-neutral-400 disabled:bg-slate-200 ring-primary-700/50 transition-all duration-300 ring-inset ring-0 focus:ring-2",
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
          {reports && (
            <>
              <ControlButton
                disabled={disableButtons || loading}
                title={viewValue === "PDF" ? "Ver tabla" : "Ver PDF"}
                onClick={() =>
                  setView((old) => (old === "PDF" ? "table" : "PDF"))
                }
                icon={
                  viewValue === "PDF" ? (
                    <Icon type="list" />
                  ) : (
                    <Icon type="pdf" />
                  )
                }
                text="PDF"
              />
              <DownloadTableExcel
                filename="tabla"
                sheet="tabla"
                currentTableRef={tableCurrentRef}
              >
                <ControlButton
                  disabled={disableButtons || loading}
                  title="Exportar Excel"
                  icon={<Icon type="excel" />}
                  text="Excel"
                />
              </DownloadTableExcel>
            </>
          )}
          {!!reload && (
            <ControlButton
              disabled={disableButtons || viewValue !== "table"}
              title="Recargar datos"
              onClick={handleReload}
              icon={<Icon type="reload" />}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TableControls;
