'use client';
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
    <div className="min-h-screen bg-gradient-to-br bg-[#faf9fa] py-12 md:py-24">
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-headline text-5xl font-bold tracking-tight text-[#169a53] md:text-6xl">
            LPDH Directory
          </h1>
        </div>

        <Card className="max-w-4xl mx-auto shadow-2xl overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent" style={{ backgroundColor: "#169a53" }}>
                <TableHead className="w-[200px] md:w-[300px] font-semibold text-white">DEPARTMENT</TableHead>
                <TableHead className="font-semibold text-white">LOCAL</TableHead>
                <TableHead className="font-semibold text-white">DIRECT</TableHead>
                <TableHead className="text-right font-semibold text-white">CELLPHONE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {directoryData.map((item, index) => (
                <TableRow
                  key={item.department}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#c2d7c9]/30"}
                >
                  <TableCell className="font-medium text-gray-800">{item.department}</TableCell>
                  <TableCell className="text-gray-700">{item.local || '-'}</TableCell>
                  <TableCell className="text-gray-700">{item.direct || '-'}</TableCell>
                  <TableCell className="text-right text-gray-700">{item.cellphone || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>
    </div>
  );
}
