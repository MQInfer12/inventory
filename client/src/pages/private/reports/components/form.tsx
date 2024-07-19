import Calendar, { CalendarStateMode } from "./calendar";
import Button from "@/components/ui/button";
import Multicheck from "@/components/ui/multicheck";
import { FormEvent } from "@/types/formEvent";
import { useState } from "react";
import { Categoria } from "../../categories/types/api";
import { useGet } from "@/hooks/useGet";
import { ENDPOINTS } from "@/constants/endpoints";
import { QUERYKEYS } from "@/constants/queryKeys";

interface Props {
  defaultFechas: CalendarStateMode;
  defaultCats: number[];
  onClose: (
    fechas: CalendarStateMode,
    categorias: {
      name: string;
      id: number;
    }[]
  ) => void;
}

const Form = ({ defaultFechas, defaultCats, onClose }: Props) => {
  const [fechas, setFechas] = useState<CalendarStateMode>(defaultFechas);
  const [cats, setCats] = useState<number[]>(defaultCats);

  const { data: categorias, loading: loadingCategorias } = useGet<Categoria[]>(
    ENDPOINTS.CATEGORIA_INDEX,
    [QUERYKEYS.CATEGORIAS]
  );

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    onClose(
      fechas,
      cats.map((c) => ({
        id: c,
        name: categorias?.find((v) => v.id === c)?.descripcion || "",
      }))
    );
  };

  return (
    <form className="flex flex-col gap-4 max-w-full">
      <div className="flex flex-wrap gap-4 max-w-[560px]">
        <Calendar fechas={fechas} setFechas={setFechas} />
        <Multicheck
          title={`Categorías (${cats.length > 0 ? "Personalizado" : "Todas"})`}
          options={
            categorias?.map((v) => ({
              value: String(v.id),
              text: v.descripcion,
            })) || []
          }
          value={cats.map((v) => String(v))}
          onChange={(v) => {
            setCats(v.map((id) => Number(id)));
          }}
          loading={loadingCategorias}
        />
        <Button text="Buscar" onClick={handleSend} />
      </div>
    </form>
  );
};

export default Form;
