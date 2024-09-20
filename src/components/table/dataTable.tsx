import moment from "moment";
import "moment/locale/pt-br";
import * as React from "react";
import { toast } from "react-hot-toast";
import { TbLoader3, TbAdjustmentsHorizontal } from "react-icons/tb";
import { BsBuildingAdd, BsUiChecksGrid } from "react-icons/bs";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import {
  MdFormatListBulletedAdd,
  MdPersonAdd,
  MdGroupAdd,
} from "react-icons/md";
import Datepicker from "tailwind-datepicker-react";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { DateRange } from "react-day-picker";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IoIosArrowDown } from "react-icons/io";
import { FiAlertOctagon } from "react-icons/fi";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Modal } from "flowbite-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IoIosImages } from "react-icons/io";
import SelectReact from "react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import api from "@/api";
import { ClassesProps } from "@/pages/classes";
import { ReloadContext } from "@/contexts/ReloadContext";
import MaskedInput from "../InputMask";
import { AuthContext, UserProps } from "@/contexts/AuthContext";
import { RowProps } from "@/contexts/ModalsContext";
import { StudentsProps } from "@/pages/students";
import axios from "axios";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { Checkbox } from "../ui/checkbox";

interface DataTableProps {
  data: [];
  columns: [];
  route: string;
}

interface AttendanceRecord {
  Motivo: string;
  Presença: string;
  Data: string;
}

interface StudentData {
  "Nome completo": string;
  "Data de nascimento": string;
  Turma: string;
  Esporte: string;
  Observações: string;
  Presenças: { [month: string]: AttendanceRecord[] };
}

interface StudentsDataProps {
  [id: string]: StudentData;
}

export interface ResponsibleProps {
  id: number;
  name: string;
  phone: string;
  status: number;
  user_id: string;
}

export interface UnitsProps {
  id: number;
  description: string;
  status: number;
}

