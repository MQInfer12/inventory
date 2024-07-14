import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { ENDPOINTS } from "@/constants/endpoints";
import { useRequest } from "@/hooks/useRequest";
import { useState } from "react";
import { FormEvent } from "@/types/formEvent";
import { SuccessResponse } from "@/types/apiResponse";
import Select from "@/components/ui/select";
import { API_ProductoDTO, Producto } from "../types/api";
import { useGet } from "@/hooks/useGet";
import { Tienda } from "../../shops/types/api";
import { QUERYKEYS } from "@/constants/queryKeys";
import FileInput from "@/components/ui/fileInput";
import { getHttpImage } from "@/utils/http";

interface Props {
  item: Producto | null;
  onSuccess: (res: SuccessResponse<Producto>) => void;
}

const Form = ({ item, onSuccess }: Props) => {
  const { data: tiendas } = useGet<Tienda[]>(ENDPOINTS.TIENDA_INDEX, [
    QUERYKEYS.TIENDAS,
  ]);
  const { send, loading } = useRequest<Producto, FormData>(
    item
      ? ENDPOINTS.PRODUCTO_UPDATE + item.id + "?_method=PUT"
      : ENDPOINTS.PRODUCTO_STORE,
    {
      method: "POST",
      onSuccess,
    }
  );

  const fileState = useState<File | null>(null);
  const [form, setForm] = useState<API_ProductoDTO>({
    codigo: item?.codigo || "",
    descripcion: item?.descripcion || "",
    detalle: item?.detalle || "",
    foto: item?.foto || "",
    piezas: item?.piezas ? String(item.piezas) : "",
    porcentaje: item?.porcentaje ? String(item.porcentaje) : "",
    stock_cbba: item?.stock_cbba ? String(item.stock_cbba) : "",
    precio_cbba: item?.precio_cbba ? String(item.precio_cbba) : "",
    precio_oferta_cbba: item?.precio_oferta_cbba
      ? String(item.precio_oferta_cbba)
      : "",
    stock_sc: item?.stock_sc ? String(item.stock_sc) : "",
    precio_sc: item?.precio_sc ? String(item.precio_sc) : "",
    precio_oferta_sc: item?.precio_oferta_sc
      ? String(item.precio_oferta_sc)
      : "",
    id_tienda: item?.id_tienda ? String(item.id_tienda) : "",
  });

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const file = fileState[0];
    if (file) {
      formData.append("foto", file);
    }
    for (const key in form) {
      formData.append(key, form[key]);
    }
    send(formData);
  };

  return (
    <form className="flex flex-col gap-4 w-[760px] max-w-full">
      <FileInput state={fileState} defaultSrc={getHttpImage(item?.foto)} />
      <div className="flex w-full flex-wrap gap-4">
        <Input
          value={form.codigo}
          onChange={(v) => setForm((prev) => ({ ...prev, codigo: v }))}
          title="Código"
          placeholder="Ingrese código"
          required
        />
        <Input
          value={form.porcentaje}
          onChange={(v) => setForm((prev) => ({ ...prev, porcentaje: v }))}
          title="Porcentaje"
          placeholder="Ingrese porcentaje"
          type="number"
        />
        <Select
          title="Tienda"
          value={form.id_tienda}
          onChange={(v) => setForm((prev) => ({ ...prev, id_tienda: v }))}
        >
          <option value="">Seleccione una tienda</option>
          {tiendas?.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </Select>
      </div>
      <Input
        value={form.descripcion}
        onChange={(v) => setForm((prev) => ({ ...prev, descripcion: v }))}
        title="Descripción"
        placeholder="Ingrese descripción"
        required
      />
      <Input
        value={form.detalle}
        onChange={(v) => setForm((prev) => ({ ...prev, detalle: v }))}
        title="Detalle"
        placeholder="Ingrese detalle"
      />
      <div className="flex w-full flex-wrap gap-4">
        <Input
          value={form.stock_cbba}
          onChange={(v) => setForm((prev) => ({ ...prev, stock_cbba: v }))}
          title="Stock CBBA."
          placeholder="Ingrese stock CBBA."
          type="number"
          required
        />
        <Input
          value={form.precio_cbba}
          onChange={(v) => setForm((prev) => ({ ...prev, precio_cbba: v }))}
          title="Precio CBBA."
          placeholder="Ingrese precio CBBA."
          type="number"
        />
        <Input
          value={form.precio_oferta_cbba}
          onChange={(v) =>
            setForm((prev) => ({ ...prev, precio_oferta_cbba: v }))
          }
          title="Precio oferta CBBA."
          placeholder="Ingrese precio de oferta CBBA."
          type="number"
        />
      </div>
      <div className="flex w-full flex-wrap gap-4">
        <Input
          value={form.stock_sc}
          onChange={(v) => setForm((prev) => ({ ...prev, stock_sc: v }))}
          title="Stock SC."
          placeholder="Ingrese stock SC."
          type="number"
          required
        />
        <Input
          value={form.precio_sc}
          onChange={(v) => setForm((prev) => ({ ...prev, precio_sc: v }))}
          title="Precio SC."
          placeholder="Ingrese precio SC."
          type="number"
        />
        <Input
          value={form.precio_oferta_sc}
          onChange={(v) =>
            setForm((prev) => ({ ...prev, precio_oferta_sc: v }))
          }
          title="Precio oferta SC."
          placeholder="Ingrese precio de oferta SC."
          type="number"
        />
      </div>
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
