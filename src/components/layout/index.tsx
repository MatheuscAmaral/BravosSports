import Container from "../container";
import Header from "../header";
import Sidebar from "../sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex bg-gray-50 font-sans">
            <Sidebar/>

            <div className="flex flex-col w-full relative">
                <Header/>
                
                <Container>
                    <Outlet/>
                </Container>
            </div>
        </div>
    )
}

export default Layout;