import { Timestamps } from "./timestamps";

export interface User extends Timestamps {
  id: number;
  usuario: string;
  superadmin: boolean;
}
