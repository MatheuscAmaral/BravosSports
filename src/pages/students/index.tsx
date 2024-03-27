import { DataTable } from "@/components/table/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PaymentProps {
  id: number;
  Matrícula: string;
  Nome: string;
  Responsável: string;
  Turma: string;
  status: number;
  Telefone: number;
}

interface ClassesProps {
  id: string,
  turma: string
}

export const columns: ColumnDef<PaymentProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Matrícula",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Matrícula
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("Matrícula")}</div>,
  },
  {
    accessorKey: "Nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("Nome")}</div>,
  },
  {
    accessorKey: "Responsável",
    header: ({ column }) => {
      return (
        <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Responsável
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("Responsável")}</div>,
  },
  {
    accessorKey: "Turma",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Turma
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("Turma")}</div>,
  },
  {
    accessorKey: "Telefone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Telefone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("Telefone")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">
        {
          row.getValue("status") == 0 && (
            "Inativo"
          )
        }

        {
          row.getValue("status") == 1 && (
            "Pendente"
          )
        }

        {
          row.getValue("status") == 2 && (
            "Ativo"
          )
        }
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => {
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
            <DropdownMenuItem>Ver dados</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const classes: ClassesProps[] = [
  {
    id: "1",
    turma: "3°A"
  },
  {
    id: "2",
    turma: "1°A"
  }
]

export const data: PaymentProps[] = [
  {
    id: 1,
    Matrícula: "3105",
    Nome: "Matheus Amaral",
    Responsável: "Ricardo Amaral",
    Turma: "3°A",
    Telefone: 31992661386,
    status: 1,
  },
  {
    id: 2,
    Matrícula: "1503",
    Nome: " Amaral",
    Responsável: "Fernanda Amaral",
    Turma: "1°A",
    Telefone: 31992121386,
    status: 1,
  },
];

const Students = () => {

  return (
    <main className="w-full">
      <section className="mt-10">
        <h1 className="text-2xl font-bold text-gray-700 flex items-center gap-1">
          Alunos <span className="text-sm mt-1">(200)</span>
        </h1>
      </section>

      <section className="w-full mx-auto mt-10">
        <DataTable columns={columns} data={data} />
      </section>
      
    </main>
  );
};

export default Students;
