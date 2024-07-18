import Page from "@/components/ui/page";
import TableContainer from "@/components/ui/table/tableContainer";
import { ENDPOINTS } from "@/constants/endpoints";
import { useGet } from "@/hooks/useGet";
import { Movimiento } from "./types/api";
import { QUERYKEYS } from "@/constants/queryKeys";
import ZoomImage from "@/components/ui/zoomImage";
import { getHttpImage } from "@/utils/http";
import { twMerge } from "@/utils/twMerge";
import Icon from "@/components/icons/icon";
import { useModal } from "@/components/ui/modal/modal";
import Form from "./components/form";
import { useState } from "react";
import { CalendarStateMode } from "./components/calendar";
import { getTodayUtc } from "@/utils/getTodayUtc";
import { toastError } from "@/utils/toasts";

const Reports = () => {
  const [fechas, setFechas] = useState<CalendarStateMode>({
    fechaInicio: getTodayUtc(),
    fechaFinal: getTodayUtc(),
    mode: "hoy",
  });
  const [cats, setCats] = useState<number[]>([]);
  const [reloadCounter, setReloadCounter] = useState(0);

  const [keys, setKeys] = useState([
    QUERYKEYS.MOVIMIENTOS,
    fechas.fechaInicio,
    fechas.fechaFinal,
    JSON.stringify(cats),
    String(reloadCounter),
  ]);

  const { data } = useGet<Movimiento[]>(ENDPOINTS.MOVIMIENTO_INDEX, keys, {
    params: {
      fechaInicio: fechas.fechaInicio,
      fechaFinal: fechas.fechaFinal,
      categories: cats.length > 0 ? JSON.stringify(cats) : "",
    },
    save: false,
  });

  const { modal, openModal, closeModal } = useModal();

  return (
    <Page>
      {modal("Filtros del reporte", () => (
        <Form
          defaultFechas={fechas}
          defaultCats={cats}
          onClose={(fechasRes, catsRes) => {
            const startDate = new Date(fechasRes.fechaInicio);
            const endDate = new Date(fechasRes.fechaFinal);
            if (startDate > endDate) {
              return toastError(
                "La fecha de inicio no puede ser mayor que la fecha final"
              );
            }
            if (endDate < startDate) {
              return toastError(
                "La fecha final no puede ser menor que la fecha de inicio"
              );
            }
            setFechas(fechasRes);
            setCats(catsRes);
            setKeys([
              QUERYKEYS.MOVIMIENTOS,
              fechasRes.fechaInicio,
              fechasRes.fechaFinal,
              JSON.stringify(catsRes),
              String(reloadCounter),
            ]);
            closeModal();
          }}
        />
      ))}
      <TableContainer
        reload={async () => {
          setReloadCounter((prev) => prev + 1);
          setKeys([
            QUERYKEYS.MOVIMIENTOS,
            fechas.fechaInicio,
            fechas.fechaFinal,
            String(reloadCounter + 1),
          ]);
        }}
        data={data}
        button={{
          fn: () => openModal(),
          icon: <Icon type="filter" />,
          text: "Filtros",
          type: "primary",
        }}
        opacityOn={(row) => !row.producto}
        columns={[
          {
            accessorFn: (row) => row.producto?.codigo,
            header: "Código",
            cell: ({ row: { original: v } }) => (
              <p
                title={v.producto?.codigo}
                className="text-ellipsis overflow-hidden"
              >
                {v.producto?.codigo || "N/A"}
              </p>
            ),
            meta: {
              width: "88px",
            },
          },
          {
            header: "Foto",
            cell: ({ row: { original: v } }) => (
              <div className="w-full flex justify-center">
                <ZoomImage
                  title="Foto del producto"
                  src={getHttpImage(v.producto?.foto)}
                  width="64px"
                  height="64px"
                />
              </div>
            ),
            meta: {
              width: "80px",
            },
          },
          {
            accessorFn: (row) =>
              row.producto?.descripcion + " " + row.producto?.detalle,
            header: "Descripción",
            cell: ({ row: { original: v } }) => {
              const detalle = v.producto?.detalle || null;
              return (
                <div className="flex flex-col gap-[2px]">
                  <strong
                    title={v.producto?.descripcion || "Producto eliminado"}
                    className="line-clamp-2 font-semibold text-black/80 text-balance"
                  >
                    {v.producto?.descripcion || "Producto eliminado"}
                  </strong>
                  <p className="line-clamp-1 text-black/60 font-medium">
                    {detalle && (
                      <span title={detalle || undefined}>{detalle}</span>
                    )}
                  </p>
                </div>
              );
            },
          },
          {
            accessorKey: "cantidad_cbba",
            header: "Mov. CBBA.",
            cell: ({ row: { original: v } }) => {
              return (
                <div
                  className={twMerge(
                    "flex flex-col items-center transition-all duration-300",
                    v.cantidad_cbba === 0
                      ? "text-primary-950/60"
                      : "text-primary-950"
                  )}
                >
                  <strong className="font-bold text-xl border-b border-transparent">
                    {v.cantidad_cbba > 0 && "+"}
                    {v.cantidad_cbba}{" "}
                  </strong>
                  <small className="font-normal opacity-60 text-[12px]">
                    unidades
                  </small>
                </div>
              );
            },
            meta: {
              width: "128px",
              center: true,
            },
          },
          {
            accessorKey: "cantidad_sc",
            header: "Mov. SC.",
            cell: ({ row: { original: v } }) => {
              return (
                <div
                  className={twMerge(
                    "flex flex-col items-center transition-all duration-300",
                    v.cantidad_sc === 0
                      ? "text-primary-950/40"
                      : "text-primary-950"
                  )}
                >
                  <strong className="font-bold text-xl border-b border-transparent">
                    {v.cantidad_sc > 0 && "+"}
                    {v.cantidad_sc}{" "}
                  </strong>
                  <small className="font-normal opacity-60 text-[12px]">
                    unidades
                  </small>
                </div>
              );
            },
            meta: {
              width: "128px",
              center: true,
            },
          },
          {
            accessorKey: "fecha",
            header: "Fecha",
            cell: ({ row: { original: v } }) => {
              return (
                <div className="flex flex-col items-center transition-all duration-300 text-primary-950">
                  <strong className="font-bold text-base border-b border-transparent">
                    {v.fecha.split(" ")[0]}{" "}
                  </strong>
                  <small className="font-semibold opacity-60 text-[12px]">
                    {v.fecha.split(" ")[1]}
                  </small>
                </div>
              );
            },
            meta: {
              width: "128px",
              center: true,
            },
          },
        ]}
      />
    </Page>
  );
};

export default Reports;
