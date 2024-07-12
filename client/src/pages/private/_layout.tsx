import Navbar from "@/components/ui/navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar isDashboard />
      <main className="flex flex-col h-full pt-16 animate-[appear_1s]">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
