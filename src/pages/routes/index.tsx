import Layout from "@/components/layout";
import { createBrowserRouter } from "react-router-dom";
import Home from "../home";
import Students from "../students";
import GetClass from "../getClass";
import Call from "../call";
import ControllCall from "../portaria/call";
import ControllStudents from "../portaria/students";
import Settings from "../settings";
import Classes from "../classes";

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
            }, 
            {
                path: "/controle/alunos",
                element: <ControllStudents/>
            },
            {
                path: "/controle/chamada",
                element: <ControllCall/>
            },
            {
                path: "/configuracoes",
                element: <Settings/>
            }, 
            {
                path: "/turmas",
                element: <Classes/>
            }
        ]
    }
]);

export default router;