import { DataTable } from "@/components/table/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { TbLoader3 } from "react-icons/tb";
import api from "@/api";
import toast from "react-hot-toast";
import { RowProps } from "@/contexts/ModalsContext";
import { PiCaretUpDownBold } from "react-icons/pi";
import { ReloadContext } from "@/contexts/ReloadContext";


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
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
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
            <PiCaretUpDownBold className="ml-2 h-4 w-4" />
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

        {row.getValue("status") == 3 && "Pendente"}

        {row.getValue("status") == 4 && "Desativado"}

        {row.getValue("status") == 2 && "Experimental"}
      </div>
    ),
  },
  {
    accessorKey: "new_status",
    header: ({ column }) => {
        return (
          <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Novo Status
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("new_status") == 0 && "Inativo"}

        {row.getValue("new_status") == 2 && "Experimental"}
      </div>
    ),
  },
  {
    accessorKey: "ready",
    header: ({ column }) => {
        return (
          <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Alterou?
          <PiCaretUpDownBold className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("ready") == true && "Sim"}

        {row.getValue("ready") == false && "Não"}
      </div>
    ),
  }
];

const Schedule = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { reloadPage } = useContext(ReloadContext);


  useEffect(() => {
    const getSchedules = async () => {
      try {
        setLoading(true);
        
        const response = await api.get(`/schedules`);
        setData(response.data);
      } catch {
        toast.error("Ocorreu um erro ao buscar os agendamentos!");
      } finally {
        setLoading(false);
      }
    };

    getSchedules();
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
              <DataTable columns={columns} data={data} route={"agendarNivel"} /> 
          </section>
        )
      }
    </main>
  );
};

export default Schedule;