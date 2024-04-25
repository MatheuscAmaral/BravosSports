import api from "@/api";
import { DataTable } from "@/components/table/dataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { RowProps, modalContext } from "@/contexts/ModalsContext";
import toast from "react-hot-toast";

export interface TeachersProps {
    id: number,
    name: string,
    status: number,
}

const columns: ColumnDef<RowProps>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Código
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
      accessorKey: "status",
      header: "Status",
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
              <DropdownMenuItem onClick={() => openModals([row.original], "Turmas do professor", "teacherClass")}>Ver turmas</DropdownMenuItem>
              <DropdownMenuItem onClick={() => openModals([row.original], "Editar professor", "teacher")}>Editar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

const Teachers = () => {
    const [teachers, setTeachers] = useState<TeachersProps[]>([]);

    useEffect(() => {
        const getTeachers = async () => {
           try {
            const response = await api.get("/teachers");

            setTeachers(response.data);
           }

           catch {
            toast.error("Ocorreu um erro ao buscar os professores disponíveis!");
           }
        }

        getTeachers();
    }, []);

    return (
        <main className="w-full">
            <section className="mt-10">
                <h1 className="text-2xl font-bold text-gray-700">Professores({`${teachers.length}`})</h1>
            </section>

            <div className="w-full mx-auto mt-10">
                {/*@ts-ignore*/}
                <DataTable columns={columns} data={teachers} />
            </div>
        </main>
    )
}

export default Teachers;