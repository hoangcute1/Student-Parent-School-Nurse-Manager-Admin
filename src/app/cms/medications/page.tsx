"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Define type for medicine
interface Medicine {
  id: number;
  name: string;
  category: string;
  quantity: number;
  maxQuantity: number;
  unit: string;
  expiryDate: string;
  status: string;
}

export default function Medicine() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );

  const handleViewMedicine = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsViewDialogOpen(true);
  };

  const handleEditMedicine = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsEditDialogOpen(true);
  };

  const handleDeleteMedicine = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Quản lý Kho thuốc
        </h1>
        <p className="text-blue-600">
          Theo dõi tồn kho, nhập xuất và hạn sử dụng thuốc
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Tổng loại thuốc
            </CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">45</div>
            <p className="text-xs text-blue-600">Đang quản lý</p>
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Sắp hết hạn
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">8</div>
            <p className="text-xs text-red-600">Trong 30 ngày tới</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Tồn kho thấp
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">12</div>
            <p className="text-xs text-orange-600">Cần nhập thêm</p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Xuất tháng này
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">156</div>
            <p className="text-xs text-green-600">Lượt cấp phát</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-blue-50">
          <TabsTrigger
            value="inventory"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Tổng số lượng thuốc
          </TabsTrigger>
          <TabsTrigger
            value="import"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Nhập kho
          </TabsTrigger>
          <TabsTrigger
            value="export"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Xuất kho
          </TabsTrigger>
          <TabsTrigger
            value="expiry"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Hạn sử dụng
          </TabsTrigger>
        </TabsList>
        <TabsContent value="inventory" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-blue-800">
                    Danh sách thuốc trong kho
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Theo dõi số lượng và tình trạng thuốc
                  </CardDescription>
                </div>
                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm thuốc mới
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Thêm thuốc mới</DialogTitle>
                      <DialogDescription>
                        Nhập thông tin thuốc vào kho
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="medicineName">Tên thuốc</Label>
                        <Input id="medicineName" placeholder="Nhập tên thuốc" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Loại thuốc</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại thuốc" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="painkiller">
                              Thuốc giảm đau
                            </SelectItem>
                            <SelectItem value="antibiotic">
                              Kháng sinh
                            </SelectItem>
                            <SelectItem value="vitamin">Vitamin</SelectItem>
                            <SelectItem value="antiseptic">
                              Thuốc sát trùng
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Số lượng</Label>
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="Nhập số lượng"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Hạn sử dụng</Label>
                        <Input id="expiryDate" type="date" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                        >
                          Hủy
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Thêm thuốc
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
                    placeholder="Tìm kiếm thuốc..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Loại thuốc" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="painkiller">Thuốc giảm đau</SelectItem>
                    <SelectItem value="antibiotic">Kháng sinh</SelectItem>
                    <SelectItem value="vitamin">Vitamin</SelectItem>
                    <SelectItem value="antiseptic">Thuốc sát trùng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên thuốc</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Đơn vị</TableHead>
                      <TableHead>Hạn sử dụng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicineInventoryData.map((medicine) => (
                      <TableRow key={medicine.id}>
                        <TableCell className="font-medium">
                          {medicine.name}
                        </TableCell>
                        <TableCell>{medicine.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{medicine.quantity}</span>
                            <Progress
                              value={
                                (medicine.quantity / medicine.maxQuantity) * 100
                              }
                              className="w-16 h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{medicine.unit}</TableCell>
                        <TableCell>{medicine.expiryDate}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              medicine.status === "Đầy đủ"
                                ? "default"
                                : medicine.status === "Sắp hết"
                                ? "destructive"
                                : "secondary"
                            }
                            className={
                              medicine.status === "Đầy đủ"
                                ? "bg-green-100 text-green-800"
                                : medicine.status === "Sắp hết"
                                ? "bg-red-100 text-red-800"
                                : "bg-orange-100 text-orange-800"
                            }
                          >
                            {medicine.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewMedicine(medicine)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditMedicine(medicine)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMedicine(medicine)}
                            >
                              <Trash2 className="h-4 w-4" />
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
        <TabsContent value="import" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Lịch sử nhập kho</CardTitle>
              <CardDescription className="text-blue-600">
                Theo dõi các lần nhập thuốc vào kho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {importHistory.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-blue-100 hover:bg-blue-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800">
                          {record.medicine}
                        </h4>
                        <p className="text-sm text-blue-600">
                          Số lượng: {record.quantity} {record.unit}
                        </p>
                        <p className="text-xs text-gray-500">
                          Ngày nhập: {record.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        Nhà cung cấp
                      </p>
                      <p className="text-xs text-gray-500">{record.supplier}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="export" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-blue-800">
                    Lịch sử xuất kho
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Theo dõi việc cấp phát thuốc cho học sinh
                  </CardDescription>
                </div>
                <Dialog
                  open={isExportDialogOpen}
                  onOpenChange={setIsExportDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Xuất kho
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Xuất thuốc khỏi kho</DialogTitle>
                      <DialogDescription>
                        Ghi nhận việc cấp phát thuốc cho học sinh
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="medicine-select">Chọn thuốc</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn thuốc cần xuất" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paracetamol">
                              Paracetamol 500mg (120 viên)
                            </SelectItem>
                            <SelectItem value="cetirizine">
                              Cetirizine 10mg (15 viên)
                            </SelectItem>
                            <SelectItem value="salbutamol">
                              Salbutamol xịt (3 ống)
                            </SelectItem>
                            <SelectItem value="vitamin-c">
                              Vitamin C (200 viên)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student-select">Học sinh</Label>
                        <Select>
                          <SelectTrigger>
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
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Số lượng xuất</Label>
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="Nhập số lượng"
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reason">Lý do sử dụng</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn lý do" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="headache">Đau đầu</SelectItem>
                            <SelectItem value="fever">Sốt</SelectItem>
                            <SelectItem value="allergy">Dị ứng</SelectItem>
                            <SelectItem value="stomachache">
                              Đau bụng
                            </SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú</Label>
                        <Textarea
                          id="notes"
                          placeholder="Ghi chú thêm (nếu có)"
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsExportDialogOpen(false)}
                        >
                          Hủy
                        </Button>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            setIsExportDialogOpen(false);
                            alert("Đã xuất thuốc thành công!");
                          }}
                        >
                          Xuất kho
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exportHistory.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-blue-100 hover:bg-blue-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <TrendingDown className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800">
                          {record.medicine}
                        </h4>
                        <p className="text-sm text-blue-600">
                          Học sinh: {record.student}
                        </p>
                        <p className="text-xs text-gray-500">
                          Thời gian: {record.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {record.quantity} {record.unit}
                      </p>
                      <p className="text-xs text-gray-500">
                        Lý do: {record.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expiry" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Thuốc sắp hết hạn</CardTitle>
              <CardDescription className="text-blue-600">
                Danh sách thuốc cần chú ý về hạn sử dụng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiringMedicines.map((medicine, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      medicine.daysLeft <= 7
                        ? "border-l-red-500 bg-red-50"
                        : medicine.daysLeft <= 30
                        ? "border-l-orange-500 bg-orange-50"
                        : "border-l-yellow-500 bg-yellow-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {medicine.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Số lượng: {medicine.quantity} {medicine.unit}
                        </p>
                        <p className="text-xs text-gray-500">
                          Hạn sử dụng: {medicine.expiryDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            medicine.daysLeft <= 7 ? "destructive" : "secondary"
                          }
                          className={
                            medicine.daysLeft <= 7
                              ? "bg-red-100 text-red-800"
                              : medicine.daysLeft <= 30
                              ? "bg-orange-100 text-orange-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          Còn {medicine.daysLeft} ngày
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>{" "}
      </Tabs>

      {/* View Medicine Dialog */}
      {selectedMedicine && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chi tiết thuốc</DialogTitle>
              <DialogDescription>Thông tin chi tiết về thuốc</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Tên thuốc
                  </h4>
                  <p className="text-lg font-medium">{selectedMedicine.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Loại thuốc
                  </h4>
                  <p className="text-lg font-medium">
                    {selectedMedicine.category}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Số lượng
                  </h4>
                  <p className="text-lg font-medium">
                    {selectedMedicine.quantity} {selectedMedicine.unit}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Hạn sử dụng
                  </h4>
                  <p className="text-lg font-medium">
                    {selectedMedicine.expiryDate}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Trạng thái
                </h4>
                <Badge
                  variant={
                    selectedMedicine.status === "Đầy đủ"
                      ? "default"
                      : selectedMedicine.status === "Sắp hết"
                      ? "destructive"
                      : "secondary"
                  }
                  className={
                    selectedMedicine.status === "Đầy đủ"
                      ? "bg-green-100 text-green-800 mt-1"
                      : selectedMedicine.status === "Sắp hết"
                      ? "bg-red-100 text-red-800 mt-1"
                      : "bg-orange-100 text-orange-800 mt-1"
                  }
                >
                  {selectedMedicine.status}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Tồn kho</h4>
                <Progress
                  value={
                    (selectedMedicine.quantity / selectedMedicine.maxQuantity) *
                    100
                  }
                  className="h-2 mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {selectedMedicine.quantity} / {selectedMedicine.maxQuantity}{" "}
                  {selectedMedicine.unit}
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Medicine Dialog */}
      {selectedMedicine && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thuốc</DialogTitle>
              <DialogDescription>
                Chỉnh sửa thông tin thuốc trong kho
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Tên thuốc</Label>
                <Input
                  id="edit-name"
                  defaultValue={selectedMedicine.name}
                  placeholder="Nhập tên thuốc"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Loại thuốc</Label>
                <Select
                  defaultValue={selectedMedicine.category
                    .toLowerCase()
                    .replace(/ /g, "-")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại thuốc" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thuoc-giam-dau">
                      Thuốc giảm đau
                    </SelectItem>
                    <SelectItem value="khang-sinh">Kháng sinh</SelectItem>
                    <SelectItem value="vitamin">Vitamin</SelectItem>
                    <SelectItem value="thuoc-sat-trung">
                      Thuốc sát trùng
                    </SelectItem>
                    <SelectItem value="thuoc-di-ung">Thuốc dị ứng</SelectItem>
                    <SelectItem value="thuoc-hen-suyen">
                      Thuốc hen suyễn
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Số lượng</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  defaultValue={selectedMedicine.quantity}
                  placeholder="Nhập số lượng"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-unit">Đơn vị</Label>
                <Input
                  id="edit-unit"
                  defaultValue={selectedMedicine.unit}
                  placeholder="Nhập đơn vị"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-expiry">Hạn sử dụng</Label>
                <Input
                  id="edit-expiry"
                  defaultValue={selectedMedicine.expiryDate
                    .split("/")
                    .reverse()
                    .join("-")}
                  type="date"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    alert("Đã cập nhật thông tin thuốc thành công!");
                  }}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Medicine Dialog */}
      {selectedMedicine && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Xác nhận xóa thuốc</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa thuốc này khỏi kho không?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-red-100 bg-red-50">
                <h4 className="font-medium text-red-800">
                  {selectedMedicine.name}
                </h4>
                <p className="text-sm text-red-600 mt-1">
                  Loại: {selectedMedicine.category}
                </p>
                <p className="text-sm text-red-600">
                  Số lượng: {selectedMedicine.quantity} {selectedMedicine.unit}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Hành động này không thể hoàn tác. Tất cả dữ liệu về thuốc này sẽ
                bị xóa vĩnh viễn.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    alert("Đã xóa thuốc thành công!");
                  }}
                >
                  Xóa thuốc
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

const medicineInventoryData = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Thuốc giảm đau",
    quantity: 120,
    maxQuantity: 200,
    unit: "viên",
    expiryDate: "15/06/2025",
    status: "Đầy đủ",
  },
  {
    id: 2,
    name: "Cetirizine 10mg",
    category: "Thuốc dị ứng",
    quantity: 15,
    maxQuantity: 100,
    unit: "viên",
    expiryDate: "20/01/2025",
    status: "Sắp hết",
  },
  {
    id: 3,
    name: "Salbutamol xịt",
    category: "Thuốc hen suyễn",
    quantity: 3,
    maxQuantity: 10,
    unit: "ống",
    expiryDate: "10/03/2025",
    status: "Tồn kho thấp",
  },
  {
    id: 4,
    name: "Vitamin C",
    category: "Vitamin",
    quantity: 200,
    maxQuantity: 300,
    unit: "viên",
    expiryDate: "30/08/2025",
    status: "Đầy đủ",
  },
];

const importHistory = [
  {
    medicine: "Paracetamol 500mg",
    quantity: 100,
    unit: "viên",
    date: "10/12/2024",
    supplier: "Công ty Dược phẩm ABC",
  },
  {
    medicine: "Vitamin C",
    quantity: 150,
    unit: "viên",
    date: "08/12/2024",
    supplier: "Công ty Dược phẩm XYZ",
  },
  {
    medicine: "Cetirizine 10mg",
    quantity: 50,
    unit: "viên",
    date: "05/12/2024",
    supplier: "Công ty Dược phẩm ABC",
  },
];

const exportHistory = [
  {
    medicine: "Paracetamol 500mg",
    student: "Nguyễn Văn An",
    quantity: 2,
    unit: "viên",
    time: "14:30 - 15/12/2024",
    reason: "Đau đầu",
  },
  {
    medicine: "Cetirizine 10mg",
    student: "Trần Thị Bình",
    quantity: 1,
    unit: "viên",
    time: "11:15 - 14/12/2024",
    reason: "Dị ứng thức ăn",
  },
  {
    medicine: "Vitamin C",
    student: "Lê Hoàng Cường",
    quantity: 1,
    unit: "viên",
    time: "09:45 - 13/12/2024",
    reason: "Bổ sung vitamin",
  },
];

const expiringMedicines = [
  {
    name: "Cetirizine 10mg",
    quantity: 15,
    unit: "viên",
    expiryDate: "20/01/2025",
    daysLeft: 25,
  },
  {
    name: "Salbutamol xịt",
    quantity: 3,
    unit: "ống",
    expiryDate: "10/03/2025",
    daysLeft: 75,
  },
  {
    name: "Thuốc sát trùng",
    quantity: 5,
    unit: "chai",
    expiryDate: "05/01/2025",
    daysLeft: 10,
  },
];
