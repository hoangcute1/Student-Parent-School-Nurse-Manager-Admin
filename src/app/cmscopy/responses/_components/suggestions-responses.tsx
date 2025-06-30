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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Send } from "lucide-react";

export function SuggestionsResponses() {
  return (
    <div className="w-full gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800">Góp ý cải thiện</CardTitle>
          <CardDescription className="text-blue-600">
            Những đề xuất từ phụ huynh để cải thiện dịch vụ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-blue-100 bg-blue-50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium text-blue-800">
                    {suggestion.title}
                  </h4>
                </div>
                <p className="text-blue-700 text-sm mb-2">
                  {suggestion.content}
                </p>
                <div className="flex justify-between items-center text-xs text-blue-600">
                  <span>{suggestion.author}</span>
                  <span>{suggestion.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const suggestions = [
  {
    title: "Cải thiện thực đơn",
    content: "Nên có thêm món chay và giảm độ mặn trong các món ăn",
    author: "Nguyễn Thị Hương",
    date: "16/12/2024",
  },
  {
    title: "Ứng dụng mobile",
    content: "Mong có app để theo dõi sức khỏe con trực tiếp trên điện thoại",
    author: "Trần Văn Nam",
    date: "15/12/2024",
  },
  {
    title: "Tăng cường hoạt động thể dục",
    content: "Nên có thêm các hoạt động thể thao ngoài trời cho học sinh",
    author: "Lê Thị Lan",
    date: "14/12/2024",
  },
];
