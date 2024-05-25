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

export interface SportsProps {
  id: number;
  description: string;
  quantity_students: number;
  modality: string,
  class: number,
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
    accessorKey: "modality",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Modalidade
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("modality")}</div>,
  },
  //  {
  //   accessorKey: "class",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Turma
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => <div>
  //     {row.getValue("class")}
  //   </div>,
  // },
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
            <DropdownMenuItem onClick={() => openModals([row.original], "Editar esportes", "esportes")}>Editar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];


const Sports = () => {
  const { reloadPage } = useContext(ReloadContext);

  useEffect(() => {
    const getClasses = async () => {
      try {
        const response = await api.get("/sports");
  
        setData(response.data);
      }

      catch {
        toast.error("Ocorreu um erro ao buscar os esportes disponíveis!");
      }
    }
  
    getClasses();
  }, [reloadPage]);

  const [data, setData] = useState<SportsProps[]>([]);

  return (
    <main className="w-full">
      <section className="mt-10">
        <h1 className="text-2xl font-bold text-gray-700 flex gap-1 items-center mt-1">Esportes<span className="text-sm mt-1">({data.length})</span></h1>
      </section>

      <div className="w-full mx-auto mt-10">
        {
          //@ts-ignore       
          <DataTable columns={columnsClass} data={data} route={"esportes"} />
        }
      </div>
    </main>
  );
};

export default Sports;
