import { ReactNode, createContext, useState } from "react";


interface ReloadDataProps {
    reloadPage: () => void;
}

interface ChildrenProps {
    children: ReactNode;
}

export const ReloadContext = createContext({} as ReloadDataProps);

const ReloadProvider = ({children}: ChildrenProps) => {
    const [reload, setReload] = useState<Boolean>(false);

    const reloadPage = () => {
        setReload(!reload);
    }

    return (
        <ReloadContext.Provider value={{reloadPage}}>
            {children}
        </ReloadContext.Provider>
    )
}

export default ReloadProvider;