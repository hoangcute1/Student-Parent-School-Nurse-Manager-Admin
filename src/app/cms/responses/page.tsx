"use client";

import { useState } from "react";
import { AllResponses } from "./_components/all-responses";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Star, MessageSquare } from "lucide-react";

export default function ResponsesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Phản hồi
        </h1>
        <p className="text-blue-600">
          Quản lý phản hồi từ phụ huynh và học sinh
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Tổng phản hồi
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">156</div>
            <p className="text-xs text-blue-600">Tháng này</p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Đánh giá tích cực
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">128</div>
            <p className="text-xs text-green-600">82% phản hồi</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">
              Đánh giá trung bình
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">4.6</div>
            <p className="text-xs text-yellow-600">Trên thang điểm 5</p>
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Cần xử lý
            </CardTitle>
            <ThumbsDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">8</div>
            <p className="text-xs text-red-600">Phản hồi tiêu cực</p>
          </CardContent>
        </Card>
      </div>

      <AllResponses
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
      />
    </div>
  );
}
