import Page from "@/components/ui/page";
import TableContainer from "@/components/ui/table/tableContainer";
import { ENDPOINTS } from "@/constants/endpoints";
import { useGet } from "@/hooks/useGet";
import { useModal } from "@/components/ui/modal/modal";
import Form from "./components/form";
import { useMutateGet } from "@/hooks/useMutateGet";
import { toastSuccess } from "@/utils/toasts";
import { useRequest } from "@/hooks/useRequest";
import { confirmAlert } from "@/utils/alerts";
import { Producto } from "./types/api";
import { QUERYKEYS } from "@/constants/queryKeys";
import ZoomImage from "@/components/ui/zoomImage";
import { getHttpImage } from "@/utils/http";
import { twMerge } from "@/utils/twMerge";
import Icon from "@/components/icons/icon";
import { useEffect, useRef, useState } from "react";
import TransactionFooter from "./components/transactionFooter";
import { useCityContext } from "@/context/cityContext";
import { createColumns } from "@/utils/createColumns";
import FontedText from "@/components/ui/table/pdf/fontedText";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export interface Transaction {
  id: number;
  diff_cbba: number;
  diff_sc: number;
}

const Products = () => {
  const keys = [QUERYKEYS.PRODUCTOS];
  const navigate = useNavigate();
  const { data, refetch } = useGet<Producto[]>(ENDPOINTS.PRODUCTO_INDEX, keys);
  const { modal, openModal, closeModal } = useModal<Producto>();
  const { setQueryData } = useMutateGet();
  const { city, cityName } = useCityContext();

  const [inTransaction, setInTransaction] = useState(false);
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  const focusRef = useRef<any>(null);

  const { send: sendTransaction } = useRequest<
    Producto[],
    {
      data: Transaction[];
    }
  >(ENDPOINTS.MOVIMIENTO_STORE, {
    onSuccess: ({ message, data }) => {
      toastSuccess(message);
      setQueryData<Producto[]>(keys, (old) =>
        old.map((p) => {
          const hasBeenModified = data.find((v) => v.id === p.id);
          if (hasBeenModified) {
            return {
              ...p,
              stock_cbba: hasBeenModified.stock_cbba,
              stock_sc: hasBeenModified.stock_sc,
            };
          }
          return p;
        })
      );
      setTransaction([]);
      setInTransaction(false);
    },
  });
  const { send, current } = useRequest<number, number>(
    ENDPOINTS.PRODUCTO_DESTROY,
    {
      method: "DELETE",
      onSuccess: ({ message, data: id }) => {
        toastSuccess(message);
        setQueryData<Producto[]>(keys, (old) => old.filter((v) => v.id !== id));
      },
    }
  );

  const handleChange = (id: number, city: "cbba" | "sc", value: string) => {
    const product = data?.find((v) => v.id === id);
    if (!product) return;
    const val = value === "" ? "0" : value;
    const exist = transaction.find((v) => v.id === id);
    let diff = 0;
    switch (city) {
      case "cbba":
        diff = Number(val) - product.stock_cbba;
        break;
      case "sc":
        diff = Number(val) - product.stock_sc;
        break;
    }
    if (exist) {
      setTransaction((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                diff_cbba: city === "cbba" ? diff : v.diff_cbba,
                diff_sc: city === "sc" ? diff : v.diff_sc,
              }
            : v
        )
      );
    } else {
      setTransaction((prev) => [
        ...prev,
        {
          id,
          diff_cbba: city === "cbba" ? diff : 0,
          diff_sc: city === "sc" ? diff : 0,
        },
      ]);
    }
    focusRef.current = city + "-" + id;
    setTransaction((prev) =>
      prev.filter((v) => !(v.diff_cbba === 0 && v.diff_sc === 0))
    );
  };

  const handleSaveTransaction = () => {
    confirmAlert(
      () => {
        sendTransaction({
          data: transaction,
        });
      },
      {
        text: "Se hará el movimiento de inventario correspondiente.",
      }
    );
  };

  useEffect(() => {
    if (focusRef.current) {
      const element = document.getElementById(focusRef.current);
      element?.focus();
    }
  }, [transaction]);

  return (
    <Page>
      <TableContainer
        name="Productos"
        add={() => openModal()}
        onClickRow={{
          fn: (row) => openModal(row),
          disabled: (row) => row.id === current || inTransaction,
        }}
        edit={{
          fn: (row) => openModal(row),
          disabled: (row) => row.id === current || inTransaction,
        }}
        del={{
          fn: (row) => confirmAlert(() => send(row.id)),
          disabled: (row) => row.id === current || inTransaction,
        }}
        rowButton={{
          icon: <Icon type="eye_search" />,
          fn: (row) => navigate(ROUTES.REPORTS + `/${row.id}`),
          disabled: (row) => row.id === current || inTransaction,
        }}
        button={{
          text: inTransaction ? "Cancelar movimiento" : "Iniciar movimiento",
          fn: () => {
            if (inTransaction) {
              setTransaction([]);
            }
            setInTransaction((prev) => !prev);
          },
          icon: <Icon type="plusminus" />,
        }}
        pdfData={[
          {
            title: "Ciudad",
            value: cityName,
          },
        ]}
        sheetData={[
          {
            title: "Descripción",
            value: (row) => row.descripcion,
            style: {
              fontWeight: 700,
            },
          },
          {
            title: "Categorías",
            value: (row) =>
              row.categorias.map((cat) => cat.descripcion).join(", "),
          },
          {
            title: "Código",
            value: (row) => row.codigo,
            style: {
              color: "red",
            },
          },
          {
            title: "%",
            value: (row) => String(row.porcentaje || ""),
          },
          {
            title: "Tienda",
            value: (row) => row.tienda?.nombre || "",
          },
          {
            title: "Ciudad",
            value: () => cityName,
          },
          {
            title: "Precio",
            value: (row) =>
              city === "cbba"
                ? String(row.precio_cbba || "")
                : String(row.precio_sc || ""),
          },
          {
            title: "Precio oferta",
            value: (row) =>
              city === "cbba"
                ? String(row.precio_oferta_cbba || "")
                : String(row.precio_oferta_sc || ""),
          },
          {
            title: "Cantidad",
            value: (row) =>
              city === "cbba" ? String(row.stock_cbba) : String(row.stock_sc),
          },
          {
            title: "",
            value: (row) =>
              city === "cbba"
                ? row.stock_cbba === 0
                  ? "Agotado"
                  : ""
                : row.stock_sc === 0
                ? "Agotado"
                : "",
            style: {
              color: "red",
            },
          },
        ]}
        reload={refetch}
        data={data}
        disableButtons={inTransaction}
        columns={(isPDF) => {
          const columns = createColumns<Producto>([
            //region CÓDIGO
            {
              accessorFn: (row) => row.codigo,
              header: "Código",
              cell: ({ row: { original: v } }) =>
                isPDF ? (
                  <FontedText>{v.codigo}</FontedText>
                ) : (
                  <p title={v.codigo} className="text-ellipsis overflow-hidden">
                    {v.codigo}
                  </p>
                ),
              meta: {
                width: "90px",
                sticky: true,
              },
            },
            //region FOTO
            {
              header: "Foto",
              cell: ({ row: { original: v } }) =>
                !isPDF && (
                  <div className="w-full flex justify-center">
                    <ZoomImage
                      title="Foto del producto"
                      src={getHttpImage(v.foto)}
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
            //region DESCRIPCIÓN
            {
              accessorFn: (row) => row.descripcion + " " + row.detalle,
              header: "Descripción",
              cell: ({ row: { original: v } }) => {
                const tienda = v.tienda ? `${v.tienda.nombre} ` : null;
                const detalle = v.detalle || null;
                return !isPDF ? (
                  <div className="flex flex-col gap-[2px]">
                    <strong
                      title={v.descripcion}
                      className="line-clamp-2 font-semibold text-black/80 text-balance"
                    >
                      {v.descripcion}
                    </strong>
                    <p className="line-clamp-1 text-black/60 font-medium">
                      {tienda && (
                        <span className="text-primary-600/90 font-medium">
                          {tienda}
                        </span>
                      )}
                      {detalle && (
                        <span title={v.detalle || undefined}>
                          {tienda && "/"} {v.detalle}
                        </span>
                      )}
                    </p>
                  </div>
                ) : (
                  <FontedText>{v.descripcion}</FontedText>
                );
              },
            },
            //region CATEGORÍAS
            {
              accessorFn: (row) =>
                row.categorias.map((v) => v.descripcion).join(", "),
              header: "Categorías",
              cell: ({ row: { original: v } }) => {
                return !isPDF ? (
                  <div className="flex gap-1 flex-wrap max-h-14 overflow-auto px-1">
                    {v.categorias.map((cat) => (
                      <strong
                        key={cat.id}
                        title={v.categorias
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
                    {v.categorias.map((v) => v.descripcion).join(", ")}
                  </FontedText>
                );
              },
              meta: {
                width: "180px",
              },
            },
          ]);

          //region COCHABAMBA
          if (city === "cbba") {
            columns.push(
              {
                header: "Precio",
                accessorKey: "precio_cbba",
                cell: ({ row: { original: v } }) =>
                  !isPDF ? (
                    <div className="flex w-full justify-end">
                      <div className="flex flex-col items-end">
                        <strong className="font-bold text-primary-950 text-xl w-full text-center">
                          {v.precio_cbba || "-"}{" "}
                          <span className="font-normal opacity-60 text-[12px]">
                            Bs.
                          </span>
                        </strong>
                        <span className="ont-normal opacity-60 text-[12px]">
                          /{" "}
                          <span className="text-primary-700 font-bold">
                            {v.precio_oferta_cbba || "-"}
                          </span>{" "}
                          Bs.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <FontedText>
                      {v.precio_cbba || "-"} Bs. /{" "}
                      <FontedText style={{ fontSize: 8 }}>
                        {v.precio_oferta_cbba || "-"} Bs.
                      </FontedText>
                    </FontedText>
                  ),
                meta: {
                  width: "100px",
                  center: true,
                },
              },
              {
                accessorKey: !inTransaction ? "stock_cbba" : undefined,
                header: "Stock",
                cell: ({ row: { original: v } }) => {
                  const stock = v.stock_cbba;
                  const tProd = transaction.find((t) => t.id === v.id);
                  const agotado =
                    inTransaction && tProd
                      ? v.stock_cbba + tProd.diff_cbba === 0
                      : v.stock_cbba === 0;
                  const hasChanged = tProd
                    ? stock + tProd.diff_cbba !== stock
                    : false;
                  return !isPDF ? (
                    <div
                      className={twMerge(
                        "flex flex-col items-center transition-all duration-300",
                        agotado
                          ? "text-rose-700"
                          : hasChanged
                          ? "text-amber-600"
                          : "text-primary-950"
                      )}
                    >
                      {inTransaction ? (
                        <div className="relative group">
                          <input
                            id={`cbba-${v.id}`}
                            className="no-arrows font-bold text-xl w-full outline-none text-center bg-transparent border-b"
                            value={tProd ? stock + tProd.diff_cbba : stock}
                            onChange={(e) =>
                              handleChange(v.id, "cbba", e.target.value)
                            }
                            onClick={(e) => e.stopPropagation()}
                            type="number"
                            min={0}
                            onFocus={(e) => (focusRef.current = e.target.id)}
                          />
                          <span className="text-primary-950 h-full hidden group-hover:block max-lg:block">
                            <div className="absolute h-full aspect-square left-0 top-0 flex-1 p-1">
                              <button
                                tabIndex={-1}
                                className="w-full flex items-center justify-center font-bold rounded-full border"
                                onClick={() => {
                                  if (!agotado) {
                                    handleChange(
                                      v.id,
                                      "cbba",
                                      tProd
                                        ? String(stock + tProd.diff_cbba - 1)
                                        : String(stock - 1)
                                    );
                                  }
                                }}
                              >
                                -
                              </button>
                            </div>
                            <div className="absolute h-full aspect-square right-0 top-0 flex-1 p-1">
                              <button
                                tabIndex={-1}
                                className="w-full flex items-center justify-center font-bold rounded-full border "
                                onClick={() => {
                                  handleChange(
                                    v.id,
                                    "cbba",
                                    tProd
                                      ? String(stock + tProd.diff_cbba + 1)
                                      : String(stock + 1)
                                  );
                                }}
                              >
                                +
                              </button>
                            </div>
                          </span>
                        </div>
                      ) : (
                        <strong className="font-bold text-xl border-b border-transparent">
                          {stock}{" "}
                        </strong>
                      )}
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

          //region SANTA CRUZ
          if (city === "sc") {
            columns.push(
              {
                header: "Precio",
                accessorKey: "precio_sc",
                cell: ({ row: { original: v } }) =>
                  !isPDF ? (
                    <div className="flex gap-2 w-full justify-end">
                      <div className="flex flex-col items-end">
                        <strong className="font-bold text-primary-950 text-xl w-full text-center">
                          {v.precio_sc || "-"}{" "}
                          <span className="font-normal opacity-60 text-[12px]">
                            Bs.
                          </span>
                        </strong>
                        <span className="font-normal opacity-60 text-[12px]">
                          /{" "}
                          <span className="text-primary-700 font-bold">
                            {v.precio_oferta_sc || "-"}
                          </span>{" "}
                          Bs.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <FontedText>
                      {v.precio_sc || "-"} Bs. /{" "}
                      <FontedText style={{ fontSize: 8 }}>
                        {v.precio_oferta_sc || "-"} Bs.
                      </FontedText>
                    </FontedText>
                  ),
                meta: {
                  width: "100px",
                  center: true,
                },
              },
              {
                accessorKey: !inTransaction ? "stock_sc" : undefined,
                header: "Stock",
                cell: ({ row: { original: v } }) => {
                  const stock = v.stock_sc;
                  const tProd = transaction.find((t) => t.id === v.id);
                  const agotado =
                    inTransaction && tProd
                      ? v.stock_sc + tProd.diff_sc === 0
                      : v.stock_sc === 0;
                  const hasChanged = tProd
                    ? stock + tProd.diff_sc !== stock
                    : false;
                  return !isPDF ? (
                    <div
                      className={twMerge(
                        "flex flex-col items-center",
                        agotado
                          ? "text-rose-700"
                          : hasChanged
                          ? "text-amber-600"
                          : "text-primary-950"
                      )}
                    >
                      {inTransaction ? (
                        <div className="relative group">
                          <input
                            id={`sc-${v.id}`}
                            className="no-arrows font-bold text-xl w-full outline-none text-center bg-transparent border-b"
                            value={tProd ? stock + tProd.diff_sc : stock}
                            onChange={(e) =>
                              handleChange(v.id, "sc", e.target.value)
                            }
                            onClick={(e) => e.stopPropagation()}
                            type="number"
                            min={0}
                            onFocus={(e) => (focusRef.current = e.target.id)}
                          />
                          <span className="text-primary-950 h-full hidden group-hover:block max-lg:block">
                            <div className="absolute h-full aspect-square left-0 top-0 flex-1 p-1">
                              <button
                                tabIndex={-1}
                                className="w-full flex items-center justify-center font-bold rounded-full border"
                                onClick={() => {
                                  if (!agotado) {
                                    handleChange(
                                      v.id,
                                      "sc",
                                      tProd
                                        ? String(stock + tProd.diff_sc - 1)
                                        : String(stock - 1)
                                    );
                                  }
                                }}
                              >
                                -
                              </button>
                            </div>
                            <div className="absolute h-full aspect-square right-0 top-0 flex-1 p-1">
                              <button
                                tabIndex={-1}
                                className="w-full flex items-center justify-center font-bold rounded-full border "
                                onClick={() => {
                                  handleChange(
                                    v.id,
                                    "sc",
                                    tProd
                                      ? String(stock + tProd.diff_sc + 1)
                                      : String(stock + 1)
                                  );
                                }}
                              >
                                +
                              </button>
                            </div>
                          </span>
                        </div>
                      ) : (
                        <strong className="font-bold text-xl border-b border-transparent">
                          {v.stock_sc}{" "}
                        </strong>
                      )}
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

          return columns;
        }}
      />
      <TransactionFooter
        open={inTransaction}
        handleSave={handleSaveTransaction}
        productos={data || []}
        transaction={transaction}
      />
      {modal("Formulario de producto", (item) => (
        <Form
          item={item}
          onSuccess={({ message, data }) => {
            if (item) {
              setQueryData<Producto[]>(keys, (old) =>
                old.map((v) => (v.id === data.id ? data : v))
              );
            } else {
              setQueryData<Producto[]>(keys, (old) => [...old, data]);
            }
            toastSuccess(message);
            closeModal();
          }}
        />
      ))}
    </Page>
  );
};

export default Products;
