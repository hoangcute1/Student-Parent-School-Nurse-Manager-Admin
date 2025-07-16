"use client";

import { useState } from "react";
import { AllResponses } from "./_components/all-responses";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Star, MessageSquare } from "lucide-react";

export default function ResponsesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl shadow-lg mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-sky-800 bg-clip-text text-transparent">
            Phản hồi
          </h1>
          <p className="text-sky-600 text-lg max-w-2xl mx-auto">
            Thống kê và quản lý phản hồi từ phụ huynh và học sinh
          </p>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-600">
                    Tổng phản hồi
                  </p>
                  <p className="text-3xl font-bold text-sky-800">156</p>
                  <p className="text-xs text-sky-600 mt-1">↗ +23% tháng này</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">
                    Đánh giá tích cực
                  </p>
                  <p className="text-3xl font-bold text-emerald-800">142</p>
                  <p className="text-xs text-emerald-600 mt-1">Tỷ lệ: 91%</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <ThumbsUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">
                    Phản hồi tiêu cực
                  </p>
                  <p className="text-3xl font-bold text-red-800">14</p>
                  <p className="text-xs text-red-600 mt-1">Cần xem lại</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                  <ThumbsDown className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">
                    Điểm trung bình
                  </p>
                  <p className="text-3xl font-bold text-amber-800">4.2</p>
                  <p className="text-xs text-amber-600 mt-1">Trên 5 sao</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sky-800">Phản hồi mới</h3>
                  <p className="text-sm text-sky-600">Xem phản hồi chưa đọc</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-800">
                    Thống kê đánh giá
                  </h3>
                  <p className="text-sm text-purple-600">Phân tích chi tiết</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <ThumbsUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-800">
                    Cải thiện dịch vụ
                  </h3>
                  <p className="text-sm text-emerald-600">Dựa trên phản hồi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm border-sky-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sky-800">
                    Xu hướng phản hồi
                  </CardTitle>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-xs bg-sky-100 text-sky-600 rounded-lg">
                      Tuần
                    </button>
                    <button className="px-3 py-1 text-xs bg-sky-500 text-white rounded-lg">
                      Tháng
                    </button>
                    <button className="px-3 py-1 text-xs bg-sky-100 text-sky-600 rounded-lg">
                      Năm
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-sky-50 to-sky-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-sky-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg
                        className="h-8 w-8 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        />
                      </svg>
                    </div>
                    <p className="text-sky-600 text-sm">
                      Biểu đồ xu hướng phản hồi theo thời gian
                    </p>
                    <p className="text-xs text-sky-500 mt-1">
                      Theo dõi chất lượng dịch vụ
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-sky-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  Cảnh báo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">
                        3 phản hồi tiêu cực chưa xử lý
                      </p>
                      <p className="text-xs text-red-600">
                        Cần được phản hồi ngay
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-800">
                        Điểm đánh giá giảm 0.2 điểm
                      </p>
                      <p className="text-xs text-amber-600">
                        So với tháng trước
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-sky-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-emerald-500" />
                  Phản hồi tích cực gần đây
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 text-sm font-medium">
                        PH
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-emerald-800">
                        Rất hài lòng với dịch vụ chăm sóc
                      </p>
                      <p className="text-xs text-emerald-600">
                        Phụ huynh Nguyễn Thị A - 5 phút trước
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-sky-50 border border-sky-200 rounded-lg">
                    <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                      <span className="text-sky-600 text-sm font-medium">
                        HS
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-sky-800">
                        Cô y tá rất tận tình
                      </p>
                      <p className="text-xs text-sky-600">
                        Học sinh Trần Văn B - 10 phút trước
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <AllResponses
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
        />
      </div>
    </div>
  );
}
