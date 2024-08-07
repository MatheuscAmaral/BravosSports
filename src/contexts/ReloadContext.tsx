import api from "@/api";
import { StudentsProps } from "@/pages/students";
import { ReactNode, createContext, useState } from "react";
import toast from "react-hot-toast";
import { RowProps } from "./ModalsContext";

interface ReloadDataProps {
    reloadPage: () => void;
    filterStudentsByClass: (id: number) => void;
    filterStudentsByTeam: (idClass: number, idTeam: number, idUnit: number, time: string) => void;
    filterByUnit: (route: string, idUnit: number) => void;
    saveUnitName: (name: string) => void;
    saveClassName: (name: string) => void;
    saveDayTrainingName: (name: string) => void;
    dayTrainingName: string;
    className: string;
    unitName: string;
    newStudents: StudentsProps[];
    newStudentsCall: StudentsProps[];
    resetData: () => void;
    newData: RowProps[];
    filterId: number;
    teamId: number;
    verifyUserCreate: (response: boolean) => void;
    idClass: number;
    saveClassId: (id: number) => void;
    createdUser: boolean;
    resetNewStudents: () => void
    resetSelect: () => void;
    unitId: number;
    daySaved: string;
    respId: number;
    saveUnitId: (id: number) => void;
    saveDayTraining: (time: string) => void;
    saveResponsibleId: (respId: number) => void;
}

interface ChildrenProps {
    children: ReactNode;
}

export const ReloadContext = createContext({} as ReloadDataProps);

const ReloadProvider = ({children}: ChildrenProps) => {
    const [reload, setReload] = useState<Boolean>(false);
    const [newStudents, setNewStudents] = useState<StudentsProps[]>([]);
    const [newStudentsCall, setNewStudentsCall] = useState<StudentsProps[]>([]);
    const [newData, setNewData] = useState<RowProps[]>([]);
    const [filterId, setFilterId] = useState(0);
    const [teamId, setTeamId] = useState(0);
    const [idClass, setIdClass] = useState(0);
    const [createdUser, setCreatedUser] = useState(false);
    const [unitId, setUnitId] = useState(0);
    const [respId, setRespId] = useState(0);
    const [daySaved, setDaySaved] = useState("");
    const [unitName, setUnitName] = useState("");
    const [className, setClassName] = useState("");
    const [dayTrainingName, setDayTrainingName] = useState("");

    const reloadPage = () => {
        setReload(!reload);
    }

    const saveUnitId = (id: number) => {
        setUnitId(id);
    }

    const saveUnitName = (name: string) => {
        setUnitName(name);
    }

    const saveClassName = (name: string) => {
        setClassName(name);
    }

    const saveDayTrainingName = (name: string) => {
        setDayTrainingName(name);
    }

    const saveResponsibleId = (respId: number) => {
        setRespId(respId);
    }

    const saveDayTraining = (day: string) => {
        setDaySaved(day);
    }

    const verifyUserCreate = (response: boolean) => {
        setCreatedUser(response);
    }

    const filterStudentsByClass = async (id: number) => {   
        try {
            setFilterId(id);
            const response = await api.get(`/students/class/filter/${id}`);
            
            setNewStudents(response.data);     
            setCreatedUser(false);
        } catch {
            toast.error("Ocorreu um erro ao buscar os alunos desta turma!");
        }
    }

    const filterStudentsByTeam = async (idClass: number, idTeam: number, idUnit: number, day: string) => {
        setFilterId(idClass);
        setTeamId(idTeam);
        
        try {
           if (idClass != 0) {
                const response = await api.get(`/students/class/${idClass}/${idTeam}/unit/${idUnit}/day/${day}`);

                setNewStudentsCall(response.data); 
            } else {
                setNewStudentsCall([]);     
            }
            
        } catch {
            toast.error("Ocorreu um erro ao buscar os alunos desta equipe!");
        }
    }

    const filterByUnit = async (route: string, idUnit: number) => {
        try {
            if (idUnit == 999) {
                return setNewData([]);
            }

            const response = await api.get(`${route}/filter/${idUnit}`);
            setNewData(response.data);
        } catch {
            toast.error("Ocorreu um erro ao buscar ao filtrar pela unidade selecionada!");
        }
    }

    const saveClassId = (id: number) => {
        setIdClass(id);
    }

    const resetNewStudents = () => {
        setNewStudentsCall([]);
    }

    const resetSelect = () => {
        setTeamId(999);
    }

    const resetData = () => {
        setNewData([]);
        setNewStudents([]);
    }

    return (
        <ReloadContext.Provider value={{reloadPage, resetData, unitId, saveUnitName, saveClassName, saveDayTrainingName, dayTrainingName, className, unitName, respId, saveResponsibleId, saveUnitId, daySaved, filterStudentsByClass, filterStudentsByTeam, filterByUnit, saveDayTraining, newData, newStudents, newStudentsCall, filterId, teamId, verifyUserCreate, createdUser, resetSelect, resetNewStudents, idClass, saveClassId }}>
            {children}
        </ReloadContext.Provider>
    )
}

export default ReloadProvider;