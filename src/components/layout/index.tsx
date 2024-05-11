import Container from "../container";
import Header from "../header";
import Sidebar from "../sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {

    return (
      <div className="flex bg-gray-50 h-svh font-sans">
        <div className="hidden xl:flex">
          <Sidebar />
        </div>

        <div className="flex flex-col w-full relative">
          <Header />

          <div className="hidden xl:flex absolute top-9 right-6">
            
          </div>

          <Container>
            <Outlet />
          </Container>
        </div>
      </div>
    );
};

export default Layout;

