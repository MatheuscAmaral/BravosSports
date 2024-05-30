import * as React from "react";
import { toast } from "react-hot-toast";
import { TbLoader3 } from "react-icons/tb";
import { MdFormatListBulletedAdd, MdPersonAdd, MdGroupAdd } from "react-icons/md";
import Datepicker from "tailwind-datepicker-react";
import { IoChevronBackOutline, IoChevronForward  } from "react-icons/io5";
import {
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
import { ChevronDown } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { FiAlertOctagon } from "react-icons/fi";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Modal } from "flowbite-react";
import { Button } from "@/components/ui/button";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";

const uploader = Uploader({
  apiKey: "free",
});


const options = { multi: true };

import api from "@/api";
import { ClassesProps } from "@/pages/classes";
import { ReloadContext } from "@/contexts/ReloadContext";
import MaskedInput from "../InputMask";
// import { TeachersProps } from "@/pages/teachers";
import { AuthContext, UserProps } from "@/contexts/AuthContext";

interface DataTableProps {
  data: [];
  columns: [];
  route: string;
}

export interface ResponsibleProps {
  id: number;
  name: string;
  phone: string;
  status: number;
}

export interface UnitsProps {
  id: number;
  description: string;
  status: number;
}

export function DataTable({ data, columns, route }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const { username } = React.useContext(AuthContext);
  const [openModal, setOpenModal] = React.useState(false);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [link, setLink] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isStudent, setIsStudent] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [name, setName] = React.useState("");
  const [nameResp, setNameResp] = React.useState("");
  const [classesDisp, setClassesDisp] = React.useState<ClassesProps[]>([]);
  const [classesDispFilter, setClassesDispFilter] = React.useState<ClassesProps[]>([]);
  const [team, setTeam] = React.useState("");
  const [teamsDisp, setTeamsDisp] = React.useState<ClassesProps[]>([]);
  const [modality, setModality] = React.useState("");
  const [units, setUnits] = React.useState("");
  const [unitsDisp, setUnitsDisp] = React.useState<UnitsProps[]>([]);
  const [classFilter, setClassFilter] = React.useState("999");
  const [classes, setClasses] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [status, setStatus] = React.useState("1");
  const [userSelected, setUserSelected] = React.useState("");
  const [users, setUsers] = React.useState<UserProps[]>([]);
  const [date, setDate] = React.useState("");
  const { filterStudentsByClass, filterStudentsByTeam, idClass, teamId, filterByUnit, reloadPage, verifyUserCreate, unitId } = React.useContext(ReloadContext);

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
        prev: () => <span><IoChevronBackOutline/></span>,
        next: () => <span><IoChevronForward/></span>,
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
        year: "numeric"
    }
}

  const [show, setShow] = React.useState<boolean>(false);

  const handleChange = (selectedDate: Date) => {
    setDate(selectedDate.toLocaleDateString('pt-BR'));
  }
  
  const handleClose = (state: boolean) => {
      setShow(state)
  }

  const handlePhoneChange = (value: string) => {
    setPhone(value);
  };

  const changeIsStudent = (e: string) => {
    setIsStudent(e);
    
    if (units != "") {
      filterUnitWithClass(units, e)
    }
  }

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
  }
  
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

      filterStudentsByClass(Number(classFilter))
    }, [classFilter]);
  }

  if (route == "turmas" || route == "teachers" || route == "esportes" || route == "responsibles") {
    React.useEffect(() => {
      getUnits();
    }, []);
  }

  if (route == "call") {   
    React.useEffect(() => {
      const getTeamsFilter = async () => {
        const response = await api.get(`/sports`);

        response.data.unshift({id: 999, description: 'Todos', status: 1});
        setClassesDisp(response.data);
      }

      getTeamsFilter();
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

  const createSports = async (e: React.FormEvent) => {
    e.preventDefault();

    if (route == "studentsClass") {
      return;
    }

    const data = {
      description: description,
      modality: modality,
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

    const data = {
      image: link,
      name: name,
      phone: phone,
      unit: units,
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

  const getUnits = async () => {
    try {
      const response = await api.get("/units");

      response.data.unshift({id: 999, description: 'Todos', status: 1});
      setUnitsDisp(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar as unidades disponíveis!");
    }
  };

  const getClasses = async () => {
    try {
      const response = await api.get("/classes");

      response.data.unshift({id: 999, description: 'Todos', status: 1});

      if (route == "students") {
        response.data.map((s: { id: number; description: string; desc_unit: string }) => {
          if (s.id != 999) {
            s.description += ' - ' + s.desc_unit;
          }
        });
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

  const getUsers = async () => {
    try {
      const response = await api.get("/users/level/2");

      setUsers(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar os usuários disponíveis!");
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
    };
  };

  const makeCall = async (students: Student[]) => {
    try {
      const studentsMap = students.map((s) => s.original);

      const transformedStudents = studentsMap.map((student) => ({
        registration: student.id,
        class: student.class,
        name: student.name,
        presence: student.presence,
        edit_by: username,
        id_call: student.id_call,
        ...((student.presence == null || student.date == null) && { made_by: username })
      }));      

      const filterTransformedStudents = transformedStudents.filter(t => t.presence != null);

      await api.post("/call", filterTransformedStudents);
      toast.success("Chamada realizada com sucesso!");
    } catch {
      toast.error("Ocorreu um erro ao realizar a chamada!");
    }
  };

  const openModals = async () => {
    setOpenModal(true);

    if (route == "students") {
      // await getResponsibles();
      await getTeams();
    }
    
    if (route == "esportes") {
      await getClasses();
    }

    if (route == "teachers") {
      await getUsers();
    }

    route != "call" && await getUnits();
    
    if (route == "call") {
      makeCall(table.getRowModel().rows);
    }
  };

  const closeModal = () => {
    setError(false);
    setOpenModal(false);
    handlePhoneChange("");
    setDate("");
    setUnits("");
    setClasses("");
    setTeam("");
    setShow(false);
    setPhone("");
    setIsStudent("");
  };

  const createStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (route == "studentsClass") {
      return;
    }

    const data = {
      image: link,
      name: name,
      team: team,
      date_of_birth: date,
      resp_phone: phone,
      resp_name: nameResp,
      status: status,
      class: classes,
      unit: units
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
      setLoading(true);
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
    }
  };

  const createTeacher = async (e: React.FormEvent) => {
    e.preventDefault();

    if (route == "studentsClass") {
      return;
    }

    const data = {
      image: link,
      name: name,
      userId: userSelected,
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
    }
  };

  return (
    <main className="w-full">
      <section
        className={`${
          route == "studentsClass" || route == "teacherClass" || route == "responsibleRealeaseds"
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
                  className="max-w-80"
              />

              <Modal show={openModal} onClose={() => closeModal()}>
                <Modal.Header>Cadastro de <span className="text-primary-color">professor</span></Modal.Header>
                <form onSubmit={createTeacher}>
                  <Modal.Body
                    className="relative"
                    style={{ maxHeight: "500px" }}
                  >
                    <div className="space-y-6">
                      <UploadButton
                        uploader={uploader}
                        options={options}
                        onComplete={(files) =>
                          files.length > 0 &&
                          setLink(files.map((x) => x.fileUrl).join("\n"))
                        }
                      >
                        {({ onClick }) => (
                          <button
                            onClick={onClick}
                            className={`h-48 w-full border-dashed ${
                              error && !link && "border-red-500"
                            } border-2 rounded-lg relative text-md font-medium text-gray-700`}
                          >
                            {link ? (
                              <div className="flex justify-center">
                                <img
                                  src={link}
                                  className="w-32"
                                  alt="foto_professor"
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2 items-center justify-center ">
                                <IoIosImages fontSize={40} />
                                <p className="w-full text-sm md:text-lg">
                                  Clique aqui para selecionar uma imagem.
                                </p>
                              </div>
                            )}
                          </button>
                        )}
                      </UploadButton>

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
                        <label htmlFor="user">Usuário:</label>
                        <Select
                          required
                          onValueChange={(e) => setUserSelected(e)}
                        >
                          <SelectTrigger id="user" className="w-full">
                            <SelectValue placeholder="Selecione o usuário para vincular" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((u) => {
                              return (
                                <SelectItem
                                  key={String(u.id)}
                                  value={String(u.id)}
                                >
                                  {u.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="status">Status: <span className="text-red-500">*</span></label>
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
                  <Modal.Footer  className="h-16 md:h-20 rounded-b-lg bg-white">
                    <Button type="submit" className="bg-primary-color hover:bg-secondary-color">Salvar</Button>
                    <Button className="bg-white text-black border border-gray-100 hover:bg-gray-100" onClick={() => closeModal()}>
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
              />

              <Select value={String(teamId)} onValueChange={(e) => filterStudentsByTeam(idClass, Number(e), Number(unitId))}>
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
            </div>
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

                <Select onValueChange={(e) => setClassFilter(e)} value={classFilter}>
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
                <Modal.Header>Cadastro de <span className="text-primary-color">aluno</span></Modal.Header>
                <form onSubmit={createStudent} >
                  <Modal.Body
                    className="relative"
                    style={{ maxHeight: "500px" }}
                  >
                    <div className="space-y-6">
                      <UploadButton
                        uploader={uploader}
                        options={options}
                        onComplete={(files) =>
                          files.length > 0 &&
                          setLink(files.map((x) => x.fileUrl).join("\n"))
                        }
                      >
                        {({ onClick }) => (
                          <button
                            onClick={onClick}
                            className={`h-48 w-full border-dashed ${
                              error && !link && "border-red-500"
                            } border-2 rounded-lg relative text-md font-medium text-gray-700`}
                          >
                            {link ? (
                              <div className="flex justify-center">
                                <img
                                  src={link}
                                  className="w-32"
                                  alt="foto_aluno"
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2 items-center justify-center ">
                                <IoIosImages fontSize={40} />
                                <p className="w-full text-sm md:text-lg">
                                  Clique aqui para selecionar uma imagem.
                                </p>
                              </div>
                            )}
                          </button>
                        )}
                      </UploadButton>

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
                          placeholder="Digite o nome do aluno..."
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col w-full gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="dateBirth">
                          Data de nascimento: <span className="text-red-500">*</span>
                        </label>

                        {/* @ts-ignore */}
                        <Datepicker options={optionsDate} onChange={handleChange} show={show} setShow={handleClose}>
                            <div className="flex gap-2 p-2.5 border rounded-lg w-full cursor-pointer" onClick={() => setShow(!show)}>
                                <input type="text" placeholder="Selecione a data de nascimento" className=" placeholder:text-gray-600 cursor-pointer w-full" value={date} readOnly />
                            </div>
                        </Datepicker>
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="class">
                          É um aluno do colégio ? <span className="text-red-500">*</span>
                        </label>
                        <Select onValueChange={(e) => changeIsStudent(e)}>
                          <SelectTrigger className="w-full" id="class">
                            <SelectValue placeholder="Selecione sim ou não" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value={"1"}>
                                Sim
                              </SelectItem>
                              <SelectItem value={"0"}>
                                Não
                              </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label className="flex justify-between items-center cursor-pointer">
                          <div>
                            Unidade: <span className="text-red-500">*</span>
                          </div>

                          <div className={`${(unitsDisp.length == 1 && unitsDisp[0]?.id == 999) ? "block" : "hidden"}`}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button className=" border-none bg-transparent h-9 hover:bg-transparent flex justify-center">
                                  <FiAlertOctagon fontSize={19} className="text-yellow-800  "/>
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Aviso!</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="py-2 p-3 text-sm">
                                  Nenhuma unidade encontrada, cadastre novas unidades e tente novamente!
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </label>

                        <Select defaultValue={units} onValueChange={(e) => filterUnitWithClass(e, isStudent)} disabled={isStudent == "" || (unitsDisp.length == 1 && unitsDisp[0]?.id == 999)}>
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

                          <div className={(classesDisp.length == 1 && classesDisp[0]?.id == 999) ? "flex" : "hidden"}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button className=" border-none bg-transparent h-9 hover:bg-transparent flex justify-center">
                                  <FiAlertOctagon fontSize={19} className="text-yellow-800  "/>
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Aviso!</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="py-2 p-3 text-sm">
                                  Nenhuma turma encontrada, cadastre novas turmas e tente novamente!
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </label>

                        <Select value={classes != "" ? classes : ""} defaultValue={classes != "" ? classes : ""} onValueChange={(e) => setClasses(e)} disabled={units == "" || (classesDisp.length == 1 && classesDisp[0]?.id == 999)}>
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

                          <div className={teamsDisp.length <= 0 ? "flex" : "hidden"}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button className=" border-none bg-transparent h-9 hover:bg-transparent flex justify-center">
                                  <FiAlertOctagon fontSize={19} className="text-yellow-800  "/>
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Aviso!</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="py-2 p-3 text-sm">
                                  Nenhum esporte encontrado, cadastre novos esportes e tente novamente!
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </label>

                        <Select onValueChange={(e) => setTeam(e)} disabled={teamsDisp.length <= 0}>
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
                        <label>
                          Telefone do responsável: <span className="text-red-500">*</span>
                        </label>
                        
                        <MaskedInput
                          value={phone}
                          onChange={handlePhoneChange}
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label id="nome_resp">
                          Nome do responsável: <span className="text-red-500">*</span>
                        </label>
                        
                        
                        <Input
                          id="nome_resp"
                          required
                          placeholder="Digite o nome do responsável..."
                          onChange={(e) => setNameResp(e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="status">Status:  <span className="text-red-500">*</span></label>
                        <Select required onValueChange={(e) => setStatus(e)}>
                          <SelectTrigger className="w-full" id="status">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Ativo</SelectItem>
                            <SelectItem value="3">Experimental</SelectItem>
                            <SelectItem value="0">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
                    <Button type="submit" className="bg-primary-color hover:bg-secondary-color">Salvar</Button>
                    <Button className="bg-white text-black border border-gray-100 hover:bg-gray-100" onClick={() => closeModal()}>
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
                className="max-w-80"
              />

              <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Cadastro de <span className="text-primary-color">responsável</span></Modal.Header>
                <form onSubmit={(e) => createResponsibles(e)}>
                  <Modal.Body className="relative">
                    <div className="space-y-6">
                    <UploadButton
                        uploader={uploader}
                        options={options}
                        onComplete={(files) =>
                          files.length > 0 &&
                          setLink(files.map((x) => x.fileUrl).join("\n"))
                        }
                      >
                        {({ onClick }) => (
                          <button
                            onClick={onClick}
                            className={`h-48 w-full border-dashed ${
                              error && !link && "border-red-500"
                            } border-2 rounded-lg relative text-md font-medium text-gray-700`}
                          >
                            {link ? (
                              <div className="flex justify-center">
                                <img
                                  src={link}
                                  className="w-32"
                                  alt="foto_aluno"
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2 items-center justify-center ">
                                <IoIosImages fontSize={40} />
                                <p className="w-full text-sm md:text-lg">
                                  Clique aqui para selecionar uma imagem.
                                </p>
                              </div>
                            )}
                          </button>
                        )}
                      </UploadButton>

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
                    <Button className="text-center bg-primary-color hover:bg-secondary-color" type="submit">
                      {loading ? <TbLoader3 /> : "Salvar"}
                    </Button>
                    <Button className="bg-white text-black border border-gray-100 hover:bg-gray-100" onClick={() => setOpenModal(false)}>
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
                  className="w-full"
                />

                <Select onValueChange={(e) => filterByUnit("classes", Number(e))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Unidade" />
                  </SelectTrigger>

                  <SelectContent>
                    {unitsDisp.map((c) => {
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

              <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Cadastro de <span className="text-primary-color">turma</span></Modal.Header>
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
                    <Button className="text-center bg-primary-color hover:bg-secondary-color" type="submit">
                      {loading ? <TbLoader3 /> : "Salvar"}
                    </Button>
                    <Button className="bg-white text-black border border-gray-100 hover:bg-gray-100" onClick={() => setOpenModal(false)}>
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

                <Select onValueChange={(e) => filterByUnit("sports", Number(e))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Unidade" />
                  </SelectTrigger>

                  <SelectContent>
                    {unitsDisp.map((c) => {
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

              <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Cadastro de <span className="text-primary-color">esporte</span></Modal.Header>
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

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
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

                      {/* <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="class">Turma:</label>
                        <Select onValueChange={(e) => setClasses(e)}>
                          <SelectTrigger
                            className="w-full"
                            id="class"
                            name="class"
                          >
                            <SelectValue placeholder="Selecione a turma" />
                          </SelectTrigger>
                          <SelectContent>
                            {classesDisp.map((c) => {
                              return (
                                <SelectItem value={String(c.id)}>
                                  {c.description}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div> */}

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
                    <Button className="text-center bg-primary-color hover:bg-secondary-color" type="submit">
                      {loading ? <TbLoader3 /> : "Salvar"}
                    </Button>
                    <Button className="bg-white text-black border border-gray-100 hover:bg-gray-100" onClick={() => setOpenModal(false)}>
                      Fechar
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </>
          )}

          <div className="flex gap-5">
            {route != "studentsClass" && route != "teacherClass" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="w-full xl:w-40">
                  <Button variant="outline" className="ml-auto">
                    Colunas <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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

                          {column.id == "responsible" && "Responsável"}

                          {column.id == "class" && "Turma"}

                          {column.id == "phone" && "Telefone"}

                          {column.id == "desc_unit" && "Unidade"}

                          {column.id == "date_of_birth" && "Data de nascimento"}

                          {column.id == "category" && "Categoria"}

                          {column.id == "modality" && "Modalidade"}

                          {column.id == "team" && "Equipe"}

                          {column.id == "status" && "Status"}

                          {column.id == "actions" && "Ações"}

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
              <MdPersonAdd fontSize={23} className="hidden md:flex"/>
              Cadastrar <span className="hidden md:block">aluno</span>
            </Button>

            <Button
              onClick={() => openModals()}
              className={`${
                route != "turmas" ? "hidden" : "flex"
              } w-full xl:max-w-48 gap-1 items-center justify-center bg-primary-color hover:bg-secondary-color`}
            >
              <MdGroupAdd fontSize={22} className="hidden md:flex"/>
              Cadastrar <span className="hidden md:block">turma</span>
            </Button>

            <Button
              onClick={() => openModals()}
              className={`${
                route != "esportes" ? "hidden" : "flex"
              } w-full xl:max-w-48 gap-1 items-center justify-center bg-primary-color hover:bg-secondary-color`}
            >
              <FaPlus fontSize={15} className="hidden md:flex"/>
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
                route != "responsibles" ? "hidden" : "flex"
              } w-full xl:max-w-56 gap-1 items-center justify-center bg-primary-color hover:bg-secondary-color`}
            >
              <MdPersonAdd fontSize={20} className="hidden md:flex"/>
              Cadastrar <span className="hidden md:block">responsável</span>
            </Button>

            <Button
              onClick={() => openModals()}
              className={`${
                route != "call" ? "hidden" : "flex"
              } w-full xl:max-w-44 gap-1 items-center justify-center bg-primary-color hover:bg-secondary-color`}
            >
              <MdFormatListBulletedAdd fontSize={23} className="hidden md:flex"/>
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
                  className={`${"text-center"}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
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
