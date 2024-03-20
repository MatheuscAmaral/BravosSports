import { DataTable } from "@/components/table/dataTable";
import { columns } from "@/components/table/columns";
import { PaymentProps } from "@/components/table/columns";

const Students = () => {
    const data: PaymentProps[] = ([
            {
              id: "728ed52f",
              amount: 100,
              status: "pending",
              email: "m@example.com",
            },
        ]);

    return (
        <div>
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}


export default Students;