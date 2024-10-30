import api from "@/api";
import { StudentsProps } from "@/pages/students";
import { ReactNode, createContext, useState, useContext } from "react";
import toast from "react-hot-toast";
import { RowProps } from "./ModalsContext";
import { AuthContext } from "./AuthContext";

interface ReloadDataProps {
    reloadPage: () => void;
    filterStudentsByClass: (id: number) => void;
    filterByUnit: (route: string, idUnit: number) => void;
    saveUnitName: (name: string) => void;
    saveClassName: (name: string) => void;
    saveDayTrainingName: (name: string) => void;
    resetData: () => void;
    verifyDataCreate: (response: boolean) => void;
    saveClassId: (id: number) => void;
    resetNewStudents: () => void
    resetSelect: () => void;
    saveUnitId: (id: number) => void;
    saveTeamId: (id: string) => void;
    saveDayTraining: (time: string) => void;
    saveResponsibleId: (respId: number) => void;
    saveReason: (row: RowProps[]) => void;
    saveData: (data: StudentsProps[]) => void;
    filterId: number;
    teamId: string;
    idClass: number;
    createdNewData: boolean;
    dayTrainingName: string;
    className: string;
    unitName: string;
    unitId: number;
    daySaved: string;
    respId: number;
    newData: RowProps[];
    newStudents: StudentsProps[];
    newStudentsCall: StudentsProps[];
    data: StudentsProps[];
    reason: RowProps[];
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
    const [teamId, setTeamId] = useState("999");
    const [idClass, setIdClass] = useState(0);
    const [createdNewData, setCreatedNewData] = useState(false);
    const [unitId, setUnitId] = useState(0);
    const [respId, setRespId] = useState(0);
    const [daySaved, setDaySaved] = useState("");
    const [unitName, setUnitName] = useState("");
    const [className, setClassName] = useState("");
    const [dayTrainingName, setDayTrainingName] = useState("");
    const [reason, setReason] = useState<RowProps[]>([]);
    const [data, setData] = useState<StudentsProps[]>([]);
    const { token } = useContext(AuthContext);

    const reloadPage = () => {
        setReload(!reload);
    }

    const saveUnitId = (id: number) => {
        setUnitId(id);
    }

    const saveUnitName = (name: string) => {
        setUnitName(name);
    }

    const saveReason = (row: RowProps[]) => {
        setReason(row);
    }

    const saveData = (data: StudentsProps[]) => {
        setData(data);
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

    const verifyDataCreate = (response: boolean) => {
        setCreatedNewData(response);
    }

    const filterStudentsByClass = async (id: number) => {   
        try {
            setFilterId(id);
            const response = await api.get(`/students/class/filter/${id}`,  {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setNewStudents(response.data);     
            setCreatedNewData(false);
        } catch {
            toast.error("Ocorreu um erro ao buscar os alunos desta turma!");
        }
    }
    
    const filterByUnit = async (route: string, idUnit: number) => {
        try {
            if (idUnit == 999) {
                return setNewData([]);
            }

            const response = await api.get(`${route}/filter/${idUnit}`,  {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewData(response.data);
        } catch {
            toast.error("Ocorreu um erro ao buscar ao filtrar pela unidade selecionada!");
        }
    }

    const saveTeamId = (id: string) => {
        setTeamId(id);
    }

    const saveClassId = (id: number) => {
        setIdClass(id);
    }

    const resetNewStudents = () => {
        setNewStudentsCall([]);
    }

    const resetSelect = () => {
        setTeamId("999");
    }

    const resetData = () => {
        setNewData([]);
        setNewStudents([]);
    }

    return (
        <ReloadContext.Provider value={{reloadPage, resetData, unitId, saveUnitName, saveTeamId,  saveClassName, saveData, data, saveDayTrainingName, dayTrainingName, className, unitName, respId, saveResponsibleId, reason, saveReason, saveUnitId, daySaved, filterStudentsByClass, filterByUnit, saveDayTraining, newData, newStudents, newStudentsCall, filterId, teamId, verifyDataCreate, createdNewData, resetSelect, resetNewStudents, idClass, saveClassId }}>
            {children}
        </ReloadContext.Provider>
    )
}

export default ReloadProvider;