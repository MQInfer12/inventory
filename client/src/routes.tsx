import { Route, Routes } from "react-router-dom";
import Login from "./pages/public/login";
import Layout from "./pages/private/_layout";
import Products from "./pages/private/products";
import { ROUTES } from "./constants/routes";
import Users from "./pages/private/users";
import Categories from "./pages/private/categories";
import Reports from "./pages/private/reports";
import Home from "./pages/private/home";
import Shops from "./pages/private/shops";

const RoutesComponent = () => {
  return (
    <main className="w-screen h-screen bg-bg">
      <Routes>
        <Route path={ROUTES.INDEX} element={<Login />} />
        <Route path={ROUTES.HOME} element={<Layout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.PRODUCTS} element={<Products />} />
          <Route path={ROUTES.USERS} element={<Users />} />
          <Route path={ROUTES.CATEGORIES} element={<Categories />} />
          <Route path={ROUTES.SHOPS} element={<Shops />} />
          <Route path={ROUTES.REPORTS} element={<Reports />} />
        </Route>
      </Routes>
    </main>
  );
};

export default RoutesComponent;
