import * as React from "react";
import { toast } from "react-hot-toast";
import { TbLoader3 } from "react-icons/tb";
import { MdFormatListBulletedAdd, MdPersonAdd, MdGroupAdd,MdSportsKabaddi } from "react-icons/md";
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
import { FaTrash } from "react-icons/fa";
import { Modal } from "flowbite-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
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
import { TeachersProps } from "@/pages/teachers";
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

export function DataTable({ data, columns, route }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const { user } = React.useContext(AuthContext);
  const [openModal, setOpenModal] = React.useState(false);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [link, setLink] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { reloadPage, verifyUserCreate } = React.useContext(ReloadContext);
  const [description, setDescription] = React.useState("");
  const [newData, setNewData] = React.useState([]);
  const [name, setName] = React.useState("");
  const [classesDisp, setClassesDisp] = React.useState<ClassesProps[]>([]);
  const [team, setTeam] = React.useState("");
  const [teamsDisp, setTeamsDisp] = React.useState<ClassesProps[]>([]);
  const [responsible, setResponsible] = React.useState("");
  const [modality, setModality] = React.useState("");
  const [responsibles, setResponsibles] = React.useState<ResponsibleProps[]>(
    []
  );
  const [classes, setClasses] = React.useState("");
  const [classesFilter, setClassesFilter] = React.useState("0");
  const [teamFilter, setTeamFilter] = React.useState("0");
  const [phone, setPhone] = React.useState("");
  const [status, setStatus] = React.useState("1");
  const [teacher, setTeacher] = React.useState("1");
  const [teachers, setTeachers] = React.useState<TeachersProps[]>([]);
  const [userSelected, setUserSelected] = React.useState("");
  const [users, setUsers] = React.useState<UserProps[]>([]);
  const { filterStudentsByClass, filterStudentsByTeam, idClass } = React.useContext(ReloadContext);

  React.useEffect(() => {
    setNewData(data);
    if (route == "students") {
      getClasses();
    }
  }, []);

  const handlePhoneChange = (value: string) => {
    setPhone(value);
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
      filterStudentsByClass(Number(classesFilter));
    }, [classesFilter]);
  }

  if (route == "call") {
    React.useEffect(() => {
      const getTeamsFilter = async () => {
        const response = await api.get(`/sports`);
        
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
      status: status,
    };

    try {
      setLoading(true);
      await api.post("/classes", data);
      toast.success("Turma cadastrada com sucesso!");
      setNewData((allData) => ({ ...allData, data }));
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
      class: classes,
      teacher_id: teacher,
      status: status,
    };

    try {
      setLoading(true);
      await api.post("/sports", data);
      toast.success("Esporte cadastrado com sucesso!");
      setNewData((allData) => ({ ...allData, data }));
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
      name: name,
      phone: phone,
      status: status,
    };

    try {
      setLoading(true);
      await api.post("/responsibles", data);
      toast.success(`${name} cadastrada com sucesso!`);
      setNewData((allData) => ({ ...allData, data }));
      setOpenModal(false);
      reloadPage();
      handlePhoneChange("");
    } catch {
      toast.error("Ocorreu um erro ao cadastrar o responsável!");
    } finally {
      setLoading(false);
    }
  };

  const getResponsibles = async () => {
    try {
      const response = await api.get("/responsibles");

      setResponsibles(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar os responsáveis disponíveis!");
    }
  };

  const getClasses = async () => {
    try {
      const response = await api.get("/classes");

      setClassesDisp(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar as turmas disponíveis!");
    }
  };

  const getTeachers = async () => {
    try {
      const response = await api.get("/teachers");

      setTeachers(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar os professores disponíveis!");
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

  const getStudentsFilter = (idTeam: any) => {
    setTeamFilter(idTeam);

    filterStudentsByTeam(idClass, idTeam);
  }

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
      id: string;
      class: string;
      name: string;
    };
  };

  const makeCall = async (students: Student[]) => {
    try {
      const studentsMap = students.map((s) => s.original);

      const transformedStudents = studentsMap.map((student) => ({
        registration: student.id,
        class: student.class,
        name: student.name,
        made_by: user.name,
      }));

      await api.post("/call", transformedStudents);

      toast.success("Chamada realizada com sucesso!");
    } catch {
      toast.error("Ocorreu um erro ao realizar una chamada!");
    }
  };

  const openModals = async () => {
    setOpenModal(true);

    if (route == "students") {
      await getResponsibles();
      await getTeams();
    }

    if (route == "esportes") {
      await getClasses();
      await getTeachers();
    }

    if (route == "teachers") {
      await getUsers();
    }

    if (route == "call") {
      makeCall(table.getSelectedRowModel().rows);
    }
  };

  const closeModal = () => {
    setError(false);
    setOpenModal(false);
    handlePhoneChange("");
    setPhone("");
  };

  const createStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (route == "studentsClass") {
      return;
    }

    const data = {
      image: link,
      name: name,
      responsible: responsible,
      class: classes,
      team: team,
      phone: phone,
      status: status,
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
      setLoading(true);
      await api.post("/students", data);

      setPhone("");
      toast.success("Aluno cadastrado com sucesso!");
      setOpenModal(false);
      reloadPage();
      setLink("");
      verifyUserCreate(true);
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
      userId: user,
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
          route == "studentsClass" || route == "teacherClass"
            ? "hidden"
            : openFilter
            ? "bg-white xl:bg-gray-50 px-5 xl:px-0 py-10"
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
              <div className={`flex justify-center w-full gap-4`}>
                <Input
                  placeholder="Pesquise pelo código do professor..."
                  value={
                    (table.getColumn("id")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("id")
                      ?.setFilterValue(String(event.target.value))
                  }
                />

                <Input
                  placeholder="Pesquise pelo nome do professor..."
                  value={
                    (table.getColumn("name")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                />
              </div>

              <Modal show={openModal} onClose={() => closeModal()}>
                <Modal.Header>Cadastro de professor</Modal.Header>
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
                                <p className="w-full">
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
                        <label htmlFor="nome">Status:</label>
                        <Select required onValueChange={(e) => setStatus(e)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Inativo</SelectItem>
                            <SelectItem value="1">Ativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button type="submit">Salvar</Button>
                    <Button color="gray" onClick={() => closeModal()}>
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

              <Input
                placeholder="Matrícula do aluno..."
                value={
                  (table.getColumn("id")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("id")?.setFilterValue(event.target.value)
                }
              />

              <Select onValueChange={(e) => getStudentsFilter(e)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Equipe" />
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

                <Input
                  placeholder="Matrícula do aluno..."
                  value={
                    (table.getColumn("id")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("id")?.setFilterValue(event.target.value)
                  }
                />

                <Select onValueChange={(e) => setClassesFilter(e)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Turma" />
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

              <Modal show={openModal} onClose={() => closeModal()}>
                <Modal.Header>Cadastro de aluno</Modal.Header>
                <form onSubmit={createStudent}>
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
                                <p className="w-full">
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

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="responsible">
                          Responsável: <span className="text-red-500">*</span>
                        </label>
                        <Select
                          required
                          onValueChange={(e) => setResponsible(e)}
                        >
                          <SelectTrigger className="w-full" id="responsible">
                            <SelectValue placeholder="Selecione o responsável" />
                          </SelectTrigger>

                          <SelectContent>
                            {responsibles.map((r) => {
                              return (
                                <SelectItem key={r.id} value={String(r.id)}>
                                  {r.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="class">
                          Turma: <span className="text-red-500">*</span>
                        </label>
                        <Select onValueChange={(e) => setClasses(e)}>
                          <SelectTrigger className="w-full" id="class">
                            <SelectValue placeholder="Selecione a turma" />
                          </SelectTrigger>
                          <SelectContent>
                            {classesDisp.map((c) => {
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
                        <label htmlFor="team">
                          Equipe: <span className="text-red-500">*</span>
                        </label>
                        <Select onValueChange={(e) => setTeam(e)}>
                          <SelectTrigger className="w-full" id="team">
                            <SelectValue placeholder="Selecione a equipe" />
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
                          Telefone: <span className="text-red-500">*</span>
                        </label>
                        
                        <MaskedInput
                          value={phone}
                          onChange={handlePhoneChange}
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="nome">Status:</label>
                        <Select required onValueChange={(e) => setStatus(e)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Inativo</SelectItem>
                            <SelectItem value="1">Pendente</SelectItem>
                            <SelectItem value="2">Ativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button type="submit">Salvar</Button>
                    <Button color="gray" onClick={() => closeModal()}>
                      Fechar
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </>
          )}

          {route == "responsibles" && (
            <>
              <div className={`flex justify-center w-full gap-4`}>
                <Input
                  placeholder="Pesquise pelo código do responsável..."
                  value={
                    (table.getColumn("id")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("id")
                      ?.setFilterValue(String(event.target.value))
                  }
                />

                <Input
                  placeholder="Pesquise pelo nome do responsável..."
                  value={
                    (table.getColumn("name")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                />
              </div>

              <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Cadastro de responsáveis</Modal.Header>
                <form onSubmit={(e) => createResponsibles(e)}>
                  <Modal.Body className="relative">
                    <div className="space-y-6">
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
                            <SelectItem value="0">Inativo</SelectItem>
                            <SelectItem value="1">Ativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button className="text-center " type="submit">
                      {loading ? <TbLoader3 /> : "Salvar"}
                    </Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                      Fechar
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </>
          )}

          {route == "turmas" && (
            <>
              <div className={`flex justify-center w-full gap-4`}>
                <Input
                  placeholder="Pesquise pelo código da turma..."
                  value={
                    (table.getColumn("id")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("id")
                      ?.setFilterValue(String(event.target.value))
                  }
                />

                <Input
                  placeholder="Pesquise pelo descrição da turma..."
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
              </div>

              <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Cadastro de turma</Modal.Header>
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
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="students">
                          Categoria: <span className="text-red-500">*</span>
                        </label>
                        <Select required onValueChange={(e) => setCategory(e)}>
                          <SelectTrigger
                            className="w-full"
                            id="category"
                            name="category"
                          >
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1° ao 3° ano</SelectItem>
                            <SelectItem value="2">4° ao 6° ano</SelectItem>
                            <SelectItem value="3">7° ao 9° ano</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="teacher">Professor:</label>
                        <Select
                          onValueChange={(e) => setTeacher(e)}
                          defaultValue={teacher}
                        >
                          <SelectTrigger
                            className="w-full"
                            id="teacher"
                            name="teacher"
                          >
                            <SelectValue placeholder="Selecione o professor" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.map((t) => {
                              return (
                                <SelectItem value={String(t.id)}>
                                  {t.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div> */}

                      {/* <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="students">Alunos:</label>
                        <Select required onValueChange={(e) => (e)}>
                          <SelectTrigger
                            className="w-full"
                            id="quantity_students"
                            name="quantity_students"
                          >
                            <SelectValue placeholder="Selecione os alunos" />
                          </SelectTrigger>
                          <SelectContent>
                            {
                              students.map(s => {
                                return (
                                  <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                )
                              })
                            }
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
                            <SelectValue placeholder="Selecione o status da turma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Inativo</SelectItem>
                            <SelectItem value="1">Ativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button className="text-center " type="submit">
                      {loading ? <TbLoader3 /> : "Salvar"}
                    </Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                      Fechar
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </>
          )}

          {route == "esportes" && (
            <>
              <div className={`flex justify-center w-full gap-4`}>
                <Input
                  placeholder="Pesquise pelo código da equipe..."
                  value={
                    (table.getColumn("id")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("id")
                      ?.setFilterValue(String(event.target.value))
                  }
                />

                <Input
                  placeholder="Pesquise pela descrição da equipe..."
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
              </div>

              <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Cadastro de equipes</Modal.Header>
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
                          placeholder="Digite a descrição da equipe..."
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
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="teacher">Professor:</label>
                        <Select onValueChange={(e) => setTeacher(e)}>
                          <SelectTrigger
                            className="w-full"
                            id="teacher"
                            name="teacher"
                          >
                            <SelectValue placeholder="Selecione o professor" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.map((t) => {
                              return (
                                <SelectItem value={String(t.id)}>
                                  {t.name}
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
                            <SelectValue placeholder="Selecione o status da equipe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Inativo</SelectItem>
                            <SelectItem value="1">Ativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button className="text-center " type="submit">
                      {loading ? <TbLoader3 /> : "Salvar"}
                    </Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
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

                          {column.id == "category" && "Categoria"}

                          {column.id == "modality" && "Modalidade"}

                          {column.id == "team" && "Equipe"}

                          {column.id == "status" && "Status"}

                          {column.id == "actions" && "Ações"}

                          {route == "students"
                            ? column.id == "id" && "Matrícula"
                            : column.id == "id" && "Código"}

                          {column.id == "description" && "Descrição"}

                          {column.id == "quantity_students" && "Alunos"}
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
              } w-full xl:max-w-40 gap-2 items-center justify-center`}
            >
              Cadastrar aluno
              <MdPersonAdd fontSize={23}/>
            </Button>

            <Button
              onClick={() => openModals()}
              className={`${
                route != "turmas" ? "hidden" : "flex"
              } w-full xl:max-w-40 gap-2 items-center justify-center`}
            >
              Cadastrar turma
              <MdGroupAdd fontSize={23}/>
            </Button>

            <Button
              onClick={() => openModals()}
              className={`${
                route != "esportes" ? "hidden" : "flex"
              } w-full xl:max-w-44 gap-2 items-center justify-center`}
            >
              Cadastrar equipe
              <MdSportsKabaddi fontSize={20}/>
            </Button>

            <Button
              onClick={() => openModals()}
              className={`${
                route != "teachers" ? "hidden" : "flex"
              } w-full xl:max-w-48 gap-2 items-center justify-center`}
            >
              Cadastrar professor
              <MdPersonAdd fontSize={20}/>
            </Button>

            <Button
              onClick={() => openModals()}
              className={`${
                route != "responsibles" ? "hidden" : "flex"
              } w-full xl:max-w-52 gap-2 items-center justify-center`}
            >
              Cadastrar responsável
              <MdPersonAdd fontSize={20}/>
            </Button>

            <Button
              onClick={() => openModals()}
              disabled={table.getSelectedRowModel().rows.length <= 0}
              className={`${
                route != "call" ? "hidden" : "flex"
              } w-full xl:max-w-44 gap-2 items-center justify-center`}
            >
              Chamada
              <MdFormatListBulletedAdd fontSize={23}/>
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
                    <TableCell key={cell.id}>
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
        {route != "teacherClass" && route != "studentsClass" && (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
          </div>
        )}

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
