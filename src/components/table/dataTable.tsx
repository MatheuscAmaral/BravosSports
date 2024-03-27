import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { Modal } from "flowbite-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IoIosImages } from "react-icons/io";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";

const uploader = Uploader({
  apiKey: "free",
});

const options = { multi: true };

import { classes } from "@/pages/students";

interface DataTableProps {
  data: [],
  columns: []
  route: string
}

export function DataTable({ data, columns, route }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [openModal, setOpenModal] = React.useState(false);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [link, setLink] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <main className="w-full">
      <section
        className={`${
          openFilter
            ? "bg-white xl:bg-gray-50 px-5 xl:px-0 py-10"
            : "bg-white p-5 xl:p-0 xl:bg-gray-50"
        } pt-5 mb-10 border xl:border-0 rounded-lg transition-all`}
      >
        <div
          className={`flex xl:hidden justify-between items-center cursor-pointer`}
          onClick={() => setOpenFilter(!openFilter)}
        >
          <h3 className="text-lg text-gray-700 font-bold">Filtros</h3>
          <IoIosArrowDown fontSize={22} />
        </div>

        <article
          className={`grid gap-5 ${
            openFilter
              ? "grid-cols-1 xl:grid-cols-2 xl:gap-10"
              : "hidden xl:grid xl:grid-cols-2"
          } mt-5 transition-all`}
        >
          <div className={`${route != "students" ? "hidden" : "flex"} justify-center w-full gap-4`}>
            <Input
              placeholder="Pesquise pelo nome do aluno..."
              value={
                (table.getColumn("Nome")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("Nome")?.setFilterValue(event.target.value)
              }
            />

            <Input
              placeholder="Pesquise pelo número de matrícula do aluno..."
              value={
                (table.getColumn("Matrícula")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("Matrícula")?.setFilterValue(event.target.value)
              }
            />

              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Turma" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => {
                    return (
                      <SelectItem key={c.id} value={c.id}>
                        {c.turma}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
          </div>

          <div className={`${route != "turmas" ? "hidden" : "flex"} justify-center w-full gap-4`}>
            <Input
              placeholder="Pesquise pelo código da turma..."
              value={
                (table.getColumn("Código")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("Código")?.setFilterValue(event.target.value)
              }
            />

            <Input
              placeholder="Pesquise pelo descrição da turma..."
              value={
                (table.getColumn("Turma")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("Turma")?.setFilterValue(event.target.value)
              }
            />
          </div>

          <div className="flex gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-full xl:w-40">
                <Button variant="outline" className="ml-auto">
                  Colunas <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value: any) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setOpenModal(true)}
              className={`${route != "students" ? "hidden" : "block"} w-full xl:max-w-32`}
            >
              Cadastrar aluno
            </Button>

            <Button
              onClick={() => setOpenModal(true)}
              className={`${route != "turmas" ? "hidden" : "block"} w-full xl:max-w-32`}
            >
              Cadastrar turma
            </Button>
          </div>
        </article>
      </section>
      <div className="border-2 rounded-lg bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Cadastro de aluno</Modal.Header>
        <Modal.Body className="relative">
          <div className="space-y-6">
            <UploadButton
              uploader={uploader}
              options={options}
              onComplete={(files) =>
                files.length > 0 &&
                setLink(files.map((x) => x.fileUrl).join("\n"))
              }
            >
              {({ onClick }) => (
                <button
                  onClick={onClick}
                  className="h-48 w-full border-dashed border-2 rounded-lg relative text-md font-medium text-gray-700"
                >
                  {link ? (
                    <div className="flex justify-center">
                      <img src={link} className="w-32" alt="foto_aluno" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 items-center justify-center ">
                      <IoIosImages fontSize={40} />
                      <p className="w-full">
                        Selecione ou arraste e solte uma imagem aqui.
                      </p>
                    </div>
                  )}
                </button>
              )}
            </UploadButton>
            <FaTrash
              fontSize={22}
              onClick={() => setLink("")}
              className={`${
                link ? "block" : "hidden"
              } absolute cursor-pointer top-4 right-9 hover:text-red-700 transition-all`}
            />

            <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
              <label htmlFor="nome">Nome:</label>
              <Input id="nome" placeholder="Digite o nome do aluno..." />
            </div>

            <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
              <label htmlFor="nome">Responsável:</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ricardo Amaral</SelectItem>
                  <SelectItem value="2">Fernanda Amaral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
              <label htmlFor="nome">Turma:</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => {
                    return (
                      <SelectItem key={c.id} value={c.id}>
                        {c.turma}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
              <label htmlFor="nome">Telefone:</label>
              <Input
                id="nome"
                placeholder="Digite o telefone do responsável..."
              />
            </div>

            <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
              <label htmlFor="nome">Status:</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Inativo</SelectItem>
                  <SelectItem value="1">Pendente</SelectItem>
                  <SelectItem value="2">Ativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Salvar</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
