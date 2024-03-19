import Layout from "@/components/layout";
import { createBrowserRouter } from "react-router-dom";
import Home from "../home";

const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Home/>
            }
        ]
    }
]);

export default router;