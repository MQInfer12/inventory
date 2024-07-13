import Logo from "@/assets/logo.png";
import { ENDPOINTS } from "@/constants/endpoints";
import { ROUTES } from "@/constants/routes";
import { useUserContext } from "@/context/userContext";
import { useRequest } from "@/hooks/useRequest";
import { deleteAuthCookie } from "@/utils/authCookie";
import { toastSuccess } from "@/utils/toasts";
import { twMerge } from "@/utils/twMerge";
import { NavLink, useNavigate } from "react-router-dom";

interface Props {
  isDashboard?: boolean;
}

const Navbar = ({ isDashboard }: Props) => {
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const { send, loading } = useRequest<null>(ENDPOINTS.LOGOUT, {
    method: "GET",
    onSuccess: (res) => {
      toastSuccess(res.message);
      setUser(null);
      deleteAuthCookie();
      navigate(ROUTES.INDEX);
    },
  });

  const handleOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switch (e.target.value) {
      case "logout":
        return send();
    }
  };

  return (
    <header
      className={twMerge(
        "h-16 px-12 flex items-center justify-between fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-bg-800"
      )}
    >
      <div className="flex items-center">
        <img src={Logo} alt="app-logo" />
        <h1 className="text-white font-semibold">ecruitify</h1>
      </div>
      {isDashboard && (
        <div className="flex h-full items-center py-2 animate-[appear_1s]">
          <ul className="flex mr-3">
            <li className="flex flex-col items-center">
              <NavLink
                className={({ isActive }) =>
                  twMerge(
                    "px-3 transition-all duration-300",
                    isActive
                      ? "text-white [&+span]:scale-100"
                      : "text-white/60 [&+span]:scale-0"
                  )
                }
                to={ROUTES.PRODUCTS}
              >
                Productos
              </NavLink>
              <span className="w-12 h-[1px] bg-primary-600 origin-center transition-all duration-300" />
            </li>
            <li className="flex flex-col items-center">
              <NavLink
                className={({ isActive }) =>
                  twMerge(
                    "px-3 transition-all duration-300",
                    isActive
                      ? "text-white [&+span]:scale-100"
                      : "text-white/60 [&+span]:scale-0"
                  )
                }
                to={ROUTES.CATEGORIES}
              >
                Categorías
              </NavLink>
              <span className="w-12 h-[1px] bg-primary-600 origin-center transition-all duration-300" />
            </li>
            <li className="flex flex-col items-center">
              <NavLink
                className={({ isActive }) =>
                  twMerge(
                    "px-3 transition-all duration-300",
                    isActive
                      ? "text-white [&+span]:scale-100"
                      : "text-white/60 [&+span]:scale-0"
                  )
                }
                to={ROUTES.USERS}
              >
                Usuarios
              </NavLink>
              <span className="w-12 h-[1px] bg-primary-600 origin-center transition-all duration-300" />
            </li>
            <li className="flex flex-col items-center">
              <NavLink
                className={({ isActive }) =>
                  twMerge(
                    "px-3 transition-all duration-300",
                    isActive
                      ? "text-white [&+span]:scale-100"
                      : "text-white/60 [&+span]:scale-0"
                  )
                }
                to={ROUTES.REPORTS}
              >
                Reportes
              </NavLink>
              <span className="w-12 h-[1px] bg-primary-600 origin-center transition-all duration-300" />
            </li>
          </ul>
          <div className="flex items-center h-full border-l border-white/60 pl-2">
            <div className="w-48 overflow-hidden flex flex-col items-center">
              <p className="text-white font-bold line-clamp-1 text-center">
                ¡Bienvenido admin!
              </p>
              <select
                value=""
                onChange={handleOptions}
                className="bg-transparent text-white outline-none ring-0 ring-inset focus:ring-2 transition-all duration-300 rounded-md text-sm"
              >
                <option
                  className="disabled:bg-gray-300 bg-gray-300 text-white"
                  disabled
                  value=""
                >
                  {loading ? "Cargando..." : "Opciones"}
                </option>
                <option className="text-primary-800" value="logout">
                  Cerrar sesión
                </option>
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
