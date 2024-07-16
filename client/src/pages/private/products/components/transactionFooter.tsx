import ControlButton from "@/components/ui/table/controlButton";
import { Transaction } from "..";
import { Producto } from "../types/api";
import Icon from "@/components/icons/icon";
import { twMerge } from "@/utils/twMerge";
import ZoomImage from "@/components/ui/zoomImage";
import { getHttpImage } from "@/utils/http";
import { useDelayUnmount } from "@/hooks/useDelayUnmount";

interface Props {
  open: boolean;
  productos: Producto[];
  transaction: Transaction[];
  handleSave: () => void;
}

const TransactionFooter = ({
  handleSave,
  open,
  productos,
  transaction,
}: Props) => {
  const render = useDelayUnmount(open, 300);
  if (!render) return null;
  return (
    <div
      className={twMerge(
        "animate-[growH_0.3s] max-sm:animate-[growHSM_0.3s] shadow-xl transition-all duration-300 overflow-hidden",
        open ? "h-[208px] max-sm:h-[304px]" : "h-0"
      )}
    >
      <div className="mt-4 p-4 pt-2 flex flex-col gap-2 h-[calc(100%_-_16px)] border border-gray-300 rounded-lg bg-white">
        <div className="h-full flex gap-4 flex-1 overflow-auto max-sm:flex-col">
          <ul
            className={twMerge(
              "flex-1 border rounded-lg h-full flex flex-col p-2 gap-2 bg-bg",
              transaction.length === 0
                ? "overflow-hidden items-center justify-center"
                : "overflow-y-auto overflow-x-hidden"
            )}
          >
            {transaction.length > 0 ? (
              transaction.map((v) => {
                const product = productos.find((p) => p.id === v.id);
                if (!product) return null;
                return (
                  <li key={product.id} className="flex items-center gap-2">
                    <div className="min-w-16">
                      <ZoomImage
                        width="64px"
                        height="64px"
                        src={getHttpImage(product.foto)}
                        title="Foto de producto"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <strong
                        className="text-sm line-clamp-1"
                        title={`${product.codigo} - ${product.descripcion}`}
                      >
                        {product.codigo} - {product.descripcion}
                      </strong>
                      <p className="text-xs font-semibold text-black/70">
                        Stock CBBA:{" "}
                        {v.diff_cbba !== 0 ? (
                          <>
                            <span className="text-primary-800 font-bold">
                              {product.stock_cbba}
                            </span>{" "}
                            {">"}{" "}
                            <span className="text-primary-800 font-bold">
                              {product.stock_cbba + v.diff_cbba}
                            </span>
                          </>
                        ) : (
                          <span className="text-primary-800 font-bold">
                            Sin cambios
                          </span>
                        )}
                      </p>
                      <p className="text-xs font-semibold text-black/70">
                        Stock SC:{" "}
                        {v.diff_sc !== 0 ? (
                          <>
                            <span className="text-primary-800 font-bold">
                              {product.stock_sc}
                            </span>{" "}
                            {">"}{" "}
                            <span className="text-primary-800 font-bold">
                              {product.stock_sc + v.diff_sc}
                            </span>
                          </>
                        ) : (
                          <span className="text-primary-800 font-bold">
                            Sin cambios
                          </span>
                        )}
                      </p>
                    </div>
                  </li>
                );
              })
            ) : (
              <p className="text-base font-semibold text-primary-700">
                Modifica el stock de los productos
              </p>
            )}
          </ul>
          <div className="max-sm:flex-row self-end flex flex-col max-sm:w-full max-sm:justify-between gap-2">
            <div className="flex flex-col gap-1 items-center max-sm:items-start">
              <p className="text-sm font-medium text-black/80">
                Productos:{" "}
                <span className="text-primary-800 font-bold">
                  {transaction.length}
                </span>
              </p>
              <p className="text-sm font-medium text-black/80">
                Salidas:{" "}
                <span className="text-primary-800 font-bold">
                  {transaction.reduce((suma, v) => {
                    if (v.diff_cbba > 0 && v.diff_sc > 0) return suma;
                    if (v.diff_cbba < 0) suma += v.diff_cbba;
                    if (v.diff_sc < 0) suma += v.diff_sc;
                    return suma;
                  }, 0) * -1}
                </span>
              </p>
              <p className="text-sm font-medium text-black/80">
                Entradas:{" "}
                <span className="text-primary-800 font-bold">
                  {transaction.reduce((suma, v) => {
                    if (v.diff_cbba < 0 && v.diff_sc < 0) return suma;
                    if (v.diff_cbba > 0) suma += v.diff_cbba;
                    if (v.diff_sc > 0) suma += v.diff_sc;
                    return suma;
                  }, 0)}
                </span>
              </p>
            </div>
            <div className="mt-2 self-end">
              <ControlButton
                disabled={transaction.length === 0}
                btnType="primary"
                text="Finalizar"
                icon={<Icon type="arrowright" />}
                onClick={handleSave}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFooter;
