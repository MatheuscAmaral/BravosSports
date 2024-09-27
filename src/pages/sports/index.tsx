import { DataTable } from "@/components/table/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import api from "@/api";
import { ReloadContext } from "@/contexts/ReloadContext";
import toast from "react-hot-toast";
import { RowProps, modalContext } from "@/contexts/ModalsContext";
import { TbLoader3 } from "react-icons/tb";
import { PiCaretUpDownBold } from "react-icons/pi";

export interface SportsProps {
  id: number;
  sport_id: number;
  description: string;
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
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  // {
  //   accessorKey: "modality",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Modalidade
  //         <PiCaretUpDownBold className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => <div>{row.getValue("modality")}</div>,
  // },
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
        <PiCaretUpDownBold className="ml-2 h-4 w-4" />
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
  const { reloadPage, newData } = useContext(ReloadContext);
  const [data, setData] = useState<SportsProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getClasses = async () => {
      try {
        setLoading(true);

        if (newData.length > 0) {
          return setData(newData);
        }

        const response = await api.get("/sports");
        setData(response.data);
      } catch {
        toast.error("Ocorreu um erro ao buscar os esportes disponíveis!");
      } finally {
        setLoading(false);
      }
    }
  
    getClasses();
  }, [reloadPage]);


  return (
    <main className="w-full">
      <section className="mt-10">
        <h1 className="text-2xl font-bold text-gray-700 flex gap-1 items-center mt-1">Esportes<span className="text-sm mt-1">({data.length})</span></h1>
      </section>

      {
        loading ? (
          <div className="mx-auto max-w-5 mt-40 mb-10">
            <TbLoader3 fontSize={25} className="w-12" style={{ animation: "spin 1s linear infinite" }}/>
          </div>
        ) : (
          <div className="w-full mx-auto mt-10">
            {
              //@ts-ignore       
              <DataTable columns={columnsClass} data={data} route={"esportes"} />
            }
          </div>
        )
      }
    </main>
  );
};

export default Sports;
