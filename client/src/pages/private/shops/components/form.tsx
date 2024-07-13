import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { ENDPOINTS } from "@/constants/endpoints";
import { useRequest } from "@/hooks/useRequest";
import { useState } from "react";
import { API_TiendaDTO, Tienda } from "../types/api";
import { FormEvent } from "@/types/formEvent";
import { SuccessResponse } from "@/types/apiResponse";

interface Props {
  item: Tienda | null;
  onSuccess: (res: SuccessResponse<Tienda>) => void;
}

const Form = ({ item, onSuccess }: Props) => {
  const { send, loading } = useRequest<Tienda, API_TiendaDTO>(
    item ? ENDPOINTS.TIENDA_UPDATE + item.id : ENDPOINTS.TIENDA_STORE,
    {
      method: item ? "PUT" : "POST",
      onSuccess,
    }
  );

  const [form, setForm] = useState({
    nombre: item?.nombre || "",
    descripcion: item?.descripcion || "",
    ciudad: item?.ciudad || "",
  });

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    send(form);
  };

  return (
    <form className="flex flex-col gap-4 w-80">
      <Input
        value={form.nombre}
        onChange={(v) => setForm((prev) => ({ ...prev, nombre: v }))}
        title="Nombre"
        placeholder="Ingrese nombre"
        required
      />
      <Input
        value={form.descripcion}
        onChange={(v) => setForm((prev) => ({ ...prev, descripcion: v }))}
        title="Descripción"
        placeholder="Ingrese descripción"
      />
      <Input
        value={form.ciudad}
        onChange={(v) => setForm((prev) => ({ ...prev, ciudad: v }))}
        title="Ciudad"
        placeholder="Ingrese ciudad"
        required
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
