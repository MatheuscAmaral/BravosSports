import {
  FormEvent,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { DataTable, UnitsProps } from "@/components/table/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import { MdContentPasteSearch } from "react-icons/md";
import noFoto from "../assets/noFoto.jpg";
import Datepicker from "tailwind-datepicker-react";
import { Button } from "@/components/ui/button";
import { TbLoader3 } from "react-icons/tb";
import SelectReact from "react-select";
import { Input } from "@/components/ui/input";
import { StudentsProps } from "@/pages/students";
import { IoIosImages } from "react-icons/io";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaTrash } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ClassesProps } from "@/pages/classes";
import { ResponsibleProps } from "@/components/table/dataTable";
import toast from "react-hot-toast";
import api from "@/api";
import { ReloadContext } from "./ReloadContext";
import MaskedInput from "@/components/InputMask";
import { AuthContext, UserProps } from "./AuthContext";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { Modal } from "flowbite-react";
import { FiAlertOctagon } from "react-icons/fi";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { SportsProps } from "@/pages/sports";

export interface RowProps {
  user_id: any;
  id: number;
  image: string;
  sport_id: number;
  name: string;
  comments_call: string;
  general_comments: string;
  responsible_name: string;
  responsible: number;
  free_view_coordinator: number;
  has_registration_number: boolean;
  image_contract: boolean;
  exit_autorization: boolean;
  contract: boolean;
  uniform: boolean;
  class: number;
  phone: string;
  status: number;
  status_call: number;
  description: string;
  modality: string;
  category: string;
  teacher_id: number;
  userId: string;
  team: string;
  presence: boolean | number;
  id_responsible: number;
  days_training: string;
  date_of_birth: string;
  schedule_by_responsible: number;
  unit: number;
  id_call: number;
  date: string;
  comments: string;
  desc_unit: string;
  class_time: Date;
  degree_kinship: string;
}

interface ModalProps {
  getData: (row: [], type: string) => void;
  open: (row: RowProps[], data: string, type: string) => void;
}

interface ChildrenProps {
  children: ReactNode;
}

const columnsStudentClass: ColumnDef<RowProps>[] = [
  {
    accessorKey: "image",
    header: "Foto",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <div className="w-12 h-12 overflow-hidden rounded-full">
          <img
            src={row.getValue("image") ? row.getValue("image") : noFoto}
            className="w-full h-full object-cover"
            style={{ borderRadius: "10%" }}
          />
        </div>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "id",
    header: "Matrícula",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("status") == "0" && "Inativo"}

        {row.getValue("status") == "1" && "Pendente"}

        {row.getValue("status") == "2" && "Ativo"}
      </div>
    ),
  },
];

const columnsResponsibleRealeaseds: ColumnDef<RowProps>[] = [
  {
    accessorKey: "image",
    header: "Foto",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <div className="w-12 h-12 overflow-hidden rounded-full">
          <img
            src={row.getValue("image") ? row.getValue("image") : noFoto}
            className="w-full h-full object-cover"
            style={{ borderRadius: "10%" }}
          />
        </div>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "degree_kinship",
    header: "Grau de parentesco",
    cell: ({ row }) => <div>{row.getValue("degree_kinship")}</div>,
  },
];

const columnsClass: ColumnDef<RowProps>[] = [
  {
    accessorKey: "description",
    header: () => {
      return "Descrição";
    },
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("status") == 0 && "Inativo"}

        {row.getValue("status") == 1 && "Ativo"}
      </div>
    ),
  },
];

export const modalContext = createContext({} as ModalProps);

