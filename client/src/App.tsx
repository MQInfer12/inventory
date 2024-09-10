import "react-toastify/dist/ReactToastify.css";
import { HashRouter } from "react-router-dom";
import Routes from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { useCloseFocusTrap } from "./components/ui/focusTrap/useCloseFocusTrap";

const queryClient = new QueryClient();

function App() {
  useCloseFocusTrap();
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer position="bottom-left" autoClose={2000} />
      <p className="fixed bottom-0 right-0 px-2 py-[2px] text-xs bg-primary-700 text-white rounded-tl-md z-20">
        v{APP_VERSION}
      </p>
      <HashRouter>
        <Routes />
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
