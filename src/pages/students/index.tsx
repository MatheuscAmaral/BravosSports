import { DataTable } from "@/components/table/dataTable";
import { ColumnDef } from "@tanstack/react-table";
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
import toast from "react-hot-toast";
import { ReloadContext } from "@/contexts/ReloadContext";
import { RowProps, modalContext } from "@/contexts/ModalsContext";
import noFoto from "../../assets/noFoto.jpg";
import { TbLoader3 } from "react-icons/tb";

export interface StudentsProps {
  id: number;
  image: string;
  name: string;
  responsible: number;
  responsible_name: string;
  class: number;
  description: string;
  team: string;
  phone: string;
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
    accessorKey: "date_of_birth",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de nascimento
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
  },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("status") == 0 && "Inativo"}

        {row.getValue("status") == 1 && "Ativo"}

        {row.getValue("status") == 2 && "Experimental"}

      </div>
    ),
  },
  {
    id: "actions",
    header: "Ações",
    enableHiding: false,
    cell: ({ row }) => {
      const { open } = useContext(modalContext);

      const openModals = (data: RowProps[]) => {
        open(data, "Editar aluno", "students");
      }

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
            <DropdownMenuItem onClick={() => openModals([row.original])}>Editar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      );
    },
  },
];

const Students = () => {
  const { reloadPage, newStudents, createdUser, filterStudentsByClass } = useContext(ReloadContext);
  const [data, setData] = useState<StudentsProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getStudents = async () => {
      try {  
        setLoading(true);
        
        if (createdUser) {
          filterStudentsByClass(999);
        }

        setData(newStudents);
      } catch {
        toast.error("Ocorreu um erro ao buscar os alunos disponíveis!");
      } finally {
        setLoading(false);
      }
    };
    
    getStudents();
  }, [reloadPage]);


  return (
    <main className="w-full overflow-auto">
      <section className="mt-10">
        <h1 className="text-2xl font-bold text-gray-700 flex items-center gap-1">
          Alunos <span className="text-sm mt-1">({data.length})</span>
        </h1>
      </section>

      {
        loading ? (
          <div className="mx-auto max-w-5 mt-40 mb-10">
            <TbLoader3 fontSize={25} className="w-12" style={{ animation: "spin 1s linear infinite" }}/>
          </div>
        ) : (
          <section className="w-full mx-auto mt-10">
            {/* @ts-ignore */}
            <DataTable columns={columns} data={data} route={"students"} />
          </section>
        )
      }
    </main>
  );
};

export default Students;
