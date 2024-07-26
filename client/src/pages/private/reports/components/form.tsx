import Calendar, { CalendarStateMode } from "./calendar";
import Button from "@/components/ui/button";
import Multicheck from "@/components/ui/multicheck";
import { FormEvent } from "@/types/formEvent";
import { useState } from "react";
import { Categoria } from "../../categories/types/api";
import { useGet } from "@/hooks/useGet";
import { ENDPOINTS } from "@/constants/endpoints";
import { QUERYKEYS } from "@/constants/queryKeys";
import ControlButton from "@/components/ui/table/controlButton";
import Icon from "@/components/icons/icon";

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
        <div className="w-full flex gap-4">
          <div className="flex items-end">
            <ControlButton
              title="Todas"
              type="button"
              btnType={cats.length > 0 ? "secondary" : "primary"}
              icon={
                <Icon
                  type={cats.length > 0 ? "dialpad_false" : "dialpad_true"}
                />
              }
              onClick={() => setCats([])}
              size="input"
            />
          </div>
          <Multicheck
            title={`Categorías (${
              cats.length > 0 ? "Personalizado" : "Todas"
            })`}
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
        </div>
        <Button text="Buscar" onClick={handleSend} />
      </div>
    </form>
  );
};

export default Form;
