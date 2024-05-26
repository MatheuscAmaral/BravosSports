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
import { ReloadContext } from "@/contexts/ReloadContext";
import noFoto from "../../assets/noFoto.jpg"; 

export interface TeachersProps {
  id: number;
  name: string;
  status: number;
}

export const columnsProf: ColumnDef<RowProps>[] = [
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
    accessorKey: "desc_unit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unidade
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("desc_unit")}</div>,
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
    enableHiding: false,
    cell: ({ row }) => {
      const { open } = useContext(modalContext);

      const openModals = (data: RowProps[], title: string, type: string) => {
        open(data, title, type);
      };

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
            <DropdownMenuItem
              onClick={() =>
                openModals(
                  [row.original],
                  "Turmas do professor",
                  "teacherClass"
                )
              }
            >
              Ver turmas
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                openModals([row.original], "Editar professor", "teacher")
              }
            >
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Teachers = () => {
  const [teachers, setTeachers] = useState<TeachersProps[]>([]);
  const { reloadPage } = useContext(ReloadContext);

  useEffect(() => {
    const getTeachers = async () => {
      try {
        const response = await api.get("/teachers");

        setTeachers(response.data);
      } catch {
        toast.error("Ocorreu um erro ao buscar os professores disponíveis!");
      }
    };

    getTeachers();
  }, [reloadPage]);

  return (
    <main className="w-full">
      <section className="mt-10">
        <h1 className="text-2xl font-bold text-gray-700">
          Professores<span className="text-sm "> ({`${teachers.length}`})</span>
        </h1>
      </section>

      <div className="w-full mx-auto mt-10">
        {/*@ts-ignore*/}
        <DataTable columns={columnsProf} data={teachers} route="teachers" />
      </div>
    </main>
  );
};

export default Teachers;
