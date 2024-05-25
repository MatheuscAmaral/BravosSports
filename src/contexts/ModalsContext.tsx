import {
  FormEvent,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { DataTable } from "@/components/table/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import { MdContentPasteSearch } from "react-icons/md";
import noFoto from "../assets/noFoto.jpg";
import { Modal } from "flowbite-react";
import { Button } from "@/components/ui/button";
import { TbLoader3 } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { StudentsProps } from "@/pages/students";
import { IoIosImages } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import { ClassesProps } from "@/pages/classes";
import { ResponsibleProps } from "@/components/table/dataTable";
import toast from "react-hot-toast";
import api from "@/api";
import { ReloadContext } from "./ReloadContext";
import MaskedInput from "@/components/InputMask";
import { TeachersProps } from "@/pages/teachers";
import { UserProps } from "./AuthContext";

export interface RowProps {
  id: number;
  image: string;
  name: string;
  responsible_name: string;
  responsible: number;
  class: number;
  phone: string;
  status: number;
  description: string;
  modality: string;
  category: string;
  teacher_id: number;
  userId: string;
  team: string;
  presence: number;
  id_responsible: number;
  days_training: string;
  date_of_birth: string;
}

const uploader = Uploader({
  apiKey: "free",
});

const options = { multi: true };

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
            style={{ borderRadius: "100%" }}
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
            style={{ borderRadius: "100%" }}
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("status") == "0" && "Inativo"}

        {row.getValue("status") == "1" && "Ativo"}
      </div>
    ),
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
    accessorKey: "modality",
    header: () => {
      return "Modalidade";
    },
    cell: ({ row }) => <div>{row.getValue("modality")}</div>,
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
  const { filterStudentsByClass, reloadPage, filterId } =
    useContext(ReloadContext);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState("");
  const [data, setData] = useState<StudentsProps[]>([]);
  const [type, setType] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");
  const [classesDisp, setClassesDisp] = useState<ClassesProps[]>([]);
  const [responsibles, setResponsibles] = useState<ResponsibleProps[]>([]);
  const [responsible, setResponsible] = useState("");
  const [classes, setClasses] = useState("");
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [modality, setModality] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [daysTraining, setDaysTraining] = useState("");
  const [teamsDisp, setTeamsDisp] = useState<ClassesProps[]>([]);
  const [teacher, setTeacher] = useState("");
  const [students, setStudents] = useState<StudentsProps[]>([]);
  const [teachers, setTeachers] = useState<TeachersProps[]>([]);
  const [teacherClass, setTeacherClass] = useState<ClassesProps[]>([]);
  const [user, setUser] = useState("");
  const [users, setUsers] = useState<UserProps[]>([]);
  const [responsibleRealeaseds, setResponsibleRealeaseds] = useState<ResponsibleProps[]>([]);

  const handlePhoneChange = (value: string) => {
    setPhone(value);
  };


  const getData = async (row: RowProps[], type: string) => {
    setData(row);
    setLink(row[0].image);

    if (type == "students") {
      setName(String(row[0].name));
      setResponsible(String(row[0].responsible));
      setClasses(String(row[0].class));
      setTeam(String(row[0].team));
      setPhone(String(row[0].phone));
      setDaysTraining(row[0].days_training != null ? String(row[0].days_training) : "");
    }

    if (type == "classes") {
      setDescription(String(row[0].description));
    }

    if (type == "esportes") {
      setDescription(String(row[0].description));
      setModality(String(row[0].modality));
      setTeacher(String(row[0].teacher_id));
      setClasses(String(row[0].class));
      setId(String(row[0].id));
    }
    
    if (type == "responsibles") {
      setName(String(row[0].name));
      setPhone(String(row[0].phone));
    }
    
    if (type == "call") {
      setId(String(row[0].id_responsible));
    }

    if (type == "teacher") {
      setName(row[0].name);
      setUser(row[0].userId);
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
        const response = await api.get(`/responsibles/releaseds/${row[0].responsible}`);

        setResponsibleRealeaseds(response.data);
      } catch {
        toast.error("Ocorreu um erro ao buscar os responsáveis disponíveis!");
      }
    }

    setStatus(String(row[0].status));
    setId(String(row[0].id));
  };

  const getResponsibles = async () => {
    try {
      const response = await api.get("/responsibles");

      setResponsibles(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar os responsáveis disponíveis!");
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
      const response =   await api.get("/teachers");

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

  const getClassesOfTeacher = async (id: number) => {
    try {
      const response = await api.get(`/sports/teacher/${id}`);

      setTeacherClass(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar as turmas do professor!");
    }
  };

  const open = async (row: RowProps[], data: string, type: string) => {
    setOpenModal(true);
    setModalData(data);
    setType(type);
    getData(row, type);

    if (type == "students") {
      setLoading(true);
      await getClasses();
      await getResponsibles();
      await getTeams();
      setLoading(false);
    }

    if (type == "classes") {
      await getTeachers();
    }

    if (type == "esportes") {
      await getTeachers();
      await getClasses();
    }

    if (type == "teacher") {
      await getUsers();
    }
  };

  const closeModal = () => {
    setError(false);
    setOpenModal(false);
    setName("");
    setResponsible("");
    setClasses("");
    setPhone("");
    setId("");
    setDescription("");
    setModality("");
    setCategory("");
    setId("");
    setUser("");
    setDaysTraining("");
    handlePhoneChange("");
  };

  const editData = async (e: FormEvent) => {
    e.preventDefault();
    let data;

    if (type == "students") {
      data = {
        image: link,
        name: name,
        responsible: responsible,
        class: classes,
        team: team,
        days_training: daysTraining,
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
    }

    if (type == "teacher") {
      data = {
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
    }

    if (type == "classes") {
      data = {
        description: description,
        status: status,
      };
    }

    if (type == "esportes") {
      data = {
        description: description,
        modality: modality,
        class: classes,
        teacher_id: teacher,
        status: status,
      };
    }

    if (type == "responsibles") {
      data = {
        image: link,
        name: name,
        phone: phone,
        status: status,
      };

      if (!link) {
        toast("É necessário que o responsável possua uma foto cadastrada!", {
          position: "top-right",
          icon: "⚠️",
        });

        setError(true);

        return;
      }
    }

    try {
      setLoading(true);
      type == "students" && (await api.put(`/students/${id}`, data));
      type == "classes" && (await api.put(`/classes/${id}`, data));
      type == "esportes" && (await api.put(`/sports/${id}`, data));
      type == "teacher" && (await api.put(`/teachers/${id}`, data));
      type == "responsibles" && (await api.put(`/responsibles/${id}`, data));

      toast.success(
        `${(data && data.name) || data?.description} editado com sucesso!`
      );

      filterStudentsByClass(filterId);
      reloadPage();
      setError(false);
      setOpenModal(false);
    } catch {
      toast.error(`Ocorreu um erro ao editar os dados de ${data && data.name}`);
    } finally {
      setLoading(false);
    }
  };

  const filterTeams = async (idClass: any) => {
    setClasses(idClass);
    
    try {
      const response = await api.get(`/sports/class/${idClass}`);

      setTeamsDisp(response.data);
      setTeam("");
    }

    catch {
      toast.error("Ocorreu um erro ao buscar as equipes disponíveis!");
    }
  }

  return (
    <modalContext.Provider value={{ getData, open }}>
      {children}
      <Modal show={openModal} onClose={() => closeModal()}>
        <Modal.Header>{modalData}</Modal.Header>
        <form onSubmit={(e) => editData(e)}>
          <Modal.Body
            className="relative overflow-auto"
            style={{ maxHeight: "500px" }}
          >
            <div
              className={`${
                type != "studentsClass" && type != "teacherClass" && "space-y-6"
              }`}
            >
              {(type == "students" || type == "teacher" || type == "responsibles") && (
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
                      className={`h-48 w-full border-dashed border-2 ${
                        error || !link ? " border-red-600" : "border-gray-300"
                      } rounded-lg relative text-md font-medium text-gray-700`}
                    >
                      {link ? (
                        <div className="flex justify-center">
                          <img src={link} className="w-32" alt="foto" />
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
                      placeholder="Digite o descrição da turma..."
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="modality">
                      Modalidade: <span className="text-red-500">*</span>
                    </label>
                    <Select
                      required
                      onValueChange={(e) => setModality(e)}
                      defaultValue={modality}
                    >
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
{/* 
                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="class">
                      Turma: <span className="text-red-500">*</span>
                    </label>
                    <Select
                      defaultValue={classes}
                      onValueChange={(e) => setClasses(e)}
                    >
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
                  </div> */}

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
                  </div>
                </div>
              )}

              {type != "teacherClass" && type != "call" && (
                <FaTrash
                  fontSize={22}
                  onClick={() => setLink("")}
                  className={`${
                    link ? "block" : "hidden"
                  } absolute cursor-pointer top-4 right-9 hover:text-red-700 transition-all`}
                />
              )}

              {type == "students" && (
                <div className="space-y-6">
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
                  </div>

                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="responsible">
                      Responsável: <span className="text-red-500">*</span>
                    </label>
                    <Select
                      required
                      onValueChange={(e) => setResponsible(e)}
                      defaultValue={responsible}
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
                    <label htmlFor="days_training">
                      Dias de treino: <span className="text-red-500">*</span>
                    </label>
                    
                    <Select onValueChange={(e) => setDaysTraining(e)} defaultValue={daysTraining.trim()}>
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
                    <label htmlFor="class">
                      Turma: <span className="text-red-500">*</span>
                    </label>
                    <Select
                      onValueChange={(e) => filterTeams(e)}
                      defaultValue={classes}
                    >
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
                    <Select defaultValue={team} onValueChange={(e) => setTeam(e)}>
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
                    <label htmlFor="nome">
                      Telefone: <span className="text-red-500">*</span>
                    </label>
                    <MaskedInput value={phone} onChange={handlePhoneChange} />
                  </div>
                </div>
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

              {type == "teacher" && (
                <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
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

                  <div className="flex flex-col gap-1 text-gray-700 mt-5 text-sm font-medium">
                    <label htmlFor="user">Usuário:</label>
                    <Select
                      defaultValue={String(user)}
                      required
                      onValueChange={(e) => setUser(e)}
                    >
                      <SelectTrigger id="user" className="w-full">
                        <SelectValue placeholder="Selecione o usuário para vincular" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((u) => {
                          return (
                            <SelectItem key={String(u.id)} value={String(u.id)}>
                              {u.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {type != "studentsClass" && type != "teacherClass" && type != "call" && (
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
                      {type == "students" && (
                        <>
                          <SelectItem value="0">Inativo</SelectItem>
                          <SelectItem value="1">Pendente</SelectItem>
                          <SelectItem value="2">Ativo</SelectItem>
                        </>
                      )}

                      {(type == "classes" ||
                        type == "teacher" ||
                        type == "esportes") && (
                        <>
                          <SelectItem value="0">Inativo</SelectItem>
                          <SelectItem value="1">Ativo</SelectItem>
                        </>
                      )}

                      {type == "responsibles" && (
                        <>
                          <SelectItem value="0">Inativo</SelectItem>
                          <SelectItem value="1">Ativo</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
            {type != "studentsClass" && type != "teacherClass" && type != "call" && (
              <Button className="text-center " type="submit">
                {loading ? <TbLoader3 /> : "Salvar"}
              </Button>
            )}
            <Button className="bg-white text-black border border-gray-100 hover:bg-gray-100" onClick={() => closeModal()}>
              Fechar
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </modalContext.Provider>
  );
};

export default ModalProvider;
