import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { ENDPOINTS } from "@/constants/endpoints";
import { useRequest } from "@/hooks/useRequest";
import { useState } from "react";
import { API_CategoriaDTO, Categoria } from "../types/api";
import { FormEvent } from "@/types/formEvent";
import { SuccessResponse } from "@/types/apiResponse";

interface Props {
  item: Categoria | null;
  onSuccess: (res: SuccessResponse<Categoria>) => void;
}

const Form = ({ item, onSuccess }: Props) => {
  const { send, loading } = useRequest<Categoria, API_CategoriaDTO>(
    item ? ENDPOINTS.CATEGORIA_UPDATE + item.id : ENDPOINTS.CATEGORIA_STORE,
    {
      method: item ? "PUT" : "POST",
      onSuccess,
    }
  );

  const [form, setForm] = useState({
    descripcion: item?.descripcion || "",
  });

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    send(form);
  };

  return (
    <form className="flex flex-col gap-4 w-80">
      <Input
        value={form.descripcion}
        onChange={(v) => setForm((prev) => ({ ...prev, descripcion: v }))}
        title="Descripción"
        placeholder="Ingrese descripción"
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
