"use client";

import { useState } from "react";
import { Clock, Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Badge } from "@/components/ui/badge";
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
        <p className="text-blue-600">Theo dõi thuốc của học sinh</p>
      </div>

      <div className="space-y-4">
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
          <Dialog open={isAddMedicineOpen} onOpenChange={setIsAddMedicineOpen}>
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
      </div>
    </div>
  );
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
