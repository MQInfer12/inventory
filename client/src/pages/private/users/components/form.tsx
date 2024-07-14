import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { ENDPOINTS } from "@/constants/endpoints";
import { useRequest } from "@/hooks/useRequest";
import { useState } from "react";
import { API_UsuarioDTO, Usuario } from "../types/api";
import { FormEvent } from "@/types/formEvent";
import { SuccessResponse } from "@/types/apiResponse";

interface Props {
  item: Usuario | null;
  onSuccess: (res: SuccessResponse<Usuario>) => void;
}

const Form = ({ item, onSuccess }: Props) => {
  const { send, loading } = useRequest<Usuario, API_UsuarioDTO>(
    item ? ENDPOINTS.USUARIO_UPDATE + item.id : ENDPOINTS.USUARIO_STORE,
    {
      method: item ? "PUT" : "POST",
      onSuccess,
    }
  );

  const [form, setForm] = useState<API_UsuarioDTO>({
    usuario: item?.usuario || "",
    password: "",
  });

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    send(form);
  };

  return (
    <form className="flex flex-col gap-4 w-80">
      <Input
        value={form.usuario}
        onChange={(v) => setForm((prev) => ({ ...prev, usuario: v }))}
        title="Usuario"
        placeholder="Ingrese usuario"
        required
      />
      <Input
        value={form.password}
        onChange={(v) => setForm((prev) => ({ ...prev, password: v }))}
        title="Contraseña"
        placeholder={
          item ? "Actualizar contraseña (opcional)" : "Ingrese contraseña"
        }
        type="password"
        required={!item}
      />
      <div className="w-full mt-2">
        <Button
          disabled={loading}
          text={loading ? "Cargando..." : item ? "Editar" : "Agregar"}
          onClick={handleSend}
        />
      </div>
    </form>
  );
};

export default Form;
