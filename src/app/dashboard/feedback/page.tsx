"use client";

import { useState, useEffect } from "react";
import { Send, Star, ThumbsUp } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import {
  createFeedback,
  getFeedbacks,
  getDefaultParentFeedbacks,
} from "@/lib/api/feedbacks";
import { Feedback } from "@/lib/type/feedbacks";

export default function FeedbackPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  // Fetch feedbacks khi component mount
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        // Sử dụng endpoint mới để lấy feedback của phụ huynh hiện tại
        // Trong thực tế, parentId sẽ được lấy từ user session/context
        const data = await getDefaultParentFeedbacks();
        setFeedbacks(data.feedbacks || []);
        console.log(
          "✅ Loaded feedbacks for current parent:",
          data.feedbacks?.length || 0
        );
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách thắc mắc",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, [toast]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // API call để tạo feedback mới
      const newFeedback = await createFeedback({
        title: formData.title,
        description: formData.description,
        parent: "684d1c638921098b6c7311ad", // Default parent ID for testing
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
      });

      toast({
        title: "Thành công",
        description:
          "Thắc mắc đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.",
      });

      // Refresh feedbacks list để hiển thị feedback mới
      const data = await getDefaultParentFeedbacks();
      setFeedbacks(data.feedbacks || []);
    } catch (error) {
      console.error("Error creating feedback:", error);
      toast({
        title: "Lỗi",
        description: "Không thể gửi thắc mắc. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "answered":
      case "Đã phản hồi":
        return "default";
      case "pending":
      case "Đang xử lý":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "answered":
      case "Đã phản hồi":
        return "bg-green-100 text-green-800";
      case "pending":
      case "Đang xử lý":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-800">
          Thắc mắc & Đánh giá
        </h1>
        <p className="text-blue-600 text-sm md:text-base">
          Hỏi đáp và đánh giá về những vấn đề liên quan đến dịch vụ y tế học
          đường.
        </p>
      </div>

      <Tabs defaultValue="new-feedback" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-blue-50">
          <TabsTrigger
            value="new-feedback"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Thắc mắc sức khỏe
          </TabsTrigger>
          <TabsTrigger
            value="my-feedback"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Thắc mắc của tôi
          </TabsTrigger>
          <TabsTrigger
            value="suggestions"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Phản hồi dịch vụ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new-feedback" className="mt-4 space-y-4">
          <Card className="border-blue-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-blue-800 text-xl">
                Gửi thắc mắc về sức khỏe
              </CardTitle>
              <CardDescription className="text-blue-600">
                Có những thắc mắc gì về sức khỏe của con em gửi cho chúng tôi !
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Loại thắc mắc</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Chọn loại thắc mắc" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="illness">
                          Bệnh lý thường gặp
                        </SelectItem>
                        <SelectItem value="nutrition">Dinh dưỡng</SelectItem>
                        <SelectItem value="development">
                          Phát triển thể chất
                        </SelectItem>
                        <SelectItem value="mental">
                          Sức khỏe tinh thần
                        </SelectItem>
                        <SelectItem value="prevention">
                          Phòng ngừa bệnh tật
                        </SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề thắc mắc</Label>
                  <Input
                    id="title"
                    placeholder="Nhập tiêu đề ngắn gọn cho thắc mắc của bạn"
                    className="border-blue-200 focus:border-blue-500"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Mô tả chi tiết</Label>
                  <Textarea
                    id="content"
                    placeholder="Mô tả chi tiết tình trạng sức khỏe cần hỏi..."
                    className="min-h-[100px] border-blue-200 focus:border-blue-500 resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-6"
                    disabled={isSubmitting}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Đang gửi..." : "Gửi thắc mắc"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-feedback" className="mt-4 space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-blue-600">Đang tải...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbacks.length === 0 ? (
                <Card className="border-blue-100">
                  <CardContent className="py-8 text-center">
                    <p className="text-blue-600">Chưa có thắc mắc nào</p>
                  </CardContent>
                </Card>
              ) : (
                feedbacks.map((feedback) => (
                  <Card
                    key={feedback._id}
                    className="border-blue-100 hover:border-blue-300 transition-all duration-300 shadow-sm"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-blue-800">
                            {feedback.title}
                          </CardTitle>
                          <CardDescription className="text-blue-600 text-sm">
                            {new Date(feedback.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={getStatusVariant(feedback.status)}
                          className={getStatusColor(feedback.status)}
                        >
                          {feedback.status === "pending"
                            ? "Chờ xử lý"
                            : "Đã phản hồi"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-blue-700 mb-3 text-sm leading-relaxed">
                        {feedback.description}
                      </p>
                      {feedback.response && (
                        <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                          <h4 className="font-medium text-blue-800 mb-1 text-sm">
                            Phản hồi từ nhà trường:
                          </h4>
                          <p className="text-sm text-blue-700 leading-relaxed">
                            {feedback.response}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="suggestions" className="mt-4 space-y-4">
          <Card className="border-blue-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-blue-800 text-xl">
                Phản hồi về chất lượng dịch vụ
              </CardTitle>
              <CardDescription className="text-blue-600">
                Đánh giá và góp ý về chất lượng dịch vụ y tế học đường
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600 text-center py-8">
                Tính năng đang phát triển...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