const ModalProvider = ({ children }: ChildrenProps) => {
  const { user, username } = useContext(AuthContext);
  const {
    filterStudentsByClass,
    reloadPage,
    verifyDataCreate,
    filterId,
    saveReason,
  } = useContext(ReloadContext);
  const [openModal, setOpenModal] = useState(false);
  const [openModalStudent, setOpenModalStudent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState("");
  const [type, setType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");
  const [degreeKinship, setDegreeKinship] = useState("");
  const [classesDisp, setClassesDisp] = useState<ClassesProps[]>([]);
  const [units, setUnits] = useState("");
  const [unitsDisp, setUnitsDisp] = useState<UnitsProps[]>([]);
  const [classTime, setClassTime] = useState("");
  const [classTimeCall, setClassTimeCall] = useState("");
  const [classes, setClasses] = useState("");
  const [id, setId] = useState("");
  const [idCall, setIdCall] = useState("");
  const [description, setDescription] = useState("");
  const [modality, setModality] = useState("");
  const [isStudent, setIsStudent] = useState("");
  const [generalComments, setGeneralComments] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);
  const [imageContract, setImageContract] = useState("");
  const [uniform, setUniform] = useState("");
  const [hasRegistrationNumber, setHasRegistrationNumber] = useState("");
  const [contract, setContract] = useState("");
  const [exitAutorization, setExitAutorization] = useState("");
  const [name, setName] = useState("");
  const [daysTraining, setDaysTraining] = useState("");
  const [teamsDisp, setTeamsDisp] = useState<ClassesProps[]>([]);
  const [row, setRow] = useState<RowProps[]>([]);
  const [students, setStudents] = useState<StudentsProps[]>([]);
  const [teacherClass, setTeacherClass] = useState<ClassesProps[]>([]);
  const [userId, setUserId] = useState("");
  const [optionTabsStudent, setOptionTabsStudent] = useState("dataStudent");
  const [date, setDate] = useState("");
  const [modalMaxHeight, setModalMaxHeight] = useState("500px");
  const [reasonData, setReasonData] = useState("");
  const [comments, setComments] = useState("");
  const [dateSelectAbsence, setDateSelectAbsence] = useState<Date | string>();
  const [dateAbsence, setDateAbsence] = useState("");
  const hostName = window.location.hostname;
  const [responsibleRealeaseds, setResponsibleRealeaseds] = useState<
    ResponsibleProps[]
  >([]);
  const [sportsDisp, setSportsDisp] = useState<
  { value: number; label: string; class: number }[]
>([]);
const [sportsSelect, setSportsSelect] = useState<
  { value: number; label: string }[]
>([]);
const [sportsSelectOld, setSportsSelectOld] = useState<
  { value: number; label: string; }[]
>([]);
  const [show, setShow] = useState<boolean>(false);

  const optionsDate = {
    title: "",
    autoHide: true,
    todayBtn: false,
    clearBtn: false,
    maxDate: new Date("2030-01-01"),
    minDate: new Date("1950-01-01"),
    theme: {
      background: "bg-white",
      todayBtn: "bg-primary-color",
      clearBtn: "",
      icons: "",
      text: "",
      disabledText: "bg-gray-100",
      input: "",
      inputIcon: "",
      selected: "bg-primary-color",
    },
    icons: {
      prev: () => (
        <span>
          <IoChevronBackOutline />
        </span>
      ),
      next: () => (
        <span>
          <IoChevronForward />
        </span>
      ),
    },
    datepickerClassNames: "top-12",
    defaultDate: new Date("2022-01-01"),
    language: "pt-br",
    disabledDates: [],
    weekDays: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
    inputNameProp: "date",
    inputIdProp: "date",
    inputDateFormatProp: {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 375) {
        setModalMaxHeight("290px");
      } else {
        setModalMaxHeight("540px");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (selectedDate: Date) => {
    setDate(selectedDate.toLocaleDateString("pt-BR"));
  };

  const handleClose = (state: boolean) => {
    setShow(state);
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
  };

  const changeDateAbsence = (e: Date) => {
    setDateSelectAbsence(e);
    setDateAbsence(
      convertDateFormat(e.toLocaleDateString("pt-BR").replace(/\//g, "-"))
    );
  };

  function convertDateFormat(dateStr: string) {
    const [dd, mm, yyyy] = dateStr.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }

  const saveImage = async () => {
    if (!file) {
      toast.error("Por favor, selecione um arquivo para fazer upload.");
      return "error"; 
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post(
        `${hostName === "localhost" ? "http://localhost:3333/upload" : "https://bravos-api-2-0.vercel.app/upload"}`,
        formData,
      );
  
      return response.data.url; 
    } catch (error) {
      console.error("Upload error:", error); 
      toast.error("Ocorreu um erro ao salvar a imagem!");
      return "error";
    }
  };

const trashImages = () => {
  setLink("")
}
  

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];

  if (selectedFile) {
    setFile(selectedFile);
    setLink(URL.createObjectURL(selectedFile)); 
  }
};

  const getSportsSelect = async (id: number) => {
    try {
        const response = await api.get(`/sports/played/${id}`);

        const formatedData = response.data.map((d: SportsProps) => ({
          value: d.sport_id,
          label: d.description
        }));

        setSportsSelect(formatedData);
        setSportsSelectOld(formatedData);
    } catch (error: any) {
        toast.error(error);
    }
  }

  const getData = async (row: RowProps[], type: string) => {
    setLink(row[0].image);
    setId(String(row[0].id));

    type != "agendarFalta"
    ? setStatus(String(row[0].status))
      : setStatus(String(row[0].status_call));
      

    if (type == "students") {
      setName(String(row[0].name));
      setClasses(String(row[0].class));
      setPhone(String(row[0].phone));
      setDate(String(row[0].date_of_birth));
      setClassTime(
        row[0].class_time != null
          ? String(row[0].class_time).split(":")[0] +
              ":" +
              String(row[0].class_time).split(":")[1]
          : ""
      );
      console.log(row[0].class_time != null
        ? String(row[0].class_time).split(":")[0] +
            ":" +
            String(row[0].class_time).split(":")[1]
        : "")
      setDaysTraining(
        row[0].days_training != null ? String(row[0].days_training) : ""
      );
      setHasRegistrationNumber(String(row[0].has_registration_number));
      setImageContract(String(row[0].image_contract));
      setContract(String(row[0].contract));
      setUniform(String(row[0].uniform));
      setExitAutorization(String(row[0].exit_autorization));
      await getClasses(row[0].class);
      await getSportsSelect(row[0].id);
    }

    if (type == "generalComments") {
      setGeneralComments(row[0].general_comments);
    }

    if (type == "classes") {
      setUnits(String(row[0].unit));
      setDescription(String(row[0].description));
    }

    if (type == "units") {
      setId(String(row[0].id));
    }

    if (type == "agendarFalta") {
      const adjustedDate = row[0].date
        ? addDays(new Date(String(row[0].date)), 1)
        : undefined;

      setDateSelectAbsence(adjustedDate);
      setDateAbsence(String(row[0].date));
      setComments(String(row[0].comments));
      setIdCall(String(row[0].id_call));
      setName(String(row[0].name));
      setId(String(row[0].id));
      setClassTimeCall(String(row[0].class_time));
    }

    if (type == "esportes") {
      setUnits(String(row[0].unit));
      setDescription(String(row[0].description));
      setModality(String(row[0].modality));
      setClasses(String(row[0].class));
      setId(String(row[0].id));
    }

    if (type == "responsibles" || type == "responsibles_released") {
      setName(String(row[0].name));
      setUnits(String(row[0].unit));
      setPhone(String(row[0].phone));
      setDegreeKinship(String(row[0].degree_kinship));
    }

    if (type == "call") {
      setId(String(row[0].id_responsible));
    }

    if (type == "teacher") {
      setUnits(String(row[0].unit));
      setName(row[0].name);
      setPhone(row[0].phone);
      setUserId(row[0].userId);
    }

    if (type == "teacherClass") {
      await getClassesOfTeacher(row[0].id);
    }

    if (type == "studentsClass") {
      try {
        const response = await api.get(`/students/class/${row[0].id}`);

        setStudents(response.data);
        setModalData(`Alunos ${row[0].description}`);
      } catch {
        toast.error("Ocorreu um erro ao buscar os dados do aluno!");
      }
    }

    if (type == "call") {
      try {
        const response = await api.get(
          `/responsibles/releaseds/${row[0].user_id}`
        );

        setResponsibleRealeaseds(response.data);
      } catch {
        toast.error("Ocorreu um erro ao buscar os responsáveis disponíveis!");
      }
    }

    setUnits(String(row[0].unit));
  };

  const getUnits = async () => {
    try {
      const response = await api.get("/units");

      setUnitsDisp(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar as unidades disponíveis!");
    }
  };

  const getClasses = async (classId: number) => {
    try {
      const response = await api.get("/classes");

      if (classId != 999) {
        const classSelected = response.data.filter(
          (s: { id: number }) => s.id == classId
        );
        const className = classSelected[0].description.toLowerCase();
        const isStudentValue = className.split(" ")[0] == "não" ? "0" : "1";

        setIsStudent(isStudentValue);

        const newClassDips = response.data.filter(
          (r: { unit: number; description: string }) => {
            const classNameFilter = r.description.toLowerCase();
            const isStudentFilter =
              classNameFilter.split(" ")[0] == "não" ? "0" : "1";

            return (
              r.unit == classSelected[0].unit &&
              isStudentFilter == isStudentValue
            );
          }
        );

        return setClassesDisp(newClassDips);
      }

      setClassesDisp(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar as turmas disponíveis!");
    }
  };

  const changeIsStudent = (e: string) => {
    setIsStudent(e);

    if (units != "") {
      filterUnitWithClass(units, e);
    }
  };

  const filterUnitWithClass = async (e: string, isStudent: string) => {
    setClasses("");
    setUnits(e);

    const response = await api.get(`/classes/filter/${e}`);

    if (isStudent == "0") {
      const newData = response.data.filter((d: { description: string }) => {
        const description = d.description.toLocaleLowerCase();
        return description.split(" ")[0] === "não";
      });

      return setClassesDisp(newData);
    } else {
      const newData = response.data.filter((d: { description: string }) => {
        const description = d.description.toLocaleLowerCase();
        return description.split(" ")[0] != "não";
      });

      return setClassesDisp(newData);
    }
  };

  const getSports = async () => {
    try {
      const response = await api.get("/sports");

      const formatedData = response.data.map((d: SportsProps) => ({
        value: d.id,
        label: d.description,
        class: d.class,
      }));

      setSportsDisp(formatedData);
      setTeamsDisp(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar as equipes disponíveis!");
    }
  };

  const getClassesOfTeacher = async (id: number) => {
    try {
      const response = await api.get(`/sports/teacher/${id}`);

      setTeacherClass(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar as turmas do professor!");
    }
  };

  const open = async (row: RowProps[], data: string, type: string) => {
    type != "call" && (await getUnits());
    setModalData(data);
    setType(type);
    getData(row, type);
    setRow(row);

    if (type == "students") {
      setOpenModalStudent(true);
      setLoading(true);
      await getSports();
      setLoading(false);
    } else {
      setOpenModal(true);
    }

    if (type == "esportes") {
      await getClasses(999);
    }

  };

  const closeModal = () => {
    setError(false);
    setOpenModal(false);
    setOpenModalStudent(false);
    setOptionTabsStudent("dataStudent");
    setName("");
    setClasses("");
    setSportsDisp([]);
    setSportsSelect([]);
    setPhone("");
    setId("");
    setDescription("");
    setModality("");
    setId("");
    setUserId("");
    setDate("");
    setClassTime("");
    setClassTimeCall("");
    setUnits("");
    setDaysTraining("");
    handlePhoneChange("");
    setDateAbsence("");
    setDateSelectAbsence("");
    setComments("");
    setShow(false);
  };

  function parseTime(timeString: string) {
    let [hours, minutes, seconds] = timeString.split(":").map(Number);
    let date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  }

  const validationTimeClass = () => {
    const dateToday = new Date();
    const formatedDateToday = convertDateFormat(
      dateToday.toLocaleDateString().replace(/\//g, "-")
    );
    const formatedDateSelect = dateAbsence;

    if (formatedDateToday == formatedDateSelect) {
      const hour = dateToday.toLocaleTimeString().split(":")[0];
      const minute = dateToday.toLocaleTimeString().split(":")[1];
      const formattedTime = parseTime(hour + ":" + minute + ":00");
      const formattedTimeClass = parseTime(classTimeCall);

      let differenceInMillis =
        formattedTimeClass.getTime() - formattedTime.getTime();
      let differenceInMinutes = Math.floor(differenceInMillis / 1000 / 60);

      if (differenceInMinutes <= 30) {
        toast.error(
          "Só é permitido agendar uma falta até 30 minutos antes do início da aula!",
          {
            position: "top-right",
          }
        );

        return true;
      }
    }

    return false;
  };

  const editData = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let data;
    let verifyIfSaveImage;

    const classTimeOptions: { [key: string]: string } = {
        "1970-01-01T13:15": new Date("1970-01-01T13:15:00.000Z").toISOString(),
        "1970-01-01T17:30": new Date("1970-01-01T17:30:00.000Z").toISOString(),
        "1970-01-01T18:20": new Date("1970-01-01T18:20:00.000Z").toISOString(),
        "1970-01-01T18:30": new Date("1970-01-01T18:30:00.000Z").toISOString()
    };

    if (file) {
      verifyIfSaveImage = await saveImage();

      if (verifyIfSaveImage == "error") {
        setLoading(false);
        return;
      }
    }

    if (type == "reasonAbsence") {
      row[0].comments_call = reasonData;
      row[0].presence = 0;
      saveReason(row);
    }

    if (type == "generalComments") {
      row[0].general_comments = generalComments;
      saveReason(row);
    }

    if (type == "students") {
      data = {
        image: verifyIfSaveImage,
        name: name,
        date_of_birth: date,
        status: status,
        class: classes,
        unit: units,
        has_registration_number:
          hasRegistrationNumber != "" && hasRegistrationNumber == "true"
            ? true
            : false,
        image_contract:
          imageContract != "" && imageContract == "true" ? true : false,
        exit_autorization:
          exitAutorization != "" && exitAutorization == "true" ? true : false,
        contract: contract != "" && contract == "true" ? true : false,
        uniform: uniform != "" && uniform == "true" ? true : false,
        ...(sportsSelect != sportsSelectOld && { sports: sportsSelect } ),
        ...(daysTraining != "" && { days_training: daysTraining }),
        ...(classTime && { class_time: classTimeOptions[classTime] })
      };

      if (!link) {
        toast("É necessário que o aluno possua uma foto cadastrada!", {
          position: "top-right",
          icon: "⚠️",
        });

        setError(true);
        return;
      }
    }

    if (type == "teacher") {
      data = {
        image: verifyIfSaveImage,
        name: name,
        phone: phone,
        userId: userId,
        status: status,
      };

      if (!link) {
        toast("É necessário que o professor possua uma foto cadastrada!", {
          position: "top-right",
          icon: "⚠️",
        });

        setError(true);

        return;
      }
    }

    if (type == "users") {
      data = {
        status: status,
      };
    }

    if (type == "units") {
      data = {
        status: status,
      };
    }

    if (type == "classes") {
      data = {
        description: description,
        unit: units,
        status: status,
      };
    }

    if (type == "esportes") {
      data = {
        description: description,
        modality: modality,
        unit: units,
        status: status,
      };
    }

    if (type == "agendarFalta") {
      data = {
        registration: id,
        date: dateAbsence,
        comments: comments,
        edit_by: username,
        student_name: name,
        status: status,
      };
    }

    if (type == "responsibles" || type == "responsibles_released") {
      data = {
        image: verifyIfSaveImage,
        name: name,
        phone: phone,
        degree_kinship: degreeKinship != "" ? degreeKinship : null,
        status: status,
      };

      if (!link && degreeKinship) {
        toast("É necessário que o responsável possua uma foto cadastrada!", {
          position: "top-right",
          icon: "⚠️",
        });

        setError(true);

        return;
      }
    }

    if (type === "agendarFalta" && validationTimeClass()) {
      return;
    }

    try {
      setLoading(true);
      type == "students" && (await api.put(`/students/${id}`, data));
      type == "classes" && (await api.put(`/classes/${id}`, data));
      type == "units" && (await api.put(`/units/${id}`, data));
      type == "esportes" && (await api.put(`/sports/${id}`, data));
      type == "teacher" && (await api.put(`/teachers/${id}`, data));
      type == "users" && (await api.put(`/users/${id}`, data));
      type == "responsibles" && (await api.put(`/responsibles/${id}`, data));
      type == "responsibles_released" &&
        (await api.put(`/responsibles/releaseds/${id}`, data));
      type == "agendarFalta" && (await api.put(`/call/${idCall}`, data));

      let message = "";
      if (
        type === "students" ||
        type === "teacher" ||
        type === "responsibles" ||
        type === "responsibles_released"
      ) {
        message = (data && data.name) + " editado com sucesso!";
      } else if (data && "description" in data) {
        message = data.description + " editado com sucesso!";
      } else {
        message = "Chamada editada com sucesso!";
      }

      if (type != "reasonAbsence" && type != "generalComments") {
        toast.success(message);
        filterStudentsByClass(filterId);
        reloadPage();
        verifyDataCreate(true);
      }

      setError(false);
      closeModal();
    } catch (error: any) {
      type == "agendarFalta"
        ? toast.error(error.response.data.error, {
            position: "top-right",
          })
        : toast.error(
            `Ocorreu um erro ao editar os dados de ${
              data &&
              (data && "description" in data ? data.description : data.name)
            }`
          );
    } finally {
      setLoading(false);
    }
  };

  return (
    <modalContext.Provider value={{ getData, open }}>
      {children}
      <Modal show={openModal} onClose={() => closeModal()}>
        <Modal.Header>{modalData}</Modal.Header>
        <form onSubmit={(e) => editData(e)}>
          <Modal.Body
            className="relative overflow-auto"
            style={{ maxHeight: modalMaxHeight }}
          >
            <div
              className={`${
                type != "studentsClass" &&
                type != "teacherClass" &&
                type != "units" &&
                type != "users" &&
                "space-y-6"
              }`}
            >
              {(type == "teacher" ||
                type == "responsibles_released" ||
                type == "responsibles") && (
                <div
                  className={`${
                    link != "" ? "h-64" : "h-48"
                  } flex justify-center transition-all w-full border-dashed ${
                    error && !link && "border-red-500"
                  } border-2 rounded-lg relative text-md font-medium text-gray-700`}
                >
                  <input
                    onChange={(e) => handleFileChange(e)}
                    type="file"
                    name="image"
                    accept="image/png, image/jpeg"
                    id="image"
                    className="absolute cursor-pointer top-0 w-full h-48 opacity-0"
                  />

                  {link ? (
                    <div className="flex justify-center">
                      <svg className="p-10 flex justify-center">
                        <image href={link} className="my-class w-80" />
                      </svg>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 items-center justify-center ">
                      <IoIosImages fontSize={40} />
                      <p className="w-full text-sm md:text-lg">
                        Clique aqui para selecionar uma imagem.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {type == "reasonAbsence" && (
                <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                  <label htmlFor="reason">
                    Motivo: <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="reason"
                    name="reason"
                    placeholder="Digite o motivo da falta..."
                    onChange={(e) => setReasonData(e.target.value)}
                    value={reasonData}
                    required
                  />
                </div>
              )}

              {type == "responsibles" && (
                <>
                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="name">
                      Nome: <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Digite o nome do responsável..."
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="phone">
                      Telefone: <span className="text-red-500">*</span>
                    </label>
                    <MaskedInput value={phone} onChange={handlePhoneChange} />
                  </div>
                </>
              )}

              {type == "responsibles_released" && (
                <>
                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="name">
                      Nome: <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Digite o nome do responsável..."
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="phone">
                      Telefone: <span className="text-red-500">*</span>
                    </label>
                    <MaskedInput value={phone} onChange={handlePhoneChange} />
                  </div>

                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="status">
                      Grau de parentesco:{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <Select
                      value={degreeKinship != "" ? degreeKinship : ""}
                      defaultValue={degreeKinship}
                      required
                      onValueChange={(e) => setDegreeKinship(e)}
                    >
                      <SelectTrigger
                        className="w-full"
                        id="status"
                        name="status"
                      >
                        <SelectValue placeholder="Selecione o grau de parentesco com o aluno" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pais">Pai ou Mãe</SelectItem>
                        <SelectItem value="Avós">Avô ou Avó</SelectItem>
                        <SelectItem value="Irmãos">Irmão ou Irmã</SelectItem>
                        <SelectItem value="Tios">Tio ou Tia</SelectItem>
                        <SelectItem value="Babá">Babá</SelectItem>
                        <SelectItem value="Escolar">
                          Escolar (transporte)
                        </SelectItem>
                        <SelectItem value="Acompanhante">
                          Acompanhante
                        </SelectItem>
                        <SelectItem value="Primos">Primo ou Prima</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {type == "agendarFalta" && (
                <>
                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="nome">
                      Selecione o dia desejado:{" "}
                      <span className="text-red-500"> *</span>
                    </label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateSelectAbsence && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateSelectAbsence ? (
                            format(dateSelectAbsence, "dd/MM/yyyy", {
                              locale: ptBR,
                            })
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          // @ts-ignore
                          selected={dateSelectAbsence || null}
                          // @ts-ignore
                          onSelect={changeDateAbsence}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="comments">
                      Informe o motivo:{" "}
                      <span className="text-red-500"> *</span>
                    </label>

                    <Input
                      id="comments"
                      placeholder="Digite o motivo da falta agendada para o aluno..."
                      onChange={(e) => setComments(e.target.value)}
                      value={comments}
                      required
                    />
                  </div>
                </>
              )}

              {type == "classes" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="description">
                      Descrição: <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="description"
                      name="description"
                      placeholder="Digite o descrição da turma..."
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label className="flex justify-between items-center cursor-pointer">
                      <div>
                        Unidade: <span className="text-red-500">*</span>
                      </div>

                      <div
                        className={`${
                          unitsDisp.length == 1 && unitsDisp[0]?.id == 999
                            ? "block"
                            : "hidden"
                        }`}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className=" border-none bg-transparent h-9 hover:bg-transparent flex justify-center">
                              <FiAlertOctagon
                                fontSize={19}
                                className="text-yellow-800  "
                              />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Aviso!</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="py-2 p-3 text-sm">
                              Nenhuma unidade encontrada, cadastre novas
                              unidades e tente novamente!
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </label>

                    <Select
                      defaultValue={units}
                      onValueChange={(e) => setUnits(e)}
                      disabled={unitsDisp.length <= 0}
                    >
                      <SelectTrigger className="w-full" id="units">
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>

                      <SelectContent>
                        {unitsDisp.map((c) => {
                          if (c.id == 999) {
                            return;
                          }

                          return (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.description}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {type == "esportes" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="description">
                      Descrição: <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="description"
                      name="description"
                      placeholder="Digite o descrição do esporte..."
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="units">
                      Unidade: <span className="text-red-500">*</span>
                    </label>
                    <Select onValueChange={(e) => setUnits(e)} value={units}>
                      <SelectTrigger className="w-full" id="units">
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>

                      <SelectContent>
                        {unitsDisp.map((c) => {
                          return (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.description}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {type != "teacherClass" &&
                type != "reasonAbsence" &&
                type != "generalComments" &&
                type != "call" && (
                  <FaTrash
                    fontSize={22}
                    onClick={() => trashImages()}
                    className={`${
                      link ? "block" : "hidden"
                    } absolute cursor-pointer top-4 right-9 hover:text-red-700 transition-all`}
                  />
                )}

              {type == "studentsClass" &&
                (students.length > 0 ? (
                  <DataTable
                    //@ts-ignore
                    columns={columnsStudentClass}
                    //@ts-ignore
                    data={students}
                    route={"studentsClass"}
                  />
                ) : (
                  <div className="flex flex-col gap-3 justify-center items-center">
                    <MdContentPasteSearch fontSize={30} />
                    <p className="text-md font-medium">
                      Nenhum aluno encontrado nessa turma!
                    </p>
                  </div>
                ))}

              {type == "teacherClass" &&
                (teacherClass.length > 0 ? (
                  <DataTable
                    //@ts-ignore
                    columns={columnsClass}
                    //@ts-ignore
                    data={teacherClass}
                    route={"teacherClass"}
                  />
                ) : (
                  <div className="flex flex-col gap-3 justify-center items-center">
                    <MdContentPasteSearch fontSize={30} />
                    <p className="text-md font-medium">
                      Nenhuma turma encontrada para este professor!
                    </p>
                  </div>
                ))}

              {type == "call" &&
                (responsibleRealeaseds.length > 0 ? (
                  <DataTable
                    //@ts-ignore
                    columns={columnsResponsibleRealeaseds}
                    //@ts-ignore
                    data={responsibleRealeaseds}
                    route={"responsibleRealeaseds"}
                  />
                ) : (
                  <div className="flex flex-col gap-3 justify-center items-center">
                    <MdContentPasteSearch fontSize={30} />
                    <p className="text-md font-medium">
                      Nenhum responsável liberado para este aluno!
                    </p>
                  </div>
                ))}

              {type == "teacherClass" && (
                <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium"></div>
              )}

              {type == "generalComments" && (
                <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                  <label htmlFor="general_comments">
                    Observação geral:
                  </label>
                  <Input
                    id="general_comments"
                    name="general_comments"
                    placeholder="Digite a sua observação geral..."
                    value={generalComments}
                    onChange={(e) => setGeneralComments(e.target.value)}
                  />
                </div>
              )}

              {type == "teacher" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="nome">
                      Nome: <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="nome"
                      name="nome"
                      placeholder="Digite o nome do professor..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label>
                      Telefone:
                      <span className="text-red-500"> * </span>
                    </label>

                    <MaskedInput value={phone} onChange={handlePhoneChange} />
                  </div>
                </div>
              )}

              {(user as unknown as UserProps).level != 3 &&
                type == "responsibles_released" && (
                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="status">
                      Status: <span className="text-red-500">*</span>
                    </label>
                    <Select
                      required
                      onValueChange={(e) => setStatus(e)}
                      defaultValue={status}
                    >
                      <SelectTrigger className="w-full" id="status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          <>
                            <SelectItem value="1">Ativo</SelectItem>
                            <SelectItem value="0">Inativo</SelectItem>
                          </>
                        }
                      </SelectContent>
                    </Select>
                  </div>
                )}

              {type != "studentsClass" &&
                type != "students" &&
                type != "responsibles_released" &&
                type != "reasonAbsence" &&
                type != "teacherClass" &&
                type != "generalComments" &&
                type != "call" && (
                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="status">
                      Status: <span className="text-red-500">*</span>
                    </label>
                    <Select
                      required
                      onValueChange={(e) => setStatus(e)}
                      defaultValue={status}
                    >
                      <SelectTrigger className="w-full" id="status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        {(type == "classes" ||
                          type == "teacher" ||
                          type == "units" ||
                          type == "esportes" ||
                          type == "responsibles" ||
                          type == "responsibles_released" ||
                          type == "users" ||
                          type == "agendarFalta") && (
                          <>
                            <SelectItem value="1">Ativo</SelectItem>
                            <SelectItem value="0">Inativo</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
            </div>
          </Modal.Body>
          <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
            {type != "studentsClass" &&
              type != "teacherClass" &&
              type != "call" && (
                <Button
                  className="text-center bg-primary-color hover:bg-secondary-color"
                  type="submit"
                >
                  {loading ? (
                    <div className="flex justify-center">
                      <TbLoader3
                        fontSize={23}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                    </div>
                  ) : (
                    "Salvar"
                  )}
                </Button>
              )}
            <Button
              className="bg-white text-black border border-gray-100 hover:bg-gray-100"
              onClick={() => closeModal()}
            >
              Fechar
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal show={openModalStudent} onClose={() => closeModal()}>
        <Modal.Header>{modalData}</Modal.Header>
        <Tabs
          defaultValue={optionTabsStudent}
          value={optionTabsStudent != "" ? optionTabsStudent : ""}
          className="px-3"
        >
          <TabsList className="flex justify-center w-full mx-auto my-5">
            <TabsTrigger value="dataStudent">Dados do aluno</TabsTrigger>
            <TabsTrigger value="documentsStudent">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value="dataStudent">
            <Modal.Body
              className="relative"
              style={{ maxHeight: modalMaxHeight }}
            >
              <div className="space-y-6 mb-5">
                <div
                  className={`${
                    link != "" ? "h-64" : "h-48"
                  } flex justify-center transition-all w-full border-dashed ${
                    error && !link && "border-red-500"
                  } border-2 rounded-lg relative text-md font-medium text-gray-700`}
                >
                  <input
                    onChange={(e) => handleFileChange(e)}
                    type="file"
                    name="image"
                    accept="image/png, image/jpeg"
                    id="image"
                    className="absolute cursor-pointer top-0 w-full h-48 opacity-0"
                  />

                  {link ? (
                    <div className="flex justify-center">
                      <svg className="p-10 flex justify-center">
                        <image href={link} className="my-class w-80" />
                      </svg>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 items-center justify-center ">
                      <IoIosImages fontSize={40} />
                      <p className="w-full text-sm md:text-lg">
                        Clique aqui para selecionar uma imagem.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                  <label htmlFor="description">
                    Nome: <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="nome"
                    name="nome"
                    placeholder="Digite o nome do aluno..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col w-full gap-1 text-gray-700 text-sm font-medium">
                  <label htmlFor="dateBirth">
                    Data de nascimento: <span className="text-red-500">*</span>
                  </label>

                  <Datepicker
                    //@ts-ignore
                    options={optionsDate}
                    onChange={handleChange}
                    show={show}
                    setShow={handleClose}
                  >
                    <div
                      className="flex gap-2 p-2.5 border rounded-lg w-full cursor-pointer"
                      onClick={() => setShow(!show)}
                    >
                      <input
                        type="text"
                        placeholder="Selecione a data de nascimento"
                        className=" placeholder:text-gray-600 cursor-pointer w-full"
                        value={date}
                        readOnly
                      />
                    </div>
                  </Datepicker>
                </div>

                <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                  <label htmlFor="class">
                    É um aluno do colégio ?{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <Select
                    value={isStudent != "" ? isStudent : ""}
                    defaultValue={isStudent}
                    onValueChange={(e) => changeIsStudent(e)}
                  >
                    <SelectTrigger className="w-full" id="class">
                      <SelectValue placeholder="Selecione sim ou não" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"1"}>Sim</SelectItem>
                      <SelectItem value={"0"}>Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                  <label className="flex justify-between items-center cursor-pointer">
                    <div>
                      Unidade: <span className="text-red-500">*</span>
                    </div>

                    <div
                      className={`${
                        unitsDisp.length <= 0 ? "block" : "hidden"
                      }`}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className=" border-none bg-transparent h-9 hover:bg-transparent flex justify-center">
                            <FiAlertOctagon
                              fontSize={19}
                              className="text-yellow-800  "
                            />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Aviso!</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <div className="py-2 p-3 text-sm">
                            Nenhuma unidade encontrada, cadastre novas unidades
                            e tente novamente!
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </label>

                  <Select
                    defaultValue={unitsDisp.length <= 0 ? "" : units}
                    onValueChange={(e) => filterUnitWithClass(e, isStudent)}
                    disabled={unitsDisp.length <= 0}
                  >
                    <SelectTrigger className="w-full" id="units">
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>

                    <SelectContent>
                      {unitsDisp.map((c) => {
                        if (c.id == 999) {
                          return;
                        }

                        return (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.description}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                  <label className="flex justify-between items-center cursor-pointer">
                    <div>
                      Turma: <span className="text-red-500">*</span>
                    </div>

                    <div
                      className={
                        classesDisp.length == 1 && classesDisp[0]?.id == 999
                          ? "flex"
                          : "hidden"
                      }
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className=" border-none bg-transparent h-9 hover:bg-transparent flex justify-center">
                            <FiAlertOctagon
                              fontSize={19}
                              className="text-yellow-800  "
                            />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Aviso!</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <div className="py-2 p-3 text-sm">
                            Nenhuma turma encontrada, cadastre novas turmas e
                            tente novamente!
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </label>

                  <Select
                    value={classes != "" ? classes : ""}
                    defaultValue={classes}
                    onValueChange={(e) => setClasses(e)}
                    disabled={
                      units == "" ||
                      (classesDisp.length == 1 && classesDisp[0]?.id == 999)
                    }
                  >
                    <SelectTrigger className="w-full" id="class">
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>

                    <SelectContent>
                      {classesDisp.map((c) => {
                        if (c.id == 999) {
                          return;
                        }

                        return (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.description.split("-")[0]}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2 my-3 mb-10">
                  <label className="flex justify-between items-center cursor-pointer">
                    <div>
                      Esportes: <span className="text-red-500">*</span>
                    </div>

                    <div
                      className={
                        teamsDisp.length <= 0 ? "flex" : "hidden"
                      }
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className=" border-none bg-transparent h-9 hover:bg-transparent flex justify-center">
                            <FiAlertOctagon
                              fontSize={19}
                              className="text-yellow-800  "
                            />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Aviso!</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <div className="py-2 p-3 text-sm">
                            Nenhum esporte encontrado, cadastre novos
                            esportes e tente novamente!
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </label>

                  <SelectReact
                    defaultValue={[]}
                    isMulti
                    name="sports"
                    value={sportsSelect}
                    // @ts-ignore
                    onChange={(e) => setSportsSelect(e)}
                    noOptionsMessage={() =>
                      "Nenhum resultado encontrado"
                    }
                    // @ts-ignore
                    options={sportsDisp}
                    className="basic-multi-select text-sm"
                    maxMenuHeight={200}
                    placeholder="Selecione o(s) esportes(s)"
                  />
                </div>

                <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                  <label htmlFor="days_training">Dias de treino:</label>

                  <Select
                    value={daysTraining != "" ? daysTraining.trim() : ""}
                    onValueChange={(e) => setDaysTraining(e)}
                    defaultValue={daysTraining.trim()}
                  >
                    <SelectTrigger className="w-full" id="days_training">
                      <SelectValue placeholder="Selecione os dias de treino" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Segunda e Quarta">
                        Segunda e Quarta
                      </SelectItem>
                      <SelectItem value="Terça e Quinta">
                        Terça e Quinta
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                  <label htmlFor="class_time">Horário de treino:</label>

                  <Select
                    value={classTime != "" ? classTime : ""}
                    defaultValue={classTime != "" ? classTime : ""}
                    disabled={daysTraining == ""}
                    onValueChange={(e) => setClassTime(e)}
                  >
                    <SelectTrigger className="w-full" id="class_time">
                      <SelectValue placeholder="Selecione os dias de treino" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="1970-01-01T13:15">13:15 às 15:00</SelectItem>

                      <SelectItem value="1970-01-01T17:30">17:30 às 18:20</SelectItem>

                      <SelectItem value="1970-01-01T18:20">18:20 às 19:20</SelectItem>

                      <SelectItem value="1970-01-01T18:30">18:30 às 19:30</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                  <label htmlFor="status">
                    Status: <span className="text-red-500">*</span>
                  </label>
                  <Select
                    required
                    onValueChange={(e) => setStatus(e)}
                    defaultValue={status}
                  >
                    <SelectTrigger className="w-full" id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <>
                        <SelectItem value="1">Ativo</SelectItem>
                        <SelectItem value="2">Experimental</SelectItem>
                        <SelectItem value="3">Pendente</SelectItem>
                        <SelectItem value="0">Inativo</SelectItem>
                        <SelectItem value="4">Desativado</SelectItem>
                        <SelectItem value="5">Pré-experimental</SelectItem>
                      </>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
              <Button
                className="bg-primary-color hover:bg-secondary-color"
                onClick={() => setOptionTabsStudent("documentsStudent")}
              >
                {loading ? (
                  <div className="flex justify-center">
                    <TbLoader3
                      fontSize={23}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  </div>
                ) : (
                  "Próximo"
                )}
              </Button>
              <Button
                className="bg-white text-black border border-gray-100 hover:bg-gray-100"
                onClick={() => closeModal()}
              >
                Fechar
              </Button>
            </Modal.Footer>
          </TabsContent>

          <TabsContent value="documentsStudent">
            <form onSubmit={editData}>
              <Modal.Body
                className="relative"
                style={{ maxHeight: modalMaxHeight }}
              >
                <div className="space-y-6 mb-10">
                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label
                      className="flex justify-between items-center cursor-pointer"
                      htmlFor="has_registration_number"
                    >
                      <div>
                        Matrícula: <span className="text-red-500">*</span>
                      </div>
                    </label>

                    <Select
                      value={
                        hasRegistrationNumber != "" ? hasRegistrationNumber : ""
                      }
                      defaultValue={hasRegistrationNumber}
                      onValueChange={(e) => setHasRegistrationNumber(e)}
                      required
                    >
                      <SelectTrigger
                        className="w-full"
                        id="has_registration_number"
                      >
                        <SelectValue placeholder="Selecione se o documento foi entregue ou não..." />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="true">Sim</SelectItem>
                        <SelectItem value="false">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label
                      className="flex justify-between items-center cursor-pointer"
                      htmlFor="image_contract"
                    >
                      <div>
                        Contrato de imagem:{" "}
                        <span className="text-red-500">*</span>
                      </div>
                    </label>

                    <Select
                      value={imageContract != "" ? imageContract : ""}
                      defaultValue={imageContract}
                      onValueChange={(e) => setImageContract(e)}
                      required
                    >
                      <SelectTrigger className="w-full" id="image_contract">
                        <SelectValue placeholder="Selecione se o documento foi entregue ou não..." />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="true">Sim</SelectItem>
                        <SelectItem value="false">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label
                      className="flex justify-between items-center cursor-pointer"
                      htmlFor="exit_autorization"
                    >
                      <div>
                        Autorização de saída:{" "}
                        <span className="text-red-500">*</span>
                      </div>
                    </label>

                    <Select
                      value={exitAutorization != "" ? exitAutorization : ""}
                      defaultValue={exitAutorization}
                      onValueChange={(e) => setExitAutorization(e)}
                      required
                    >
                      <SelectTrigger className="w-full" id="exit_autorization">
                        <SelectValue placeholder="Selecione se o documento foi entregue ou não..." />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="true">Sim</SelectItem>
                        <SelectItem value="false">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label
                      className="flex justify-between items-center cursor-pointer"
                      htmlFor="contract"
                    >
                      <div>
                        Contrato: <span className="text-red-500">*</span>
                      </div>
                    </label>

                    <Select
                      value={contract != "" ? contract : ""}
                      defaultValue={contract}
                      onValueChange={(e) => setContract(e)}
                      required
                    >
                      <SelectTrigger className="w-full" id="contract">
                        <SelectValue placeholder="Selecione se o documento foi entregue ou não..." />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="true">Sim</SelectItem>
                        <SelectItem value="false">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label
                      className="flex justify-between items-center cursor-pointer"
                      htmlFor="uniform"
                    >
                      <div>
                        Uniforme: <span className="text-red-500">*</span>
                      </div>
                    </label>

                    <Select
                      value={uniform != "" ? uniform : ""}
                      defaultValue={uniform}
                      onValueChange={(e) => setUniform(e)}
                      required
                    >
                      <SelectTrigger className="w-full" id="uniform">
                        <SelectValue placeholder="Selecione se o documento foi entregue ou não..." />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="true">Sim</SelectItem>
                        <SelectItem value="false">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
                <Button className="bg-primary-color hover:bg-secondary-color">
                  {loading ? (
                    <div className="flex justify-center">
                      <TbLoader3
                        fontSize={23}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                    </div>
                  ) : (
                    "Salvar"
                  )}
                </Button>
                <Button
                  className="bg-white text-black border border-gray-100 hover:bg-gray-100"
                  onClick={() => setOptionTabsStudent("dataStudent")}
                >
                  Voltar
                </Button>
              </Modal.Footer>
            </form>
          </TabsContent>
        </Tabs>
      </Modal>
    </modalContext.Provider>
  );
};

export default ModalProvider;
