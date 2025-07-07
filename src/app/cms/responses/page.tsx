"use client";

import { useState, useEffect } from "react";
import { AllResponses } from "./_components/all-responses";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFeedbackStore } from "@/stores/feedback-store";

export default function ResponsesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");

  const { feedbacks, fetchFeedbacks, isLoading } = useFeedbackStore();

  useEffect(() => {
    if (feedbacks.length === 0) {
      fetchFeedbacks();
    }
  }, [feedbacks.length, fetchFeedbacks]);

  // Calculate statistics
  const totalFeedbacks = feedbacks.length;
  const processedFeedbacks = feedbacks.filter(
    (f) => f.response !== null && f.response !== ""
  ).length;
  const unprocessedFeedbacks = feedbacks.filter(
    (f) => f.response === null || f.response === ""
  ).length;

  // Mock function for export - can be implemented later
  const handleExportToExcel = () => {
    alert("Chức năng xuất báo cáo sẽ được triển khai sau!");
  };

  const handleRefresh = async () => {
    await fetchFeedbacks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl shadow-lg mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-sky-800 bg-clip-text text-transparent">
            Dashboard - Phản hồi
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Theo dõi phản hồi từ phụ huynh và học sinh về chất lượng dịch vụ y
            tế
          </p>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng phản hồi
                  </p>
                  <p className="text-3xl font-bold text-sky-700">
                    {totalFeedbacks}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    ↗ +23% tháng này
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-sky-100 to-sky-200 rounded-xl">
                  <MessageSquare className="h-6 w-6 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đã xử lý</p>
                  <p className="text-3xl font-bold text-emerald-700">
                    {processedFeedbacks}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    Phản hồi tích cực
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
                  <ThumbsUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Chưa xử lý
                  </p>
                  <p className="text-3xl font-bold text-red-700">
                    {unprocessedFeedbacks}
                  </p>
                  <p className="text-xs text-red-600 mt-1">Cần xem lại</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl">
                  <ThumbsDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-sky-600" />
                  Thao tác nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleExportToExcel}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Download className="h-4 w-4" />
                  <span>Xuất báo cáo Excel</span>
                </Button>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  className="w-full border-sky-200 text-sky-700 py-3 px-4 rounded-lg hover:bg-sky-50 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Làm mới dữ liệu</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Data Table */}
          <div className="lg:col-span-3">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      Danh sách phản hồi
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Quản lý và theo dõi phản hồi từ phụ huynh và học sinh
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <AllResponses
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedRating={selectedRating}
                  setSelectedRating={setSelectedRating}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
