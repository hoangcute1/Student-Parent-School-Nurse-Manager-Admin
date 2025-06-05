import { Clock, Download, Filter, Plus, Search, Pill } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MedicationsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">Quản lý thuốc</h1>
        <p className="text-blue-600">
          Theo dõi thuốc của học sinh, quản lý kho thuốc và yêu cầu cấp phát thuốc.
        </p>
      </div>

      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-blue-50">
          <TabsTrigger value="student" className="data-[state=active]:bg-white data-[state=active]:text-blue-800">Thuốc học sinh</TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:bg-white data-[state=active]:text-blue-800">Kho thuốc</TabsTrigger>
          <TabsTrigger value="requests" className="data-[state=active]:bg-white data-[state=active]:text-blue-800">Yêu cầu cấp thuốc</TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
                <Input type="search" placeholder="Tìm kiếm thuốc..." className="w-[300px] pl-8 border-blue-200 focus:border-blue-500" />
              </div>
              <Button variant="outline" size="icon" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Link href="/dashboard/medications/add">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Thêm thuốc mới
              </Button>
            </Link>
          </div>

          <div className="rounded-md border border-blue-200">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="text-blue-800">Tên học sinh</TableHead>
                  <TableHead className="text-blue-800">Tên thuốc</TableHead>
                  <TableHead>Liều lượng</TableHead>
                  <TableHead>Thời gian dùng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentMedications.map((med, index) => (
                  <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{med.studentName}</TableCell>
                    <TableCell>{med.medicationName}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-orange-500" />
                        {med.schedule}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={med.status === "Đang dùng" ? "default" : "outline"}>{med.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Tìm kiếm thuốc trong kho..." className="w-[300px] pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Xuất báo cáo
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nhập thuốc
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inventoryStats.map((stat, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:border-orange-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên thuốc</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Hạn sử dụng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item, index) => (
                  <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.expiry}</TableCell>
                    <TableCell>
                      <Badge variant={getInventoryStatusVariant(item.status)}>{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Yêu cầu cấp thuốc</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Tạo yêu cầu mới
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicationRequests.map((request, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:border-orange-500 group">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{request.studentName}</CardTitle>
                    <Badge variant={getRequestStatusVariant(request.status)}>{request.status}</Badge>
                  </div>
                  <CardDescription>
                    Yêu cầu #{request.id} • {request.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Pill className="mr-2 h-4 w-4 text-orange-500" />
                      <span className="font-medium">{request.medicationName}</span>
                    </div>
                    <p className="text-sm">
                      {request.dosage} • {request.schedule}
                    </p>
                    {request.notes && <p className="text-sm text-muted-foreground mt-2">{request.notes}</p>}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Chi tiết
                  </Button>
                  {request.status === "Chờ xử lý" && (
                    <Button size="sm" className="transition-all duration-300 group-hover:bg-orange-500">
                      Xử lý
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getInventoryStatusVariant(status: string): "default" | "destructive" | "outline" | "secondary" {
  switch (status) {
    case "Đầy đủ":
      return "default"
    case "Sắp hết":
      return "secondary"
    case "Cần nhập thêm":
      return "destructive"
    case "Sắp hết hạn":
      return "secondary"
    default:
      return "outline"
  }
}

function getRequestStatusVariant(status: string) {
  switch (status) {
    case "Đã xử lý":
      return "default"
    case "Chờ xử lý":
      return "secondary"
    case "Từ chối":
      return "destructive"
    default:
      return "outline"
  }
}

const studentMedications = [
  {
    studentName: "Nguyễn Văn An",
    medicationName: "Paracetamol",
    dosage: "500mg, 1 viên",
    schedule: "Sau bữa trưa",
    status: "Đang dùng",
  },
  {
    studentName: "Trần Thị Bình",
    medicationName: "Cetirizine",
    dosage: "10mg, 1 viên",
    schedule: "Sáng và tối",
    status: "Đang dùng",
  },
  {
    studentName: "Lê Hoàng Cường",
    medicationName: "Salbutamol",
    dosage: "2 nhát xịt",
    schedule: "Khi có triệu chứng",
    status: "Khi cần",
  },
  {
    studentName: "Phạm Minh Đức",
    medicationName: "Vitamin D",
    dosage: "400 IU, 1 viên",
    schedule: "Sau bữa sáng",
    status: "Đang dùng",
  },
  {
    studentName: "Hoàng Thị Lan",
    medicationName: "Ibuprofen",
    dosage: "200mg, 1 viên",
    schedule: "Khi đau đầu",
    status: "Khi cần",
  },
]

const inventoryStats = [
  {
    title: "Tổng số thuốc",
    value: "28",
    description: "Loại thuốc trong kho",
  },
  {
    title: "Sắp hết hạn",
    value: "5",
    description: "Loại thuốc cần thay thế",
  },
  {
    title: "Cần nhập thêm",
    value: "7",
    description: "Loại thuốc sắp hết",
  },
]

const inventoryItems = [
  {
    name: "Paracetamol 500mg",
    type: "Giảm đau, hạ sốt",
    quantity: "120 viên",
    expiry: "12/2025",
    status: "Đầy đủ",
  },
  {
    name: "Cetirizine 10mg",
    type: "Kháng histamine",
    quantity: "45 viên",
    expiry: "10/2025",
    status: "Sắp hết",
  },
  {
    name: "Salbutamol xịt",
    type: "Giãn phế quản",
    quantity: "8 ống",
    expiry: "08/2025",
    status: "Cần nhập thêm",
  },
  {
    name: "Vitamin D 400 IU",
    type: "Vitamin",
    quantity: "200 viên",
    expiry: "06/2025",
    status: "Sắp hết hạn",
  },
  {
    name: "Ibuprofen 200mg",
    type: "Giảm đau, kháng viêm",
    quantity: "80 viên",
    expiry: "11/2025",
    status: "Đầy đủ",
  },
]

const medicationRequests = [
  {
    id: "REQ-2025-001",
    studentName: "Nguyễn Văn An",
    medicationName: "Paracetamol 500mg",
    dosage: "1 viên",
    schedule: "Sau bữa trưa",
    date: "15/05/2025",
    status: "Chờ xử lý",
    notes: "Học sinh bị sốt nhẹ, cần uống thuốc sau bữa trưa.",
  },
  {
    id: "REQ-2025-002",
    studentName: "Trần Thị Bình",
    medicationName: "Cetirizine 10mg",
    dosage: "1 viên",
    schedule: "Sáng và tối",
    date: "14/05/2025",
    status: "Đã xử lý",
  },
  {
    id: "REQ-2025-003",
    studentName: "Lê Hoàng Cường",
    medicationName: "Salbutamol",
    dosage: "2 nhát xịt",
    schedule: "Khi có triệu chứng",
    date: "13/05/2025",
    status: "Từ chối",
    notes: "Cần có đơn thuốc mới từ bác sĩ.",
  },
  {
    id: "REQ-2025-004",
    studentName: "Phạm Minh Đức",
    medicationName: "Vitamin D",
    dosage: "1 viên",
    schedule: "Sau bữa sáng",
    date: "12/05/2025",
    status: "Đã xử lý",
  },
]
