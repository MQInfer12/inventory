import { ENDPOINTS } from "@/constants/endpoints";
import { QUERYKEYS } from "@/constants/queryKeys";
import { useGet } from "@/hooks/useGet";
import { Producto } from "@/pages/private/products/types/api";
import { getHttpImage } from "@/utils/http";
import { twMerge } from "@/utils/twMerge";
import Placeholder from "@/assets/placeholder.jpg";

interface Props {
  title: string;
  value: number[];
  onChange: (value: number[]) => void;
  required?: boolean;
}

const ProductPicker = ({ onChange, title, value, required }: Props) => {
  const { data, loading } = useGet<Producto[]>(ENDPOINTS.PRODUCTO_INDEX, [
    QUERYKEYS.PRODUCTOS,
  ]);

  const handleChange = (opValue: number) => {
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
          "text-primary-700",
          required && "after:content-['_*'] after:text-rose-800 after:font-bold"
        )}
      >
        {title}
      </p>
      <div
        className={twMerge(
          "scroll-mini max-h-96 form-input text-sm w-full rounded-lg placeholder:font-medium font-medium",
          "overflow-x-hidden overflow-y-auto"
        )}
      >
        {data && data.length > 0 ? (
          <>
            <div className="w-full flex flex-wrap gap-2">
              {data.map((op) => {
                const isActive = value.includes(op.id);
                return (
                  <button
                    key={op.id}
                    type="button"
                    className={twMerge(
                      "min-w-32 flex-1 h-32 flex flex-col overflow-hidden border rounded-lg whitespace-nowrap border-gray-300 hover:opacity-80 transition-all duration-300",
                      isActive
                        ? "text-white bg-primary-700"
                        : "text-primary-800"
                    )}
                    onClick={() => handleChange(op.id)}
                  >
                    <img
                      className={twMerge("w-full flex-1 overflow-hidden object-cover", !op.foto && "opacity-30")}
                      src={getHttpImage(op.foto) || Placeholder}
                    />
                    <p
                      className="w-full px-2 py-1 border-t border-gray-300 overflow-hidden text-ellipsis"
                      title={op.descripcion}
                    >
                      {op.descripcion}
                    </p>
                  </button>
                );
              })}
            </div>
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

export default ProductPicker;
