import Loader from "@/components/ui/loader/loader";
import Navbar from "@/components/ui/navbar";
import { ENDPOINTS } from "@/constants/endpoints";
import { ROUTES } from "@/constants/routes";
import { useUserContext } from "@/context/userContext";
import { useRequest } from "@/hooks/useRequest";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  initialRoute: string;
}

const Layout = ({ initialRoute }: Props) => {
  const { setUser, state } = useUserContext();
  const [loadedRoute, setLoadedRoute] = useState(false);

  const { send } = useRequest<User>(ENDPOINTS.ME, {
    method: "GET",
    onSuccess: ({ data }) => {
      setUser(data);
    },
  });

  useEffect(() => {
    if (state === "loading") {
      send();
    }
  }, []);

  useEffect(() => {
    if (!loadedRoute && state !== "loading") {
      setLoadedRoute(true);
    }
  }, [state]);

  if (state === "unlogged") return <Navigate to={ROUTES.INDEX} />;
  if (state === "loading")
    return (
      <div className="w-screen h-screen">
        <Loader text="Cargando datos de usuario..." />
      </div>
    );
  if (!loadedRoute) return <Navigate to={initialRoute} />;
  return (
    <>
      <Navbar isDashboard />
      <main className="flex flex-col h-full pt-16 animate-[appear_1s]">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
