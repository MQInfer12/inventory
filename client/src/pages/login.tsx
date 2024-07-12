import Logo from "@/assets/logo.png";
import Waves from "@/components/login/waves";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Navbar from "@/components/ui/navbar";
import { ROUTES } from "@/constants/routes";
import { twMerge } from "@/utils/twMerge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [logged, setLogged] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <section
        className={twMerge(
          "w-full h-full flex flex-col items-center justify-center relative isolate bg-bg-800 transition-all duration-1000",
          logged ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className="flex flex-col items-center mb-40">
          <img src={Logo} className="w-14 h-auto" alt="app-logo" />
          <h2 className="text-4xl text-white mt-6">Iniciar sesión</h2>
          <p className="text-white/80 mt-8">
            ¡Inicia sesión y empieza a manejar tu inventario!
          </p>
          <form className="mt-12 flex flex-col gap-4 w-72">
            <Input title="Usuario" placeholder="Ingrese usuario" />
            <Input title="Contraseña" placeholder="Ingrese contraseña" />
            <div className="w-full mt-4">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setLogged(true);
                  setTimeout(() => {
                    navigate(ROUTES.PRODUCTS);
                  }, 1000);
                }}
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
