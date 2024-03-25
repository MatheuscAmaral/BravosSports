import { DataTable } from "@/components/table/dataTable";
import { columns } from "@/components/table/columns";
import { PaymentProps } from "@/components/table/columns";

const GetClass = () => {
    const data: PaymentProps[] = ([
        {
          id: "728ed52f",
          amount: 100,
          status: "pending",
          email: "m@example.com",
        },
    ]);

    return (
        <main className="w-full">
            <section className="mt-10 ml-10">
                <h1 className="text-2xl font-bold text-gray-600">Buscar em sala</h1>
            </section>

            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} />
            </div>
        </main>
    )
}

export default GetClass;