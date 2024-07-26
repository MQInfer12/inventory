import Page from "@/components/ui/page";
import TableContainer from "@/components/ui/table/tableContainer";
import { ENDPOINTS } from "@/constants/endpoints";
import { useGet } from "@/hooks/useGet";
import { Movimiento } from "./types/api";
import { QUERYKEYS } from "@/constants/queryKeys";
import ZoomImage from "@/components/ui/zoomImage";
import { getHttpImage } from "@/utils/http";
import Icon from "@/components/icons/icon";
import { useModal } from "@/components/ui/modal/modal";
import Form from "./components/form";
import { useState } from "react";
import { CalendarStateMode } from "./components/calendar";
import { getTodayUtc } from "@/utils/getTodayUtc";
import { toastError } from "@/utils/toasts";
import FontedText from "@/components/ui/table/pdf/fontedText";
import { createColumns } from "@/utils/createColumns";
import { useCityContext } from "@/context/cityContext";
import { twMerge } from "@/utils/twMerge";
import { formatDate } from "@/utils/formatDate";

const Reports = () => {
  const { city, cityName } = useCityContext();

  const [fechas, setFechas] = useState<CalendarStateMode>({
    fechaInicio: getTodayUtc(),
    fechaFinal: getTodayUtc(),
    mode: "personalizado",
  });

  const [cats, setCats] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [reloadCounter, setReloadCounter] = useState(0);

  const [keys, setKeys] = useState([
    QUERYKEYS.MOVIMIENTOS,
    fechas.fechaInicio,
    fechas.fechaFinal,
    JSON.stringify(cats.map((c) => c.id)),
    String(reloadCounter),
  ]);

  const { data } = useGet<Movimiento[]>(ENDPOINTS.MOVIMIENTO_INDEX, keys, {
    params: {
      fechaInicio: fechas.fechaInicio,
      fechaFinal: fechas.fechaFinal,
      categories: cats.length > 0 ? JSON.stringify(cats.map((c) => c.id)) : "",
    },
    save: false,
  });

  const { modal, openModal, closeModal } = useModal();

  return (
    <Page>
      {modal("Filtros del reporte", () => (
        <Form
          defaultFechas={fechas}
          defaultCats={cats.map((c) => c.id)}
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
              JSON.stringify(catsRes.map((c) => c.id)),
              String(reloadCounter),
            ]);
            closeModal();
          }}
        />
      ))}
      <TableContainer
        name="Movimientos"
        reload={async () => {
          setReloadCounter((prev) => prev + 1);
          setKeys([
            QUERYKEYS.MOVIMIENTOS,
            fechas.fechaInicio,
            fechas.fechaFinal,
            JSON.stringify(cats.map((c) => c.id)),
            String(reloadCounter + 1),
          ]);
        }}
        data={data?.filter((v) => {
          //! NO SE ENTIENDE PERO FUNCIONA EL FILTRO

          const x = city === "cbba";
          const y = v.cantidad_cbba !== 0;
          const z = v.cantidad_sc !== 0;

          const condition1 = y === z;
          const condition2 = x === y;

          return condition1 || condition2;
        })}
        button={{
          fn: () => openModal(),
          icon: <Icon type="filter" />,
          text: "Filtros",
          type: "primary",
        }}
        opacityOn={(row) => !row.producto}
        pdfData={[
          {
            title: "Ciudad",
            value: cityName,
          },
          {
            title: "Fecha",
            value:
              fechas.fechaInicio && fechas.fechaFinal
                ? fechas.fechaInicio === fechas.fechaFinal
                  ? formatDate(fechas.fechaInicio)
                  : `Desde el ${formatDate(
                      fechas.fechaInicio
                    )} hasta el ${formatDate(fechas.fechaFinal)}`
                : fechas.fechaInicio
                ? `Desde el ${formatDate(fechas.fechaInicio)}`
                : fechas.fechaFinal
                ? `Hasta el ${formatDate(fechas.fechaFinal)}`
                : "Siempre",
          },
          {
            title: "Categorías",
            value:
              cats.length > 0 ? cats.map((c) => c.name).join(", ") : "Todas",
          },
        ]}
        columns={(isPDF) => {
          const columns = createColumns<Movimiento>([
            {
              accessorFn: (row) => row.producto?.codigo,
              header: "Código",
              cell: ({ row: { original: v } }) =>
                !isPDF ? (
                  <p
                    title={v.producto?.codigo}
                    className="text-ellipsis overflow-hidden"
                  >
                    {v.producto?.codigo || "N/A"}
                  </p>
                ) : (
                  <FontedText>{v.producto?.codigo}</FontedText>
                ),
              meta: {
                width: "90px",
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
                showPDF: false,
              },
            },
            {
              accessorFn: (row) =>
                row.producto?.descripcion + " " + row.producto?.detalle,
              header: "Descripción",
              cell: ({ row: { original: v } }) => {
                const detalle = v.producto?.detalle || null;
                return !isPDF ? (
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
                ) : (
                  <FontedText>
                    {v.producto?.descripcion || "Producto eliminado"}
                  </FontedText>
                );
              },
            },
            {
              accessorFn: (row) =>
                row.producto?.categorias.map((v) => v.descripcion).join(", "),
              header: "Categorías",
              cell: ({ row: { original: v } }) => {
                return !isPDF ? (
                  <div className="flex gap-1 flex-wrap max-h-14 overflow-auto px-1">
                    {v.producto?.categorias.map((cat) => (
                      <strong
                        title={v.producto?.categorias
                          .map((v) => v.descripcion)
                          .join(", ")}
                        className="line-clamp-2 font-semibold text-white px-2 text-balance text-xs bg-primary-600 rounded-md"
                      >
                        {cat.descripcion}
                      </strong>
                    ))}
                  </div>
                ) : (
                  <FontedText>
                    {v.producto?.categorias
                      .map((v) => v.descripcion)
                      .join(", ")}
                  </FontedText>
                );
              },
              meta: {
                width: "180px",
              },
            },
            {
              accessorFn: (row) => row.usuario?.usuario || "Usuario eliminado",
              header: "Usuario",
              cell: ({ row: { original: v } }) => {
                return !isPDF ? (
                  <p className="text-sm font-medium text-black/80 line-clamp-1">
                    {v.usuario?.usuario || "Usuario eliminado"}
                  </p>
                ) : (
                  <FontedText>
                    {v.usuario?.usuario || "Usuario eliminado"}
                  </FontedText>
                );
              },
              meta: {
                width: "160px",
              },
            },
          ]);

          if (city === "cbba") {
            columns.push(
              {
                accessorKey: "cantidad_cbba",
                header: "Movimiento",
                cell: ({ row: { original: v } }) => {
                  return !isPDF ? (
                    <div
                      className={twMerge(
                        "flex flex-col items-center transition-all duration-300",
                        "text-primary-950"
                      )}
                    >
                      <strong className="font-bold text-xl border-b border-transparent">
                        {v.cantidad_cbba !== 0 ? (
                          <>
                            {v.cantidad_cbba > 0 && "+"}
                            {v.cantidad_cbba}{" "}
                          </>
                        ) : (
                          "Creado"
                        )}
                      </strong>
                      {v.cantidad_cbba !== 0 && (
                        <small className="font-normal opacity-60 text-[12px]">
                          unidades
                        </small>
                      )}
                    </div>
                  ) : (
                    <FontedText>
                      {v.cantidad_cbba === 0
                        ? `Creado`
                        : `${v.cantidad_cbba > 0 ? "+" : ""}${
                            v.cantidad_cbba
                          } unidades`}
                    </FontedText>
                  );
                },
                meta: {
                  width: "128px",
                  center: true,
                },
              },
              {
                accessorKey: "actual_cbba",
                header: "Total",
                cell: ({ row: { original: v } }) => {
                  const stock = v.actual_cbba;
                  const agotado = stock === 0;
                  return !isPDF ? (
                    <div
                      className={twMerge(
                        "flex flex-col items-center transition-all duration-300",
                        agotado ? "text-rose-700" : "text-primary-950"
                      )}
                    >
                      <strong className="font-bold text-xl border-b border-transparent">
                        {stock}{" "}
                      </strong>
                      <small className="font-normal opacity-60 text-[12px]">
                        unidades
                      </small>
                    </div>
                  ) : (
                    <FontedText>
                      {stock > 0 ? `${stock} unidades` : "Agotado"}
                    </FontedText>
                  );
                },
                meta: {
                  width: "100px",
                  center: true,
                },
              }
            );
          }

          if (city === "sc") {
            columns.push(
              {
                accessorKey: "cantidad_sc",
                header: "Movimiento",
                cell: ({ row: { original: v } }) => {
                  return !isPDF ? (
                    <div
                      className={twMerge(
                        "flex flex-col items-center transition-all duration-300",
                        "text-primary-950"
                      )}
                    >
                      <strong className="font-bold text-xl border-b border-transparent">
                        {v.cantidad_sc !== 0 ? (
                          <>
                            {v.cantidad_sc > 0 && "+"}
                            {v.cantidad_sc}{" "}
                          </>
                        ) : (
                          "Creado"
                        )}
                      </strong>
                      {v.cantidad_sc !== 0 && (
                        <small className="font-normal opacity-60 text-[12px]">
                          unidades
                        </small>
                      )}
                    </div>
                  ) : (
                    <FontedText>
                      {v.cantidad_sc === 0
                        ? `Creado`
                        : `${v.cantidad_sc > 0 ? "+" : ""}${
                            v.cantidad_sc
                          } unidades`}
                    </FontedText>
                  );
                },
                meta: {
                  width: "128px",
                  center: true,
                },
              },
              {
                accessorKey: "actual_sc",
                header: "Total",
                cell: ({ row: { original: v } }) => {
                  const stock = v.actual_sc;
                  const agotado = stock === 0;
                  return !isPDF ? (
                    <div
                      className={twMerge(
                        "flex flex-col items-center transition-all duration-300",
                        agotado ? "text-rose-700" : "text-primary-950"
                      )}
                    >
                      <strong className="font-bold text-xl border-b border-transparent">
                        {stock}{" "}
                      </strong>
                      <small className="font-normal opacity-60 text-[12px]">
                        unidades
                      </small>
                    </div>
                  ) : (
                    <FontedText>
                      {stock > 0 ? `${stock} unidades` : "Agotado"}
                    </FontedText>
                  );
                },
                meta: {
                  width: "100px",
                  center: true,
                },
              }
            );
          }

          columns.push({
            accessorFn: (row) => formatDate(row.fecha.split(" ")[0]),
            header: "Fecha",
            cell: ({ row: { original: v } }) => {
              return !isPDF ? (
                <div className="flex flex-col items-center transition-all duration-300 text-primary-950">
                  <strong className="font-bold text-base border-b border-transparent">
                    {formatDate(v.fecha.split(" ")[0])}{" "}
                  </strong>
                  <small className="font-semibold opacity-60 text-[12px]">
                    {v.fecha.split(" ")[1]}
                  </small>
                </div>
              ) : (
                <FontedText>
                  {formatDate(v.fecha.split(" ")[0])}{" "}
                  <FontedText style={{ fontSize: 8 }}>
                    / {v.fecha.split(" ")[1]}
                  </FontedText>
                </FontedText>
              );
            },
            meta: {
              width: "128px",
              center: true,
            },
          });

          return columns;
        }}
      />
    </Page>
  );
};

export default Reports;
