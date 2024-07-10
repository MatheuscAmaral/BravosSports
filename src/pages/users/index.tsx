import api from "@/api";
import { DataTable } from "@/components/table/dataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { RowProps } from "@/contexts/ModalsContext";
import toast from "react-hot-toast";
import { TbLoader3 } from "react-icons/tb";
import { ReloadContext } from "@/contexts/ReloadContext";

export interface UsersProps {
  id: number;
  name: string;
  level: number;
  complete_register: number;
  status: number;
}

export const columnsProf: ColumnDef<RowProps>[] = [
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
    accessorKey: "level",
    header: "Nível",
    cell: ({ row }) => <div>
        {
            row.getValue("level") == 0 && "Desenvolvedor"
        }
        {
            row.getValue("level") == 1 && "Administrador"
        }
        {
            row.getValue("level") == 2 && "Professor"
        }
        {
            row.getValue("level") == 3 && "Responsável"
        }
    </div>,
  },
  {
    accessorKey: "complete_register",
    header: "Cadastro completo ?",
    cell: ({ row }) => <div>
        {
            row.getValue("complete_register") == 0 && "Não"
        }
        {
            row.getValue("complete_register") == 1 && "Sim"
        }
        {
            (row.getValue("complete_register") != 1 && row.getValue("complete_register") != 0) && "-"
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
      </div>
    ),
  }
];

const Users = () => {
  const [users, setUsers] = useState<UsersProps[]>([]);
  const [loading, setLoading] = useState(false);
  const { reloadPage } = useContext(ReloadContext);

  useEffect(() => {
    const getUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/users");

            setUsers(response.data)
        } catch {
            toast.error("Ocorreu um erro ao buscar os usuários disponíveis!");
        } finally {
            setLoading(false);
        }
    }

    getUsers();
  }, [reloadPage]);


  return (
    <main className="w-full">
      <section className="mt-10">
        <h1 className="text-2xl font-bold text-gray-700">
          Usuários<span className="text-sm "> ({`${users.length}`})</span>
        </h1>
      </section>

      {
        loading ? (
          <div className="mx-auto max-w-5 mt-40 mb-10">
            <TbLoader3 fontSize={25} className="w-12" style={{ animation: "spin 1s linear infinite" }}/>
          </div>
        ) : (
          <div className="w-full mx-auto mt-10">
            {/*@ts-ignore*/}
            <DataTable columns={columnsProf} data={users} route="users" />
          </div>
        )
      }

    </main>
  );
};

export default Users;
