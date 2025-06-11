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
import { Select } from "@/components/ui/select";
import { Filter, Search, Send, Star, User } from "lucide-react";
import { getFeedbacks } from "@/lib/api/feedbacks";

interface AllResponsesProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedRating: string;
  setSelectedRating: (value: string) => void;
}

export function AllResponses({
  searchTerm,
  setSearchTerm,
  selectedRating,
  setSelectedRating,
}: AllResponsesProps) {
  const data = getFeedbacks();
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
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4 mr-2" />
            Gửi thông báo
          </Button>
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
          <Select
            value={selectedRating}
            onValueChange={setSelectedRating}
          ></Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {allFeedback.map((feedback, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800">
                      {feedback.author}
                    </h4>
                    <p className="text-sm text-blue-600">
                      {feedback.relation} - {feedback.studentClass}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{feedback.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{feedback.date}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Trả lời
                  </Button>
                  {feedback.type === "Tiêu cực" && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Xử lý
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const allFeedback = [
  {
    author: "Nguyễn Thị Lan",
    relation: "Phụ huynh",
    studentClass: "Lớp 1A",
    rating: 5,
    type: "Tích cực",
    content:
      "Tôi rất hài lòng với chất lượng chăm sóc sức khỏe cho con. Các cô giáo y tế rất tận tâm và chu đáo.",
    date: "16/12/2024",
  },
  {
    author: "Trần Văn Minh",
    relation: "Phụ huynh",
    studentClass: "Lớp 2B",
    rating: 2,
    type: "Tiêu cực",
    content:
      "Thời gian chờ khám quá lâu, con tôi phải chờ 30 phút mới được khám. Mong nhà trường cải thiện.",
    date: "15/12/2024",
  },
  {
    author: "Lê Thị Hoa",
    relation: "Phụ huynh",
    studentClass: "Lớp 3A",
    rating: 4,
    type: "Góp ý",
    content:
      "Dịch vụ tốt nhưng mong có thêm thông tin chi tiết về tình trạng sức khỏe của con qua app.",
    date: "14/12/2024",
  },
];
