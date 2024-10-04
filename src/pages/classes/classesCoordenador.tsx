import { DataTable } from "@/components/table/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import { PiCaretUpDownBold } from "react-icons/pi";
import { Modal } from "flowbite-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormEvent, useContext, useEffect, useState } from "react";
import api from "@/api";
import { ReloadContext } from "@/contexts/ReloadContext";
import toast from "react-hot-toast";
import { RowProps } from "@/contexts/ModalsContext";
import { TbArrowsExchange, TbLoader3 } from "react-icons/tb";
import noFoto from "../../assets/noFoto.jpg";
import { AuthContext, UserProps } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { StudentsProps } from "../students";

export interface ClassesProps {
  id: number;
  description: string;
  modality: string;
  status: number;
}

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
    accessorKey: "responsible_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Responsável
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("responsible_name")}</div>,
  },
  {
    accessorKey: "desc_unit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unidade
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => 
      <div>
        {
          row.getValue("desc_unit") ? row.getValue("desc_unit") : "-"
        }
      </div>,
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
    cell: ({ row }) =>
      <div>
        {
          row.getValue("description") ? row.getValue("description") : "-"
        }
      </div>,
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
    )
  },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("status") == 0 && "Inativo"}

        {row.getValue("status") == 1 && "Ativo"}

        {row.getValue("status") == 2 && "Experimental"}

        {row.getValue("status") == 3 && "Pendente"}

        {row.getValue("status") == 4 && "Desativado"}
      </div>
    ),
  }
];
  

const ClassesCoordenador = () => {
  const { reloadPage, newData } = useContext(ReloadContext);
  const { user } = useContext(AuthContext);
  const [data, setData] = useState<StudentsProps[]>([]);
  const [classes, setClasses] = useState<ClassesProps[]>([]);
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [openModal, setOpenModal] = useState(
    (user as unknown as UserProps).level != 3 ? true : false
  );
  const navigate = useNavigate();

  const closeModal = () => {
    if (!ready) {
      navigate("/");
      toast("É necessário selecionar um responsável para acessar a tela!", {
        position: "top-right",
        icon: "⚠️",
        duration: 1500
      });
      return;
    }

    setOpenModal(false);
  };

  useEffect(() => {
    const getClasses = async () => {
      try {
        setLoading(true);

        const response = await api.get("/classes/coordinator");
        setClasses(response.data);
      } catch {
        toast.error("Ocorreu um erro ao buscar as turmas disponíveis!");
      } finally {
        setLoading(false);
      }
    }
  
    getClasses();
  }, [reloadPage, newData]);


  const getStudents =  async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setLoad(true);

      const response = await api.get(
        `/students/coordinator/${classId}`
      );

      setReady(true);
      setOpenModal(false);
      setData(response.data);
    } catch {
      toast.error(
        "Ocorreu um erro ao buscar os alunos disponíveis da turma!"
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="w-full">
      <section className="mt-10 flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold text-gray-700 flex gap-1 items-center mt-1">
          Turmas<span className="text-sm mt-1">({data.length})</span>
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
        <Modal.Header>Selecione uma <span className="text-primary-color">turma</span></Modal.Header>
        <form onSubmit={(e) => getStudents(e)}>
          <Modal.Body className="relative" style={{ maxHeight: "500px" }}>
            <div className="space-y-6">
              <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                <label htmlFor="unit">Turmas: <span className="text-red-500">*</span> </label>
                  <Select disabled={classes.length == 0} value={classId} required onValueChange={(e) => setClassId(e)}>
                    <SelectTrigger className="w-full" id="classes">
                      <SelectValue placeholder={classes.length > 0 ? "Selecione a turma desejada" : "Nenhuma turma disponível"} />
                    </SelectTrigger>

                    <SelectContent>
                       {classes.map((c) => {
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
              route={"turmasCoordenador"}
            />
          </section>
        ))}
    </main>
  );
};

export default ClassesCoordenador;
