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
import React, { useEffect } from "react";
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
//       return <Badge className="bg-blue-100 text-blue-800">Góp ý</Badge>;
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

  useEffect(() => {
    if (feedbacks.length === 0) {
      fetchFeedbacks();
    }
  }, [fetchFeedbacks, feedbacks.length]);

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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-blue-800">Tất cả phản hồi</CardTitle>
            <CardDescription className="text-blue-600">
              Danh sách phản hồi từ phụ huynh và học sinh
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm phản hồi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedRating} onValueChange={setSelectedRating}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Lọc theo đánh giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="5">5 sao</SelectItem>
              <SelectItem value="4">4 sao</SelectItem>
              <SelectItem value="3">3 sao</SelectItem>
              <SelectItem value="2">2 sao</SelectItem>
              <SelectItem value="1">1 sao</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        {
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="p-4 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800">
                        {feedback.title}
                      </h4>
                      <p className="text-sm text-blue-600">
                        {feedback.parent || "Anonymous"}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{feedback.description}</p>

                {feedback.response && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-3 border-l-4 border-blue-500">
                    <h4 className="font-medium text-blue-800 mb-1">
                      Phản hồi:
                    </h4>
                    <p className="text-sm text-blue-700">{feedback.response}</p>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex gap-2">
                    <ResponseDialog
                      title={feedback.title}
                      description="Nhập phản hồi của bạn để giúp cải thiện dịch vụ"
                      onSubmit={(response) =>
                        handleRespondClick(feedback._id, response)
                      }
                    />
                    {!feedback.response && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Xử lý
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      </CardContent>
    </Card>
  );
}
