import { DataTable } from "@/components/table/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { TbLoader3 } from "react-icons/tb";
import api from "@/api";
import toast from "react-hot-toast";
import { RowProps, modalContext } from "@/contexts/ModalsContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReloadContext } from "@/contexts/ReloadContext";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { AuthContext, UserProps } from "@/contexts/AuthContext";
import { FaCircleQuestion } from "react-icons/fa6";


export const columns: ColumnDef<RowProps>[] = [
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
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Data agendada
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      function convertDateFormat(dateStr: string) {
        const [dd, mm, yyyy] = dateStr.split('-');
        return `${yyyy}/${mm}/${dd  }`;
      }

      return (
        convertDateFormat(row.getValue("date"))
      )
    },
  },
  {
    accessorKey: "comments",
    header: "Motivo",
    cell: ({ row }) => <div>
      {
        row.getValue("comments") != null ? (
          <div className="flex justify-center bg-gray-50 hover:bg-gray-200 rounded-lg w-9 mx-auto">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="border-none bg-transparent h-9 hover:bg-transparent flex justify-center">
              <FaCircleQuestion
                  fontSize={19}
                  className="text-red-600"
                />
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
        ) : "-"
      }
    </div>,
  },
  {
    accessorKey: "status_call",
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
        {row.getValue("status_call") == 0 && "Inativo"}

        {row.getValue("status_call") == 1 && "Ativo"}
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
        open(data, "Editar agendamento", "agendarFalta");
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

const ScheduleAbsence = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { user } = useContext(AuthContext);
  const { reloadPage } = useContext(ReloadContext);


  useEffect(() => {
    const getCalls = async () => {
      try {
        setLoading(true);
        
        const response = await api.get(`/call/responsible/${(user as unknown as UserProps).id}/level/${(user as unknown as UserProps).level}`);
        setData(response.data);
      } catch {
        toast.error("Ocorreu um erro ao buscar os agendamentos de falta feitos pelo responsável!");
      } finally {
        setLoading(false);
      }
    };

    getCalls();
  }, [reloadPage]);


  return (
    <main className="w-full">
      <section className="mt-10 flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold text-gray-700 flex items-center gap-1">
          Agendamentos <span className="text-sm mt-1">({data.length})</span>
        </h1>
      </section>

      
      {
        loading ? (
          <div className="mx-auto max-w-5 mt-40 mb-10">
            <TbLoader3
              fontSize={25}
              className="w-12"
              style={{ animation: "spin 1s linear infinite" }}
            />
          </div>
        ) : (
          <section className="w-full mx-auto mt-10">
              {/* @ts-ignore */}
              <DataTable columns={columns} data={data} route={"agendarFalta"} /> 
          </section>
        )
      }
    </main>
  );
};

export default ScheduleAbsence;
