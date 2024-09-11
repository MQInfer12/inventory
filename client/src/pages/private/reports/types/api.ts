import { Timestamps } from "@/types/timestamps";
import { Producto } from "../../products/types/api";
import { Usuario } from "../../users/types/api";

export interface Movimiento extends Timestamps {
  id: number;
  id_producto: number;
  cantidad_cbba: number;
  actual_cbba: number;
  cantidad_sc: number;
  precio_venta_cbba: number;
  precio_venta_sc: number;
  actual_sc: number;
  fecha: string;
  producto: Producto | null;
  usuario: Usuario | null;
}
