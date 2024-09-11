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
import { CalendarMode } from "./components/calendar";
import { getTodayUtc } from "@/utils/getTodayUtc";
import { toastError } from "@/utils/toasts";
import FontedText from "@/components/ui/table/pdf/fontedText";
import { createColumns } from "@/utils/createColumns";
import { useCityContext } from "@/context/cityContext";
import { twMerge } from "@/utils/twMerge";
import { formatDate } from "@/utils/formatDate";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Producto } from "../products/types/api";
import { ROUTES } from "@/constants/routes";
import ControlButton from "@/components/ui/table/controlButton";
import { getSheetData } from "./utils/sheetData";

export type ShowType = "Movimientos" | "Ventas";

interface Props {
  idProduct?: number;
}

const Reports = ({ idProduct }: Props) => {
  const navigate = useNavigate();

  const { city, cityName } = useCityContext();

  const [searchParams, setSearchParams] = useSearchParams({
    show: "Movimientos",
    fechaInicio: idProduct ? "" : getTodayUtc(),
    fechaFinal: idProduct ? "" : getTodayUtc(),
    mode: idProduct ? "siempre" : "personalizado",
    cats: [],
  });

  const show: ShowType =
    (searchParams.get("show") as ShowType) || "Movimientos";
  const fechaInicio = searchParams.get("fechaInicio") ?? getTodayUtc();
  const fechaFinal = searchParams.get("fechaFinal") ?? getTodayUtc();
  const mode = (searchParams.get("mode") || "personalizado") as CalendarMode;
  const cats = JSON.parse(searchParams.get("cats") || "[]") as {
    id: number;
    name: string;
  }[];

  const fechas = { fechaInicio, fechaFinal, mode };

  const [reloadCounter, setReloadCounter] = useState(0);

  const [keys, setKeys] = useState([
    QUERYKEYS.MOVIMIENTOS,
    fechas.fechaInicio,
    fechas.fechaFinal,
    JSON.stringify(cats.map((c) => c.id)),
    String(reloadCounter),
  ]);

  //! SEND IF PRODUCT EXIST
  const { data: productData } = useGet<{
    producto: Producto;
    movimientos: Movimiento[];
  }>(ENDPOINTS.MOVIMIENTO_SHOW + idProduct, [`product-${idProduct}`, ...keys], {
    params: {
      fechaInicio: fechas.fechaInicio,
      fechaFinal: fechas.fechaFinal,
      categories: cats.length > 0 ? JSON.stringify(cats.map((c) => c.id)) : "",
    },
    save: false,
    send: !!idProduct,
    onError: () => {
      navigate(ROUTES.PRODUCTS);
    },
  });

  //! SEND IF PRODUCT DOESN'T EXIST
  const { data } = useGet<Movimiento[]>(ENDPOINTS.MOVIMIENTO_INDEX, keys, {
    params: {
      fechaInicio: fechas.fechaInicio,
      fechaFinal: fechas.fechaFinal,
      categories: cats.length > 0 ? JSON.stringify(cats.map((c) => c.id)) : "",
    },
    save: false,
    send: !idProduct,
  });

  const { modal, openModal, closeModal } = useModal();

  const loadedData = data || productData?.movimientos;

  const pdfData = [
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
            : `Desde el ${formatDate(fechas.fechaInicio)} hasta el ${formatDate(
                fechas.fechaFinal
              )}`
          : fechas.fechaInicio
          ? `Desde el ${formatDate(fechas.fechaInicio)}`
          : fechas.fechaFinal
          ? `Hasta el ${formatDate(fechas.fechaFinal)}`
          : "Siempre",
    },
  ];

  if (idProduct) {
    pdfData.push({
      title: "Producto",
      value: productData
        ? `${productData.producto.id} - ${productData.producto.descripcion}`
        : "",
    });
  } else {
    pdfData.push({
      title: "Categorías",
      value: cats.length > 0 ? cats.map((c) => c.name).join(", ") : "Todas",
    });
  }

  return (
    <Page>
      {modal("Filtros de fechas", () => (
        <Form
          defaultFechas={fechas}
          defaultCats={cats.map((c) => c.id)}
          withCats={!idProduct}
          onClose={(fechasRes, cats) => {
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

            setSearchParams(
              (prev) => {
                prev.set("fechaInicio", fechasRes.fechaInicio);
                prev.set("fechaFinal", fechasRes.fechaFinal);
                prev.set("mode", fechasRes.mode);
                prev.set("cats", JSON.stringify(cats));
                return prev;
              },
              {
                replace: true,
              }
            );

            setKeys([
              QUERYKEYS.MOVIMIENTOS,
              fechasRes.fechaInicio,
              fechasRes.fechaFinal,
              JSON.stringify(cats.map((c) => c.id)),
              String(reloadCounter),
            ]);
            closeModal();
          }}
        />
      ))}

      <div className="flex mb-4 justify-between gap-4">
        <div className="flex gap-4 items-center flex-1 overflow-hidden">
          <ControlButton
            onClick={() =>
              setSearchParams((prev) => {
                prev.set(
                  "show",
                  show === "Movimientos" ? "Ventas" : "Movimientos"
                );
                return prev;
              })
            }
            icon={<Icon type={"eye_search"} />}
            text={`${show}`}
            btnType="secondary"
          ></ControlButton>
          {fechaInicio && fechaFinal ? (
            fechaInicio === fechaFinal ? (
              fechaInicio === getTodayUtc() ? (
                <small className="flex items-center justify-center text-xs bg-primary-800 text-white px-3 rounded-md">
                  Hoy
                </small>
              ) : (
                <small className="flex items-center justify-center text-xs bg-primary-800 text-white px-3 rounded-md">
                  {formatDate(fechaInicio)}
                </small>
              )
            ) : (
              <small className="flex items-center justify-center text-xs bg-primary-800 text-white px-3 rounded-md">
                {formatDate(fechaInicio)} / {formatDate(fechaFinal)}
              </small>
            )
          ) : (
            <>
              {fechaInicio && (
                <small className="flex items-center justify-center text-xs bg-primary-800 text-white px-3 rounded-md">
                  {formatDate(fechaInicio)}
                </small>
              )}
              {fechaFinal && (
                <small className="flex items-center justify-center text-xs bg-primary-800 text-white px-3 rounded-md">
                  {formatDate(fechaFinal)}
                </small>
              )}
              {!fechaInicio && !fechaFinal && (
                <small className="flex items-center justify-center text-xs bg-primary-800 text-white px-3 rounded-md">
                  Siempre
                </small>
              )}
            </>
          )}
          {!idProduct && (
            <small className="flex items-center justify-center text-xs bg-primary-800 text-white px-3 rounded-md">
              {cats.length > 0
                ? cats.map((c) => c.name).join(", ")
                : "Todas las categorías"}
            </small>
          )}
          {!!idProduct && (
            <small className="items-center justify-center text-xs bg-primary-800 text-white px-3 rounded-md whitespace-nowrap text-ellipsis overflow-hidden">
              {productData
                ? `${productData.producto.codigo} - ${productData.producto.descripcion}`
                : "Cargando datos..."}
            </small>
          )}
        </div>
        <div className="flex items-center">
          {productData && (
            <small className="flex items-center justify-center text-xs bg-primary-800 text-white px-3 rounded-md whitespace-nowrap">
              {productData
                ? city === "cbba"
                  ? productData.producto.total_ventas_cbba > 0
                    ? `${productData.producto.total_ventas_cbba} vendidos en total`
                    : "Sin ventas"
                  : productData.producto.total_ventas_sc > 0
                  ? `${productData.producto.total_ventas_sc} vendidos en total`
                  : "Sin ventas"
                : "Cargando datos..."}
            </small>
          )}
        </div>
      </div>

      <TableContainer
        name={show}
        rowHeight={82}
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
        data={loadedData?.filter((v) => {
          //! NO SE ENTIENDE PERO FUNCIONA EL FILTRO
          if (show === "Movimientos") {
            const x = city === "cbba";
            const y = v.cantidad_cbba !== 0;
            const z = v.cantidad_sc !== 0;

            const condition1 = y === z;
            const condition2 = x === y;

            return condition1 || condition2;
          }

          if (show === "Ventas") {
            return city === "cbba" ? v.cantidad_cbba < 0 : v.cantidad_sc < 0;
          }

          return true;
        })}
        button={{
          fn: () => {
            openModal();
          },
          icon: <Icon type="calendarconfig" />,
          text: "Filtros",
          type: "primary",
        }}
        opacityOn={(row) => !row.producto}
        pdfData={pdfData}
        sheetData={getSheetData(show, city, cityName)}
        columns={(isPDF) => {
          const columns = createColumns<Movimiento>([]);

          if (!idProduct) {
            columns.push(
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
                  sticky: true,
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
                    <FontedText>{v.producto?.descripcion || "-"}</FontedText>
                  );
                },
                meta: {
                  showPDF: show === "Movimientos",
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
                          key={cat.id}
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
                  showPDF: show === "Movimientos",
                  width: "180px",
                },
              }
            );
          }

          columns.push({
            accessorFn: (row) => row.usuario?.usuario || "Usuario eliminado",
            header: show === "Movimientos" ? "Usuario" : "Vendedor",
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
              width: idProduct ? undefined : "160px",
            },
          });

          if (city === "cbba") {
            columns.push({
              accessorKey: "cantidad_cbba",
              header: show === "Movimientos" ? "Movimiento" : "Cantidad",
              cell: ({ row: { original: v } }) => {
                return !isPDF ? (
                  <div
                    className={twMerge(
                      "flex flex-col items-center transition-all duration-300",
                      "text-primary-950"
                    )}
                  >
                    <strong className="font-bold text-xl border-b border-transparent">
                      {show === "Movimientos" ? (
                        v.cantidad_cbba !== 0 ? (
                          <>
                            {v.cantidad_cbba > 0 && "+"}
                            {v.cantidad_cbba}{" "}
                          </>
                        ) : (
                          "Creado"
                        )
                      ) : (
                        v.cantidad_cbba * -1
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
                    {show === "Movimientos"
                      ? v.cantidad_cbba !== 0
                        ? `${v.cantidad_cbba > 0 ? "+" : ""}${
                            v.cantidad_cbba
                          } unidades`
                        : "Creado"
                      : `${v.cantidad_cbba * -1} unidades`}
                  </FontedText>
                );
              },
              meta: {
                width: "128px",
                center: true,
              },
            });

            if (show === "Movimientos") {
              columns.push({
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
              });
            } else {
              columns.push(
                {
                  header: "Precio/u",
                  accessorKey: "precio_venta_cbba",
                  cell: ({ row: { original: v } }) =>
                    !isPDF ? (
                      <div className="flex w-full justify-end">
                        <div className="flex flex-col items-end">
                          <strong className="font-bold text-primary-950 text-xl w-full text-center">
                            {v.precio_venta_cbba}{" "}
                            <span className="font-normal opacity-60 text-[12px]">
                              Bs.
                            </span>
                          </strong>
                        </div>
                      </div>
                    ) : (
                      <FontedText>{v.precio_venta_cbba} Bs.</FontedText>
                    ),
                  meta: {
                    width: "100px",
                    center: true,
                  },
                },
                {
                  header: "Total",
                  accessorFn: (row) =>
                    row.precio_venta_cbba * row.cantidad_cbba,
                  cell: ({ row: { original: v } }) =>
                    !isPDF ? (
                      <div className="flex w-full justify-end">
                        <div className="flex flex-col items-end">
                          <strong className="font-bold text-primary-950 text-xl w-full text-center">
                            {v.precio_venta_cbba * v.cantidad_cbba * -1}{" "}
                            <span className="font-normal opacity-60 text-[12px]">
                              Bs.
                            </span>
                          </strong>
                        </div>
                      </div>
                    ) : (
                      <FontedText>
                        {v.precio_venta_cbba * v.cantidad_cbba * -1} Bs.
                      </FontedText>
                    ),
                  meta: {
                    width: "100px",
                    center: true,
                  },
                }
              );
            }
          }

          if (city === "sc") {
            columns.push({
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
                      {show === "Movimientos" ? (
                        v.cantidad_sc !== 0 ? (
                          <>
                            {v.cantidad_sc > 0 && "+"}
                            {v.cantidad_sc}{" "}
                          </>
                        ) : (
                          "Creado"
                        )
                      ) : (
                        v.cantidad_sc * -1
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
                    {show === "Movimientos"
                      ? v.cantidad_sc !== 0
                        ? `${v.cantidad_sc > 0 ? "+" : ""}${
                            v.cantidad_sc
                          } unidades`
                        : "Creado"
                      : `${v.cantidad_sc * -1} unidades`}
                  </FontedText>
                );
              },
              meta: {
                width: "128px",
                center: true,
              },
            });

            if (show === "Movimientos") {
              columns.push({
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
              });
            } else {
              columns.push(
                {
                  header: "Precio/u",
                  accessorKey: "precio_venta_sc",
                  cell: ({ row: { original: v } }) =>
                    !isPDF ? (
                      <div className="flex w-full justify-end">
                        <div className="flex flex-col items-end">
                          <strong className="font-bold text-primary-950 text-xl w-full text-center">
                            {v.precio_venta_sc}{" "}
                            <span className="font-normal opacity-60 text-[12px]">
                              Bs.
                            </span>
                          </strong>
                        </div>
                      </div>
                    ) : (
                      <FontedText>{v.precio_venta_sc} Bs.</FontedText>
                    ),
                  meta: {
                    width: "100px",
                    center: true,
                  },
                },
                {
                  header: "Total",
                  accessorFn: (row) => row.precio_venta_sc * row.cantidad_sc,
                  cell: ({ row: { original: v } }) =>
                    !isPDF ? (
                      <div className="flex w-full justify-end">
                        <div className="flex flex-col items-end">
                          <strong className="font-bold text-primary-950 text-xl w-full text-center">
                            {v.precio_venta_sc * v.cantidad_sc * -1}{" "}
                            <span className="font-normal opacity-60 text-[12px]">
                              Bs.
                            </span>
                          </strong>
                        </div>
                      </div>
                    ) : (
                      <FontedText>
                        {v.precio_venta_sc * v.cantidad_sc * -1} Bs.
                      </FontedText>
                    ),
                  meta: {
                    width: "100px",
                    center: true,
                  },
                }
              );
            }
          }

          columns.push({
            accessorFn: (row) => row.fecha,
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
                  {show === "Movimientos" && (
                    <FontedText style={{ fontSize: 8 }}>
                      / {v.fecha.split(" ")[1]}
                    </FontedText>
                  )}
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
