import { User } from "@/types/user";
import { getAuthCookie } from "@/utils/authCookie";
import { createContext, useCallback, useContext, useState } from "react";

type State = "unlogged" | "loading" | "logged" | "login";

interface Ctx {
  user: User | null;
  state: State;
  setUser: (user: User | null) => void;
  setUserLogin: (user: User | null) => void;
}

const UserContext = createContext<Ctx | null>(null);

interface Props {
  children: JSX.Element;
}

export const UserContextProvider = ({ children }: Props) => {
  const token = getAuthCookie();
  const [user, setUserS] = useState<User | null>(null);
  const [state, setState] = useState<State>(token ? "loading" : "unlogged");

  const setUser = useCallback((user: User | null) => {
    setUserS(user);
    setState(user ? "login" : "unlogged");
  }, []);

  const setUserLogin = useCallback((user: User | null) => {
    setUserS(user);
    setState(user ? "login" : "unlogged");
  }, []);

  return (
    <UserContext.Provider value={{ user, state, setUser, setUserLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("this contexts must be used whitin a UserContextProvider");
  }
  return context;
};
