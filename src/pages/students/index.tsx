import { DataTable } from "@/components/table/dataTable";

import { ColumnDef } from "@tanstack/react-table";

export interface PaymentProps {
  id: number;
  Matrícula: string;
  Nome: string;
  Responsável: string;
  status: number;
  Telefone: number;
}

const columns: ColumnDef<PaymentProps[]>[] = [
  {
    accessorKey: "Matrícula",
    header: "Matrícula",
  },
  {
    accessorKey: "Nome",
    header: "Nome",
  },
  {
    accessorKey: "Responsável",
    header: "Responsável",
  },
  {
    accessorKey: "Telefone",
    header: "Telefone",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export const data: PaymentProps[] = [
  {
    id: 1,
    Matrícula: "3105",
    Nome: "Matheus Amaral",
    Responsável: "Ricardo Amaral",
    Telefone: 31992661386,
    status: 1,
  },
  {
    id: 2,
    Matrícula: "1503",
    Nome: " Amaral",
    Responsável: "Fernanda Amaral",
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

      <div className="w-full mx-auto mt-10">
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  );
};

export default Students;
