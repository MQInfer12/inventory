import { ROUTES } from "@/constants/routes";
import { useUserContext } from "@/context/userContext";
import { Navigate } from "react-router-dom";

const Redirect = () => {
  const { state } = useUserContext();
  if (state !== "unlogged") return <Navigate to={ROUTES.HOME} />;
  return <Navigate to={ROUTES.INDEX} />;
};

export default Redirect;
