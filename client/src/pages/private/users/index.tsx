import Page from "@/components/ui/page";
import TableContainer from "@/components/ui/table/tableContainer";
import { ENDPOINTS } from "@/constants/endpoints";
import { useGet } from "@/hooks/useGet";
import { Usuario } from "./types/api";
import { useModal } from "@/components/ui/modal/modal";
import Form from "./components/form";
import { useMutateGet } from "@/hooks/useMutateGet";
import { toastSuccess } from "@/utils/toasts";
import { useRequest } from "@/hooks/useRequest";
import { confirmAlert } from "@/utils/alerts";
import { useUserContext } from "@/context/userContext";
import { QUERYKEYS } from "@/constants/queryKeys";

const Users = () => {
  const keys = [QUERYKEYS.USUARIOS];
  const { user, setUser } = useUserContext();
  const { data } = useGet<Usuario[]>(ENDPOINTS.USUARIO_INDEX, keys);
  const { modal, openModal, closeModal } = useModal<Usuario>();
  const { setQueryData } = useMutateGet();

  const { send, current } = useRequest<string, number>(
    ENDPOINTS.USUARIO_DESTROY,
    {
      method: "DELETE",
      onSuccess: ({ message, data: id }) => {
        toastSuccess(message);
        setQueryData<Usuario[]>(keys, (old) => {
          return old.filter((v) => v.id !== Number(id));
        });
      },
    }
  );

  return (
    <Page>
      <TableContainer
        add={() => openModal()}
        onClickRow={{
          fn: (row) => openModal(row),
          disabled: (row) =>
            row.id === current || (row.id !== user?.id && row.superadmin),
        }}
        edit={{
          fn: (row) => openModal(row),
          disabled: (row) =>
            row.id === current || (row.id !== user?.id && row.superadmin),
        }}
        del={{
          fn: (row) => confirmAlert(() => send(row.id)),
          disabled: (row) => row.id === current || row.superadmin,
        }}
        columns={[
          {
            accessorFn: (row) =>
              `${row.usuario}${row.superadmin ? " (administrador)" : ""}`,
            header: "Usuario",
          },
        ]}
        data={data}
      />
      {modal("Formulario de usuario", (item) => (
        <Form
          item={item}
          onSuccess={({ message, data }) => {
            if (item) {
              if (data.id === user?.id) setUser(data);
              setQueryData<Usuario[]>(keys, (old) =>
                old.map((v) => (v.id === data.id ? data : v))
              );
            } else {
              setQueryData<Usuario[]>(keys, (old) => [...old, data]);
            }
            toastSuccess(message);
            closeModal();
          }}
        />
      ))}
    </Page>
  );
};

export default Users;
