import { ReactNode, createContext, useState } from "react";

interface UserDataProps {
    user: UserProps[],
    authUser: (user: UserProps[]) => void,
    logout: () => void,
}

export interface UserProps {
    id: number;
    name: string;
    level: number;
    user: string;
    email: string;
}

interface ChildrenProps {
    children: ReactNode
}

export const AuthContext = createContext({} as UserDataProps);

const AuthProvider = ({children} : ChildrenProps) => {
    const [user, setUser] = useState<UserProps[]>([]);

    const authUser = (user: UserProps[]) => {
        setUser(user);
    }
    
    const logout = () => {
        setUser([]);
        localStorage.removeItem("@bravosSports:user");
        localStorage.removeItem("@bravosSports:lastVisitedRoute");
    }

    return (
        <AuthContext.Provider value={{ user, authUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;