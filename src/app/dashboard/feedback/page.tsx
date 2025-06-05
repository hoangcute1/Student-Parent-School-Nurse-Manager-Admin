"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Giả lập dữ liệu phản hồi
const feedbacks = [
  {
    id: 1,
    type: "Chương trình KS57",
    purpose: "Đăng ký chương trình KS57",
    createDate: "11/05/2025",
    processNote:
      "Chào em, em sẽ được xếp lớp môn DXE291c theo chương trình KS57 trên FAP và thư mời coursera sẽ được gửi vào email của em trước ngày 20/5, em vui lòng xem sylabus trên FAP và vào coursera để học nhé. Chúc em học tốt.",
    file: "",
    status: "Approved",
    updateDate: "13/05/2025 17:19:19",
  },
  {
    id: 2,
    type: "Hoãn nghĩa vụ quân sự",
    purpose: "em xin hoãn nghĩ vụ quân sự",
    createDate: "10/11/2024",
    processNote:
      "Sinh viên vui lòng đến P.202 nhận giấy xác nhận sinh viên từ 14h00 ngày 11/11 nhé. Thân ái.",
    file: "",
    status: "Approved",
    updateDate: "11/11/2024 11:28:11",
  },
];

export default function FeedbackDashboard() {
  const [newFeedback, setNewFeedback] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmitFeedback = () => {
    // Xử lý gửi phản hồi
    console.log("Gửi phản hồi:", newFeedback);
    setNewFeedback("");
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-800">
            Phản hồi ý kiến
          </h1>
          <p className="text-blue-600">
            Theo dõi trạng thái xử lý đơn từ của bạn
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              Tạo đơn mới
            </Button>
          </DialogTrigger>
          <DialogContent className="border-blue-100">
            <DialogHeader>
              <DialogTitle className="text-blue-800">Tạo đơn mới</DialogTitle>
              <DialogDescription className="text-blue-600">
                Vui lòng điền đầy đủ thông tin đơn của bạn
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Nhập nội dung đơn của bạn..."
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                className="min-h-[150px] border-blue-200 focus:border-blue-500"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmitFeedback}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Gửi đơn
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg border-blue-100">
        <Table>
          <TableHeader className="bg-blue-50">
            <TableRow>
              <TableHead className="text-blue-800">TYPE</TableHead>
              <TableHead className="text-blue-800">PURPOSE</TableHead>
              <TableHead className="text-blue-800">CREATEDATE</TableHead>
              <TableHead className="max-w-[400px] text-blue-800">
                PROCESSNOTE
              </TableHead>
              <TableHead className="text-blue-800">FILE</TableHead>
              <TableHead className="text-blue-800">STATUS</TableHead>
              <TableHead className="text-blue-800">...</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((feedback) => (
              <TableRow key={feedback.id} className="hover:bg-blue-50">
                <TableCell className="text-blue-700">{feedback.type}</TableCell>
                <TableCell className="text-blue-700">
                  {feedback.purpose}
                </TableCell>
                <TableCell className="text-blue-700">
                  {feedback.createDate}
                </TableCell>
                <TableCell className="max-w-[400px] whitespace-normal text-blue-700">
                  {feedback.processNote}
                </TableCell>
                <TableCell className="text-blue-700">{feedback.file}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      feedback.status === "Approved" ? "default" : "destructive"
                    }
                    className={
                      feedback.status === "Approved"
                        ? "whitespace-nowrap bg-green-100 text-green-800 border-green-200"
                        : "whitespace-nowrap bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    {feedback.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-blue-700">
                  {feedback.updateDate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
