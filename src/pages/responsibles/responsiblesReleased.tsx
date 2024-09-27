import { DataTable, ResponsibleProps } from "@/components/table/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SelectReact from "react-select";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormEvent, useContext, useEffect, useState } from "react";
import api from "@/api";
import toast from "react-hot-toast";
import { RowProps, modalContext } from "@/contexts/ModalsContext";
import { ReloadContext } from "@/contexts/ReloadContext";
import noFoto from "../../assets/noFoto.jpg";
import { AuthContext, UserProps } from "@/contexts/AuthContext";
import { TbArrowsExchange, TbLoader3 } from "react-icons/tb";
import { PiCaretUpDownBold } from "react-icons/pi";
import { Modal } from "flowbite-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { StudentsProps } from "../students";
import { modalPictureContext } from "@/contexts/ModalPicture";

export const columns: ColumnDef<RowProps>[] = [
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "degree_kinship",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Grau de parentesco
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("degree_kinship")}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Telefone
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("status") == 0 && "Inativo"}

        {row.getValue("status") == 1 && "Ativo"}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { open } = useContext(modalContext);
      const { openPicture } = useContext(modalPictureContext);
      const { user } = useContext(AuthContext);

      const openModalPicture = (data: RowProps[]) => {
        openPicture(data[0].name, data[0].image);
      };

      const openModals = (data: RowProps[]) => {
        open(data, "Editar responsável", "responsibles_released");
      };

      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              {
                (user as unknown as UserProps).level != 4 ?(
                  <DropdownMenuItem onClick={() => openModals([row.original])}>
                    Editar
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => openModalPicture([row.original])}>
                    Ver Foto
                  </DropdownMenuItem>
                )
              }
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

interface FormatedResponsibleProps {
  value: string;
  label: string;
  class: string;
}

const ResponsiblesReleased = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState<ResponsibleProps[]>([]);
  const [responsibles, setResponsibles] = useState<ResponsibleProps[]>([]);
  const [students, setStudents] = useState<StudentsProps[]>([]);
  const [responsibleId, setResponsibleId] = useState("");
  const [formatedResponsibleId, setFormatedResponsibleId] = useState<FormatedResponsibleProps>({
    value: "",   
    label: "",
    class: "",
  });  
  const { reloadPage, saveResponsibleId, createdNewData } =
    useContext(ReloadContext);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [openModal, setOpenModal] = useState(
    (user as unknown as UserProps).level != 3 ? true : false
  );

  const getResponsiblesReleased = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();

      saveResponsibleId(Number(responsibleId));
    }

    try {
      setLoading(true);

      let responsiblePath = "";

      if ((user as unknown as UserProps).level !== 3 && (user as unknown as UserProps).level !== 4) {
        responsiblePath = responsibleId;
      } else if ((user as unknown as UserProps).level === 3) {
        responsiblePath = String((user as unknown as UserProps).id);
      } else if ((user as unknown as UserProps).level === 4) {
        responsiblePath = formatedResponsibleId.value;
      }

      const response = await api.get(
        `/responsibles/releaseds/${responsiblePath}/${(user as unknown as UserProps).level}`
      );

      setReady(true);
      setOpenModal(false);
      setData(response.data);
    } catch {
      toast.error(
        "Ocorreu um erro ao buscar os responsáveis liberados disponíveis!"
      );
    } finally {
      setLoading(false);
    }
  };

  const getResponsibles = async () => {
    try {
      const response = await api.get(`/responsibles/`);

      setResponsibles(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar os responsáveis disponíveis!");
    } finally {
      setLoading(false);
    }
  };

  const getStudents = async () => {
    try {
      const response = await api.get(`/students/`);

      const formatedData = response.data.map((d: StudentsProps) => ({
        value: d.responsible,
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

  const closeModal = () => {
    if (!ready) {
      navigate("/");
      toast("É necessário selecionar um responsável para acessar a tela!", {
        position: "top-right",
        icon: "⚠️",
      });
      return;
    }

    setOpenModal(false);
  };

  useEffect(() => {
    if ((user as unknown as UserProps).level == 3) {
      getResponsiblesReleased();
    }

    if (
      (user as unknown as UserProps).level == 0 ||
      (user as unknown as UserProps).level == 1
    ) {
      if (createdNewData) {
        getResponsiblesReleased();
        return;
      }

      getResponsibles();
    }

    else if (
      (user as unknown as UserProps).level == 4
    ) {
      if (createdNewData) {
        getResponsiblesReleased();
        return;
      }

      getStudents();
    }
  }, [reloadPage]);

  return (
    <main className="w-full">
      <section className="mt-10 flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold text-gray-700 flex items-center gap-1">
          Responsáveis Liberados{" "}
          <span className="text-sm mt-1">({data.length})</span>
        </h1>

        <button
          className={`${
            ready && (user as unknown as UserProps).level != 3
              ? "flex"
              : "hidden"
          } rounded-lg p-2 bg-gray-700 hover:bg-gray-800 transition-all`}
          onClick={() => setOpenModal(true)}
          title="Trocar turma"
        >
          <TbArrowsExchange className="text-white" fontSize={20} />
        </button>
      </section>

      <Modal show={openModal} onClose={() => closeModal()}>
        <Modal.Header>
          {
            ((user as unknown as UserProps).level != 4) ? (
              <>Selecione um <span className="text-primary-color">responsável</span></>
            ) : (
              <>Selecione um <span className="text-primary-color">aluno</span></>
            )
          }
        </Modal.Header>

        <form onSubmit={(e) => getResponsiblesReleased(e)}>
          <Modal.Body className="relative" style={{ maxHeight: "500px" }}>
            <div className="space-y-6">
              <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                <label htmlFor="unit">
                  { 
                    ((user as unknown as UserProps).level != 4) ? (
                      <>Responsável: <span className="text-red-500">*</span></>
                    ) : (
                      <>Aluno: <span className="text-red-500">*</span></>
                    )
                  }
                </label>

                { 
                  ((user as unknown as UserProps).level != 4) ? (
                    <Select value={responsibleId} required onValueChange={(e) => setResponsibleId(e)}>
                      <SelectTrigger className="w-full" id="responsible">
                        <SelectValue placeholder="Selecione o responsável desejado" />
                      </SelectTrigger>

                      <SelectContent>
                        {responsibles.map((r) => {
                          return (
                            <SelectItem key={r.user_id} value={r.user_id}>
                              {r.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  ) : (
                    <SelectReact
                      defaultValue={[]}
                      name="students"
                      value={formatedResponsibleId.value == "" ? "" : formatedResponsibleId}
                      // @ts-ignore
                      onChange={(e) => setFormatedResponsibleId(e)}
                      noOptionsMessage={() =>
                        "Nenhum resultado encontrado"
                      }
                      // @ts-ignore
                      options={students}
                      className="basic-multi-select text-sm mb-10"
                      maxMenuHeight={200}
                      placeholder="Selecione o aluno"
                    />
                  )
                }
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
            <Button
              type="submit"
              className="bg-primary-color hover:bg-secondary-color"
            >
              Selecionar
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {ready &&
        (loading ? (
          <div className="mx-auto max-w-5 mt-40 mb-10">
            <TbLoader3
              fontSize={25}
              className="w-12"
              style={{ animation: "spin 1s linear infinite" }}
            />
          </div>
        ) : (
          <section className="w-full mx-auto mt-10">
            <DataTable
              //@ts-ignore
              columns={columns}
              //@ts-ignore
              data={data}
              route={"responsibles_released"}
            />
          </section>
        ))}
    </main>
  );
};

export default ResponsiblesReleased;
