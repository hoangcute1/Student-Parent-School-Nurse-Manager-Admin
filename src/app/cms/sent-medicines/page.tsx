"use client"

import { useState } from "react"
import { Pill, Plus, Search, User, CheckCircle, Clock, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ParentMedicine() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false)

  const handleSubmitMedicine = () => {
    // Xử lý gửi thuốc ở đây
    setIsAddMedicineOpen(false)
    // Hiển thị thông báo thành công
    alert("Đã gửi yêu cầu thuốc thành công!")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-teal-800">Thuốc từ Phụ huynh</h1>
        <p className="text-teal-600">Quản lý thuốc cá nhân học sinh do phụ huynh gửi</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-teal-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-teal-700">Yêu cầu mới</CardTitle>
            <Pill className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-800">8</div>
            <p className="text-xs text-teal-600">Chờ xử lý</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Đang xử lý</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">12</div>
            <p className="text-xs text-orange-600">Đang kiểm tra</p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Đã duyệt</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">45</div>
            <p className="text-xs text-green-600">Tháng này</p>
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Từ chối</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">3</div>
            <p className="text-xs text-red-600">Cần xem lại</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-teal-50">
          <TabsTrigger value="requests" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Yêu cầu mới
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Đã duyệt
          </TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Kho thuốc PH
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            Lịch sử
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-teal-800">Yêu cầu thuốc từ phụ huynh</CardTitle>
                  <CardDescription className="text-teal-600">
                    Danh sách yêu cầu gửi thuốc cần được xử lý
                  </CardDescription>
                </div>
                <Dialog open={isAddMedicineOpen} onOpenChange={setIsAddMedicineOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm yêu cầu thuốc
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Yêu cầu gửi thuốc cho học sinh</DialogTitle>
                      <DialogDescription>Điền thông tin chi tiết về thuốc cần gửi cho con em</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="student">Học sinh</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn học sinh" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student1">Nguyễn Văn An - Lớp 1A</SelectItem>
                            <SelectItem value="student2">Trần Thị Bình - Lớp 2B</SelectItem>
                            <SelectItem value="student3">Lê Hoàng Cường - Lớp 3A</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="medicineName">Tên thuốc</Label>
                          <Input id="medicineName" placeholder="VD: Paracetamol 500mg" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Số lượng</Label>
                          <Input id="quantity" type="number" placeholder="VD: 10" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dosage">Liều dùng</Label>
                          <Input id="dosage" placeholder="VD: 1 viên/lần" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="frequency">Tần suất</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn tần suất" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="once">1 lần/ngày</SelectItem>
                              <SelectItem value="twice">2 lần/ngày</SelectItem>
                              <SelectItem value="three">3 lần/ngày</SelectItem>
                              <SelectItem value="asneeded">Khi cần thiết</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Ngày bắt đầu</Label>
                          <Input id="startDate" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">Ngày kết thúc</Label>
                          <Input id="endDate" type="date" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reason">Lý do sử dụng</Label>
                        <Textarea id="reason" placeholder="VD: Điều trị cảm lạnh, sốt..." />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="instructions">Hướng dẫn đặc biệt</Label>
                        <Textarea id="instructions" placeholder="VD: Uống sau ăn, không uống khi đói..." />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parentContact">Số điện thoại liên hệ</Label>
                        <Input id="parentContact" placeholder="Số điện thoại phụ huynh" />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddMedicineOpen(false)}>
                          Hủy
                        </Button>
                        <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSubmitMedicine}>
                          Gửi yêu cầu
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm theo tên học sinh hoặc thuốc..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="reviewing">Đang xem xét</SelectItem>
                    <SelectItem value="approved">Đã duyệt</SelectItem>
                    <SelectItem value="rejected">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {medicineRequests.map((request, index) => (
                  <div key={index} className="p-4 rounded-lg border border-teal-100 hover:bg-teal-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-teal-800">{request.studentName}</h4>
                          <p className="text-sm text-teal-600">
                            {request.class} • {request.parentName}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={request.status === "Chờ xử lý" ? "secondary" : "default"}
                        className={
                          request.status === "Chờ xử lý"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "Đã duyệt"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm">
                          <strong>Thuốc:</strong> {request.medicineName}
                        </p>
                        <p className="text-sm">
                          <strong>Số lượng:</strong> {request.quantity}
                        </p>
                        <p className="text-sm">
                          <strong>Liều dùng:</strong> {request.dosage}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">
                          <strong>Tần suất:</strong> {request.frequency}
                        </p>
                        <p className="text-sm">
                          <strong>Thời gian:</strong> {request.duration}
                        </p>
                        <p className="text-sm">
                          <strong>Lý do:</strong> {request.reason}
                        </p>
                      </div>
                    </div>

                    {request.instructions && (
                      <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>Hướng dẫn:</strong> {request.instructions}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Gửi lúc: {request.submittedAt}</span>
                      <div className="flex gap-2">
                        {request.status === "Chờ xử lý" && (
                          <>
                            <Button size="sm" variant="outline" className="border-red-200 text-red-700">
                              Từ chối
                            </Button>
                            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                              Duyệt
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-teal-800">Thuốc đã được duyệt</CardTitle>
              <CardDescription className="text-teal-600">
                Danh sách thuốc từ phụ huynh đã được phê duyệt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Học sinh</TableHead>
                      <TableHead>Thuốc</TableHead>
                      <TableHead>Liều dùng</TableHead>
                      <TableHead>Tần suất</TableHead>
                      <TableHead>Còn lại</TableHead>
                      <TableHead>Ngày hết hạn</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedMedicines.map((medicine) => (
                      <TableRow key={medicine.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{medicine.studentName}</div>
                            <div className="text-sm text-gray-500">{medicine.class}</div>
                          </div>
                        </TableCell>
                        <TableCell>{medicine.medicineName}</TableCell>
                        <TableCell>{medicine.dosage}</TableCell>
                        <TableCell>{medicine.frequency}</TableCell>
                        <TableCell>
                          <Badge
                            variant={medicine.remaining > 5 ? "default" : "destructive"}
                            className={
                              medicine.remaining > 5 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {medicine.remaining} viên
                          </Badge>
                        </TableCell>
                        <TableCell>{medicine.expiryDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              Cấp phát
                            </Button>
                            <Button variant="ghost" size="sm">
                              Chi tiết
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-teal-800">Kho thuốc phụ huynh</CardTitle>
              <CardDescription className="text-teal-600">
                Tổng hợp thuốc cá nhân của học sinh do phụ huynh gửi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parentMedicineInventory.map((item, index) => (
                  <Card key={index} className="border-teal-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-teal-800">{item.studentName}</CardTitle>
                      <CardDescription className="text-teal-600">{item.class}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {item.medicines.map((med, medIndex) => (
                          <div key={medIndex} className="p-2 bg-gray-50 rounded border">
                            <div className="font-medium text-sm">{med.name}</div>
                            <div className="text-xs text-gray-600">
                              Còn: {med.quantity} • HSD: {med.expiry}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-3 bg-teal-600 hover:bg-teal-700" size="sm">
                        Xem chi tiết
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-teal-800">Lịch sử cấp phát</CardTitle>
              <CardDescription className="text-teal-600">
                Lịch sử cấp phát thuốc từ phụ huynh cho học sinh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medicineHistory.map((history, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Pill className="h-5 w-5 text-teal-600" />
                      <div>
                        <div className="font-medium text-gray-900">{history.action}</div>
                        <div className="text-sm text-gray-600">
                          {history.studentName} - {history.medicineName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{history.quantity}</div>
                      <div className="text-xs text-gray-500">{history.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const medicineRequests = [
  {
    studentName: "Nguyễn Văn An",
    class: "Lớp 1A",
    parentName: "Nguyễn Thị Lan",
    medicineName: "Paracetamol 500mg",
    quantity: "10 viên",
    dosage: "1 viên/lần",
    frequency: "2 lần/ngày",
    duration: "16/12 - 20/12/2024",
    reason: "Điều trị cảm lạnh, sốt",
    instructions: "Uống sau ăn, không uống khi đói",
    status: "Chờ xử lý",
    submittedAt: "16/12/2024 - 08:30",
  },
  {
    studentName: "Trần Thị Bình",
    class: "Lớp 2B",
    parentName: "Trần Văn Minh",
    medicineName: "Cetirizine 10mg",
    quantity: "5 viên",
    dosage: "1/2 viên/lần",
    frequency: "1 lần/ngày",
    duration: "16/12 - 18/12/2024",
    reason: "Dị ứng thời tiết",
    instructions: "Uống vào buổi tối trước khi ngủ",
    status: "Đã duyệt",
    submittedAt: "15/12/2024 - 14:20",
  },
  {
    studentName: "Lê Hoàng Cường",
    class: "Lớp 3A",
    parentName: "Lê Thị Hoa",
    medicineName: "Vitamin C 500mg",
    quantity: "20 viên",
    dosage: "1 viên/lần",
    frequency: "1 lần/ngày",
    duration: "16/12 - 30/12/2024",
    reason: "Tăng cường sức đề kháng",
    instructions: "Uống sau bữa sáng",
    status: "Chờ xử lý",
    submittedAt: "15/12/2024 - 16:45",
  },
]

const approvedMedicines = [
  {
    id: 1,
    studentName: "Trần Thị Bình",
    class: "Lớp 2B",
    medicineName: "Cetirizine 10mg",
    dosage: "1/2 viên/lần",
    frequency: "1 lần/ngày",
    remaining: 3,
    expiryDate: "18/12/2024",
  },
  {
    id: 2,
    studentName: "Phạm Văn Đức",
    class: "Lớp 1A",
    medicineName: "Salbutamol xịt",
    dosage: "2 xịt/lần",
    frequency: "Khi cần",
    remaining: 15,
    expiryDate: "25/12/2024",
  },
]

const parentMedicineInventory = [
  {
    studentName: "Nguyễn Văn An",
    class: "Lớp 1A",
    medicines: [
      { name: "Paracetamol 500mg", quantity: "8 viên", expiry: "20/12/2024" },
      { name: "Vitamin C", quantity: "15 viên", expiry: "30/12/2024" },
    ],
  },
  {
    studentName: "Trần Thị Bình",
    class: "Lớp 2B",
    medicines: [{ name: "Cetirizine 10mg", quantity: "3 viên", expiry: "18/12/2024" }],
  },
  {
    studentName: "Lê Hoàng Cường",
    class: "Lớp 3A",
    medicines: [
      { name: "Salbutamol xịt", quantity: "1 ống", expiry: "25/12/2024" },
      { name: "Loratadine 10mg", quantity: "5 viên", expiry: "22/12/2024" },
    ],
  },
]

const medicineHistory = [
  {
    action: "Cấp phát thuốc",
    studentName: "Trần Thị Bình",
    medicineName: "Cetirizine 10mg",
    quantity: "1/2 viên",
    time: "16/12/2024 - 14:30",
  },
  {
    action: "Nhận thuốc từ PH",
    studentName: "Nguyễn Văn An",
    medicineName: "Paracetamol 500mg",
    quantity: "10 viên",
    time: "16/12/2024 - 08:45",
  },
  {
    action: "Cấp phát thuốc",
    studentName: "Lê Hoàng Cường",
    medicineName: "Salbutamol xịt",
    quantity: "2 xịt",
    time: "15/12/2024 - 16:20",
  },
]
