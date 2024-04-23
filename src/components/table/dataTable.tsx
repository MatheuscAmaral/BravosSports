import * as React from "react";
import { toast } from "react-hot-toast";
import { TbLoader3 } from "react-icons/tb";
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

import api from "@/api";
import { ClassesProps } from "@/pages/classes";
import { ReloadContext } from "@/contexts/ReloadContext";
import { StudentsProps } from "@/pages/students";

interface DataTableProps {
  data: [];
  columns: [];
  route: string;
}

export interface ResponsibleProps {
  id: number;
  name: string;
  phone: string;
  status: number;
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

  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { reloadPage } = React.useContext(ReloadContext);
  const [description, setDescription] = React.useState("");
  const [newData, setNewData] = React.useState([]);
  const quantity_students = 0;
  const [name, setName] = React.useState("");
  const [classesDisp, setClassesDisp] = React.useState<ClassesProps[]>([]);
  const [responsible, setResponsible] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [modality, setModality] = React.useState("");
  const [responsibles, setResponsibles] = React.useState<ResponsibleProps[]>(
    []
  );
  const [students, setStudents] = React.useState<StudentsProps[]>([]);
  const [classes, setClasses] = React.useState("1");
  const [phone, setPhone] = React.useState("");
  const [status, setStatus] = React.useState("1");

  React.useEffect(() => {
    setNewData(data);
    if (route == "students") {
      getClasses();
    }
  }, []);

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

  const createClasses = async (e: React.FormEvent) => {
    e.preventDefault();

    if (route == "studentsClass") {
      return;
    }

    const data = {
      description: description,
      quantity_students: quantity_students,
      modality: modality,
      category: category,
      status: status,
    };

    try {
      setLoading(true);
      await api.post("/classes", data);
      toast.success("Turma cadastrada com sucesso!");
      setNewData((allData) => ({ ...allData, data }));
      setOpenModal(false);
      reloadPage();
    } catch {
      toast.error("Ocorreu um erro ao cadastrar a turma!");
    } finally {
      setLoading(false);
    }
  };

