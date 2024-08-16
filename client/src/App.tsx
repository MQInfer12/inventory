import "react-toastify/dist/ReactToastify.css";
import { HashRouter } from "react-router-dom";
import Routes from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { useCloseFocusTrap } from "./components/ui/focusTrap/useCloseFocusTrap";
import { UserContextProvider } from "./context/userContext";
import { CityContextProvider } from "./context/cityContext";

const queryClient = new QueryClient();

function App() {
  useCloseFocusTrap();
  return (
    <UserContextProvider>
      <CityContextProvider>
        <QueryClientProvider client={queryClient}>
          <ToastContainer position="bottom-left" autoClose={2000} />
          <HashRouter>
            <Routes />
          </HashRouter>
        </QueryClientProvider>
      </CityContextProvider>
    </UserContextProvider>
  );
}

export default App;
