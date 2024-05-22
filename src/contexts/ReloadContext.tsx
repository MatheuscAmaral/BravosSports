import api from "@/api";
import { StudentsProps } from "@/pages/students";
import { ReactNode, createContext, useState } from "react";
import toast from "react-hot-toast";


interface ReloadDataProps {
    reloadPage: () => void;
    filterStudentsByClass: (id: number) => void;
    filterStudentsByTeam: (idClass: number, idTeam: number) => void;
    newStudents: StudentsProps[];
    newStudentsCall: StudentsProps[];
    filterId: number;
    teamId: number;
    verifyUserCreate: (response: boolean) => void;
    idClass: number;
    saveClassId: (id: number) => void;
    createdUser: boolean;
    resetNewStudents: () => void; 
}

interface ChildrenProps {
    children: ReactNode;
}

export const ReloadContext = createContext({} as ReloadDataProps);

const ReloadProvider = ({children}: ChildrenProps) => {
    const [reload, setReload] = useState<Boolean>(false);
    const [newStudents, setNewStudents] = useState<StudentsProps[]>([]);
    const [newStudentsCall, setNewStudentsCall] = useState<StudentsProps[]>([]);
    const [filterId, setFilterId] = useState(0);
    const [teamId, setTeamId] = useState(0);
    const [idClass, setIdClass] = useState(0);
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

    const filterStudentsByTeam = async (idClass: number, idTeam: number) => {
        setFilterId(idClass);
        setTeamId(idTeam);
        
        try {
           if (idClass != 0) {
                const response = await api.get(`/students/class/${idClass}/${idTeam}`);

                setNewStudentsCall(response.data); 
            } else {
                setNewStudentsCall([]); 
            }
            
        } catch {
            toast.error("Ocorreu um erro ao buscar os alunos desta equipe!");
        }
    }

    const saveClassId = (id: number) => {
        setIdClass(id);
    }

    const resetNewStudents = () => {
        setNewStudentsCall([]);
    }

    return (
        <ReloadContext.Provider value={{reloadPage, filterStudentsByClass, filterStudentsByTeam, newStudents, newStudentsCall, filterId, teamId, verifyUserCreate, createdUser, resetNewStudents, idClass, saveClassId}}>
            {children}
        </ReloadContext.Provider>
    )
}

export default ReloadProvider;