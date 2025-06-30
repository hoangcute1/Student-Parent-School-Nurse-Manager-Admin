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
import { getMedicineDeliveriesByStaffId } from "@/lib/api/medicine-delivery";

// Define types for our medicine data

export default function ParentMedicine() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);
  const {
    medicineDeliveryByStaffId,
    fetchMedicineDeliveryByStaffId,
    isLoading,
    setIsLoading,
    setError,
    updateMedicineDelivery,
    viewMedicineDeliveries,
  } = useMedicineDeliveryStore();

  useEffect(() => {
    if (medicineDeliveryByStaffId.length === 0) {
      fetchMedicineDeliveryByStaffId();
    }
  }, [fetchMedicineDeliveryByStaffId, medicineDeliveryByStaffId.length]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-teal-600 text-lg font-semibold">
          Đang tải dữ liệu...
        </span>
      </div>
    );
  }

  // Handler cập nhật trạng thái
  const handleUpdateStatus = async (
    id: string,
    status: "progress" | "completed" | "cancelled"
  ) => {
    try {
      setIsLoading(true);
      await updateMedicineDelivery(id, { status });
      fetchMedicineDeliveryByStaffId();
    } catch (err) {
      setError("Không thể cập nhật trạng thái đơn thuốc");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-teal-800">
          Thuốc gửi từ Phụ huynh
        </h1>
        <p className="text-teal-600">
          Quản lý thuốc cá nhân học sinh do phụ huynh gửi
        </p>
      </div>
      {/* Stats Cards */}
      <Tabs defaultValue="requests" className="w-full">
        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-teal-800">
                    Yêu cầu thuốc từ phụ huynh
                  </CardTitle>
                  <CardDescription className="text-teal-600">
                    Danh sách yêu cầu gửi thuốc cần được xử lý
                  </CardDescription>
                </div>
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
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
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
                {medicineDeliveryByStaffId.map((request, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-teal-100 hover:bg-teal-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-teal-800">
                            {request.student?.name || "N/A"}
                          </h4>
                          <p className="text-sm text-teal-600">
                            Lớp: {request.student?.class?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          request.status === "pending" ? "secondary" : "default"
                        }
                        className={
                          request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm">
                          <strong>Thuốc:</strong> {request.name}
                        </p>
                        <p className="text-sm">
                          <strong>Số lượng:</strong> {request.total}
                        </p>
                        <p className="text-sm">
                          <strong>Người gửi: </strong>{" "}
                          {request.parentName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">
                          <strong>Số lần uống: </strong> {request.per_day}
                        </p>
                        <p className="text-sm">
                          <strong>Thời gian uống:</strong>{" "}
                          {request.created_at
                            ? new Date(request.created_at).toLocaleDateString(
                                "vi-VN"
                              )
                            : "không"}
                          {" - "}
                          {request.end_at
                            ? new Date(request.end_at).toLocaleDateString(
                                "vi-VN"
                              )
                            : "không"}
                        </p>
                      </div>
                    </div>

                    {request.note && (
                      <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>Hướng dẫn:</strong> {request.note}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>
                        Gửi lúc:{" "}
                        {request.created_at
                          ? new Date(request.created_at).toLocaleString("vi-VN")
                          : "không xác định"}
                      </span>
                      <div className="flex gap-2">
                        {/* Nếu trạng thái là pending: chỉ hiện Duyệt và Huỷ */}
                        {request.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-700"
                              onClick={() =>
                                handleUpdateStatus(request.id, "cancelled")
                              }
                            >
                              Huỷ
                            </Button>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() =>
                                handleUpdateStatus(request.id, "progress")
                              }
                            >
                              Duyệt
                            </Button>
                          </>
                        )}
                        {/* Nếu trạng thái là progress: chỉ hiện Hoàn thành và Huỷ */}
                        {request.status === "progress" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-700"
                              onClick={() =>
                                handleUpdateStatus(request.id, "cancelled")
                              }
                            >
                              Huỷ
                            </Button>
                            <Button
                              size="sm"
                              className="bg-teal-600 hover:bg-teal-700"
                              onClick={() =>
                                handleUpdateStatus(request.id, "completed")
                              }
                            >
                              Hoàn thành
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
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
        </TabsContent>
      </Tabs>{" "}
      {selectedMedicine && (
        <ViewDeliveryDialog
          delivery={
            medicineDeliveryByStaffId.find((d) => d.id === selectedMedicine)!
          }
          onClose={() => setSelectedMedicine(null)}
        />
      )}
    </div>
  );
}
