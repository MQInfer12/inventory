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

const Products = () => {
  const keys = [QUERYKEYS.PRODUCTOS];
  const { data } = useGet<Producto[]>(ENDPOINTS.PRODUCTO_INDEX, keys);
  const { modal, openModal, closeModal } = useModal<Producto>();
  const { setQueryData } = useMutateGet();

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

  return (
    <Page>
      <TableContainer
        add={() => openModal()}
        onClickRow={{
          fn: (row) => openModal(row),
          disabled: (row) => row.id === current,
        }}
        edit={{
          fn: (row) => openModal(row),
          disabled: (row) => row.id === current,
        }}
        del={{
          fn: (row) => confirmAlert(() => send(row.id)),
          disabled: (row) => row.id === current,
        }}
        columns={[
          {
            accessorKey: "codigo",
            header: "Código",
            meta: {
              width: "120px",
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
            accessorFn: (row) => row.precio_cbba,
            cell: ({ row: { original: v } }) => (
              <div className="flex w-full justify-end">
                <div className="flex flex-col items-end">
                  <strong
                    title={v.descripcion}
                    className="font-bold text-primary-950 text-xl w-full text-center"
                  >
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
            accessorFn: (row) => row.precio_sc,
            cell: ({ row: { original: v } }) => (
              <div className="flex gap-2 w-full justify-end">
                <div className="flex flex-col items-end">
                  <strong
                    title={v.descripcion}
                    className="font-bold text-primary-950 text-xl w-full text-center"
                  >
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
          {
            accessorKey: "stock_cbba",
            header: "Stock CBBA.",
            cell: ({ row: { original: v } }) => (
              <strong
                title={v.descripcion}
                className="line-clamp-2 font-bold text-primary-950 text-xl w-full text-center"
              >
                {v.stock_cbba}{" "}
                <span className="font-normal opacity-60 text-[12px]">
                  unidades
                </span>
              </strong>
            ),
            meta: {
              width: "140px",
              center: true,
            },
          },
          {
            accessorKey: "stock_sc",
            header: "Stock SC.",
            cell: ({ row: { original: v } }) => (
              <strong
                title={v.descripcion}
                className="line-clamp-2 font-bold text-primary-950 text-xl w-full text-center"
              >
                {v.stock_sc}{" "}
                <span className="font-normal opacity-60 text-[12px]">
                  unidades
                </span>
              </strong>
            ),
            meta: {
              width: "140px",
              center: true,
            },
          },
        ]}
        data={data}
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
