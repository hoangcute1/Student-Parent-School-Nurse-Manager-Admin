"use client";

import { useState, useEffect } from "react";
import { AllResponses } from "./_components/all-responses";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Star, MessageSquare } from "lucide-react";
import { useFeedbackStore } from "@/stores/feedback-store";

export default function ResponsesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  const { feedbacks, fetchFeedbacks } = useFeedbackStore();

  useEffect(() => {
    fetchFeedbacks(true);
  }, [fetchFeedbacks]);

  // Calculate real stats from feedbacks data
  const totalFeedbacks = feedbacks.length;
  const pendingFeedbacks = feedbacks.filter((f) => !f.response).length;
  const respondedFeedbacks = feedbacks.filter((f) => f.response).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl shadow-lg mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-sky-800 bg-clip-text text-transparent">
            Quản lý phản hồi
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Theo dõi và quản lý phản hồi từ phụ huynh và học sinh
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tổng phản hồi
              </CardTitle>
              <div className="p-2 bg-sky-100 rounded-lg">
                <MessageSquare className="h-4 w-4 text-sky-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sky-700">
                {totalFeedbacks}
              </div>
              <p className="text-xs text-sky-600">Tổng số phản hồi</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Chưa phản hồi
              </CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg
                  className="h-4 w-4 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">
                {pendingFeedbacks}
              </div>
              <p className="text-xs text-orange-600">Đang chờ xử lý</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Đã phản hồi
              </CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="h-4 w-4 text-green-600"
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
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {respondedFeedbacks}
              </div>
              <p className="text-xs text-green-600">Đã hoàn thành</p>
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
    </div>
  );
}