export const columnsCoordinator: ColumnDef<RowProps>[] = [
  {
    id: "select",
    header: "",
    cell: ({ row }) => {
      const [valueCheck, setValueCheck] = React.useState(row.original.free_view_coordinator);

      const changeFieldValue = (value: boolean) => {
        row.toggleSelected(value);
      
        if (value == true) {
          row.original.free_view_coordinator = 1;
          setValueCheck(1);
        } else {
          row.original.free_view_coordinator = 0;
          setValueCheck(0);
        }
      };

      return (
        <Checkbox
          checked={row.original.free_view_coordinator == 1 || valueCheck == 1}
          onCheckedChange={(value) => changeFieldValue(!!value)} 
          aria-label="Select row"
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "desc_unit",
    header: "Unidade",
    cell: ({ row }) => <div>{row.getValue("desc_unit")}</div>,
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

export function DataTable({ data, columns, route }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [modalMaxHeight, setModalMaxHeight] = React.useState("500px");
  const [date2, setDate2] = React.useState<DateRange | undefined>(undefined);
  const { username, user } = React.useContext(AuthContext);
  const [openModal, setOpenModal] = React.useState(false);
  const [openCoordinatorModal, setOpenCoordinatorModal] = React.useState(false);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [link, setLink] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isStudent, setIsStudent] = React.useState("");
  const [level, setLevel] = React.useState(0);
  const [optionTabs, setOptionTabs] = React.useState("selectStudent");
  const [studentRespData, setStudentRespData] = React.useState<StudentsProps[]>(
    []
  );
  const [students, setStudents] = React.useState<
    { value: number; label: string; class: number }[]
  >([]);
  const [studentsSelect, setStudentsSelect] = React.useState<
    { value: number; label: string; class: number }[]
  >([]);
  const [description, setDescription] = React.useState("");
  const [nameResp, setNameResp] = React.useState("");
  const [name, setName] = React.useState("");
  const [classesDisp, setClassesDisp] = React.useState<ClassesProps[]>([]);
  const [degreeKinship, setDegreeKinship] = React.useState("");
  const [classTime, setClassTime] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [classesDispFilter, setClassesDispFilter] = React.useState<
    ClassesProps[]
  >([]);
  const [team, setTeam] = React.useState("");
  const [teamsDisp, setTeamsDisp] = React.useState<ClassesProps[]>([]);
  const [units, setUnits] = React.useState("");
  const [unitsDisp, setUnitsDisp] = React.useState<UnitsProps[]>([]);
  const [classFilter, setClassFilter] = React.useState("999");
  const [classes, setClasses] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [status, setStatus] = React.useState("1");
  const [daysTraining, setDaysTraining] = React.useState("");
  const [date, setDate] = React.useState("");
  const [dateSelectAbsence, setDateSelectAbsence] = React.useState<
    Date | string
  >();
  const hostName = window.location.hostname;
  const [dateAbsence, setDateAbsence] = React.useState("");
  const [comments, setComments] = React.useState("");
  const {
    filterStudentsByClass,
    filterStudentsByTeam,
    idClass,
    teamId,
    filterByUnit,
    reloadPage,
    verifyUserCreate,
    unitId,
    daySaved,
    respId,
    unitName,
    className,
    dayTrainingName,
  } = React.useContext(ReloadContext);

  function formatarDataParaBrasileiro(data: Date) {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  React.useEffect(() => {
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

  const hoje = new Date();
  const dataBrasileira = formatarDataParaBrasileiro(hoje);

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
    inputPlaceholderProp: "",
    inputDateFormatProp: {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  };

  const [show, setShow] = React.useState<boolean>(false);

  const handleChange = (selectedDate: Date) => {
    setDate(selectedDate.toLocaleDateString("pt-BR"));
  };

  const formatDateToExcel = (date: string) => {
    const formatedDate = date.split("/");

    return formatedDate[0];
  };

  const verifyMonthName = (date: number) => {
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    return monthNames[date];
  };

  const generateExcel = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const dataCall = {
      date: date2,
      unit: unitId,
      classId: idClass,
      day_of_training: daySaved,
      team: teamId,
    };
  
    try {
      setLoading(true);
      const response = await api.post("/students/excel", dataCall);
      const students: Student[] = response.data.students;
  
      const groupedStudents: StudentsDataProps = {};
  
      students.forEach((student: { [key: string]: any }) => {
        const id = student["id"];
  
        if (!groupedStudents[id]) {
          groupedStudents[id] = {
            "Nome completo": student["Nome completo"],
            "Data de nascimento": student["Data de nascimento"],
            Turma: student["Turma"],
            Esporte: student["Esporte"],
            Observações: student["Observações"],
            Presenças: {},
          };
        }
  
        const data = moment(student["Data"], "DD/MM/YYYY");
        const mes = verifyMonthName(data.month());
  
        if (!groupedStudents[id].Presenças[mes]) {
          groupedStudents[id].Presenças[mes] = [];
        }
  
        groupedStudents[id].Presenças[mes].push({
          Motivo: student["Motivo"],
          Presença: student["Presença"],
          Data: student["Data"],
        });
      });
  
      const result = Object.values(groupedStudents);
  
      const monthMapping: { [key: string]: number } = {
        janeiro: 1,
        fevereiro: 2,
        março: 3,
        abril: 4,
        maio: 5,
        junho: 6,
        julho: 7,
        agosto: 8,
        setembro: 9,
        outubro: 10,
        novembro: 11,
        dezembro: 12,
      };
  
      const getMonthNumber = (monthName: string): number =>
        monthMapping[monthName.toLowerCase()] || 0;
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Chamada");
  
      worksheet.columns = [
        { width: 30 },
        { width: 30 },
        { width: 20 },
        { width: 15 },
        { width: 60 },
        { width: 50 },
      ];
  
      worksheet.mergeCells("A1:F1");
      const titleCell = worksheet.getCell("A1");
      titleCell.value = `UNIDADE ${unitName.toLocaleUpperCase()}`;
      titleCell.font = { size: 15, bold: true };
      titleCell.alignment = { vertical: "middle", horizontal: "center" };
      titleCell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
  
      worksheet.mergeCells("A2:F2");
      const subtitleCell = worksheet.getCell("A2");
      subtitleCell.value = "Coordenação: Gracielle Bravos: (31) 99100-5157";
      subtitleCell.font = { size: 12, bold: true };
      subtitleCell.alignment = { vertical: "middle", horizontal: "center" };
      subtitleCell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
  
      worksheet.mergeCells("A3:F3");
      const descriptionCell = worksheet.getCell("A3");
      descriptionCell.value = `Iniciação esportiva - ${
        className !== "" ? className : "Todos"
      } ${dayTrainingName !== "" ? "- " + dayTrainingName : ""} - ${dataBrasileira}`;
      descriptionCell.font = { size: 12.5, bold: true };
      descriptionCell.alignment = { vertical: "middle", horizontal: "center" };
      descriptionCell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
  
      const headers = [
        "Atleta",
        "Data de nascimento",
        "Turma",
        "Esporte",
        "Presença",
        "Observações",
      ];
  
      const headerRow = worksheet.addRow(headers);
      headerRow.height = 25;
      headerRow.font = { size: 12, bold: true };
  
      headerRow.eachCell({ includeEmpty: true }, (cell: ExcelJS.Cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
  
      const monthsPresent: { [key: string]: any[] } = {};
  
      result.forEach((student: any) => {
        Object.keys(student["Presenças"]).forEach((month) => {
          if (!monthsPresent[month]) {
            monthsPresent[month] = [];
          }
  
          const dataEntry = {
            "Nome completo": student["Nome completo"],
            "Data de nascimento": student["Data de nascimento"],
            Turma: student["Turma"],
            Esporte: student["Esporte"],
            Observações: student["Observações"],
            Presenças: student["Presenças"][month],
          };
  
          monthsPresent[month].push(dataEntry);
        });
      });
  
      Object.keys(monthsPresent)
        .sort((a, b) => getMonthNumber(a) - getMonthNumber(b))
        .forEach((month) => {
          const monthTitleRow = worksheet.addRow(["", "", "", "", month.toUpperCase(), ""]);
          monthTitleRow.getCell(5).alignment = {
            vertical: "middle",
            horizontal: "center",
          };
          monthTitleRow.getCell(5).font = { bold: true, size: 14 };
  
          monthTitleRow.getCell(1).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
          };
          monthTitleRow.getCell(6).border = {
            top: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
          };
  
          monthTitleRow.getCell(5).border = {};
  
          monthsPresent[month].forEach((student) => {
            const initialRow = worksheet.rowCount + 1;
          
            worksheet.addRow([
              student["Nome completo"],
              student["Data de nascimento"],
              student["Turma"],
              student["Esporte"],
              "", 
              student["Observações"],
            ]);
          
            const presencaCell = worksheet.getCell(initialRow, 5);
            
            const presenceArray = student["Presenças"].map((p: { Data: string; Presença: string }) => ({
              date: formatDateToExcel(p["Data"]).slice(0, 2),
              status: p["Presença"], 
            }));
            
            presenceArray.sort((a: { date: any; }, b: { date: any; }) => Number(a.date) - Number(b.date));
          
            const presenceString = presenceArray
              .map((p: { date: any; status: any; }) => `${p.date} ${p.status}`)
              .join(' | ');
          
            presencaCell.value = presenceString;
            presencaCell.alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            };
            presencaCell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          
            const lastRow = worksheet.rowCount;
            worksheet.mergeCells(initialRow, 1, lastRow, 1);
            worksheet.mergeCells(initialRow, 2, lastRow, 2);
            worksheet.mergeCells(initialRow, 3, lastRow, 3);
            worksheet.mergeCells(initialRow, 4, lastRow, 4);
            worksheet.mergeCells(initialRow, 6, lastRow, 6);
          
            for (let i = 1; i <= 6; i++) {
              const cell = worksheet.getCell(initialRow, i);
              cell.alignment = { vertical: "middle", horizontal: "center" };
            }
        
            const observationCell = worksheet.getCell(initialRow, 6);
            observationCell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          
            for (let i = initialRow; i <= lastRow; i++) {
              worksheet.getRow(i).eachCell((cell: ExcelJS.Cell) => {
                cell.border = {
                  top: { style: "thin" },
                  left: { style: "thin" },
                  bottom: { style: "thin" },
                  right: { style: "thin" },
                };
              });
            }
            
          });
        });
  
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Chamada - ${className != "" ? className : "Todos"} - ${dataBrasileira}.xlsx`
      );
  
      if (response.data.students.length === 0) {
        toast.error("Nenhum registro encontrado!");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao gerar o excel!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const setTrash = () => {
    setLink("");
    setFile(null);
  };

  const handleClose = (state: boolean) => {
    setShow(state);
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
  };

  const changeDateAbsence = (e: Date) => {
    setDateSelectAbsence(e);
    setDateAbsence(e.toLocaleDateString("pt-BR").replace(/\//g, "-"));
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
    setTeam("");

    const response = await api.get(`/classes/filter/${e}`);

    if (e != "0") {
      const responseSports = await api.get(`/sports/unit/${e}`);
      setTeamsDisp(responseSports.data);
    }

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

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (route == "students") {
    React.useEffect(() => {
      if (classFilter == "999") {
        getClasses();
      }

      filterStudentsByClass(Number(classFilter));
    }, [classFilter]);
  }

  if (
    route == "turmas" ||
    route == "teachers" ||
    route == "esportes" ||
    route == "responsibles"
  ) {
    React.useEffect(() => {
      getUnits();
    }, []);
  }

  if (route == "call") {
    React.useEffect(() => {
      const getTeamsFilter = async () => {
        const response = await api.get(`/sports/unit/${unitId}`);

        response.data.unshift({ id: 999, description: "Todos", status: 1 });
        setClassesDisp(response.data);
      };

      getTeamsFilter();
    }, []);
  }

  const getStudents = async () => {
    try {
      const response = await api.get("/students/agendamentos");

      const formatedData = response.data.map((d: StudentsProps) => ({
        value: d.id,
        label: d.name,
        class: d.class,
      }));

      setStudents(formatedData);
    } catch {
      toast.error("Ocorreu um erro ao buscar os alunos disponíveis!");
    } finally {
      setLoading(false);
    }
  };

  if (route == "agendarFalta") {
    React.useEffect(() => {
      const getStudentOfResponsibleData = async () => {
        const response = await api.get(
          `/call/student/responsible/${(user as unknown as UserProps).id}`
        );

        setStudentRespData(response.data);
      };

      getStudentOfResponsibleData();
    }, []);
  }

  const createClasses = async (e: React.FormEvent) => {
    e.preventDefault();

    if (route == "studentsClass") {
      return;
    }

    const data = {
      description: description,
      unit: units,
      status: status,
    };

    try {
      setLoading(true);
      await api.post("/classes", data);
      toast.success("Turma cadastrada com sucesso!");
      setOpenModal(false);
      reloadPage();
      handlePhoneChange("");
    } catch {
      toast.error("Ocorreu um erro ao cadastrar a turma!");
    } finally {
      setLoading(false);
    }
  };

  const createUnit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (route == "studentsClass") {
      return;
    }

    const data = {
      description: description,
      status: status,
    };

    try {
      setLoading(true);
      await api.post("/units", data);
      toast.success("Unidade cadastrada com sucesso!");
      setOpenModal(false);
      reloadPage();
    } catch {
      toast.error("Ocorreu um erro ao cadastrar a unidade!");
    } finally {
      setLoading(false);
    }
  };

  const createSports = async (e: React.FormEvent) => {
    e.preventDefault();

    if (route == "studentsClass") {
      return;
    }

    const data = {
      description: description,
      unit: units,
      status: status,
    };

    try {
      setLoading(true);
      await api.post("/sports", data);
      toast.success("Esporte cadastrado com sucesso!");
      setOpenModal(false);
      reloadPage();
      handlePhoneChange("");
    } catch {
      toast.error("Ocorreu um erro ao cadastrar o esporte!");
    } finally {
      setLoading(false);
    }
  };

  const createResponsibles = async (e: React.FormEvent) => {
    e.preventDefault();

    if (route == "studentsClass") {
      return;
    }

    const verifyIfSaveImage = await saveImage();

    if (verifyIfSaveImage == "error") {
      return;
    }

    const data = {
      image: verifyIfSaveImage,
      name: name,
      phone: phone,
      status: status,
    };

    try {
      setLoading(true);
      await api.post("/responsibles", data);
      toast.success(`${name} cadastrada com sucesso!`);
      setOpenModal(false);
      reloadPage();
      handlePhoneChange("");
    } catch {
      toast.error("Ocorreu um erro ao cadastrar o responsável!");
    } finally {
      setLoading(false);
    }
  };

  const createUsers = async (e: React.FormEvent) => {
    e.preventDefault();

    let verifyIfSaveImage;

    if (level == 2) {
      verifyIfSaveImage = await saveImage();

      if (verifyIfSaveImage == "error") {
        return;
      }
    }

    const userData = {
      name: name,
      level: level,
      complete_register: 0,
      user: phone,
      password: phone,
      ...(verifyIfSaveImage != "" && { image: verifyIfSaveImage }),
      phone: phone,
      status: status,
    };

    try {
      setLoading(true);
      await api.post("/users/register", userData);
      toast.success(`${name} cadastrado com sucesso!`);
      setOpenModal(false);
      reloadPage();
      handlePhoneChange("");
    } catch {
      toast.error("Ocorreu um erro ao cadastrar o usuário!");
    } finally {
      setLoading(false);
    }
  };

  const getResponsibleWithIdUser = async (id: number) => {
    try {
      const response = await api.get(`/responsibles/user/${id}`);

      return response.data.user_id;
    } catch {
      toast.error("Ocorreu um erro ao buscar os dados do responsável!");
    }
  };

  const createResponsiblesReleaseds = async (e: React.FormEvent) => {
    e.preventDefault();

    if (route == "studentsClass") {
      return;
    }

    const verifyIfSaveImage = await saveImage();

    if (verifyIfSaveImage == "error") {
      return;
    }

    if (!link) {
      toast("É necessário que o aluno possua uma foto cadastrada!", {
        position: "top-right",
        icon: "⚠️",
      });

      setError(true);
      return;
    }

    const responsibleId = await getResponsibleWithIdUser(
      (user as unknown as UserProps).level != 3
        ? respId
        : (user as unknown as UserProps).id
    );

    const data = {
      image: verifyIfSaveImage,
      name: name,
      phone: phone,
      degree_kinship: degreeKinship,
      id_responsible: responsibleId,
      status: status,
    };

    try {
      setLoading(true);
      await api.post("/responsibles/releaseds", data);
      toast.success(`${name} cadastrada com sucesso!`);
      closeModal();
      reloadPage();
      verifyUserCreate(true);
      handlePhoneChange("");
    } catch {
      toast.error("Ocorreu um erro ao cadastrar o responsável!");
    } finally {
      setLoading(false);
    }
  };

  const getUnits = async () => {
    try {
      const response = await api.get("/units");

      response.data.unshift({ id: 999, description: "Todos", status: 1 });
      setUnitsDisp(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar as unidades disponíveis!");
    }
  };

  const getClasses = async () => {
    try {
      const response = await api.get("/classes");

      response.data.unshift({ id: 999, description: "Todos", status: 1 });

      if (route == "students") {
        response.data.map(
          (s: { id: number; description: string; desc_unit: string }) => {
            if (s.id != 999) {
              s.description += " - " + s.desc_unit;
            }
          }
        );
      }

      setClassesDispFilter(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar as turmas disponíveis!");
    }
  };

  const getTeams = async () => {
    try {
      const response = await api.get("/sports");

      setTeamsDisp(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar as equipes disponíveis!");
    }
  };

  type Student = {
    original: {
      id_call: any;
      id: string;
      class: string;
      name: string;
      presence: number | null;
      date: string | null;
      schedule_by_responsible: number;
      status_call: number;
    };
  };


  const selectClassesToCoordinatorSee = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put("/classes/coordinator", data);
      
      reloadPage();
    } catch {
      toast.error("Ocorreu um erro ao selecionar as turmas!");
    } finally {
      setLoading(false);
    }
  }

  const makeCall = async (students: Student[]) => {
    try {
      const studentsMap = students.map((s) => s.original);

      const transformedStudents = studentsMap
        .filter((student) => {
          return !(
            student.schedule_by_responsible == 1 && student.status_call != 0
          );
        })
        .map((student) => {
          return {
            registration: student.id,
            class: student.class,
            name: student.name,
            presence: student.presence,
            edit_by: username,
            id_call: student.id_call,
            ...((student.presence == null || student.date == null) && {
              made_by: username,
            }),
            ...(student.schedule_by_responsible == 1 &&
              student.status_call == 0 && {
                schedule_by_responsible: 1,
                status_call: student.status_call,
              }),
          };
        });

      const filterTransformedStudents = transformedStudents.filter(
        (t) => t.presence != null
      );

      await api.post("/call", filterTransformedStudents);
      toast.success("Chamada realizada com sucesso!");
    } catch {
      toast.error("Ocorreu um erro ao realizar a chamada!");
    }
  };

  const openModals = async () => {
    setOpenModal(true);

    if (route == "students") {
      await getTeams();
    }

    if (route == "esportes") {
      await getClasses();
    }

    route != "call" && (await getUnits());

    if (route == "call") {
      makeCall(table.getRowModel().rows);
      setOpenModal(false);
    }

    if (route == "agendarFalta") {
      getStudents();
    }
  };

  const openExcelModal = async () => {
    setOpenModal(true);
  };

  const openCoordinatorModals = async () => {
    setOpenCoordinatorModal(true);
  };

  const closeModal = () => {
    setError(false);
    setOpenModal(false);
    handlePhoneChange("");
    setDate("");
    setUnits("");
    setClasses("");
    setTeam("");
    setLink("");
    setShow(false);
    setDaysTraining("");
    setStudentsSelect([]);
    setClassTime("");
    setPhone("");
    setDate2(undefined);
    setOptionTabs("selectStudent");
    setIsStudent("");
    setLevel(0);
    setComments("");
    setDateSelectAbsence("");
    setName("");
    setStatus("");
    setDateAbsence("");
  };

  const saveImage = async () => {
    const formData = new FormData();
    //@ts-ignore
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${hostName == "localhost" ? "http://localhost:3000/upload" : "https://bravos-api.onrender.com/upload"}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return `${hostName == "localhost" ? `http://localhost:3000/files/${response.data}` : `https://bravos-api.onrender.com/files/${response.data}`}`;
    } catch {
      toast.error("Ocorreu um erro ao salvar a imagem!");
      return "error";
    }
  };

  const createStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (route == "studentsClass") {
      return;
    }
    
    const verifyIfSaveImage = await saveImage();
    
    if (verifyIfSaveImage == "error") {
      setLoading(false);
      return;
    }

    const data = {
      image: verifyIfSaveImage,
      name: name,
      team: team,
      date_of_birth: date,
      resp_phone: phone,
      resp_name: nameResp,
      status: status,
      ...(daysTraining != "" && { days_training: daysTraining }),
      ...(classTime != "" && { class_time: classTime }),
      class: classes,
      unit: units,
    };

    if (!link) {
      toast("É necessário que o aluno possua uma foto cadastrada!", {
        position: "top-right",
        icon: "⚠️",
      });

      setError(true);
      return;
    }

    try {
      setClassFilter("999");
      await api.post("/students", data);

      setPhone("");
      toast.success("Aluno cadastrado com sucesso!");
      closeModal();
      verifyUserCreate(true);
      reloadPage();
      setLink("");
      setDate("");
    } catch {
      toast.error("Ocorreu um erro ao cadastrar o aluno!");
    } finally {
      setLoading(false);
    }
  };

  function convertDateFormat(dateStr: string) {
    const [dd, mm, yyyy] = dateStr.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }

  function parseDate(dateString: string) {
    let [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function parseTime(timeString: string) {
    let [hours, minutes, seconds] = timeString.split(":").map(Number);
    let date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setLink(URL.createObjectURL(selectedFile));
    }
  };

  const createScheduleAbsence = async (e: React.FormEvent) => {
    e.preventDefault();

    if (route == "studentsClass") {
      return;
    }

    const dateToday = new Date();
    const formatedDateToday = parseDate(
      dateToday.toLocaleDateString().replace(/\//g, "-")
    );
    const formatedDateSelect = parseDate(dateAbsence);

    if (formatedDateToday.getTime() == formatedDateSelect.getTime()) {
      const hour = dateToday.toLocaleTimeString().split(":")[0];
      const minute = dateToday.toLocaleTimeString().split(":")[1];
      const formattedTime = parseTime(hour + ":" + minute + ":00");
      const formattedTimeClass = parseTime(studentRespData[0].class_time);

      let differenceInMillis =
        formattedTimeClass.getTime() - formattedTime.getTime();
      let differenceInMinutes = Math.floor(differenceInMillis / 1000 / 60);

      if (differenceInMinutes <= 30) {
        return toast.error(
          "Só é permitido agendar uma falta até 30 minutos antes do início da aula!",
          {
            position: "top-right",
          }
        );
      }
    }

    let data: any[] = [];

    if (
      studentsSelect.length >= 0 &&
      (user as unknown as UserProps).level != 3
    ) {
      studentsSelect.map((s) =>
        data.push({
          registration: s.value,
          class: s.class,
          name: s.label,
          presence: 0,
          edit_by: username,
          made_by: username,
          date: convertDateFormat(dateAbsence),
          schedule_by_responsible: 1,
          comments: comments,
          status: true,
        })
      );
    } else {
      data = [
        {
          registration: studentRespData[0].id,
          class: studentRespData[0].class,
          name: studentRespData[0].name,
          presence: 0,
          edit_by: username,
          made_by: username,
          date: convertDateFormat(dateAbsence),
          schedule_by_responsible: 1,
          comments: comments,
          status: true,
        },
      ];
    }

    try {
      setLoading(true);
      await api.post("/call", data);

      toast.success("Falta agendada com sucesso!");
      verifyUserCreate(true);
      reloadPage();
      setComments("");
      setDateSelectAbsence("");
      setDateAbsence("");
    } catch (error: any) {
      toast.error(error.response.data.error, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTeacher = async (e: React.FormEvent) => {
    e.preventDefault();

    if (route == "studentsClass") {
      return;
    }

    const verifyIfSaveImage = await saveImage();

    if (verifyIfSaveImage == "error") {
      return;
    }

    const data = {
      image: verifyIfSaveImage,
      name: name,
      phone: phone,
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

    try {
      setLoading(true);
      await api.post("/teachers", data);

      toast.success("Professor cadastrado com sucesso!");
      setOpenModal(false);
      reloadPage();
      setLink("");
    } catch {
      toast.error("Ocorreu um erro ao cadastrar o professor!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full">
      <section
        className={`${
          route == "studentsClass" ||
          route == "teacherClass" ||
          route == "responsibleRealeaseds" ||
          route == "turmasCoordenadorSelect"
            ? "hidden"
            : openFilter
            ? "bg-white xl:bg-gray-50 px-5 xl:px-0 py-10 xl:py-0"
            : "bg-white p-5 xl:p-0 xl:bg-gray-50"
        } pt-5 mb-10 border xl:border-0 rounded-lg transition-all`}
      >
        <div
          className={`flex xl:hidden justify-between  cursor-pointer`}
          onClick={() => setOpenFilter(!openFilter)}
        >
          <h3 className="text-lg text-gray-700 font-bold">Filtros</h3>
          <IoIosArrowDown
            fontSize={22}
            className={`${
              openFilter ? "rotate-180" : "rotate-0"
            } transition-all`}
          />
        </div>

        <article
          className={`grid gap-5 ${
            openFilter
              ? "grid-cols-1 xl:grid-cols-2 xl:gap-10"
              : "hidden xl:grid xl:grid-cols-2"
          } mt-5 transition-all`}
        >
          {route == "teachers" && (
            <>
              <Input
                placeholder="Pesquise pelo nome do professor..."
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-full xl:max-w-96"
              />

              <Modal show={openModal} onClose={() => closeModal()}>
                <Modal.Header>
                  Cadastro de
                  <span className="text-primary-color"> professor</span>
                </Modal.Header>
                <form onSubmit={createTeacher}>
                  <Modal.Body
                    className="relative"
                     style={{ maxHeight: modalMaxHeight }}
                  >
                    <div className="space-y-6">
                      <div
                        className={`${
                          link != "" ? "h-64" : "h-48"
                        } flex justify-center transition-all w-full border-dashed ${
                          error && !link && "border-red-500"
                        } border-2 rounded-lg relative text-md font-medium text-gray-700`}
                      >
                        <input
                          required
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
                            <p className="w-full px-3 text-center text-sm md:text-lg">
                              Clique aqui para selecionar uma imagem.
                            </p>
                          </div>
                        )}
                      </div>

                      <FaTrash
                        fontSize={22}
                        onClick={() => setLink("")}
                        className={`${
                          link ? "block" : "hidden"
                        } absolute cursor-pointer top-4 right-9 hover:text-red-700 transition-all`}
                      />

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="nome">
                          Nome: <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="nome"
                          required
                          placeholder="Digite o nome do professor..."
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label>
                          Telefone:
                          <span className="text-red-500"> * </span>
                        </label>

                        <MaskedInput
                          value={phone}
                          onChange={handlePhoneChange}
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="status">
                          Status: <span className="text-red-500">*</span>
                        </label>
                        <Select required onValueChange={(e) => setStatus(e)}>
                          <SelectTrigger className="w-full" id="status">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Ativo</SelectItem>
                            <SelectItem value="0">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
                    <Button
                      type="submit"
                      className="bg-primary-color hover:bg-secondary-color"
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
                    <Button
                      className="bg-white text-black border border-gray-100 hover:bg-gray-100"
                      onClick={() => closeModal()}
                    >
                      Fechar
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </>
          )}

          {route == "call" && (
            <div className={`flex justify-center w-full gap-4`}>
              <Input
                placeholder="Nome do aluno..."
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="w-full"
              />
              

              <Select
                value={String(teamId)}
                onValueChange={(e) =>
                  filterStudentsByTeam(
                    idClass,
                    Number(e),
                    Number(unitId),
                    daySaved != "" ? daySaved : "-99"
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Esportes" />
                </SelectTrigger>

                <SelectContent>
                  {classesDisp.map((c) => {
                    if (c.status == 1) {
                      return (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.description}
                        </SelectItem>
                      );
                    }
                  })}
                </SelectContent>
              </Select>

              <Modal show={openModal} onClose={() => closeModal()}>
                <Modal.Header>
                  Gerar
                  <span className="text-primary-color"> excel</span>
                </Modal.Header>

                <form onSubmit={generateExcel}>
                  <Modal.Body
                    className="relative"
                     style={{ maxHeight: modalMaxHeight }}
                  >
                    <div className="space-y-6">
                      <div className={cn("grade gap-2")}>
                        <label
                          htmlFor="status"
                          className="text-gray-600 text-sm"
                        >
                          Selecione uma data para gerar o filtro:{" "}
                          <span className="text-red-500">*</span>
                        </label>

                        <Popover>
                          <PopoverTrigger asChild className="mt-1">
                            <Button
                              id="data"
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal text-xs",
                                !date2 && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date2?.from ? (
                                date2.to ? (
                                  <>
                                    {format(
                                      date2.from,
                                      "dd 'de' MMMM 'de' yyyy",
                                      { locale: ptBR }
                                    )}{" "}
                                    -{" "}
                                    {format(
                                      date2.to,
                                      "dd 'de' MMMM 'de' yyyy",
                                      { locale: ptBR }
                                    )}
                                  </>
                                ) : (
                                  format(date2.from, "dd 'de' MMMM 'de' yyyy", {
                                    locale: ptBR,
                                  })
                                )
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={date2?.from}
                              selected={date2}
                              onSelect={setDate2}
                              numberOfMonths={2}
                              locale={ptBR}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
                    <Button
                      className="bg-primary-color hover:bg-secondary-color"
                      disabled={!date2}
                    >
                      {loading ? (
                        <div className="flex justify-center">
                          <TbLoader3
                            fontSize={23}
                            style={{
                              animation: "spin 1s linear infinite",
                            }}
                          />
                        </div>
                      ) : (
                        "Gerar"
                      )}
                    </Button>

                    <Button
                      className="bg-white text-black border border-gray-100 hover:bg-gray-100"
                      onClick={() => closeModal()}
                    >
                      Fechar
                    </Button>

                    <button type="submit" className="opacity-0 cursor-default">
                      Gerar
                    </button>
                  </Modal.Footer>
                </form>
              </Modal>
            </div>
          )}

          {route == "agendarFalta" && (
            <>
              <Input
                placeholder="Nome do aluno..."
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="xl:max-w-80"
              />

              <Modal show={openModal} onClose={() => closeModal()}>
                <Modal.Header>
                  Agendamento de
                  <span className="text-primary-color"> falta</span>
                </Modal.Header>

                <form onSubmit={createScheduleAbsence}>
                  <Modal.Body
                    className="relative"
                     style={{ maxHeight: modalMaxHeight }}
                  >
                    {(user as unknown as UserProps).level != 3 ? (
                      <Tabs
                        defaultValue={optionTabs}
                        value={optionTabs != "" ? optionTabs : ""}
                      >
                        <TabsList className="flex justify-center w-full mx-auto mb-7">
                          <TabsTrigger value="selectStudent">
                            Selecione o aluno
                          </TabsTrigger>
                          <TabsTrigger value="schedule">
                            Agendamento
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent
                          value="selectStudent"
                          className={`${isOpen ? "mb-52" : ""} transition-all`}
                        >
                          <div className="flex flex-col gap-2 my-3 mb-10">
                            <label
                              htmlFor="nome"
                              className="text-sm font-medium text-gray-700"
                            >
                              Selecione o(s) aluno(s) desejado:
                              <span className="text-red-500"> *</span>
                            </label>

                            <SelectReact
                              defaultValue={[]}
                              isMulti
                              name="students"
                              value={studentsSelect}
                              // @ts-ignore
                              onChange={(e) => setStudentsSelect(e)}
                              noOptionsMessage={() =>
                                "Nenhum resultado encontrado"
                              }
                              // @ts-ignore
                              options={students}
                              className="basic-multi-select text-sm"
                              onMenuOpen={() => setIsOpen(true)}
                              onMenuClose={() => setIsOpen(false)}
                              maxMenuHeight={200}
                              placeholder="Selecione o(s) aluno(s)"
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="schedule">
                          <div className="space-y-6 mb-5">
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
                                      !dateSelectAbsence &&
                                        "text-muted-foreground"
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
                                    selected={dateSelectAbsence}
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
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <div className="space-y-6 mb-5">
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
                                selected={dateSelectAbsence}
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
                          />
                        </div>
                      </div>
                    )}
                  </Modal.Body>
                  <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
                    {(user as unknown as UserProps).level != 3 ? (
                      optionTabs == "schedule" ? (
                        <>
                          <Button
                            type="submit"
                            className="bg-primary-color hover:bg-secondary-color"
                          >
                            {loading ? (
                              <div className="flex justify-center">
                                <TbLoader3
                                  fontSize={23}
                                  style={{
                                    animation: "spin 1s linear infinite",
                                  }}
                                />
                              </div>
                            ) : (
                              "Salvar"
                            )}
                          </Button>

                          <Button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              setOptionTabs("selectStudent");
                            }}
                            className="bg-white text-black border border-gray-100 hover:bg-gray-100"
                          >
                            Voltar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type="button"
                            className={`bg-primary-color hover:bg-secondary-color ${
                              studentsSelect.length <= 0
                                ? "cursor-not-allowed"
                                : ""
                            }`}
                            disabled={studentsSelect.length <= 0}
                            title={
                              studentsSelect.length <= 0
                                ? "É necessário selecionar um ou mais alunos!"
                                : ""
                            }
                            onClick={(event) => {
                              event.preventDefault();
                              setOptionTabs("schedule");
                            }}
                          >
                            {loading ? (
                              <div className="flex justify-center">
                                <TbLoader3
                                  fontSize={23}
                                  style={{
                                    animation: "spin 1s linear infinite",
                                  }}
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
                        </>
                      )
                    ) : (
                      <>
                        <Button
                          type="submit"
                          className="bg-primary-color hover:bg-secondary-color"
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

                        <Button
                          className="bg-white text-black border border-gray-100 hover:bg-gray-100"
                          onClick={() => closeModal()}
                        >
                          Fechar
                        </Button>
                      </>
                    )}
                  </Modal.Footer>
                </form>
              </Modal>
            </>
          )}

          {route == "students" && (
            <>
              <div className={`flex justify-center w-full gap-4`}>
                <Input
                  placeholder="Nome do aluno..."
                  value={
                    (table.getColumn("name")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                />

                <Select
                  onValueChange={(e) => setClassFilter(e)}
                  value={classFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Turma" />
                  </SelectTrigger>

                  <SelectContent>
                    {classesDispFilter.map((c) => {
                      if (c.status == 1) {
                        return (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.description}
                          </SelectItem>
                        );
                      }
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Modal show={openModal} onClose={() => closeModal()}>
                <Modal.Header>
                  Cadastro de <span className="text-primary-color">aluno</span>
                </Modal.Header>
                <form onSubmit={createStudent}>
                  <Modal.Body
                    className="relative"
                    style={{ maxHeight: modalMaxHeight }}
                  >
                    <div className="space-y-6">
                      <div
                        className={`${
                          link != "" ? "h-64" : "h-48"
                        } flex justify-center transition-all w-full border-dashed ${
                          error && !link && "border-red-500"
                        } border-2 rounded-lg relative text-md font-medium text-gray-700`}
                      >
                        <input
                          required
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
                            <p className="w-full px-3 text-center text-sm md:text-lg">
                              Clique aqui para selecionar uma imagem.
                            </p>
                          </div>
                        )}
                      </div>

                      <FaTrash
                        fontSize={22}
                        onClick={() => setTrash()}
                        className={`${
                          link ? "block" : "hidden"
                        } absolute cursor-pointer top-4 right-9 hover:text-red-700 transition-all`}
                      />

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="nome">
                          Nome: <span className="text-red-500">*</span>
                        </label>

                        <Input
                          id="nome"
                          required
                          placeholder="Digite o nome do aluno..."
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col w-full gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="dateBirth">
                          Data de nascimento:{" "}
                          <span className="text-red-500">*</span>
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
                          required
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
                          onValueChange={(e) =>
                            filterUnitWithClass(e, isStudent)
                          }
                          disabled={
                            isStudent == "" ||
                            (unitsDisp.length == 1 && unitsDisp[0]?.id == 999)
                          }
                          required
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
                              classesDisp.length == 0 ? "flex" : "hidden"
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
                                  Nenhuma turma encontrada, cadastre novas
                                  turmas e tente novamente!
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </label>

                        <Select
                          value={classes != "" ? classes : ""}
                          defaultValue={classes != "" ? classes : ""}
                          onValueChange={(e) => setClasses(e)}
                          disabled={units == "" || classesDisp.length == 0}
                          required
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

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label className="flex justify-between items-center cursor-pointer">
                          <div>
                            Esporte: <span className="text-red-500">*</span>
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

                        <Select
                          onValueChange={(e) => setTeam(e)}
                          value={team != "" ? team : ""}
                          defaultValue={team != "" ? team : ""}
                          disabled={teamsDisp.length <= 0 || units == ""}
                          required
                        >
                          <SelectTrigger className="w-full" id="sport">
                            <SelectValue placeholder="Selecione o esporte" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamsDisp.map((t) => {
                              return (
                                <SelectItem key={t.id} value={String(t.id)}>
                                  {t.description}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="days_training">Dias de treino:</label>

                        <Select onValueChange={(e) => setDaysTraining(e)}>
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
                          disabled={daysTraining == ""}
                          onValueChange={(e) => setClassTime(e)}
                        >
                          <SelectTrigger className="w-full" id="class_time">
                            <SelectValue placeholder="Selecione os dias de treino" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="13:15">
                              13:15 às 15:00
                            </SelectItem>

                            <SelectItem value="17:30">
                              17:30 às 18:20
                            </SelectItem>

                            <SelectItem value="18:20">
                              18:20 às 19:20
                            </SelectItem>

                            <SelectItem value="18:30">
                              18:30 às 19:30
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label>
                          Telefone do responsável:{" "}
                          <span className="text-red-500">*</span>
                        </label>

                        <MaskedInput
                          value={phone}
                          onChange={handlePhoneChange}
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label id="nome_resp">
                          Nome do responsável:{" "}
                          <span className="text-red-500">*</span>
                        </label>

                        <Input
                          id="nome_resp"
                          required
                          placeholder="Digite o nome do responsável..."
                          onChange={(e) => setNameResp(e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="status">
                          Status: <span className="text-red-500">*</span>
                        </label>
                        <Select required onValueChange={(e) => setStatus(e)}>
                          <SelectTrigger className="w-full" id="status">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Ativo</SelectItem>
                            <SelectItem value="2">Experimental</SelectItem>
                            <SelectItem value="3">Pendente</SelectItem>
                            <SelectItem value="0">Inativo</SelectItem>
                            <SelectItem value="4">Desativado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
                    <Button
                      type="submit"
                      className="bg-primary-color hover:bg-secondary-color"
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
                    <Button
                      className="bg-white text-black border border-gray-100 hover:bg-gray-100"
                      onClick={() => closeModal()}
                    >
                      Fechar
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </>
          )}

        {route == "turmasCoordenador" && (
            <>
              <div className={`flex justify-center w-full gap-4`}>
                <Input
                  placeholder="Nome do aluno..."
                  value={
                    (table.getColumn("name")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                />
              </div>
            </>
          )}


          {route == "responsibles_released" && (
            <>
              <Input
                placeholder="Pesquise pelo nome do responsável liberado..."
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-full xl:max-w-96"
              />

              <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>
                  Cadastro de{" "}
                  <span className="text-primary-color">responsável</span>
                </Modal.Header>

                <form onSubmit={(e) => createResponsiblesReleaseds(e)}>
                  <Modal.Body className="relative"  style={{ maxHeight: modalMaxHeight }}>
                    <div className="space-y-6">
                      <div
                        className={`${
                          link != "" ? "h-64" : "h-48"
                        } flex justify-center transition-all w-full border-dashed ${
                          error && !link && "border-red-500"
                        } border-2 rounded-lg relative text-md font-medium text-gray-700`}
                      >
                        <input
                          required
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

                      <FaTrash
                        fontSize={22}
                        onClick={() => setLink("")}
                        className={`${
                          link ? "block" : "hidden"
                        } absolute cursor-pointer top-4 right-9 hover:text-red-700 transition-all`}
                      />

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="name">
                          Nome: <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Digite o nome do responsável..."
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="phone">
                          Telefone: <span className="text-red-500">*</span>
                        </label>
                        <MaskedInput
                          value={phone}
                          onChange={handlePhoneChange}
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="status">
                          Grau de parentesco:{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Select
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
                            <SelectItem value="Irmãos">
                              Irmão ou Irmã
                            </SelectItem>
                            <SelectItem value="Tios">Tio ou Tia</SelectItem>
                            <SelectItem value="Babá">Babá</SelectItem>
                            <SelectItem value="Escolar">
                              Escolar (transporte)
                            </SelectItem>
                            <SelectItem value="Acompanhante">
                              Acompanhante
                            </SelectItem>
                            <SelectItem value="Primos">
                              Primo ou Prima
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="status">
                          Status: <span className="text-red-500">*</span>
                        </label>
                        <Select required onValueChange={(e) => setStatus(e)}>
                          <SelectTrigger
                            className="w-full"
                            id="status"
                            name="status"
                          >
                            <SelectValue placeholder="Selecione o status do responsável" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Ativo</SelectItem>
                            <SelectItem value="0">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
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
                    <Button
                      className="bg-white text-black border border-gray-100 hover:bg-gray-100"
                      onClick={() => setOpenModal(false)}
                    >
                      Fechar
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </>
          )}

          {route == "responsibles" && (
            <>
              <Input
                placeholder="Pesquise pelo nome do responsável..."
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-full xl:max-w-96"
              />

              <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>
                  Cadastro de{" "}
                  <span className="text-primary-color">responsável</span>
                </Modal.Header>
                <form onSubmit={(e) => createResponsibles(e)}>
                  <Modal.Body className="relative" >
                    <div className="space-y-6">
                      <div
                        className={`${
                          link != "" ? "h-64" : "h-48"
                        } flex justify-center transition-all w-full border-dashed ${
                          error && !link && "border-red-500"
                        } border-2 rounded-lg relative text-md font-medium text-gray-700`}
                      >
                        <input
                          required
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

                      <FaTrash
                        fontSize={22}
                        onClick={() => setLink("")}
                        className={`${
                          link ? "block" : "hidden"
                        } absolute cursor-pointer top-4 right-9 hover:text-red-700 transition-all`}
                      />

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="name">
                          Nome: <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Digite o nome do responsável..."
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="phone">
                          Telefone: <span className="text-red-500">*</span>
                        </label>
                        <MaskedInput
                          value={phone}
                          onChange={handlePhoneChange}
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="status">
                          Status: <span className="text-red-500">*</span>
                        </label>
                        <Select required onValueChange={(e) => setStatus(e)}>
                          <SelectTrigger
                            className="w-full"
                            id="status"
                            name="status"
                          >
                            <SelectValue placeholder="Selecione o status do responsável" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Ativo</SelectItem>
                            <SelectItem value="0">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
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
                    <Button
                      className="bg-white text-black border border-gray-100 hover:bg-gray-100"
                      onClick={() => setOpenModal(false)}
                    >
                      Fechar
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </>
          )}

          {route == "users" && (
            <>
              <Input
                placeholder="Pesquise pelo nome do usuário..."
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className=" max-w-80 md:max-w-80"
              />

              <Modal show={openModal} onClose={() => closeModal()}>
                <Modal.Header>
                  Cadastro de{" "}
                  <span className="text-primary-color">usuários</span>
                </Modal.Header>

                <form onSubmit={(e) => createUsers(e)}>
                  <Modal.Body className="relative">
                    <div className="space-y-6">
                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="name">
                          Nível: <span className="text-red-500">*</span>
                        </label>

                        <Select
                          required
                          onValueChange={(e) => setLevel(Number(e))}
                        >
                          <SelectTrigger
                            className="w-full"
                            id="level"
                            name="level"
                          >
                            <SelectValue placeholder="Selecione o nível do usuário" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">Professor</SelectItem>
                            <SelectItem value="1">Administrador</SelectItem>
                            <SelectItem value="4">Porteiro</SelectItem>
                            <SelectItem value="5">Coordenador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {level == 2 && (
                        <>
                          <div
                            className={`${
                              link != "" ? "h-64" : "h-48"
                            } flex justify-center transition-all w-full border-dashed ${
                              error && !link && "border-red-500"
                            } border-2 rounded-lg relative text-md font-medium text-gray-700`}
                          >
                            <input
                              required
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
                                  <image
                                    href={link}
                                    className="my-class w-80"
                                  />
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

                          <FaTrash
                            fontSize={22}
                            onClick={() => setLink("")}
                            className={`${
                              link ? "block" : "hidden"
                            } absolute cursor-pointer top-28 right-9 hover:text-red-700 transition-all`}
                          />
                        </>
                      )}

                      {level != 0 && (
                        <>
                          <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                            <label htmlFor="name">
                              Nome: <span className="text-red-500">*</span>
                            </label>
                            <Input
                              id="name"
                              name="name"
                              value={name}
                              placeholder="Digite o nome do usuário..."
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </div>

                          <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                            <label htmlFor="phone">
                              Telefone: <span className="text-red-500">*</span>
                            </label>

                            <MaskedInput
                              value={phone}
                              onChange={handlePhoneChange}
                            />
                          </div>

                          <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                            <label htmlFor="status">
                              Status: <span className="text-red-500">*</span>
                            </label>
                            <Select
                              defaultValue={status}
                              required
                              onValueChange={(e) => setStatus(e)}
                            >
                              <SelectTrigger
                                className="w-full"
                                id="status"
                                value={status}
                                name="status"
                              >
                                <SelectValue placeholder="Selecione o status do responsável" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Ativo</SelectItem>
                                <SelectItem value="0">Inativo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
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
                    <Button
                      className="bg-white text-black border border-gray-100 hover:bg-gray-100"
                      onClick={() => closeModal()}
                    >
                      Fechar
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </>
          )}

          {route == "turmas" && (
            <>
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Pesquise pela descrição da turma..."
                  value={
                    (table
                      .getColumn("description")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("description")
                      ?.setFilterValue(event.target.value)
                  }
                  className="max-w-full xl:max-w-96"
                />

                <Select
                  onValueChange={(e) => filterByUnit("classes", Number(e))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Unidade" />
                  </SelectTrigger>

                  <SelectContent>
                    {unitsDisp.map((u) => {
                      if (u.status == 1) {
                        return (
                          <SelectItem key={u.id} value={String(u.id)}>
                            {u.description}
                          </SelectItem>
                        );
                      }
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Modal show={openCoordinatorModal} onClose={() => setOpenCoordinatorModal(false)}>
                <Modal.Header>
                  Selecionar <span className="text-primary-color">turmas</span>
                </Modal.Header>
                <form onSubmit={(e) => selectClassesToCoordinatorSee(e)}>
                  <Modal.Body className="relative">
                    <div>
                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <DataTable
                          //@ts-ignore
                          columns={columnsCoordinator}
                          //@ts-ignore
                          data={data}
                          route={"turmasCoordenadorSelect"}
                        />
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
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
                  </Modal.Footer>
                </form>
              </Modal>


              <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>
                  Cadastro de <span className="text-primary-color">turma</span>
                </Modal.Header>
                <form onSubmit={(e) => createClasses(e)}>
                  <Modal.Body className="relative">
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
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="units">
                          Unidade: <span className="text-red-500">*</span>
                        </label>
                        <Select onValueChange={(e) => setUnits(e)}>
                          <SelectTrigger className="w-full" id="units">
                            <SelectValue placeholder="Selecione a unidade" />
                          </SelectTrigger>

                          <SelectContent>
                            {unitsDisp.map((u) => {
                              if (u.id == 999) {
                                return;
                              }

                              return (
                                <SelectItem key={u.id} value={String(u.id)}>
                                  {u.description}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="status">
                          Status: <span className="text-red-500">*</span>
                        </label>
                        <Select required onValueChange={(e) => setStatus(e)}>
                          <SelectTrigger
                            className="w-full"
                            id="status"
                            name="status"
                          >
                            <SelectValue placeholder="Selecione o status da turma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Ativo</SelectItem>
                            <SelectItem value="0">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
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
                    <Button
                      className="bg-white text-black border border-gray-100 hover:bg-gray-100"
                      onClick={() => setOpenModal(false)}
                    >
                      Fechar
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>


            </>
          )}

          {route == "units" && (
            <>
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Pesquise pela descrição da unidade..."
                  value={
                    (table
                      .getColumn("description")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("description")
                      ?.setFilterValue(event.target.value)
                  }
                  className="max-w-full xl:max-w-96"
                />
              </div>

              <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>
                  Cadastro de{" "}
                  <span className="text-primary-color">unidade</span>
                </Modal.Header>
                <form onSubmit={(e) => createUnit(e)}>
                  <Modal.Body className="relative">
                    <div className="space-y-6">
                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="description">
                          Descrição: <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="description"
                          name="description"
                          placeholder="Digite a descrição da unidade..."
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="status">
                          Status: <span className="text-red-500">*</span>
                        </label>
                        <Select required onValueChange={(e) => setStatus(e)}>
                          <SelectTrigger
                            className="w-full"
                            id="status"
                            name="status"
                          >
                            <SelectValue placeholder="Selecione o status do esporte" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Ativo</SelectItem>
                            <SelectItem value="0">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
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
                    <Button
                      className="bg-white text-black border border-gray-100 hover:bg-gray-100"
                      onClick={() => setOpenModal(false)}
                    >
                      Fechar
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </>
          )}

          {route == "esportes" && (
            <>
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Pesquise pela descrição do esporte..."
                  value={
                    (table
                      .getColumn("description")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("description")
                      ?.setFilterValue(event.target.value)
                  }
                />

                <Select
                  onValueChange={(e) => filterByUnit("sports", Number(e))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Unidade" />
                  </SelectTrigger>

                  <SelectContent>
                    {unitsDisp.map((u) => {
                      if (u.status == 1) {
                        return (
                          <SelectItem key={u.id} value={String(u.id)}>
                            {u.description}
                          </SelectItem>
                        );
                      }
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>
                  Cadastro de{" "}
                  <span className="text-primary-color">esporte</span>
                </Modal.Header>
                <form onSubmit={(e) => createSports(e)}>
                  <Modal.Body className="relative">
                    <div className="space-y-6">
                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="description">
                          Descrição: <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="description"
                          name="description"
                          placeholder="Digite a descrição do esporte..."
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </div>

                      {/* <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="modality">
                          Modalidade: <span className="text-red-500">*</span>
                        </label>
                        <Select required onValueChange={(e) => setModality(e)}>
                          <SelectTrigger
                            className="w-full"
                            id="modality"
                            name="modality"
                          >
                            <SelectValue placeholder="Selecione a modalidade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Futsal">Futsal</SelectItem>
                            <SelectItem value="Handebol">Handebol</SelectItem>
                            <SelectItem value="Vôlei">Vôlei</SelectItem>
                          </SelectContent>
                        </Select>
                      </div> */}

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="units">
                          Unidade: <span className="text-red-500">*</span>
                        </label>
                        <Select onValueChange={(e) => setUnits(e)}>
                          <SelectTrigger className="w-full" id="units">
                            <SelectValue placeholder="Selecione a unidade" />
                          </SelectTrigger>

                          <SelectContent>
                            {unitsDisp.map((u) => {
                              if (u.id == 999) {
                                return;
                              }

                              return (
                                <SelectItem key={u.id} value={String(u.id)}>
                                  {u.description}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="status">
                          Status: <span className="text-red-500">*</span>
                        </label>
                        <Select required onValueChange={(e) => setStatus(e)}>
                          <SelectTrigger
                            className="w-full"
                            id="status"
                            name="status"
                          >
                            <SelectValue placeholder="Selecione o status do esporte" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Ativo</SelectItem>
                            <SelectItem value="0">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
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
                    <Button
                      className="bg-white text-black border border-gray-100 hover:bg-gray-100"
                      onClick={() => setOpenModal(false)}
                    >
                      Fechar
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </>
          )}

          <div className="flex gap-5">
            {route != "studentsClass" && route != "teacherClass" && route != "turmasCoordenadorSelect" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="w-full xl:w-40">
                  <Button variant="outline" className={`${(route == "call" || route == "turmas") ? "hidden 2xl:flex" : ""} ml-auto gap-1`}>
                    <TbAdjustmentsHorizontal fontSize={20} /> Colunas
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Alterar colunas</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value: any) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id == "image" && "Foto"}

                          {column.id == "name" && "Nome"}

                          {column.id == "responsible_name" && "Responsável"}

                          {column.id == "class" && "Turma"}

                          {column.id == "phone" && "Telefone"}

                          {column.id == "desc_unit" && "Unidade"}

                          {route == "agendarFalta"
                            ? column.id == "comments" && "Motivo"
                            : column.id == "comments" && "Observações"}

                          {column.id == "comments_call" && "Motivo"}

                          {column.id == "date" && "Data agendada"}

                          {column.id == "date_of_birth" && "Data de nascimento"}

                          {column.id == "category" && "Categoria"}

                          {column.id == "degree_kinship" &&
                            "Grau de parentesco"}

                          {column.id == "description_sport" && "Esporte"}

                          {column.id == "modality" && "Modalidade"}

                          {column.id == "team" && "Equipe"}

                          {column.id == "status" && "Status"}

                          {column.id == "status_call" && "Status"}

                          {column.id == "actions" && "Ações"}

                          {column.id == "level" && "Nível"}

                          {column.id == "complete_register" &&
                            "Cadastro completo"}

                          {route == "students"
                            ? column.id == "id" && "Matrícula"
                            : column.id == "id" && "Código"}

                          {column.id == "description" && "Descrição"}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              onClick={() => openModals()}
              className={`${
                route != "students" ? "hidden" : "flex"
              } w-full xl:max-w-44 gap-1 items-center justify-center bg-primary-color hover:bg-secondary-color`}
            >
              <MdPersonAdd fontSize={23} className="hidden md:flex" />
              Cadastrar <span className="hidden md:block">aluno</span>
            </Button>

            <Button
              onClick={() => openCoordinatorModals()}
              className={`${
                route != "turmas" ? "hidden" : "flex"
              } w-full xl:max-w-48 gap-1 items-center justify-center bg-primary-color hover:bg-secondary-color`}
            >
              <BsUiChecksGrid fontSize={16} className="hidden md:flex" />
              Selecionar 
            </Button>

            <Button
              onClick={() => openModals()}
              className={`${
                route != "turmas" ? "hidden" : "flex"
              } w-full xl:max-w-48 gap-1 items-center justify-center bg-primary-color hover:bg-secondary-color`}
            >
              <MdGroupAdd fontSize={22} className="hidden md:flex" />
              Cadastrar 
            </Button>

            <Button
              onClick={() => openModals()}
              className={`${
                route != "units" ? "hidden" : "flex"
              } w-full xl:max-w-48 gap-1 items-center justify-center bg-primary-color hover:bg-secondary-color`}
            >
              <BsBuildingAdd fontSize={22} className="hidden md:flex" />
              Cadastrar <span className="hidden md:block">unidade</span>
            </Button>

            <Button
              onClick={() => openModals()}
              className={`${
                route != "esportes" ? "hidden" : "flex"
              } w-full xl:max-w-48 gap-1 items-center justify-center bg-primary-color hover:bg-secondary-color`}
            >
              <FaPlus fontSize={15} className="hidden md:flex" />
              Cadastrar <span className="hidden md:block">esporte</span>
            </Button>

            <Button
              onClick={() => openModals()}
              className={`${
                route != "teachers" ? "hidden" : "flex"
              } w-full xl:max-w-52 gap-1 items-center justify-center bg-primary-color hover:bg-secondary-color`}
            >
              <MdPersonAdd fontSize={20} className="hidden md:flex" />
              Cadastrar <span className="hidden md:block">professor</span>
            </Button>

            <Button
              onClick={() => openModals()}
              className={`${
                route != "agendarFalta" ? "hidden" : "flex"
              } w-full xl:max-w-52 gap-1 items-center justify-center bg-primary-color hover:bg-secondary-color`}
            >
              <MdPersonAdd fontSize={20} className="hidden md:flex" />
              Agendar falta <span className="hidden md:block"></span>
            </Button>

            <Button
              onClick={() => openModals()}
              className={`${
                route != "users" ? "hidden" : "flex"
              } w-full xl:max-w-52 gap-1 items-center justify-center bg-primary-color hover:bg-secondary-color`}
            >
              <MdPersonAdd fontSize={20} className="hidden md:flex" />
              Criar usuário <span className="hidden md:block"></span>
            </Button>

            <Button
              onClick={() => openModals()}
              className={`${
                route != "responsibles_released" || (user as unknown as UserProps).level == 4 ? "hidden" : "flex"
              } w-full xl:max-w-52 gap-1 items-center justify-center bg-primary-color hover:bg-secondary-color`}
            >
              <MdPersonAdd fontSize={20} className="hidden md:flex" />
              Cadastrar <span className="hidden md:block">novo</span>
            </Button>

            <Button
              onClick={() => openExcelModal()}
              className={`${
                route != "call" ||
                ((user as unknown as UserProps).level != 0 &&
                  (user as unknown as UserProps).level != 1)
                  ? "hidden"
                  : "flex"
              } w-full xl:max-w-44 gap-1 items-center justify-center bg-primary-color hover:bg-secondary-color`}
              disabled={data.length <= 0}
            >
              <PiMicrosoftExcelLogoFill
                fontSize={23}
                className="hidden md:flex"
              />
              Gerar excel
            </Button>
            

            <Button
              onClick={() => openModals()}
              className={`${
                route != "call" ? "hidden" : "flex"
              } w-full xl:max-w-44 gap-1 items-center justify-center bg-primary-color hover:bg-secondary-color`}
              disabled={data.length <= 0}
            >
              <MdFormatListBulletedAdd
                fontSize={23}
                className="hidden md:flex"
              />
              Chamada
            </Button>
          </div>
        </article>
      </section>

      <div
        className={`${
          route != "studentsClass" && route != "teacherClass"
            ? "border-2 rounded-lg bg-white"
            : "border rounded-sm bg-white"
        }`}
      >
        <Table className="select-none">
          <TableHeader
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "white",
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={"text-center"}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            style={{ maxHeight: "200px" }}
            className=" overflow-y-auto"
          >
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`
                  ${
                    location.pathname == "/chamada" &&
                    (row.original as RowProps).status == 2
                      ? "bg-yellow-400"
                      : ""
                  } 
                  ${
                    location.pathname == "/chamada" &&
                    (row.original as RowProps).status == 3
                      ? " bg-orange-500"
                      : ""
                  }
                  ${
                    location.pathname == "/chamada" &&
                    (row.original as RowProps).status == 0
                      ? "bg-red-500"
                      : ""
                  }
                  ${
                    location.pathname == "/alunos" &&
                    (row.original as RowProps).status == 4
                      ? "bg-red-500"
                      : ""
                  }`
                }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={`whitespace-nowrap ${((location.pathname == "alunos" || location.pathname == "chamada") && (cell.column.id == "name" || cell.column.id == "responsible_name")) ? "text-left" : "text-center"}`}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground hidden">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </main>
  );
}
