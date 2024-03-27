import { ReactNode, createContext, useState } from "react";

interface UserDataProps {
    user: string,
    authUser: (user: string) => void,
    logout: () => void,
}

interface ChildrenProps {
    children: ReactNode
}

export const AuthContext = createContext({} as UserDataProps);

const AuthProvider = ({children} : ChildrenProps) => {
    const [user, setUser] = useState<string>("");

    const authUser = (user: string) => {
        setUser(user);
    }
    
    const logout = () => {
        setUser("");
    }

    return (
        <AuthContext.Provider value={{user, authUser, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;