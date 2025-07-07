"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  Users,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  RefreshCw,
  ChevronDown,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMedicineDeliveryStore } from "@/stores/medicine-delivery-store";
import { ViewDeliveryDialog } from "./view-delivery-dialog";
import { MedicineDeliveryTable } from "./components/medicine-delivery-table";
import { MedicineDeliveryStats } from "./components/stats-cards";
import type { MedicineDeliveryByStaff } from "@/lib/type/medicine-delivery";

function SentMedicinesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedDelivery, setSelectedDelivery] =
    useState<MedicineDeliveryByStaff | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const {
    medicineDeliveryByStaffId,
    fetchMedicineDeliveryByStaffId,
    updateMedicineDelivery,
    softDeleteMedicineDelivery,
    isLoading,
    error,
    setError,
    setIsLoading,
  } = useMedicineDeliveryStore();

  useEffect(() => {
    fetchMedicineDeliveryByStaffId();
  }, [fetchMedicineDeliveryByStaffId]);

  // Filter data based on search and status
  const filteredData = medicineDeliveryByStaffId.filter((delivery) => {
    const matchesSearch =
      delivery.student?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.parentName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || delivery.status === selectedStatus;

    // Date filtering logic
    let matchesDate = true;
    if (selectedDate !== "all" && delivery.created_at) {
      const deliveryDate = new Date(delivery.created_at);
      const now = new Date();

      switch (selectedDate) {
        case "today":
          matchesDate = deliveryDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = deliveryDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = deliveryDate >= monthAgo;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Stats calculation
  const stats = {
    total: medicineDeliveryByStaffId.length,
    pending: medicineDeliveryByStaffId.filter((d) => d.status === "pending")
      .length,
    progress: medicineDeliveryByStaffId.filter((d) => d.status === "progress")
      .length,
    completed: medicineDeliveryByStaffId.filter((d) => d.status === "completed")
      .length,
    cancelled: medicineDeliveryByStaffId.filter((d) => d.status === "cancelled")
      .length,
  };

  // Handle status update
  const handleUpdateStatus = async (
    id: string,
    newStatus: "pending" | "progress" | "completed" | "cancelled"
  ) => {
    try {
      setIsLoading(true);
      await updateMedicineDelivery(id, { status: newStatus });
      await fetchMedicineDeliveryByStaffId();
    } catch (err) {
      setError("Không thể cập nhật trạng thái");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete delivery (soft delete - chỉ ẩn khỏi view admin/staff)
  const handleDeleteDelivery = async (delivery: MedicineDeliveryByStaff) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn ẩn đơn thuốc "${delivery.name}" cho học sinh "${delivery.student?.name}"?\n\nĐơn thuốc sẽ bị ẩn khỏi view quản trị nhưng phụ huynh vẫn có thể thấy được.`
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);
      if (softDeleteMedicineDelivery) {
        await softDeleteMedicineDelivery(delivery.id);
        await fetchMedicineDeliveryByStaffId();
      } else {
        setError("Chức năng ẩn đơn thuốc không khả dụng");
      }
    } catch (err) {
      setError("Không thể ẩn đơn thuốc");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view delivery
  const handleViewDelivery = (delivery: MedicineDeliveryByStaff) => {
    setSelectedDelivery(delivery);
    setShowViewDialog(true);
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await fetchMedicineDeliveryByStaffId();
    } catch (err) {
      setError("Không thể làm mới dữ liệu");
    }
  };

  // Handle export to Excel
  const handleExportExcel = () => {
    try {
      // Create CSV content
      const headers = [
        "Học sinh",
        "Lớp",
        "Thuốc",
        "Số liều",
        "Mỗi lần",
        "Phụ huynh",
        "Trạng thái",
        "Ngày tạo",
      ];
      const csvContent = [
        headers.join(","),
        ...filteredData.map((delivery) =>
          [
            `"${delivery.student?.name || "N/A"}"`,
            `"${delivery.student?.class?.name || "N/A"}"`,
            `"${delivery.name || "N/A"}"`,
            `"${delivery.total || "N/A"}"`,
            `"${delivery.per_dose || "N/A"}"`,
            `"${delivery.parentName || "N/A"}"`,
            `"${getStatusText(delivery.status)}"`,
            `"${
              delivery.created_at
                ? new Date(delivery.created_at).toLocaleDateString("vi-VN")
                : "N/A"
            }"`,
          ].join(",")
        ),
      ].join("\n");

      // Create and download file
      const blob = new Blob(["\ufeff" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `danh-sach-don-thuoc-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Không thể xuất báo cáo");
    }
  };

  // Get status text helper function
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "progress":
        return "Đang thực hiện";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (isLoading && medicineDeliveryByStaffId.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <RefreshCw className="w-12 h-12 text-sky-500 animate-spin mx-auto" />
              <p className="text-sky-600 text-lg font-medium">
                Đang tải dữ liệu...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold text-gray-900">
                Quản lý Thuốc gửi
              </h1>
              <p className="text-gray-600">
                Theo dõi và quản lý các đơn thuốc từ phụ huynh
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="border-sky-200 text-sky-700 hover:bg-sky-50"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Làm mới
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportExcel}
                className="border-sky-200 text-sky-700 hover:bg-sky-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Có lỗi xảy ra</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <MedicineDeliveryStats stats={stats} />

        {/* Filters */}
        <Card className="border-sky-200 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-sky-600" />
              Bộ lọc & Tìm kiếm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Tìm theo tên học sinh, thuốc, phụ huynh..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-sky-200 focus:border-sky-500 focus:ring-sky-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="border-sky-200 focus:border-sky-500 focus:ring-sky-200">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="progress">Đang thực hiện</SelectItem>
                    <SelectItem value="completed">Đã hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Thời gian
                </label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger className="border-sky-200 focus:border-sky-500 focus:ring-sky-200">
                    <SelectValue placeholder="Chọn thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả thời gian</SelectItem>
                    <SelectItem value="today">Hôm nay</SelectItem>
                    <SelectItem value="week">Tuần này</SelectItem>
                    <SelectItem value="month">Tháng này</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="border-sky-200 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Danh sách đơn thuốc
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Hiển thị {filteredData.length} trong tổng số{" "}
                  {medicineDeliveryByStaffId.length} đơn thuốc
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Trang {currentPage} / {totalPages || 1}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <MedicineDeliveryTable
              deliveries={paginatedData}
              onViewDelivery={handleViewDelivery}
              onUpdateStatus={handleUpdateStatus}
              onDeleteDelivery={handleDeleteDelivery}
              isLoading={isLoading}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="border-sky-200 text-sky-700 hover:bg-sky-50"
                >
                  Trước
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (page > totalPages) return null;

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={
                        currentPage === page
                          ? "bg-sky-500 text-white hover:bg-sky-600"
                          : "border-sky-200 text-sky-700 hover:bg-sky-50"
                      }
                    >
                      {page}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="border-sky-200 text-sky-700 hover:bg-sky-50"
                >
                  Sau
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Dialog */}
        {showViewDialog && selectedDelivery && (
          <ViewDeliveryDialog
            delivery={selectedDelivery}
            onClose={() => {
              setShowViewDialog(false);
              setSelectedDelivery(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default SentMedicinesPage;
