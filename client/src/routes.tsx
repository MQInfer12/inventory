import { Route, Routes } from "react-router-dom";
import Login from "./pages/public/login";
import Layout from "./pages/private/_layout";
import Products from "./pages/private/products";
import { ROUTES } from "./constants/routes";
import Categories from "./pages/private/categories";
import Reports from "./pages/private/reports";
import Home from "./pages/private/home";
import Shops from "./pages/private/shops";
import Users from "./pages/private/users";
import { useUserContext } from "./context/userContext";
import Redirect from "./pages/public/redirect";
import { useMemo } from "react";
import { useCityContext } from "./context/cityContext";

const RoutesComponent = () => {
  const { user, state } = useUserContext();
  const { city } = useCityContext();
  const initialRoute = useMemo(() => window.location.hash.replace("#", ""), []);

  return (
    <main className="w-screen h-screen bg-bg">
      <Routes>
        <Route path={ROUTES.INDEX} element={<Login />} />
        {state !== "unlogged" && (
          <Route
            path={ROUTES.HOME}
            element={<Layout initialRoute={initialRoute} />}
          >
            <Route path={ROUTES.HOME} element={<Home />} />
            {state !== "loading" && (
              <>
                <Route
                  path={ROUTES.PRODUCTS}
                  element={<Products key={city} />}
                />
                <Route path={ROUTES.CATEGORIES} element={<Categories />} />
                <Route path={ROUTES.SHOPS} element={<Shops />} />
                <Route path={ROUTES.REPORTS} element={<Reports />} />
                <Route
                  path={ROUTES.REPORTS + "/:idProduct"}
                  element={<Reports />}
                />
                {user?.superadmin && (
                  <Route path={ROUTES.USERS} element={<Users />} />
                )}
              </>
            )}
          </Route>
        )}
        <Route path="/*" element={<Redirect />} />
      </Routes>
    </main>
  );
};

export default RoutesComponent;
