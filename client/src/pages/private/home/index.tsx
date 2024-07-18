import { ROUTES } from "@/constants/routes";
import { Navigate } from "react-router-dom";

const Home = () => {
  return <Navigate to={ROUTES.PRODUCTS} />;
};

export default Home;
