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
  Pill,
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


import { useMedicineDeliveryStore } from "@/stores/medicine-delivery-store";

import { MedicineDeliveryTable } from "./components/medicine-delivery-table";
import { FilterBar } from "./components/filter-bar";
import type { MedicineDelivery } from "@/lib/type/medicine-delivery";
import ViewDeliveryDialog from "./components/view-delivery-dialog";

function SentMedicinesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedDelivery, setSelectedDelivery] =
    useState<MedicineDelivery | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const {
    medicineDeliveries,
    fetchMedicineDeliveries,
    updateMedicineDelivery,
    softDeleteMedicineDelivery,
    isLoading,
    error,
    setError,
    setIsLoading,
  } = useMedicineDeliveryStore();

  useEffect(() => {
    fetchMedicineDeliveries();
  }, [fetchMedicineDeliveries]);

  // Filter data based on search and status
  console.log("🔍 Tất cả created_at:", medicineDeliveries.map(d => d.created_at));
  const filteredData = [...medicineDeliveries]
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // ✅ mới nhất lên đầu
  .filter((delivery) => {
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

  // Stats calculation
  const stats = {
    total: medicineDeliveries.length,
    pending: medicineDeliveries.filter((d) => d.status === "pending")
      .length,
    completed: medicineDeliveries.filter((d) => d.status === "completed")
      .length,
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
            `"${delivery.parentName || "N/A"}"`,
            `"${getStatusText(delivery.status)}"`,
            `"${delivery.created_at
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

  // Action handlers for deliveries
  const handleViewDelivery = (delivery: MedicineDelivery) => {
    setSelectedDelivery(delivery);
    setShowViewDialog(true);
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: "pending" | "morning" | "noon" | "completed" | "cancelled",
    reason?: string
  ) => {
    try {
      setIsLoading(true);
      const updateObj: any = { status: newStatus };
      if (reason) updateObj.reason = reason;
      await updateMedicineDelivery(id, updateObj);
      await fetchMedicineDeliveries();
    } catch (err) {
      setError("Không thể cập nhật trạng thái");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDelivery = async (delivery: MedicineDelivery) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn ẩn đơn thuốc "${delivery.name}" cho học sinh "${delivery.student?.name}"?`
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);
      if (softDeleteMedicineDelivery) {
        await softDeleteMedicineDelivery(delivery.id);
        await fetchMedicineDeliveries();
      } else {
        setError("Chức năng ẩn đơn thuốc không khả dụng");
      }
    } catch (err) {
      setError("Không thể ẩn đơn thuốc");
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading && medicineDeliveries.length === 0) {
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
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl shadow-lg mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-sky-800 bg-clip-text text-transparent">
            Đơn thuốc từ phụ huynh
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Theo dõi và quản lý các đơn thuốc được gửi từ phụ huynh
          </p>
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

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng đơn thuốc
                  </p>
                  <p className="text-3xl font-bold text-sky-700">
                    {stats.total}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    ↗ +{stats.pending} mới
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-sky-100 to-sky-200 rounded-xl">
                  <svg
                    className="w-6 h-6 text-sky-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
                  <p className="text-3xl font-bold text-amber-700">
                    {stats.pending}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">Cần xử lý</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl">
                  <svg
                    className="w-6 h-6 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
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
                  <p className="text-3xl font-bold text-emerald-700">
                    {stats.completed}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">Thành công</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
                  <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Main Data Table */}
        <div className="">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Danh sách đơn thuốc
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Quản lý các đơn thuốc được gửi từ phụ huynh
                  </CardDescription>
                </div>
                <div className="w-full md:w-auto flex justify-end mt-4 md:mt-0">
                  <Button
                    onClick={handleExportExcel}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-3 rounded-lg shadow-lg hover:from-emerald-600 hover:to-emerald-700 flex items-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Xuất báo cáo
                  </Button>
                </div>
              </div>

            </CardHeader>
            <CardContent className="space-y-6">
              <FilterBar
                onSearchChange={setSearchTerm}
                onStatusFilterChange={setSelectedStatus}
                onDateFilterChange={setSelectedDate}
              />
              <div className="mt-6">
                <MedicineDeliveryTable
                  deliveries={filteredData}
                  isLoading={isLoading}
                  onViewDelivery={handleViewDelivery}
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteDelivery={handleDeleteDelivery}
                />
              </div>
            </CardContent>
          </Card>
        </div>


      </div>

      {/* Dialog xem chi tiết đơn thuốc */}
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
  );
}

export default SentMedicinesPage;
