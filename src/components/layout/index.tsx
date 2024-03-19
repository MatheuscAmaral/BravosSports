import Sidebar from "../sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex bg-gray-50 font-sans">
            <Sidebar/>
            <Outlet/>
        </div>
    )
}

export default Layout;