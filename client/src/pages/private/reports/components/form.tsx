import Calendar, { CalendarStateMode } from "./calendar";
import Button from "@/components/ui/button";
import { FormEvent } from "@/types/formEvent";
import { useState } from "react";

interface Props {
  defaultFechas: CalendarStateMode;
  onClose: (fechas: CalendarStateMode) => void;
}

const Form = ({ defaultFechas, onClose }: Props) => {
  const [fechas, setFechas] = useState<CalendarStateMode>(defaultFechas);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    onClose(fechas);
  };

  return (
    <form className="flex flex-col gap-4 max-w-full">
      <div className="flex w-full flex-wrap gap-4">
        <Calendar fechas={fechas} setFechas={setFechas} />
        <Button text="Buscar" onClick={handleSend} />
      </div>
    </form>
  );
};

export default Form;
