import Layout from "@/components/layout";
import { createBrowserRouter } from "react-router-dom";
import Home from "../home";
import Students from "../students";

const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Home/>
            }, 
            {
                path: "/alunos",
                element: <Students/>
            }
        ]
    }
]);

export default router;