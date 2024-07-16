import Logo from "@/assets/logo.png";
import Waves from "@/components/login/waves";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Navbar from "@/components/ui/navbar";
import { ENDPOINTS } from "@/constants/endpoints";
import { ROUTES } from "@/constants/routes";
import { useRequest } from "@/hooks/useRequest";
import { twMerge } from "@/utils/twMerge";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API_LoginDTO, API_LoginRes } from "./types/api";
import { setAuthCookie } from "@/utils/authCookie";
import { useUserContext } from "@/context/userContext";
import { toastSuccess } from "@/utils/toasts";
import { FormEvent } from "@/types/formEvent";

const Login = () => {
  const navigate = useNavigate();

  const { state, setUserLogin } = useUserContext();
  const [logged, setLogged] = useState(false);
  const [form, setForm] = useState({
    usuario: "",
    password: "",
  });

  const { send, loading } = useRequest<API_LoginRes, API_LoginDTO>(
    ENDPOINTS.LOGIN,
    {
      onSuccess: ({ message, data }) => {
        toastSuccess(message);
        setAuthCookie(data.access_token);
        setLogged(true);
        setTimeout(() => {
          setUserLogin(data.user);
          navigate(ROUTES.PRODUCTS);
        }, 1000);
      },
    }
  );

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    send(form);
  };

  if (state === "loading" || state === "logged")
    return <Navigate to={ROUTES.HOME} />;
  return (
    <>
      <Navbar />
      <section
        className={twMerge(
          "w-full h-full flex flex-col items-center justify-center relative isolate bg-bg-800 transition-all duration-1000 px-10",
          logged ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className="flex flex-col items-center mb-40">
          <img src={Logo} className="w-14 h-auto" alt="app-logo" />
          <h2 className="text-4xl text-white mt-6">Iniciar sesión</h2>
          <p className="text-white/80 mt-8 text-center">
            ¡Inicia sesión y empieza a manejar tu inventario!
          </p>
          <form className="mt-12 flex flex-col gap-4 w-72">
            <Input
              value={form.usuario}
              onChange={(v) => setForm((prev) => ({ ...prev, usuario: v }))}
              title="Usuario"
              placeholder="Ingrese usuario"
              dark
              required
            />
            <Input
              type="password"
              value={form.password}
              onChange={(v) => setForm((prev) => ({ ...prev, password: v }))}
              title="Contraseña"
              placeholder="Ingrese contraseña"
              dark
              required
            />
            <div className="w-full mt-4">
              <Button
                text={loading ? "Cargando..." : "Iniciar sesión"}
                disabled={loading}
                onClick={handleSend}
              />
            </div>
          </form>
        </div>
        <Waves />
      </section>
    </>
  );
};

export default Login;
