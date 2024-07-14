import { Timestamps } from "@/types/timestamps";

export interface Usuario extends Timestamps {
  id: number;
  usuario: string;
  superadmin: boolean;
}

export interface API_UsuarioDTO {
  usuario: string;
  password: string;
}
