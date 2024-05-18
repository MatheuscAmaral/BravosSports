import { DataTable } from "@/components/table/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormEvent, useContext, useEffect, useState } from "react";
import api from "@/api";
import toast from "react-hot-toast";
import { ReloadContext } from "@/contexts/ReloadContext";
import { RowProps } from "@/contexts/ModalsContext";
import { StudentsProps } from "../students";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "flowbite-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ClassesProps } from "../classes";

export const columns: ColumnDef<RowProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: "Foto",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <img
          src={row.getValue("image")}
          className="w-12"
          style={{ borderRadius: "100%" }}
        />
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Matrícula
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "responsible",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Responsável
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("responsible")}</div>,
  },
  {
    accessorKey: "class",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Turma
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("class")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("status") == 0 && "Inativo"}

        {row.getValue("status") == 1 && "Pendente"}

        {row.getValue("status") == 2 && "Ativo"}
      </div>
    ),
  },
];

const Call = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(true);
  const [data, setData] = useState<StudentsProps[]>([]);
  const [classes, setClasses] = useState<ClassesProps[]>([]);
  const [classId, setClassId] = useState("");

  useEffect(() => {
    const getClasses = async () => {
      try {
        const response = await api.get("/classes");

        setClasses(response.data);

      } catch {
        toast.error("Ocorreu um erro ao buscar as turmas disponíveis!");
      }
    };

    getClasses();
  }, []);

  const getStudents = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.get(`/students/class/${classId}`);

      setData(response.data);
      setOpenModal(false);
    } catch {
      toast.error("Ocorreu um erro ao buscar os alunos disponíveis!");
    }
  }


  const closeModal = () => {
      setOpenModal(false);
      navigate("/");
  }

  return (
    <main className="w-full">
      <section className="mt-10">
        <h1 className="text-2xl font-bold text-gray-700 flex items-center gap-1">
          Chamada <span className="text-sm mt-1">({data.length})</span>
        </h1>
      </section>

      <Modal show={openModal} onClose={() => closeModal()}>
        <Modal.Header>Selecione uma turma</Modal.Header>
        <form onSubmit={getStudents}>
          <Modal.Body className="relative" style={{ maxHeight: "500px" }}>
            <div className="space-y-6">
              <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                <label htmlFor="class">
                  Turma: <span className="text-red-500">*</span>
                </label>
                <Select onValueChange={(e) => setClassId(e)} required>
                  <SelectTrigger id="class" className="w-full">
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      classes.map(c => {
                        return (
                          <SelectItem key={String(c.id)} value={String(c.id)}>{c.description}</SelectItem>
                        )
                      })
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" disabled={!classId} >Selecionar</Button>
          </Modal.Footer>
        </form>
      </Modal>

      {
        data.length >= 1 && (
          <section className="w-full mx-auto mt-10">
              {/* @ts-ignore */}
              <DataTable columns={columns} data={data} route={"call"} /> 
          </section>
        )
      } 
    </main>
  );
};

export default Call;
