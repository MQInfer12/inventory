import { twMerge } from "@/utils/twMerge";
interface Option {
  value: string;
  text: string;
}

interface Props {
  title: string;
  value: string[];
  options: Option[];
  onChange: (value: string[]) => void;
  dark?: boolean;
  required?: boolean;
  loading?: boolean;
}

const Multicheck = ({
  title,
  onChange,
  options,
  value,
  dark,
  required,
  loading,
}: Props) => {
  const handleChange = (opValue: string) => {
    const exist = value.includes(opValue);
    if (!exist) {
      const newValues = [...value, opValue];
      onChange(newValues);
    } else {
      const newValues = value.filter((v) => v !== opValue);
      onChange(newValues);
    }
  };

  return (
    <div className="relative flex flex-col flex-1 min-w-56">
      <p
        className={twMerge(
          "pl-4 pb-2 text-sm font-medium",
          dark ? "text-white" : "text-primary-700",
          required && "after:content-['_*'] after:text-rose-800 after:font-bold"
        )}
      >
        {title}
      </p>
      <div
        className={twMerge(
          "scroll-mini form-input h-[38px] text-sm w-full bg-bg-300 rounded-xl px-2 py-1 outline-none ring-inset ring-0 focus:ring-2 transition-all duration-300 border placeholder:font-medium font-medium",
          dark
            ? "bg-bg-200 text-white border-bg-800 placeholder:text-white/20 ring-primary-700"
            : "bg-white text-black/80 border-gray-300 placeholder:text-black/40 ring-primary-700/50",
          "flex gap-2 items-center overflow-x-auto overflow-y-hidden"
        )}
      >
        {options.length > 0 ? (
          <>
            {options.map((op) => {
              const isActive = value.includes(op.value);
              return (
                <button
                  key={op.value}
                  type="button"
                  className={twMerge(
                    "border px-2 rounded-lg whitespace-nowrap border-primary-800/40 hover:opacity-80 transition-all duration-300",
                    isActive ? "text-white bg-primary-700" : "text-primary-800"
                  )}
                  onClick={() => handleChange(op.value)}
                >
                  {op.text}
                </button>
              );
            })}
          </>
        ) : (
          <p className="text-black/40 pl-2 select-none">
            {loading ? "Cargando..." : "No hay datos"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Multicheck;
