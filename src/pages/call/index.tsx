import { DataTable } from "@/components/table/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormEvent, useContext, useEffect, useState } from "react";
import { PiCaretUpDownBold } from "react-icons/pi";
import { TbArrowsExchange, TbLoader3 } from "react-icons/tb";
import api from "@/api";
import toast from "react-hot-toast";
import { RowProps, modalContext } from "@/contexts/ModalsContext";
import { Modal } from "flowbite-react";
import noFoto from "../../assets/noFoto.jpg";
import { GoAlertFill } from "react-icons/go";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ClassesProps } from "../classes";
import { ReloadContext } from "@/contexts/ReloadContext";
import { IoIosCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { FaCircleQuestion } from "react-icons/fa6";
import { modalPictureContext } from "@/contexts/ModalPicture";

export const columns: ColumnDef<RowProps>[] = [
  {
    id: "select",
    header: "Presença",
    cell: ({ row }) => {
      const [presence, setPresence] = useState(row.original.presence);
      const { open } = useContext(modalContext);
      const { reason, saveReason } = useContext(ReloadContext);
      const statusCall = row.original.status_call;
      const schedule = row.original.schedule_by_responsible;
  
      const openModals = (data: RowProps[], title: string, type: string) => {
        open(data, title, type);
      };
  
      useEffect(() => {
        if (reason.length > 0 && reason[0] && reason[0].comments_call !== "" && row.original.id === reason[0].id) {
          setPresence(presence);
        }
      }, [reason, row.original.id]);
      
  
      const changePresence = (presence: number) => {
        if (presence === 0) {
          openModals([row.original], "Motivo da falta", "reasonAbsence");
        } else {
          setPresence(presence);
          row.original.presence = presence;
          row.original.comments_call = "";
          saveReason([row.original]);
        }
      };
  
      return (
        <div className="flex justify-center items-center gap-3 text-2xl bg-gray-50 p-2 w-20 mx-auto rounded-lg">
          <button
            disabled={schedule != null && statusCall != 0}
            className={schedule != null && statusCall != 0 ? "cursor-not-allowed" : ""}
            onClick={() => changePresence(1)}
            title={schedule != null && statusCall != 0 ? "Não é possível alterar uma falta agendada" : ""}
          >
            <IoIosCheckmarkCircle
              className={`${
                row.original.presence != null && presence != null && row.original.presence === 1
                  ? "text-green-500"
                  : "text-gray-300"
              } ${(schedule != null && statusCall != 0) ? "cursor-not-allowed" : "cursor-pointer"}`}
            />
          </button>
  
          <button
            disabled={schedule != null && statusCall != 0}
            onClick={() => changePresence(0)}
            title={schedule != null && statusCall != 0 ? "Não é possível alterar uma falta agendada" : ""}
          >
            <IoMdCloseCircle
              className={`${
                row.original.presence != null && presence != null && row.original.presence === 0
                  ? "text-red-500"
                  : "text-gray-300"
              } ${(schedule != null && statusCall != 0) ? "cursor-not-allowed" : "cursor-pointer"}`}
            />
          </button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },  
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
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Turma
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "description_sport",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Esporte
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("description_sport")}</div>,
  },
  {
    accessorKey: "date_of_birth",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de nascimento
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("date_of_birth")}</div>,
  },
  {
    accessorKey: "comments",
    header: "Observações",
    cell: ({ row }) => (
      <div>
        {row.getValue("comments") != null && row.getValue("comments") != "" ? (
          <div className="flex justify-center bg-gray-50 rounded-lg w-9 mx-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="border-none bg-transparent h-9 hover:bg-transparent flex justify-center">
                  <GoAlertFill fontSize={19} className="text-yellow-800" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Aviso!</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="py-2 p-3 text-sm">
                  {row.getValue("comments")}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    accessorKey: "comments_call",
    header: "Motivo",
    cell: ({ row }) => {
      const { reason } = useContext(ReloadContext);
      const [comments, setComments] = useState<string | null>(row.getValue("comments_call"));
  
      useEffect(() => {
        if (reason.length > 0 && reason[0] && reason[0].comments_call !== "" && row.original.id === reason[0].id) {
          setComments(reason[0].comments_call); 
        }

        if (reason.length > 0 && reason[0] && row.original.id === reason[0].id && reason[0].presence == 1) {
          setComments("");
        }
      }, [reason, row.original.id]);
  
      return (
        <div>
          {(comments != null && row.original.status_call != 0 && row.original.presence == 0) ? (
            <div className="flex justify-center bg-gray-50 rounded-lg w-9 mx-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="border-none bg-transparent h-9 hover:bg-transparent flex justify-center">
                    <FaCircleQuestion fontSize={19} className="text-red-600" />
                  </Button>
                </DropdownMenuTrigger>
  
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Aviso!</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="py-2 p-3 text-sm">
                    {comments}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            "-"
          )}
        </div>
      );
    },
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

        {row.getValue("status") == 2 && "Experimental"}

        {row.getValue("status") == 3 && "Pendente"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Ações",
    enableHiding: false,
    cell: ({ row }) => {
      const { open } = useContext(modalContext);
      const { openPicture } = useContext(modalPictureContext);

      const openModals = (data: RowProps[]) => {
        open(data, "Responsáveis cadastrados", "call");
      };

      const openModalPicture = (data: RowProps[]) => {
        openPicture(data[0].name, data[0].image);
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
            <DropdownMenuItem onClick={() => openModals([row.original])}>
              Ver responsáveis
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openModalPicture([row.original])}>
              Ver Foto
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      );
    },
  },
];

const Call = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [unitId, setUnitId] = useState("");
  const [units, setUnits] = useState<ClassesProps[]>([]);
  const [classes, setClasses] = useState<ClassesProps[]>([]);
  const [classId, setClassId] = useState("");
  const [daysTraining, setDaysTraining] = useState("");
  const { reloadPage, newStudentsCall, saveData, data, saveUnitName, reason,saveClassName, saveDayTrainingName, saveClassId, resetSelect, saveUnitId, saveDayTraining } =
    useContext(ReloadContext); 

  useEffect(() => {
    const getUnits = async () => {
      try {
        const response = await api.get("/units");

        setUnits(response.data);
      } catch {
        toast.error("Ocorreu um erro ao buscar as unidades disponíveis!");
      }
    };

    if (newStudentsCall.length <= 0) {
      getUnits();
      saveData(data);
    } else {
      saveData(newStudentsCall);
    }

    if (data.length > 0 && reason && reason[0]) {
      const updatedData = data.map((d) => {
        if (d.id === reason[0].id && d.comments_call !== reason[0].comments_call) {
          return { ...d, comments_call: reason[0].comments_call };
        }

        if (d.id === reason[0].id && d.comments_call == "" && reason[0].comments_call == "") {
          return { ...d, presence: 1 };
        }

        return d;
      });
    
      saveData(updatedData); 
    }
    

    saveData(data);
  }, [reloadPage]);

  const getClasses = async (idUnit: number) => {
    try {
      const response = await api.get(`/classes/call/${idUnit}`);

      response.data.unshift({ id: -99, description: "Todos", status: 1 });

      setClasses(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar as turmas disponíveis!");
    }
  };

  const saveAndFilterClassTime = (e: string) => {
    setDaysTraining(e);

    saveDayTraining(e);
  };

  useEffect(() => {
   const getUnitName = async () => {
    const response = await api.get(`/units/getname/${unitId}`);
    
    saveUnitName(response.data);
   }

   getUnitName();
  }, [unitId])

  useEffect(() => {
   const getClassName = async () => {
    const response = await api.get(`/classes/getname/${classId}`);
    
    saveClassName(response.data);
   }

   getClassName();
  }, [classId]);

  
  useEffect(() => {
   const getTrainingDayName = async () => {
    const response = await api.get(`/students/getname/${daysTraining}`);
    
    saveDayTrainingName(response.data);
   }

   getTrainingDayName();
  }, [daysTraining]);

  const filterAndSetUnitId = async (e: string) => {
    setUnitId(e);
    setClassId("");
    setDaysTraining("");

    getClasses(Number(e));
  };

  const getStudents = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setClassId("");
      resetSelect();
      saveClassId(Number(classId));
      saveUnitId(Number(unitId));

      if (daysTraining == "") {
        saveDayTraining("-99")
      }
      
      const response = await api.get(
        `/students/class/${classId}/unit/${unitId}/day/${daysTraining != "" ? daysTraining : -99}`
      );

      if (daysTraining == "") {
        saveDayTrainingName("");
      }

      saveData(response.data);
      setLoad(true);
      setDaysTraining("");
      setOpenModal(false);
    } catch {
      toast.error("Ocorreu um erro ao buscar os alunos disponíveis!");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setOpenModal(false);

    if (daysTraining == "") {
      saveDayTrainingName("");
    }

    if (!load) {
      navigate("/");
      toast("É necessário utilizar os filtros obrigatórios para acessar a tela!", {
        position: "top-right",
        icon: "⚠️",
      });
    }
  };

  return (
    <main className="w-full">
      <section className="mt-10 flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold text-gray-700 flex items-center gap-1">
          Chamada <span className="text-sm mt-1">({data.length})</span>
        </h1>

        <button
          className={`${
            load ? "flex" : "hidden"
          } rounded-lg p-2 bg-gray-700 hover:bg-gray-800 transition-all`}
          onClick={() => setOpenModal(true)}
          title="Trocar turma"
        >
          <TbArrowsExchange className="text-white" fontSize={20} />
        </button>
      </section>

      <Modal show={openModal} onClose={() => closeModal()}>
        <Modal.Header>
          Selecione uma <span className="text-primary-color">turma</span>
        </Modal.Header>
        <form onSubmit={getStudents}>
          <Modal.Body className="relative" style={{ maxHeight: "500px" }}>
            <div className="space-y-6">
              <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                <label htmlFor="unit">
                  Unidade: <span className="text-red-500">*</span>
                </label>

                <Select
                  onValueChange={(e) => filterAndSetUnitId(e)}
                  required
                  defaultValue={unitId}
                >
                  <SelectTrigger id="unit" className="w-full">
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>

                  <SelectContent>
                    {units.map((c) => {
                      return (
                        <SelectItem key={String(c.id)} value={String(c.id)}>
                          {c.description}
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
                  onValueChange={(e) => setClassId(e)}
                  required
                  value={classId != "" ? String(classId) : ""}
                  defaultValue={classId != "" ? String(classId) : ""}
                  disabled={unitId == ""}
                >
                  <SelectTrigger id="class" className="w-full">
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => {
                      return (
                        <SelectItem key={String(c.id)} value={String(c.id)}>
                          {c.description}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                <label htmlFor="class">
                  Dia de treino: 
                </label>

                <Select
                  onValueChange={(e) => saveAndFilterClassTime(e)}
                  value={daysTraining != "" ? String(daysTraining) : ""}
                  defaultValue={daysTraining != "" ? String(daysTraining) : ""}
                  disabled={classId == ""}
                >
                  <SelectTrigger id="class" className="w-full">
                    <SelectValue placeholder="Selecione um dia de treino" />
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
            </div>
          </Modal.Body>
          <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
            <Button
              type="submit"
              className="bg-primary-color hover:bg-secondary-color"
              disabled={!classId}
            >
              Selecionar
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {loading ? (
        <div className="mx-auto max-w-5 mt-40 mb-10">
          <TbLoader3
            fontSize={25}
            className="w-12"
            style={{ animation: "spin 1s linear infinite" }}
          />
        </div>
      ) : (
        load && (
          <section className="w-full mx-auto mt-10">
            {/* @ts-ignore */}
            <DataTable columns={columns} data={data} route={"call"} />
          </section>
        )
      )}
    </main>
  );
};

export default Call;
