import { Timestamps } from "@/types/timestamps";
import { Producto } from "../../products/types/api";

export interface Movimiento extends Timestamps {
  id: number;
  id_producto: number;
  cantidad_cbba: number;
  cantidad_sc: number;
  fecha: string;
  producto: Producto | null;
}