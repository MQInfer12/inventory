import Page from "@/components/ui/page";
import TableContainer from "@/components/ui/table/tableContainer";
import { ENDPOINTS } from "@/constants/endpoints";
import { useGet } from "@/hooks/useGet";
import { Categoria } from "./types/api";
import { useModal } from "@/components/ui/modal/modal";
import Form from "./components/form";
import { useMutateGet } from "@/hooks/useMutateGet";
import { toastSuccess } from "@/utils/toasts";
import { useRequest } from "@/hooks/useRequest";
import { confirmAlert } from "@/utils/alerts";
import { QUERYKEYS } from "@/constants/queryKeys";

const Categories = () => {
  const keys = [QUERYKEYS.CATEGORIAS];
  const { data, refetch } = useGet<Categoria[]>(
    ENDPOINTS.CATEGORIA_INDEX,
    keys
  );
  const { modal, openModal, closeModal } = useModal<Categoria>();
  const { setQueryData } = useMutateGet();

  const { send, current } = useRequest<number, number>(
    ENDPOINTS.CATEGORIA_DESTROY,
    {
      method: "DELETE",
      onSuccess: ({ message, data: id }) => {
        toastSuccess(message);
        setQueryData<Categoria[]>(keys, (old) => {
          return old.filter((v) => v.id !== id);
        });
      },
    }
  );

  return (
    <Page>
      <TableContainer
        name="Categorías"
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
            accessorKey: "descripcion",
            header: "Descripción",
          },
        ]}
        data={data}
      />
      {modal("Formulario de categoría", (item) => (
        <Form
          item={item}
          onSuccess={({ message, data }) => {
            if (item) {
              setQueryData<Categoria[]>(keys, (old) =>
                old.map((v) => (v.id === data.id ? data : v))
              );
            } else {
              setQueryData<Categoria[]>(keys, (old) => [...old, data]);
            }
            toastSuccess(message);
            closeModal();
          }}
        />
      ))}
    </Page>
  );
};

export default Categories;
