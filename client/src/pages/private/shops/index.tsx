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
import { Tienda } from "./types/api";
import { QUERYKEYS } from "@/constants/queryKeys";

const Shops = () => {
  const keys = [QUERYKEYS.TIENDAS];
  const { data, refetch } = useGet<Tienda[]>(ENDPOINTS.TIENDA_INDEX, keys);
  const { modal, openModal, closeModal } = useModal<Tienda>();
  const { setQueryData } = useMutateGet();

  const { send, current } = useRequest<number, number>(
    ENDPOINTS.TIENDA_DESTROY,
    {
      method: "DELETE",
      onSuccess: ({ message, data: id }) => {
        toastSuccess(message);
        setQueryData<Tienda[]>(keys, (old) => old.filter((v) => v.id !== id));
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
        reload={refetch}
        columns={[
          {
            accessorKey: "nombre",
            header: "Nombre",
          },
          {
            accessorKey: "descripcion",
            header: "Descripción",
          },
          {
            accessorKey: "ciudad",
            header: "Ciudad",
          },
        ]}
        data={data}
      />
      {modal("Formulario de tienda", (item) => (
        <Form
          item={item}
          onSuccess={({ message, data }) => {
            if (item) {
              setQueryData<Tienda[]>(keys, (old) =>
                old.map((v) => (v.id === data.id ? data : v))
              );
            } else {
              setQueryData<Tienda[]>(keys, (old) => [...old, data]);
            }
            toastSuccess(message);
            closeModal();
          }}
        />
      ))}
    </Page>
  );
};

export default Shops;