  const getResponsibles = async () => {
    try {
      const response = await api.get("/responsibles");

      setResponsibles(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar os responsáveis disponíveis!");
    }
  };

  const getClasses = async () => {
    try {
      const response = await api.get("/classes");

      setClassesDisp(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar as turmas disponíveis!");
    }
  };

  const getStudents = async () => {
    try {
      const response = await api.get("/students");

      setStudents(response.data);
    } catch {
      toast.error("Ocorreu um erro ao buscar os alunos disponíveis!");
    }
  };

  const openModals = async () => {
    setOpenModal(true);

    if (route == "students") {
      await getResponsibles();
    }

    if (route == "turmas") {
      await getStudents();
    }
  };

  const closeModal = () => {
    setError(false);
    setOpenModal(false);
  };

  const createStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (route == "studentsClass") {
      return;
    }

    const data = {
      image: link,
      name: name,
      responsible: responsible,
      class: classes,
      phone: phone,
      status: status,
    };

    if (!link) {
      toast("É necessário que o aluno possua uma foto cadastrada!", {
        position: "top-right",
        icon: "⚠️",
      });

      setError(true);

      return;
    }

    try {
      setLoading(true);
      await api.post("/students", data);

      toast.success("Aluno cadastrado com sucesso!");
      setOpenModal(false);
      reloadPage();
      setLink("");
    } catch {
      toast.error("Ocorreu um erro ao cadastrar o aluno!");
    }
  };

  return (
    <main className="w-full">
      <section
        className={`${
          route == "studentsClass" ? "hidden" : 
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
          <IoIosArrowDown
            fontSize={22}
            className={`${
              openFilter ? "rotate-180" : "rotate-0"
            } transition-all`}
          />
        </div>

        <article
          className={`grid gap-5 ${
            openFilter
              ? "grid-cols-1 xl:grid-cols-2 xl:gap-10"
              : "hidden xl:grid xl:grid-cols-2"
          } mt-5 transition-all`}
        >
          {route == "students" && (
            <>
              <div className={`flex justify-center w-full gap-4`}>
                <Input
                  placeholder="Nome do aluno..."
                  value={
                    (table.getColumn("name")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                />

                <Input
                  placeholder="Matrícula do aluno..."
                  value={
                    (table.getColumn("id")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("id")?.setFilterValue(event.target.value)
                  }
                />

                <Select onValueChange={(e) => setClasses(e)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {classesDisp.map((c) => {
                      if (c.status == 1) {
                        return (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.description}
                          </SelectItem>
                        );
                      }
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Modal show={openModal} onClose={() => closeModal()}>
                <Modal.Header>Cadastro de aluno</Modal.Header>
                <form onSubmit={createStudent}>
                  <Modal.Body
                    className="relative"
                    style={{ maxHeight: "500px" }}
                  >
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
                            className={`h-48 w-full border-dashed ${
                              error && !link && "border-red-500"
                            } border-2 rounded-lg relative text-md font-medium text-gray-700`}
                          >
                            {link ? (
                              <div className="flex justify-center">
                                <img
                                  src={link}
                                  className="w-32"
                                  alt="foto_aluno"
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2 items-center justify-center ">
                                <IoIosImages fontSize={40} />
                                <p className="w-full">
                                  Clique aqui para selecionar uma imagem.
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
                        <Input
                          id="nome"
                          required
                          placeholder="Digite o nome do aluno..."
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="nome">Responsável:</label>
                        <Select
                          required
                          onValueChange={(e) => setResponsible(e)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o responsável" />
                          </SelectTrigger>

                          <SelectContent>
                            {responsibles.map((r) => {
                              return (
                                <SelectItem key={r.id} value={String(r.id)}>
                                  {r.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="nome">Turma:</label>
                        <Select onValueChange={(e) => setClasses(e)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a turma" />
                          </SelectTrigger>
                          <SelectContent>
                            {classesDisp.map((c) => {
                              return (
                                <SelectItem key={c.id} value={String(c.id)}>
                                  {c.description}
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
                          required
                          placeholder="Digite o telefone do responsável..."
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="nome">Status:</label>
                        <Select required onValueChange={(e) => setStatus(e)}>
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
                    <Button type="submit">Salvar</Button>
                    <Button color="gray" onClick={() => closeModal()}>
                      Fechar
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </>
          )}

          {route == "turmas" && (
            <>
              <div className={`flex justify-center w-full gap-4`}>
                <Input
                  placeholder="Pesquise pelo código da turma..."
                  value={
                    (table.getColumn("id")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("id")
                      ?.setFilterValue(String(event.target.value))
                  }
                />

                <Input
                  placeholder="Pesquise pelo descrição da turma..."
                  value={
                    (table
                      .getColumn("description")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("description")
                      ?.setFilterValue(event.target.value)
                  }
                />
              </div>

              <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Cadastro de turma</Modal.Header>
                <form onSubmit={(e) => createClasses(e)}>
                  <Modal.Body className="relative">
                    <div className="space-y-6">
                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="description">Descrição:</label>
                        <Input
                          id="description"
                          name="description"
                          placeholder="Digite o descrição da turma..."
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="modality">Modalidade:</label>
                        <Select required onValueChange={(e) => setModality(e)}>
                          <SelectTrigger
                            className="w-full"
                            id="modality"
                            name="modality"
                          >
                            <SelectValue placeholder="Selecione a modalidade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Futsal">Futsal</SelectItem>
                            <SelectItem value="Handebol">Handebol</SelectItem>
                            <SelectItem value="Vôlei">Vôlei</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="students">Categoria:</label>
                        <Select required onValueChange={(e) => setCategory(e)}>
                          <SelectTrigger
                            className="w-full"
                            id="category"
                            name="category"
                          >
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1° ao 3° ano</SelectItem>
                            <SelectItem value="2">4° ao 6° ano</SelectItem>
                            <SelectItem value="3">7° ao 9° ano</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="students">Alunos:</label>
                        <Select required onValueChange={(e) => (e)}>
                          <SelectTrigger
                            className="w-full"
                            id="quantity_students"
                            name="quantity_students"
                          >
                            <SelectValue placeholder="Selecione os alunos" />
                          </SelectTrigger>
                          <SelectContent>
                            {
                              students.map(s => {
                                return (
                                  <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                )
                              })
                            }
                          </SelectContent>
                        </Select>
                      </div> */}

                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="status">Status:</label>
                        <Select required onValueChange={(e) => setStatus(e)}>
                          <SelectTrigger
                            className="w-full"
                            id="status"
                            name="status"
                          >
                            <SelectValue placeholder="Selecione o status da turma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Inativo</SelectItem>
                            <SelectItem value="1">Ativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button className="text-center " type="submit">
                      {loading ? <TbLoader3 /> : "Salvar"}
                    </Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                      Fechar
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </>
          )}

          <div className="flex gap-5">
            {route != "studentsClass" && (
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
                          {column.id == "image" && "Foto"}

                          {column.id == "name" && "Nome"}

                          {column.id == "responsible" && "Responsável"}

                          {column.id == "class" && "Turma"}

                          {column.id == "phone" && "Telefone"}

                          {column.id == "category" && "Categoria"}

                          {column.id == "modality" && "Modalidade"}

                          {column.id == "status" && "Status"}

                          {route == "students"
                            ? column.id == "id" && "Matrícula"
                            : column.id == "id" && "Código"}

                          {column.id == "description" && "Descrição"}

                          {column.id == "quantity_students" && "Alunos"}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              onClick={() => openModals()}
              className={`${
                route != "students" ? "hidden" : "block"
              } w-full xl:max-w-32`}
            >
              Cadastrar aluno
            </Button>

            <Button
              onClick={() => openModals()}
              className={`${
                route != "turmas" ? "hidden" : "block"
              } w-full xl:max-w-32`}
            >
              Cadastrar turma
            </Button>
          </div>
        </article>
      </section>
      <div className={`${route != "studentsClass" ? "border-2 rounded-lg bg-white" : "border rounded-sm bg-white"}`}>
        <Table>
          <TableHeader style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "white" }}>
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
          <TableBody
            style={{ maxHeight: "200px" }}
            className=" overflow-y-auto"
          >
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  // className={`${row.original && row.original.status == 1 && "bg-yellow-400"}`}
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
    </main>
  );
}
