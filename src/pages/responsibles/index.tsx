import { DataTable, ResponsibleProps } from "@/components/table/dataTable";
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
import toast from "react-hot-toast";
import { RowProps, modalContext } from "@/contexts/ModalsContext";
import { ReloadContext } from "@/contexts/ReloadContext";
import noFoto from "../../assets/noFoto.jpg";
import { PiCaretUpDownBold } from "react-icons/pi";
import { TbLoader3 } from "react-icons/tb";


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
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "degree_kinship",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Grau de parentesco
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">
      {
        row.getValue("degree_kinship") ? row.getValue("degree_kinship") : "-"
      }
    </div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Telefone
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("phone")}</div>,
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
    enableHiding: false,
    cell: ({ row }) => {
      const { open } = useContext(modalContext);

      const openModals = (data: RowProps[]) => {
        open(data, "Editar responsável", "responsibles");
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

const Responsibles = () => {
  const [data, setData] = useState<ResponsibleProps[]>([]);
  const { reloadPage } = useContext(ReloadContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getResponsibles = async () => {
       try {
        setLoading(true);

        const response = await api.get("/responsibles");
        setData(response.data);
       } catch {
        toast.error("Ocorreu um erro ao buscar os responsáveis disponíveis!");
       } finally {
        setLoading(false);
       }
    }

    getResponsibles();
  }, [reloadPage]);

  return (
    <main className="w-full">
      <section className="mt-10">
        <h1 className="text-2xl font-bold text-gray-700 flex items-center gap-1">
          Responsáveis <span className="text-sm mt-1">({data.length})</span>
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
            <DataTable columns={columns} data={data} route={"responsibles"} />
          </section>
        )
      }

    </main>
  );
};

export default Responsibles;
