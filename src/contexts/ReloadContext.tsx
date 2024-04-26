import api from "@/api";
import { StudentsProps } from "@/pages/students";
import { ReactNode, createContext, useState } from "react";
import toast from "react-hot-toast";


interface ReloadDataProps {
    reloadPage: () => void;
    filterStudentsByClass: (id: number) => void;
    newStudents: StudentsProps[];
}

interface ChildrenProps {
    children: ReactNode;
}

export const ReloadContext = createContext({} as ReloadDataProps);

const ReloadProvider = ({children}: ChildrenProps) => {
    const [reload, setReload] = useState<Boolean>(false);
    const [newStudents, setNewStudents] = useState<StudentsProps[]>([]);

    const reloadPage = () => {
        setReload(!reload);
    }

    const filterStudentsByClass = async (id: number) => {
        try {
            if (id == 0) {
                const response = await api.get(`/students`);
    
                setNewStudents(response.data);          
            } else {
                const response = await api.get(`/students/class/${id}`);
    
                setNewStudents(response.data);    
            }

        } catch {
            toast.error("Ocorreu um erro ao buscar os alunos desta turma!");
        }
    }

    return (
        <ReloadContext.Provider value={{reloadPage, filterStudentsByClass, newStudents}}>
            {children}
        </ReloadContext.Provider>
    )
}

export default ReloadProvider;