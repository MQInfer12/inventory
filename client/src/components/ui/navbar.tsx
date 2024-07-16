import Logo from "@/assets/logo.png";
import { ENDPOINTS } from "@/constants/endpoints";
import { ROUTENAMES, ROUTES } from "@/constants/routes";
import { useUserContext } from "@/context/userContext";
import { useRequest } from "@/hooks/useRequest";
import { deleteAuthCookie } from "@/utils/authCookie";
import { toastSuccess } from "@/utils/toasts";
import { twMerge } from "@/utils/twMerge";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Icon from "../icons/icon";
import { useState } from "react";

interface Props {
  isDashboard?: boolean;
}

const Navbar = ({ isDashboard }: Props) => {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

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

  const handleLink = () => {
    setOpen(false);
  };

  return (
    <header
      className={twMerge(
        "h-16 fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-bg-800"
      )}
    >
      <div className="h-full px-12 relative flex items-center justify-between max-lg:px-4">
        <div className="flex items-center">
          <img src={Logo} alt="app-logo" />
          <h1 className="text-white font-semibold max-[872px]:hidden">
            ecruitify
          </h1>
        </div>
        {isDashboard && (
          <div className="flex h-full items-center py-2 animate-[appear_1s]">
            <ul
              className={twMerge(
                "flex mr-3 bg-bg-800 border-white/30 animate-[appear_.3s]",
                "max-[872px]:border-t max-[872px]:mr-0 max-[872px]:absolute max-[872px]:flex-col max-[872px]:py-4 max-[872px]:w-full max-[872px]:right-0 max-[872px]:top-full max-[872px]:gap-4",
                open ? "flex" : "flex max-[872px]:hidden"
              )}
            >
              <li className="text-sm flex flex-col items-center">
                <NavLink
                  onClick={handleLink}
                  className={({ isActive }) =>
                    twMerge(
                      "px-4 transition-all duration-300",
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
              <li className="text-sm flex flex-col items-center">
                <NavLink
                  onClick={handleLink}
                  className={({ isActive }) =>
                    twMerge(
                      "px-4 transition-all duration-300",
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
              <li className="text-sm flex flex-col items-center">
                <NavLink
                  onClick={handleLink}
                  className={({ isActive }) =>
                    twMerge(
                      "px-4 transition-all duration-300",
                      isActive
                        ? "text-white [&+span]:scale-100"
                        : "text-white/60 [&+span]:scale-0"
                    )
                  }
                  to={ROUTES.SHOPS}
                >
                  Tiendas
                </NavLink>
                <span className="w-12 h-[1px] bg-primary-600 origin-center transition-all duration-300" />
              </li>
              {user?.superadmin && (
                <li className="text-sm flex flex-col items-center">
                  <NavLink
                    onClick={handleLink}
                    className={({ isActive }) =>
                      twMerge(
                        "px-4 transition-all duration-300",
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
              )}
              <li className="text-sm flex flex-col items-center">
                <NavLink
                  onClick={handleLink}
                  className={({ isActive }) =>
                    twMerge(
                      "px-4 transition-all duration-300",
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
            <div className="flex items-center h-full border-l border-white/30 pl-4 max-[872px]:border-r max-[872px]:border-l-0 max-[872px]:pr-4">
              <div className="overflow-hidden flex flex-col items-center">
                <p className="text-primary-600 font-semibold hidden max-[872px]:block">
                  {ROUTENAMES[pathname as ROUTES]}
                </p>
                <select
                  value=""
                  onChange={handleOptions}
                  className="max-w-48 font-bold text-ellipsis bg-bg-800 text-white/80 outline-none ring-0 ring-inset focus:ring-2 transition-all duration-300 rounded-md text-sm hover:opacity-80 cursor-pointer"
                >
                  <option disabled value="">
                    {loading ? "Cargando..." : `¡Bienvenido ${user?.usuario}!`}
                  </option>
                  <option value="logout">Cerrar sesión</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="hidden h-full aspect-square p-2 max-[872px]:block hover:opacity-60 transition-all duration-300"
            >
              <div className="text-white">
                <Icon type={open ? "x" : "list"} />
              </div>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
