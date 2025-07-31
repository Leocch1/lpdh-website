
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const directoryData = [
  { department: "ACCOUNTING", local: "117 / 198", direct: "8829-8164", cellphone: "09178369466" },
  { department: "ADMITTING", local: "170", direct: "", cellphone: "09178369466" },
  { department: "BILLING", local: "122 / 168", direct: "", cellphone: "09178289433" },
  { department: "BOARD ROOM", local: "172 / 163", direct: "8636-9414", cellphone: "" },
  { department: "CARD-PULMO", local: "132", direct: "8332-6268", cellphone: "09171479949" },
  { department: "CASHIER", local: "120", direct: "8829-8297", cellphone: "09178005487" },
  { department: "CT-SCAN", local: "169", direct: "", cellphone: "09951629112" },
  { department: "ER / ER HMO", local: "147 / 167", direct: "8820-0079", cellphone: "09178554590" },
  { department: "ICU", local: "164", direct: "8829-5277", cellphone: "09175402203" },
  { department: "INDUSTRIAL", local: "166", direct: "8332-6264", cellphone: "09178514431" },
  { department: "INFORMATION", local: "102", direct: "8825-5236", cellphone: "09178369466" },
  { department: "LPCHP GREEN CARD", local: "306", direct: "8829-7715", cellphone: "" },
  { department: "NICU", local: "158", direct: "", cellphone: "09950154862" },
  { department: "ONCOLOGY UNIT", local: "204", direct: "", cellphone: "09182785775" },
  { department: "REHAB", local: "506", direct: "8332-6250", cellphone: "09178062050" },
  { department: "STATION 1", local: "771", direct: "8332-6283", cellphone: "09178514499" },
  { department: "STATION 2", local: "156", direct: "8820-5211", cellphone: "09178514507" },
  { department: "STATION 3A", local: "773", direct: "8829-5694", cellphone: "09178514521" },
  { department: "STATION 3B", local: "772", direct: "8829-5926", cellphone: "09178514524" },
  { department: "STATION 4", local: "774", direct: "8829-2108", cellphone: "09178514531" },
];

export default function DirectoriesPage() {
  return (
    <div className="bg-secondary">
        <div className="container py-12 md:py-24">
            <div className="text-center mb-12">
                <h1 className="font-headline text-5xl font-bold tracking-tight text-primary">LPDH Directory</h1>
            </div>

            <Card className="max-w-4xl mx-auto shadow-lg overflow-hidden">
                <Table>
                <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                    <TableHead className="w-[300px] font-semibold text-foreground">DEPARTMENT</TableHead>
                    <TableHead className="font-semibold text-foreground">LOCAL</TableHead>
                    <TableHead className="font-semibold text-foreground">DIRECT</TableHead>
                    <TableHead className="text-right font-semibold text-foreground">CELLPHONE</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {directoryData.map((item) => (
                    <TableRow key={item.department}>
                        <TableCell className="font-medium">{item.department}</TableCell>
                        <TableCell>{item.local || '-'}</TableCell>
                        <TableCell>{item.direct || '-'}</TableCell>
                        <TableCell className="text-right">{item.cellphone || '-'}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Card>
        </div>
    </div>
  );
}
