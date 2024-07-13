import { User } from "@/types/user";
import { getAuthCookie } from "@/utils/authCookie";
import { create } from "zustand";

interface Ctx {
  user: User | null;
  state: "unlogged" | "loading" | "logged";
  setUser: (user: User | null) => void;
}

export const useUserContext = create<Ctx>((set) => {
  const token = getAuthCookie();
  return {
    user: null,
    state: token ? "loading" : "unlogged",
    setUser: (user) =>
      set((prev) => ({ ...prev, user, state: user ? "logged" : "unlogged" })),
  };
});
