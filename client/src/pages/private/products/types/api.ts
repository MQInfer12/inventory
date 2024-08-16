import { Timestamps } from "@/types/timestamps";
import { Tienda } from "../../shops/types/api";
import { Categoria } from "../../categories/types/api";
import { Movimiento } from "../../reports/types/api";

export interface Producto extends Timestamps {
  id: number;
  id_tienda: number;
  codigo: string;
  descripcion: string;
  detalle: string | null;
  foto: string | null;
  porcentaje: number | null;
  piezas: number | null;
  stock_cbba: number;
  stock_sc: number;
  precio_cbba: number | null;
  precio_oferta_cbba: number | null;
  precio_sc: number | null;
  precio_oferta_sc: number | null;
  tienda: Tienda | null;
  categorias: Categoria[];
  movimiento: Movimiento;
}

export interface API_ProductoDTO {
  [key: string]: string | number[];
  id_tienda: string;
  codigo: string;
  descripcion: string;
  detalle: string;
  foto: string;
  porcentaje: string;
  piezas: string;
  stock_cbba: string;
  stock_sc: string;
  precio_cbba: string;
  precio_oferta_cbba: string;
  precio_sc: string;
  precio_oferta_sc: string;
  categorias: number[];
}
