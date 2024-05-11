import api from "@/api";
import { StudentsProps } from "@/pages/students";
import { ReactNode, createContext, useState } from "react";
import toast from "react-hot-toast";


interface ReloadDataProps {
    reloadPage: () => void;
    filterStudentsByClass: (id: number) => void;
    newStudents: StudentsProps[];
    filterId: number;
    verifyUserCreate: (response: boolean) => void;
    createdUser: boolean;
}

interface ChildrenProps {
    children: ReactNode;
}

export const ReloadContext = createContext({} as ReloadDataProps);

const ReloadProvider = ({children}: ChildrenProps) => {
    const [reload, setReload] = useState<Boolean>(false);
    const [newStudents, setNewStudents] = useState<StudentsProps[]>([]);
    const [filterId, setFilterId] = useState(0);
    const [createdUser, setCreatedUser] = useState(false);

    const reloadPage = () => {
        setReload(!reload);
    }

    const verifyUserCreate = (response: boolean) => {
        setCreatedUser(response);
    }

    const filterStudentsByClass = async (id: number) => {
        setFilterId(id);
        
        try {
            if (id == 0) {
                const response = await api.get(`/students`);
    
                setNewStudents(response.data);          
            } else {
                const response = await api.get(`/students/class/${id}`);
    
                setNewStudents(response.data);    
            }
            setCreatedUser(false);
        } catch {
            toast.error("Ocorreu um erro ao buscar os alunos desta turma!");
        }
    }

    return (
        <ReloadContext.Provider value={{reloadPage, filterStudentsByClass, newStudents, filterId, verifyUserCreate, createdUser}}>
            {children}
        </ReloadContext.Provider>
    )
}

export default ReloadProvider;