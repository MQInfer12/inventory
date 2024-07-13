import { Timestamps } from "@/types/timestamps";

export interface Tienda extends Timestamps {
  id: number;
  nombre: string;
  descripcion: string;
  ciudad: string;
}

export interface API_TiendaDTO {
  nombre: string;
  descripcion: string;
  ciudad: string;
}