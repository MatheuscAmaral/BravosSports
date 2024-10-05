import api from "@/api";
import { AuthContext } from "@/contexts/AuthContext";
import { ReloadContext } from "@/contexts/ReloadContext";
import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }: any) => {
    const navigate = useNavigate();
    const { user, authUser, token } = useContext(AuthContext);
    const { resetNewStudents, resetData, saveReason, resetSelect } = useContext(ReloadContext);
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem("@bravosSports:user");
        resetData();
        resetNewStudents();

        const verifyUserReleased = async (user: string, name: string) => {
            const data = {
                user,
                name
            }
            
            try {
                const response = await api.post("/users/checkout", data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                if (response.data.length > 0) {
                    localStorage.setItem("@bravosSports:user", JSON.stringify(response.data[0]));
                } else {
                    toast.error("Usuário não encontrado!", {
                        position: "top-right"
                    });

                    <Navigate to={"/"}/>
                    localStorage.removeItem("@bravosSports:user");
                    localStorage.removeItem("@bravosSports:lastVisitedRoute");
                }
            } catch (error: any) {
                const messageError = error.response.data.errors;

                if (error.response.data.error != "Token inválido!") {    
                    toast.error(messageError, {
                        position: "top-right"
                    });    
                }

                localStorage.removeItem("@bravosSports:user");
                localStorage.removeItem("@bravosSports:lastVisitedRoute");
                navigate("/login");
            }
        }
    
        if (storedUser) { 
            const parsedUser = JSON.parse(storedUser);
            verifyUserReleased(parsedUser.user, parsedUser.name);
            authUser(parsedUser, token);
            localStorage.setItem("@bravosSports:lastVisitedRoute", location.pathname);

            const lastVisitedRoute = localStorage.getItem("@bravosSports:lastVisitedRoute");
            if (lastVisitedRoute) {
                <Navigate to={lastVisitedRoute}/>
                return;
            }
        }

        if (location.pathname != "call") {
            saveReason([]);
            resetSelect();
        }
    }, [location.pathname]);
    
    if (location.pathname == "/alunos" || location.pathname == "/professores" || location.pathname == "/turmas" || location.pathname == "/responsaveis") {
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

    if (location.pathname == "/chamada") {
        const storedUser = localStorage.getItem("@bravosSports:user");

        if (storedUser) {
            if (location.pathname == "/chamada" && JSON.parse(storedUser).level == 3) {
                toast('Você não tem permissão para acessar essa tela!', {
                    icon: '⚠️',
                });

                return <Navigate to={"/"} />
            }
        }
    }
    
    if (location.pathname == "/responsaveis/liberados") {
        const storedUser = localStorage.getItem("@bravosSports:user");

        if (storedUser) {
            if (location.pathname == "/responsaveis/liberados" && (JSON.parse(storedUser).level != 4 && JSON.parse(storedUser).level != 3 && JSON.parse(storedUser).level != 1 && JSON.parse(storedUser).level != 0)) {
                toast('Você não tem permissão para acessar essa tela!', {
                    icon: '⚠️',
                });

                return <Navigate to={"/"} />
            }
        }
    }

    if (location.pathname == "/agendamentos") {
        const storedUser = localStorage.getItem("@bravosSports:user");

        if (storedUser) {
            if (location.pathname == "/agendamentos" && (JSON.parse(storedUser).level != 3 && JSON.parse(storedUser).level != 1 && JSON.parse(storedUser).level != 0)) {
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
