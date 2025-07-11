"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Eye, 
  Search, 
  Pill, 
  Clock, 
  Activity, 
  CheckCircle,
  X,
  User,
  Calendar,
  Package
} from "lucide-react";

interface MedicineDelivery {
  _id: string;
  parentName: string;
  studentName: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  status: "pending" | "progress" | "completed" | "cancelled";
  createdAt: string;
  notes?: string;
}

export default function ViewSentMedicinesPage() {
  const [medicines, setMedicines] = useState<MedicineDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineDelivery | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setMedicines([
        {
          _id: "1",
          parentName: "Nguyễn Thị Lan",
          studentName: "Nguyễn Văn An",
          medicineName: "Paracetamol 500mg",
          dosage: "1 viên",
          frequency: "3 lần/ngày",
          duration: "5 ngày",
          instructions: "Uống sau ăn",
          status: "pending",
          createdAt: "2024-01-15T08:30:00Z",
          notes: "Trẻ bị sốt nhẹ"
        },
        {
          _id: "2",
          parentName: "Trần Văn Hùng",
          studentName: "Trần Thị Mai",
          medicineName: "Amoxicillin 250mg",
          dosage: "1 viên",
          frequency: "2 lần/ngày",
          duration: "7 ngày",
          instructions: "Uống trước ăn 30 phút",
          status: "progress",
          createdAt: "2024-01-14T14:20:00Z"
        },
        {
          _id: "3",
          parentName: "Lê Thị Hoa",
          studentName: "Lê Văn Nam",
          medicineName: "Vitamin C 100mg",
          dosage: "1 viên",
          frequency: "1 lần/ngày",
          duration: "30 ngày",
          instructions: "Uống sau ăn sáng",
          status: "completed",
          createdAt: "2024-01-10T09:15:00Z"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            Chờ xử lý
          </Badge>
        );
      case "progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Activity className="w-3 h-3 mr-1" />
            Đang thực hiện
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã hoàn thành
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <X className="w-3 h-3 mr-1" />
            Đã hủy
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (medicine: MedicineDelivery) => {
    setSelectedMedicine(medicine);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Pill className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Xem thuốc gửi</h1>
            <p className="text-gray-600">Tất cả đơn thuốc từ phụ huynh - Chỉ xem</p>
          </div>
        </div>
        <Badge variant="outline" className="text-purple-600 border-purple-200">
          <Eye className="w-3 h-3 mr-1" />
          Read Only
        </Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên học sinh, phụ huynh hoặc tên thuốc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{medicines.length}</p>
                <p className="text-sm text-gray-600">Tổng đơn thuốc</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {medicines.filter(m => m.status === "pending").length}
                </p>
                <p className="text-sm text-gray-600">Chờ xử lý</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {medicines.filter(m => m.status === "progress").length}
                </p>
                <p className="text-sm text-gray-600">Đang thực hiện</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {medicines.filter(m => m.status === "completed").length}
                </p>
                <p className="text-sm text-gray-600">Đã hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medicines List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn thuốc</CardTitle>
          <CardDescription>
            Hiển thị {filteredMedicines.length} / {medicines.length} đơn thuốc
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMedicines.map((medicine) => (
              <div
                key={medicine._id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{medicine.medicineName}</h3>
                      {getStatusBadge(medicine.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{medicine.studentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4" />
                        <span>{medicine.dosage} - {medicine.frequency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(medicine.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2">
                      Phụ huynh: {medicine.parentName}
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(medicine)}
                    className="ml-4"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredMedicines.length === 0 && (
              <div className="text-center py-8">
                <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Không tìm thấy đơn thuốc nào</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Details Modal */}
      {showDetails && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Chi tiết đơn thuốc</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{selectedMedicine.medicineName}</h3>
                {getStatusBadge(selectedMedicine.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Học sinh</label>
                  <p className="text-gray-900">{selectedMedicine.studentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phụ huynh</label>
                  <p className="text-gray-900">{selectedMedicine.parentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Liều dùng</label>
                  <p className="text-gray-900">{selectedMedicine.dosage}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tần suất</label>
                  <p className="text-gray-900">{selectedMedicine.frequency}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Thời gian dùng</label>
                  <p className="text-gray-900">{selectedMedicine.duration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Ngày gửi</label>
                  <p className="text-gray-900">
                    {new Date(selectedMedicine.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Hướng dẫn sử dụng</label>
                <p className="text-gray-900 mt-1">{selectedMedicine.instructions}</p>
              </div>

              {selectedMedicine.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Ghi chú</label>
                  <p className="text-gray-900 mt-1">{selectedMedicine.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowDetails(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
