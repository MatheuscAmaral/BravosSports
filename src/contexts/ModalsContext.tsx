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

export interface RowProps {
  id: number;
  image: string;
  name: string;
  responsible: number;
  class: number;
  phone: string;
  status: number;
  description: string;
  modality: string;
  category: string;
  teacher_id: number;
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
      <div>
        {<img src={row.getValue("image")} className="w-12 rounded-lg" />}
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

const columnsClass: ColumnDef<RowProps>[] = [
  {
    accessorKey: "id",
    header: () => {
      return "Código";
    },
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
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
  const { reloadPage } = useContext(ReloadContext);
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
  const [teacher, setTeacher] = useState("");
  const [students, setStudents] = useState<StudentsProps[]>([]);
  const [teachers, setTeachers] = useState<TeachersProps[]>([]);
  const [teacherClass, setTeacherClass] = useState<ClassesProps[]>([]);

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
      setPhone(String(row[0].phone));
    }

    if (type == "classes") {
      setDescription(String(row[0].description));
      setModality(String(row[0].modality));
      setCategory(row[0].category);
      setTeacher(String(row[0].teacher_id));
    }

    if (type == "teacher") {
      setName(row[0].name);
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

  const getClassesOfTeacher = async (id: number) => {
    try {
      const response = await api.get(`/classes/teacher/${id}`);

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
      setLoading(false);
    }

    if (type == "classes") {
      await getTeachers();
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
    }

    if (type == "teacher") {
      data = {
        image: link,
        name: name,
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
        modality: modality,
        category: category,
        teacher_id: teacher,
        status: status,
      };
    }

    try {
      setLoading(true);
      type == "students" && (await api.put(`/students/${id}`, data));
      type == "classes" && (await api.put(`/classes/${id}`, data));
      type == "teacher" && (await api.put(`/teachers/${id}`, data));

      toast.success(
        `${(data && data.name) || data?.description} editado com sucesso!`
      );
      setError(false);
      setOpenModal(false);
      reloadPage();
    } catch {
      toast.error(`Ocorreu um erro ao editar os dados de ${data && data.name}`);
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
            style={{ maxHeight: "500px" }}
          >
            <div
              className={`${
                type != "studentsClass" && type != "teacherClass" && "space-y-6"
              }`}
            >
              {(type == "students" || type == "teacher") && (
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
                          <img src={link} className="w-32" alt="foto_aluno" />
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

                  <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                    <label htmlFor="category">
                      Categoria: <span className="text-red-500">*</span>
                    </label>
                    <Select
                      required
                      onValueChange={(e) => setCategory(e)}
                      defaultValue={category}
                    >
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
                  </div>
                </div>
              )}

              {type != "teacherClass" && (
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
                    <label htmlFor="class">
                      Turma: <span className="text-red-500">*</span>
                    </label>
                    <Select
                      onValueChange={(e) => setClasses(e)}
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
                </div>
              )}

              {type != "studentsClass" && type != "teacherClass" && (
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

                      {(type == "classes" || type == "teacher") && (
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
          <Modal.Footer>
            {type != "studentsClass" && type != "teacherClass" && (
              <Button className="text-center " type="submit">
                {loading ? <TbLoader3 /> : "Salvar"}
              </Button>
            )}
            <Button color="gray" onClick={() => closeModal()}>
              Fechar
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </modalContext.Provider>
  );
};

export default ModalProvider;
