import Layout from "@/components/layout";
import { createBrowserRouter } from "react-router-dom";
import Home from "../home";
import Students from "../students";
import Call from "../call";
import Settings from "../settings";
import Classes from "../classes";
import Teachers from "../teachers";
import Auth from "../auth";
import PrivateRoute from "./PrivateRoute";
import Responsibles from "../responsibles";
import Sports from "../sports";
import ResponsiblesReleased from "../responsibles/responsiblesReleased";
import ScheduleAbsence from "../responsibles/scheduleAbsence";

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
        path: "/agendar",
        element: (
          <PrivateRoute>
            <ScheduleAbsence />
          </PrivateRoute>
        ),
      },
      {
        path: "/responsaveis/liberados",
        element: (
          <PrivateRoute>
            <ResponsiblesReleased />
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
        path: "/esportes",
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
