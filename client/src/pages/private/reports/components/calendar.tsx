import Icon from "@/components/icons/icon";
import Input from "@/components/ui/input";
import ControlButton from "@/components/ui/table/controlButton";
import { getTodayUtc } from "@/utils/getTodayUtc";
import { twMerge } from "@/utils/twMerge";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";

type CalendarMode = "hoy" | "siempre" | "personalizado";

export interface CalendarStateMode {
  fechaInicio: string;
  fechaFinal: string;
  mode: CalendarMode;
}

const MESES: Record<string, string> = {
  January: "Ene",
  February: "Feb",
  March: "Mar",
  April: "Abr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Ago",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dic",
};
const DIAS = ["L", "M", "M", "J", "V", "S", "D"];

interface Props {
  fechas: CalendarStateMode;
  setFechas: React.Dispatch<React.SetStateAction<CalendarStateMode>>;
}

const Calendar = ({
  fechas: { fechaFinal, fechaInicio, mode },
  setFechas,
}: Props) => {
  const [fechaActual, setFechaActual] = useState(dayjs());
  const hoy = dayjs();

  const [dragging, setDragging] = useState(false);
  const [rangeStart, setRangeStart] = useState(dayjs(fechaInicio));
  const [rangeEnd, setRangeEnd] = useState(dayjs(fechaFinal));
  const [dragType, setDragType] = useState<string | null>(null);

  useEffect(() => {
    setRangeStart(dayjs(fechaInicio));
    setRangeEnd(dayjs(fechaFinal));
  }, [fechaFinal, fechaInicio]);

  const getMes = useCallback((fecha: Dayjs) => {
    const year = fecha.year();
    const mes = fecha.month();
    const primerDiaDelMes = dayjs(new Date(year, mes, 1)).day();
    let diaActual = primerDiaDelMes === 0 ? -6 : 1 - primerDiaDelMes; // Ajuste para que la semana comience en lunes

    const dias = new Array(6).fill(null).map(() => {
      return new Array(7).fill(null).map(() => {
        diaActual++;
        return dayjs(new Date(year, mes, diaActual));
      });
    });

    return dias;
  }, []);

  const handlePrevMonth = () => {
    setFechaActual(fechaActual.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setFechaActual(fechaActual.add(1, "month"));
  };

  /* DRAG PV DATES RANGE */

  const handleMouseDown = (type: string | null) => {
    if (mode !== "personalizado") return;
    if (type) {
      setDragging(true);
      setDragType(type);
    }
  };

  const handleMouseUp = async () => {
    if (mode !== "personalizado") return;
    setDragging(false);
    setDragType(null);
    const fechaInicio = rangeStart.toISOString().split("T")[0];
    const fechaFinal = rangeEnd.toISOString().split("T")[0];
    setFechas({
      fechaInicio,
      fechaFinal,
      mode,
    });
  };

  const handleMouseEnter = (dia: Dayjs) => {
    if (!dragging) return;
    if (dragType === "start") {
      if (dia.isBefore(rangeEnd, "day") || dia.isSame(rangeEnd, "day")) {
        setRangeStart(dia);
      } else {
        setRangeStart(rangeEnd);
        setRangeEnd(dia);
        setDragType("end");
      }
    } else if (dragType === "end") {
      if (dia.isAfter(rangeStart, "day") || dia.isSame(rangeStart, "day")) {
        setRangeEnd(dia);
      } else {
        setRangeEnd(rangeStart);
        setRangeStart(dia);
        setDragType("start");
      }
    }
  };

  const dias = getMes(fechaActual);
  const pvInicio = rangeStart;
  const pvFinal = rangeEnd;

  const handleMode = (newMode: CalendarMode) => {
    switch (newMode) {
      case "hoy":
        setFechas({
          fechaInicio: getTodayUtc(),
          fechaFinal: getTodayUtc(),
          mode: "hoy",
        });
        return;
      case "siempre":
        setFechas({
          fechaInicio: "",
          fechaFinal: "",
          mode: "siempre",
        });
        return;
      case "personalizado":
        setFechas({
          fechaInicio: getTodayUtc(),
          fechaFinal: getTodayUtc(),
          mode: "personalizado",
        });
        return;
    }
  };

  const invalid = pvInicio > pvFinal || pvFinal < pvInicio;
  return (
    <div className="w-full flex gap-4 flex-wrap justify-center items-end">
      <div className="flex flex-col w-[270px] gap-2">
        <div className="flex flex-col h-80 w-full gap-2">
          <div className="flex justify-between items-center px-2">
            <p className="text-sm font-semibold text-primary-700">
              {MESES[fechaActual.format("MMMM")]}, {fechaActual.format("YYYY")}
            </p>
            <div className="flex gap-2">
              <ControlButton
                type="button"
                onClick={handlePrevMonth}
                icon={<Icon type="left" />}
              />
              <ControlButton
                type="button"
                onClick={handleNextMonth}
                icon={<Icon type="right" />}
              />
            </div>
          </div>
          <div
            className={
              "h-full grid grid-cols-7 grid-rows-7 border border-gray-300 rounded-lg p-1 bg-white"
            }
          >
            {DIAS.map((dia, i) => (
              <div key={i} className="flex items-center justify-center">
                <p className="text-nowrap font-bold text-primary-900 text-sm">
                  {dia}
                </p>
              </div>
            ))}
            {dias.flat().map((dia, i) => {
              const isToday = dia.isSame(hoy, "day");
              const isCurrentMonth = dia.month() === fechaActual.month();
              const isSamePvInicio = dia.isSame(pvInicio, "day");
              const isAfterPvInicio = dia.isAfter(pvInicio, "day");
              const isBeforePvFinal = dia.isBefore(pvFinal, "day");
              const isSamePvFinal = dia.isSame(pvFinal, "day");
              const inPvRange =
                !invalid &&
                (isSamePvInicio ||
                  isSamePvFinal ||
                  (isAfterPvInicio && isBeforePvFinal));
              return (
                <button
                  key={i}
                  type="button"
                  className={twMerge(
                    "flex group relative items-center justify-center isolate hover:opacity-60",
                    !isCurrentMonth && "opacity-40"
                  )}
                  onMouseDown={() =>
                    handleMouseDown(
                      isSamePvInicio ? "start" : isSamePvFinal ? "end" : null
                    )
                  }
                  onMouseEnter={() => handleMouseEnter(dia)}
                  onMouseUp={handleMouseUp}
                  tabIndex={-1}
                >
                  {inPvRange && (
                    <span
                      className={twMerge(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square transition-[opacity] duration-200 bg-emerald-500/70",
                        dragging && "opacity-80",
                        !(isAfterPvInicio && isBeforePvFinal) &&
                          isSamePvInicio &&
                          isSamePvFinal
                          ? "rounded-full"
                          : isSamePvInicio
                          ? "rounded-l-full"
                          : isSamePvFinal && "rounded-r-full"
                      )}
                    />
                  )}
                  {isToday && (
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square rounded-full bg-primary-800/80" />
                  )}
                  <p
                    className={twMerge(
                      "text-nowrap text-[12px] font-bold z-10",
                      isToday || inPvRange ? "text-white" : "text-black/60"
                    )}
                  >
                    {dia.format("D")}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <ControlButton
            type="button"
            full
            icon={<Icon type="calendarconfig" />}
            text="Personalizado"
            title="Personalizado"
            onClick={() => handleMode("personalizado")}
            btnType={mode === "personalizado" ? "primary" : "secondary"}
          />
          <ControlButton
            type="button"
            full
            icon={<Icon type="calendartoday" />}
            text="Hoy"
            title="Hoy"
            onClick={() => handleMode("hoy")}
            btnType={mode === "hoy" ? "primary" : "secondary"}
          />
          <ControlButton
            type="button"
            full
            icon={<Icon type="calendaralways" />}
            text="Siempre"
            title="Siempre"
            onClick={() => handleMode("siempre")}
            btnType={mode === "siempre" ? "primary" : "secondary"}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <Input
              title="Fecha de inicio"
              value={fechaInicio}
              type="date"
              required
              onChange={(e) =>
                setFechas((prev) => ({ ...prev, fechaInicio: e }))
              }
              disabled={mode === "hoy" || mode === "siempre"}
            />
          </div>
          <div>
            <Input
              title="Fecha final"
              value={fechaFinal}
              type="date"
              required
              onChange={(e) =>
                setFechas((prev) => ({ ...prev, fechaFinal: e }))
              }
              disabled={mode === "hoy" || mode === "siempre"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
