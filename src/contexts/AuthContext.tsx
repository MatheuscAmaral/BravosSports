import { ReactNode, createContext, useState } from "react";

interface UserDataProps {
    user: UserProps[],
    authUser: (user: UserProps[]) => void,
    logout: () => void,
    username: string,
}

export interface UserProps {
    id: number;
    name: string;
    level: number;
    user: string;
    email: string;
    complete_register: number;
}

interface ChildrenProps {
    children: ReactNode
}

export const AuthContext = createContext({} as UserDataProps);

const AuthProvider = ({children} : ChildrenProps) => {
    const [user, setUser] = useState<UserProps[]>([]);
    const [username, setUsername] = useState("");

    const authUser = (user: UserProps[]) => {
        setUser(user);
        setUsername((user as unknown as UserProps).name);
    }
    
    const logout = () => {
        setUser([]);
        localStorage.removeItem("@bravosSports:user");
        localStorage.removeItem("@bravosSports:lastVisitedRoute");
    }

    return (
        <AuthContext.Provider value={{ user, authUser, logout, username }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;