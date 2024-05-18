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
import Teachers from "../teachers";
import Auth from "../auth";
import PrivateRoute from "./PrivateRoute";
import Responsibles from "../responsibles";
import Sports from "../teams";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "/alunos",
        element: (
          <PrivateRoute>
            <Students />
          </PrivateRoute>
        ),
      },
      {
        path: "/buscar",
        element: (
          <PrivateRoute>
            <GetClass />
          </PrivateRoute>
        ),
      },
      {
        path: "/professores",
        element: (
          <PrivateRoute>
            <Teachers />
          </PrivateRoute>
        ),
      },
      {
        path: "/responsaveis",
        element: (
          <PrivateRoute>
            <Responsibles />
          </PrivateRoute>
        ),
      },
      {
        path: "/chamada",
        element: (
          <PrivateRoute>
            <Call />
          </PrivateRoute>
        ),
      },
      {
        path: "/controle/alunos",
        element: (
          <PrivateRoute>
            <ControllStudents />
          </PrivateRoute>
        ),
      },
      {
        path: "/controle/chamada",
        element: (
          <PrivateRoute>
            <ControllCall />
          </PrivateRoute>
        ),
      },
      {
        path: "/configuracoes",
        element: (
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        ),
      },
      {
        path: "/turmas",
        element: (
          <PrivateRoute>
            <Classes />
          </PrivateRoute>
        ),
      },
      {
        path: "/equipes",
        element: (
          <PrivateRoute>
            <Sports />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Auth />,
  },
]);

export default router;
