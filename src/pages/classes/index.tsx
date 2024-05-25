import { DataTable } from "@/components/table/dataTable";
import { ColumnDef } from "@tanstack/react-table";
// import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import api from "@/api";
import { ReloadContext } from "@/contexts/ReloadContext";
import toast from "react-hot-toast";
import { RowProps, modalContext } from "@/contexts/ModalsContext";

export interface ClassesProps {
  id: number;
  description: string;
  status: number;
}

export const columnsClass: ColumnDef<RowProps>[] = [
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Descrição
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
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
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
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
    header: "Ações",
    cell: ({ row }) => {
      const { open } = useContext(modalContext);

      const openModals = (data: RowProps[], title: string, type: string) => {  
        open(data, title, type);
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => openModals([row.original], "Alunos da Turma", "studentsClass")}>Ver alunos</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openModals([row.original], "Editar turma", "classes")}>Editar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];


const Classes = () => {
  const { reloadPage } = useContext(ReloadContext);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const getClasses = async () => {
      try {
        setLoad(true);
        const response = await api.get("/classes");
  
        setData(response.data);
      }

      catch {
        toast.error("Ocorreu um erro ao buscar as turmas disponíveis!");
      }

      finally {
        setLoad(false);
      }
    }
  
    getClasses();
  }, [reloadPage]);

  const [data, setData] = useState<ClassesProps[]>([]);

  return (
    <main className="w-full">
      <section className="mt-10">
        <h1 className="text-2xl font-bold text-gray-700 flex gap-1 items-center mt-1">Turmas<span className="text-sm mt-1">({data.length})</span></h1>
      </section>

      <div className="w-full mx-auto mt-10">
        {
          //@ts-ignore       
          <DataTable columns={columnsClass} data={data} route={"turmas"} />
        }
      </div>
    </main>
  );
};

export default Classes;
