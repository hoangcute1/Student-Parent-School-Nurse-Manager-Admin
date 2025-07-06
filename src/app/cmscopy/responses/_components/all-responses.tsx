"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, Send, Star, User } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useFeedbackStore } from "@/stores/feedback-store";
import { Badge } from "@/components/ui/badge";
import { ResponseDialog } from "./response-dialog";
import { toast } from "@/components/ui/use-toast";

interface AllResponsesProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedRating: string;
  setSelectedRating: (value: string) => void;
}

// const getStatusBadge = (status?: string) => {
//   switch (status) {
//     case "positive":
//       return <Badge className="bg-green-100 text-green-800">Tích cực</Badge>;
//     case "negative":
//       return <Badge className="bg-red-100 text-red-800">Tiêu cực</Badge>;
//     case "suggestion":
//       return <Badge className="bg-sky-100 text-sky-800">Góp ý</Badge>;
//     default:
//       return null;
//   }
// };

export function AllResponses({
  searchTerm,
  setSearchTerm,
  selectedRating,
  setSelectedRating,
}: AllResponsesProps) {
  const { feedbacks, isLoading, error, fetchFeedbacks, updateFeedback } =
    useFeedbackStore();

  const hasInitialized = useRef(false);

  useEffect(() => {
    console.log(
      "AllResponses component mounted, feedbacks length:",
      feedbacks.length
    );
    console.log("isLoading:", isLoading);
    console.log("hasInitialized:", hasInitialized.current);

    // Add check for client-side rendering and prevent double fetch
    if (typeof window !== "undefined" && !hasInitialized.current) {
      console.log("✅ Running in browser environment");
      console.log("Fetching feedbacks with no-auth API...");
      hasInitialized.current = true;
      fetchFeedbacks(true); // Use no-auth API for responses page
    }
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    console.log("Feedbacks updated:", feedbacks.length, "items");
    console.log("Loading state:", isLoading);
    console.log("Error state:", error);
  }, [feedbacks, isLoading, error]);

  const handleRespondClick = async (id: string, response: string) => {
    try {
      await updateFeedback(id, { response });
      toast({
        title: "Phản hồi thành công",
        description: "Phản hồi của bạn đã được gửi đi",
      });
    } catch (error) {
      console.error("Failed to update feedback:", error);
      toast({
        title: "Lỗi",
        description: "Không thể gửi phản hồi. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleProcessClick = async (id: string) => {
    try {
      await updateFeedback(id, {
        response: "Đã tiếp nhận và xử lý yêu cầu của bạn.",
      });
      toast({
        title: "Xử lý thành công",
        description: "Feedback đã được đánh dấu là đã xử lý",
      });
      // Refresh data
      fetchFeedbacks(true);
    } catch (error) {
      console.error("Failed to process feedback:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xử lý feedback. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  // Filter feedbacks based on search term and selected status
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    // Filter by search term
    const matchesSearch =
      !searchTerm ||
      feedback.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof feedback.parent === "object" &&
        feedback.parent?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()));

    // Filter by status
    const matchesStatus =
      selectedRating === "all" ||
      (selectedRating === "pending" && !feedback.response) ||
      (selectedRating === "responded" && feedback.response);

    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-sky-50 to-white border-b border-sky-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-sky-800 flex items-center gap-2">
              <Send className="w-5 h-5" />
              Tất cả phản hồi
            </CardTitle>
            <CardDescription className="text-sky-600">
              Danh sách phản hồi từ phụ huynh và học sinh
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                fetchFeedbacks(true);
              }}
              variant="outline"
              size="sm"
              className="border-sky-200 hover:bg-sky-50 text-sky-700 transition-all duration-200 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Tải lại
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-sky-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sky-400" />
              <Input
                placeholder="Tìm kiếm phản hồi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg transition-all duration-200"
              />
            </div>
            <div className="flex gap-3">
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger className="w-[200px] h-11 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg">
                  <Filter className="w-4 h-4 mr-2 text-sky-400" />
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent className="border-sky-200 shadow-lg">
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chưa phản hồi</SelectItem>
                  <SelectItem value="responded">Đã phản hồi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            <span className="ml-2 text-sky-600">
              Đang tải dữ liệu phản hồi...
            </span>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">Lỗi: {error}</p>
            <Button
              onClick={() => fetchFeedbacks(true)}
              className="mt-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white"
              variant="outline"
            >
              Thử lại
            </Button>
          </div>
        )}

        {!isLoading &&
          !error &&
          filteredFeedbacks.length === 0 &&
          feedbacks.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Không tìm thấy phản hồi nào phù hợp với bộ lọc
              </p>
            </div>
          )}

        {!isLoading && !error && feedbacks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">Chưa có phản hồi nào</p>
          </div>
        )}

        {!isLoading && !error && filteredFeedbacks.length > 0 && (
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="p-4 rounded-lg border border-sky-100 hover:bg-sky-50/50 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-sky-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sky-800">
                        {feedback.title}
                      </h4>
                      <p className="text-sm text-sky-600">
                        {typeof feedback.parent === "object" &&
                        feedback.parent?.email
                          ? feedback.parent.email
                          : typeof feedback.parent === "string"
                          ? feedback.parent
                          : "Anonymous"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {feedback.response ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        ✓ Đã phản hồi
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                        ⏳ Chưa phản hồi
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{feedback.description}</p>

                {feedback.response && (
                  <div className="bg-sky-50 rounded-lg p-3 mb-3 border-l-4 border-sky-500">
                    <h4 className="font-medium text-sky-800 mb-1">Phản hồi:</h4>
                    <p className="text-sm text-sky-700">{feedback.response}</p>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex gap-2">
                    {!feedback.response && (
                      <ResponseDialog
                        title={feedback.title}
                        description="Nhập phản hồi của bạn để giúp cải thiện dịch vụ"
                        onSubmit={(response) =>
                          handleRespondClick(feedback._id, response)
                        }
                      />
                    )}
                    {!feedback.response && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg transition-all duration-300"
                        onClick={() => {
                          // Mark as processed without response
                          handleProcessClick(feedback._id);
                        }}
                      >
                        Đánh dấu đã xử lý
                      </Button>
                    )}
                    {feedback.response && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50"
                        disabled
                      >
                        ✓ Đã hoàn thành
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
