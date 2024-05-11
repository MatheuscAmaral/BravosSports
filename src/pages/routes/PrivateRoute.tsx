import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }: any) => {
    const { user, authUser } = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem("@bravosSports:user");
    
        if (storedUser) { 
            const parsedUser = JSON.parse(storedUser);
            authUser(parsedUser);
            localStorage.setItem("@bravosSports:lastVisitedRoute", location.pathname);

            const lastVisitedRoute = localStorage.getItem("@bravosSports:lastVisitedRoute");
            if (lastVisitedRoute) {
                <Navigate to={lastVisitedRoute}/>
                return;
            }
        }
    }, [location.pathname]);
    
    if (location.pathname == "/alunos" || location.pathname == "/professores" || location.pathname == "/turmas" || location.pathname == "/responsaveis" ) {
        const storedUser = localStorage.getItem("@bravosSports:user");

        if (storedUser) {
            if (JSON.parse(storedUser).level != 0 && JSON.parse(storedUser).level != 1) {
                toast('Você não tem permissão para acessar essa tela!', {
                    icon: '⚠️',
                  });

                return <Navigate to={"/"} />
            }
        }

    }

    return user.length <= 0 ? <Navigate to={"/login"} /> : children;
}

export default PrivateRoute;
