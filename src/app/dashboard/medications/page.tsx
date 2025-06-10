"use client";

import { useState } from "react";
import { Clock, Download, Filter, Plus, Search, Pill } from "lucide-react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MedicationsPage() {
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);

  const handleSubmitMedicine = () => {
    // TODO: Implement medicine submission logic
    setIsAddMedicineOpen(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Quản lý thuốc
        </h1>
        <p className="text-blue-600">
          Theo dõi thuốc của học sinh, quản lý kho thuốc và yêu cầu cấp phát
          thuốc.
        </p>
      </div>

      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-blue-50">
          <TabsTrigger
            value="student"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-800"
          >
            Thuốc học sinh
          </TabsTrigger>
          <TabsTrigger
            value="inventory"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-800"
          >
            Kho thuốc
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-800"
          >
            Yêu cầu cấp thuốc
          </TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm thuốc..."
                  className="w-[300px] pl-8 border-blue-200 focus:border-blue-500"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Dialog
              open={isAddMedicineOpen}
              onOpenChange={setIsAddMedicineOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" /> Gửi thuốc mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <div className="flex justify-between items-start">
                  <DialogHeader>
                    <DialogTitle className="text-xl">
                      Yêu cầu gửi thuốc cho học sinh
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Điền thông tin chi tiết về thuốc cần gửi cho con em
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="student">Học sinh</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn học sinh" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student1">
                          Nguyễn Văn An - Lớp 1A
                        </SelectItem>
                        <SelectItem value="student2">
                          Trần Thị Bình - Lớp 2B
                        </SelectItem>
                        <SelectItem value="student3">
                          Lê Hoàng Cường - Lớp 3A
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicineName">Tên thuốc</Label>
                      <Input
                        id="medicineName"
                        placeholder="VD: Paracetamol 500mg"
                      />
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
                          <SelectItem value="asneeded">
                            Khi cần thiết
                          </SelectItem>
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
                    <Textarea
                      id="reason"
                      placeholder="VD: Điều trị cảm lạnh, sốt..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">Hướng dẫn đặc biệt</Label>
                    <Textarea
                      id="instructions"
                      placeholder="VD: Uống sau ăn, không uống khi đói..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentContact">Số điện thoại liên hệ</Label>
                    <Input
                      id="parentContact"
                      placeholder="Số điện thoại phụ huynh"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddMedicineOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={handleSubmitMedicine}
                  >
                    Gửi yêu cầu
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      {med.studentName}
                    </TableCell>
                    <TableCell>{med.medicationName}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-orange-500" />
                        {med.schedule}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          med.status === "Đang dùng" ? "default" : "outline"
                        }
                      >
                        {med.status}
                      </Badge>
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
                <Input
                  type="search"
                  placeholder="Tìm kiếm thuốc trong kho..."
                  className="w-[300px] pl-8"
                />
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
              <Card
                key={index}
                className="transition-all duration-300 hover:shadow-lg hover:border-orange-500"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
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
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.expiry}</TableCell>
                    <TableCell>
                      <Badge variant={getInventoryStatusVariant(item.status)}>
                        {item.status}
                      </Badge>
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
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Quản lý thuốc
              </h2>
              <p className="text-muted-foreground">
                Quản lý tất cả các yêu cầu thuốc của học sinh
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Xuất báo cáo
              </Button>
              <Dialog
                open={isAddMedicineOpen}
                onOpenChange={setIsAddMedicineOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Gửi thuốc mới
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Yêu cầu thuốc mới</DialogTitle>
                    <DialogDescription>
                      Điền thông tin về thuốc cần gửi cho học sinh
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="student">Chọn học sinh</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn học sinh" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student1">Nguyễn Văn A</SelectItem>
                          <SelectItem value="student2">Trần Thị B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="medicine">Tên thuốc</Label>
                        <Input id="medicine" placeholder="Nhập tên thuốc" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="quantity">Số lượng</Label>
                        <Input
                          id="quantity"
                          placeholder="Nhập số lượng"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="dosage">Liều lượng</Label>
                        <Input id="dosage" placeholder="VD: 1 viên" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="frequency">Tần suất</Label>
                        <Input id="frequency" placeholder="VD: 2 lần/ngày" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="startDate">Ngày bắt đầu</Label>
                        <Input id="startDate" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="endDate">Ngày kết thúc</Label>
                        <Input id="endDate" type="date" />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="reason">Lý do sử dụng</Label>
                      <Textarea
                        id="reason"
                        placeholder="Nhập lý do sử dụng thuốc"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="instructions">Hướng dẫn đặc biệt</Label>
                      <Textarea
                        id="instructions"
                        placeholder="Nhập hướng dẫn đặc biệt nếu có"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="contact">
                        Thông tin liên hệ phụ huynh
                      </Label>
                      <Input
                        id="contact"
                        placeholder="Số điện thoại phụ huynh"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddMedicineOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button onClick={handleSubmitMedicine}>Gửi yêu cầu</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicationRequests.map((request, index) => (
              <Card
                key={index}
                className="transition-all duration-300 hover:shadow-lg hover:border-orange-500 group"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{request.studentName}</CardTitle>
                    <Badge variant={getRequestStatusVariant(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Yêu cầu #{request.id} • {request.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Pill className="mr-2 h-4 w-4 text-orange-500" />
                      <span className="font-medium">
                        {request.medicationName}
                      </span>
                    </div>
                    <p className="text-sm">
                      {request.dosage} • {request.schedule}
                    </p>
                    {request.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {request.notes}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Chi tiết
                  </Button>
                  {request.status === "Chờ xử lý" && (
                    <Button
                      size="sm"
                      className="transition-all duration-300 group-hover:bg-orange-500"
                    >
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
  );
}

function getInventoryStatusVariant(
  status: string
): "default" | "destructive" | "outline" | "secondary" {
  switch (status) {
    case "Đầy đủ":
      return "default";
    case "Sắp hết":
      return "secondary";
    case "Cần nhập thêm":
      return "destructive";
    case "Sắp hết hạn":
      return "secondary";
    default:
      return "outline";
  }
}

function getRequestStatusVariant(status: string) {
  switch (status) {
    case "Đã xử lý":
      return "default";
    case "Chờ xử lý":
      return "secondary";
    case "Từ chối":
      return "destructive";
    default:
      return "outline";
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
];

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
];

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
];

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
];
