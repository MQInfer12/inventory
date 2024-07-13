import { User } from "@/types/user";

export interface API_LoginDTO {
  usuario: string;
  password: string;
}

export interface API_LoginRes {
  access_token: string;
  user: User;
}