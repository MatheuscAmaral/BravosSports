import Layout from "@/components/layout";
import { createBrowserRouter } from "react-router-dom";
import Home from "../home";
import Students from "../students";
import GetClass from "../getClass";
import Call from "../call";

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
            }, 
            {
                path: "/buscar",
                element: <GetClass/>
            }, 
            {
                path: "/chamada",
                element: <Call/>
            }
        ]
    }
]);

export default router;