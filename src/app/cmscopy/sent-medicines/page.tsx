"use client";

import { useEffect, useState } from "react";
import {
  Pill,
  Plus,
  Search,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  Package,
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

import { useMedicineDeliveryStore } from "@/stores/medicine-delivery-store";
import { request } from "http";
import { ViewDeliveryDialog } from "./view-delivery-dialog";

// Define types for our medicine data

export default function ParentMedicine() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);
  const {
    medicineDeliveries,
    fetchMedicineDeliveries,
    isLoading,
    setIsLoading,
    setError,
    updateMedicineDelivery,
    viewMedicineDeliveries,
  } = useMedicineDeliveryStore();

  useEffect(() => {
    if (medicineDeliveries.length === 0) {
      fetchMedicineDeliveries();
    }
  }, [fetchMedicineDeliveries, medicineDeliveries.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <span className="text-sky-600 text-lg font-semibold">
              Đang tải dữ liệu...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalMedicines = medicineDeliveries.length;
  const pendingMedicines = medicineDeliveries.filter(
    (m) => m.status === "pending"
  ).length;
  const completedMedicines = medicineDeliveries.filter(
    (m) => m.status === "completed"
  ).length;
  const progressMedicines = medicineDeliveries.filter(
    (m) => m.status === "progress"
  ).length;

  // Handler cập nhật trạng thái
  const handleUpdateStatus = async (
    id: string,
    status: "progress" | "completed" | "cancelled"
  ) => {
    try {
      setIsLoading(true);
      await updateMedicineDelivery(id, { status });
      fetchMedicineDeliveries();
    } catch (err) {
      setError("Không thể cập nhật trạng thái đơn thuốc");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl shadow-lg mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-sky-800 bg-clip-text text-transparent">
            Thuốc gửi từ Phụ huynh
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quản lý thuốc cá nhân học sinh do phụ huynh gửi
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng yêu cầu
                  </p>
                  <p className="text-3xl font-bold text-sky-700">
                    {totalMedicines}
                  </p>
                </div>
                <div className="p-3 bg-sky-100 rounded-xl">
                  <Package className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {pendingMedicines}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Đang xử lý
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {progressMedicines}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Hoàn thành
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {completedMedicines}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Yêu cầu thuốc từ phụ huynh
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Danh sách yêu cầu gửi thuốc cần được xử lý
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
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
                  <SelectItem value="progress">Đang làm</SelectItem>
                  <SelectItem value="completed">Đã hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã huỷ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {medicineDeliveries.map((request, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-sky-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg">
                          {request.student.name || "N/A"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Lớp: {request.student.class?.name || "N/A"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : request.status === "completed"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : request.status === "progress"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }
                    >
                      {request.status === "pending"
                        ? "Chờ xử lí"
                        : request.status === "progress"
                        ? "Đang làm"
                        : request.status === "completed"
                        ? "Đã hoàn thành"
                        : request.status === "cancelled"
                        ? "Đã huỷ"
                        : request.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">
                          Thuốc:
                        </span>{" "}
                        <span className="text-gray-900">{request.name}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">
                          Số lượng:
                        </span>{" "}
                        <span className="text-gray-900">{request.total}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">
                          Người gửi:
                        </span>{" "}
                        <span className="text-gray-900">
                          {request.parentName || "N/A"}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">
                          Số lần uống:
                        </span>{" "}
                        <span className="text-gray-900">{request.per_day}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">
                          Người nhận:
                        </span>{" "}
                        <span className="text-gray-900">
                          {request.staffName}
                        </span>
                      </p>
                    </div>
                  </div>

                  {request.note && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Hướng dẫn:</span>{" "}
                        {request.note}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      Gửi lúc:{" "}
                      {request.created_at
                        ? new Date(request.created_at).toLocaleString("vi-VN")
                        : "không xác định"}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-sky-200 text-sky-700 hover:bg-sky-50"
                        onClick={() => {
                          viewMedicineDeliveries(request.id);
                          setSelectedMedicine(request.id);
                          setIsDetailDialogOpen(true);
                        }}
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dialog for viewing delivery details */}
        {selectedMedicine && (
          <ViewDeliveryDialog
            delivery={
              medicineDeliveries.find((d) => d.id === selectedMedicine)!
            }
            onClose={() => setSelectedMedicine(null)}
          />
        )}
      </div>
    </div>
  );
}
