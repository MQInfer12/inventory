import { Timestamps } from "@/types/timestamps";

export interface Categoria extends Timestamps {
  id: number;
  descripcion: string;
}

export interface API_CategoriaDTO {
  descripcion: string;
}