"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThumbsUp, Star } from "lucide-react";

export function PositiveResponses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-800">Phản hồi tích cực</CardTitle>
        <CardDescription className="text-green-600">
          Những đánh giá và nhận xét tích cực từ phụ huynh
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {positiveFeedback.map((feedback, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-green-100 bg-green-50"
            >
              <div className="flex items-center gap-3 mb-3">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">
                    {feedback.author}
                  </h4>
                  <p className="text-sm text-green-600">{feedback.relation}</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  {[...Array(feedback.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
              <p className="text-green-700 mb-2">{feedback.content}</p>
              <p className="text-sm text-green-600">{feedback.date}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const positiveFeedback = [
  {
    author: "Phạm Thị Mai",
    relation: "Phụ huynh học sinh lớp 1B",
    rating: 5,
    content:
      "Cảm ơn cô y tế đã chăm sóc con tôi khi bé bị dị ứng. Xử lý rất nhanh và chuyên nghiệp.",
    date: "16/12/2024",
  },
  {
    author: "Hoàng Văn Đức",
    relation: "Phụ huynh học sinh lớp 2A",
    rating: 5,
    content:
      "Thực đơn bán trú rất đa dạng và bổ dưỡng. Con tôi rất thích ăn ở trường.",
    date: "15/12/2024",
  },
  {
    author: "Nguyễn Thị Bích",
    relation: "Phụ huynh học sinh lớp 3B",
    rating: 4,
    content:
      "Hệ thống theo dõi sức khỏe rất tốt, tôi luôn được cập nhật tình hình của con.",
    date: "14/12/2024",
  },
];
