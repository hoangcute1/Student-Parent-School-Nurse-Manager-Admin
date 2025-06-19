"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsDown } from "lucide-react";

export function NegativeResponses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-800">Phản hồi tiêu cực</CardTitle>
        <CardDescription className="text-red-600">
          Những phản hồi cần được xử lý và cải thiện
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {" "}
          {negativeFeedback.map((feedback, index) => (
            <div
              key={`negative-${feedback.author}-${index}`}
              className="p-4 rounded-lg border border-red-100 bg-red-50"
            >
              <div className="flex items-center gap-3 mb-3">
                <ThumbsDown className="h-5 w-5 text-red-600" />
                <div>
                  <h4 className="font-medium text-red-800">
                    {feedback.author}
                  </h4>
                  <p className="text-sm text-red-600">{feedback.relation}</p>
                </div>
                <div className="ml-auto">
                  <Badge className="bg-red-100 text-red-800">Cần xử lý</Badge>
                </div>
              </div>
              <p className="text-red-700 mb-3">{feedback.content}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-red-600">{feedback.date}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-700"
                  >
                    Liên hệ
                  </Button>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Xử lý ngay
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const negativeFeedback = [
  {
    author: "Trần Thị Nga",
    relation: "Phụ huynh học sinh lớp 1A",
    content:
      "Con tôi bị dị ứng nhưng không được thông báo kịp thời. Mong nhà trường cải thiện việc liên lạc.",
    date: "15/12/2024",
  },
  {
    author: "Lê Văn Tùng",
    relation: "Phụ huynh học sinh lớp 2B",
    content:
      "Phòng y tế thiếu thuốc cơ bản, con tôi đau đầu mà không có thuốc để uống.",
    date: "13/12/2024",
  },
];
