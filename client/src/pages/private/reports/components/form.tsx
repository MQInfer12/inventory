import Calendar, { CalendarStateMode } from "./calendar";
import Button from "@/components/ui/button";
import { ENDPOINTS } from "@/constants/endpoints";
import { QUERYKEYS } from "@/constants/queryKeys";
import { useGet } from "@/hooks/useGet";
import { FormEvent } from "@/types/formEvent";
import { useState } from "react";
import { Categoria } from "../../categories/types/api";
import Multicheck from "@/components/ui/multicheck";
import ControlButton from "@/components/ui/table/controlButton";
import Icon from "@/components/icons/icon";

interface Props {
  defaultFechas: CalendarStateMode;
  defaultCats: number[];
  withCats?: boolean;
  onClose: (
    fechas: CalendarStateMode,
    categorias: {
      name: string;
      id: number;
    }[]
  ) => void;
}

const Form = ({ defaultFechas, defaultCats, withCats, onClose }: Props) => {
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
        {withCats && (
          <div className="w-[560px] flex gap-4">
            <Multicheck
              title={`Por categorías (${
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
          </div>
        )}
        <Button text="Buscar" onClick={handleSend} />
      </div>
    </form>
  );
};

export default Form;
