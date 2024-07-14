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
import {
  ElementRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";

interface Transaction {
  id: number;
  city: "cbba" | "sc";
  diff: number;
}

const Products = () => {
  const keys = [QUERYKEYS.PRODUCTOS];
  const { data, refetch } = useGet<Producto[]>(ENDPOINTS.PRODUCTO_INDEX, keys);
  const { modal, openModal, closeModal } = useModal<Producto>();
  const { setQueryData } = useMutateGet();

  const [inTransaction, setInTransaction] = useState(false);
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  const focusRef = useRef<any>(null);

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
    const exist = transaction.find((v) => v.id === id && v.city === city);
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
        prev.map((v) => (v.id === id && v.city === city ? { ...v, diff } : v))
      );
    } else {
      setTransaction((prev) => [
        ...prev,
        {
          id,
          city,
          diff,
        },
      ]);
    }
    setTransaction((prev) => prev.filter((v) => v.diff !== 0));
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
        button={{
          text: inTransaction ? "Cancelar transacción" : "Iniciar transacción",
          fn: () => setInTransaction((prev) => !prev),
          icon: <Icon type="plusminus" />,
        }}
        reload={refetch}
        data={data}
        columns={[
          {
            accessorFn: (row) => row.codigo,
            header: "Código",
            cell: ({ row: { original: v } }) => (
              <p title={v.codigo} className="text-ellipsis overflow-hidden">
                {v.codigo}
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
                  src={getHttpImage(v.foto)}
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
            accessorFn: (row) => row.descripcion + " " + row.detalle,
            header: "Descripción",
            cell: ({ row: { original: v } }) => {
              const tienda = v.tienda ? `${v.tienda.nombre} ` : null;
              const detalle = v.detalle || null;
              return (
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
              );
            },
          },
          {
            header: "Precio CBBA.",
            accessorKey: "precio_cbba",
            cell: ({ row: { original: v } }) => (
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
            ),
            meta: {
              width: "140px",
              center: true,
            },
          },
          {
            header: "Precio SC.",
            accessorKey: "precio_sc",
            cell: ({ row: { original: v } }) => (
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
            ),
            meta: {
              width: "140px",
              center: true,
            },
          },
          //region STOCKS
          {
            accessorKey: "stock_cbba",
            header: "Stock CBBA.",
            cell: ({ row: { original: v } }) => {
              const stock = v.stock_cbba;
              const agotado = v.stock_cbba === 0;
              const tProd = transaction.find(
                (t) => t.id === v.id && t.city === "cbba"
              );
              return (
                <div
                  className={twMerge(
                    "flex flex-col items-center",
                    agotado ? "text-rose-700" : "text-primary-950"
                  )}
                >
                  {inTransaction ? (
                    <input
                      id={`cbba-${v.id}`}
                      className="no-arrows font-bold text-xl text-primary-950 w-full outline-none text-center bg-transparent border-b"
                      value={tProd ? stock + tProd.diff : stock}
                      onChange={(e) =>
                        handleChange(v.id, "cbba", e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                      type="number"
                      min={0}
                      onFocus={(e) => (focusRef.current = e.target.id)}
                    />
                  ) : (
                    <strong className="font-bold text-xl border-b border-transparent">
                      {stock}{" "}
                    </strong>
                  )}
                  <small className="font-normal opacity-60 text-[12px]">
                    unidades
                  </small>
                </div>
              );
            },
            meta: {
              width: "140px",
              center: true,
            },
          },
          {
            accessorKey: "stock_sc",
            header: "Stock SC.",
            cell: ({ row: { original: v } }) => {
              const stock = v.stock_sc;
              const agotado = v.stock_sc === 0;
              const tProd = transaction.find(
                (t) => t.id === v.id && t.city === "sc"
              );
              return (
                <div
                  className={twMerge(
                    "flex flex-col items-center",
                    agotado ? "text-rose-700" : "text-primary-950"
                  )}
                >
                  {inTransaction ? (
                    <input
                      id={`sc-${v.id}`}
                      className="no-arrows font-bold text-xl text-primary-950 w-full outline-none text-center bg-transparent border-b"
                      value={tProd ? stock + tProd.diff : stock}
                      onChange={(e) => handleChange(v.id, "sc", e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      type="number"
                      min={0}
                      onFocus={(e) => (focusRef.current = e.target.id)}
                    />
                  ) : (
                    <strong className="font-bold text-xl border-b border-transparent">
                      {v.stock_sc}{" "}
                    </strong>
                  )}
                  <small className="font-normal opacity-60 text-[12px]">
                    unidades
                  </small>
                </div>
              );
            },
            meta: {
              width: "140px",
              center: true,
            },
          },
        ]}
      />
      {inTransaction && (
        <div className="h-40 bg-white border border-gray-300 rounded-lg shadow-xl"></div>
      )}
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
