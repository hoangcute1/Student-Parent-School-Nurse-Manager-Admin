"use client";

import { useState, useEffect } from "react";
import { Send, Star, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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

import { createFeedback, getDefaultParentFeedbacks } from "@/lib/api/feedbacks";
import { Feedback } from "@/lib/type/feedbacks";
import {
  getCategoryInfo,
  getCategoryLabel,
} from "@/lib/utils/feedback-category";
import { useParentStudentsStore } from "@/stores/parent-students-store";

export default function FeedbackPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchStudentsByParent } = useParentStudentsStore();

  useEffect(() => {
    fetchStudentsByParent();
  }, [fetchStudentsByParent]);
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
        category: formData.category,
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-sky-500 to-sky-600 rounded-full shadow-lg">
            <Send className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-sky-600 to-sky-800 bg-clip-text text-transparent">
              Hỏi đáp sức khỏe
            </h1>
            <p className="text-base md:text-lg text-sky-600 max-w-3xl mx-auto leading-relaxed">
              Gửi thắc mắc về sức khỏe của con em và nhận tư vấn từ đội ngũ y tế
              chuyên nghiệp
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="max-w-5xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
            <Tabs defaultValue="new-feedback" className="w-full">
              {/* Header with Tabs */}
              <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-8 pt-8 pb-4">
                <div className="text-center space-y-4 mb-6">
                  <CardTitle className="text-3xl md:text-4xl font-bold text-white">
                    Hệ thống hỏi đáp sức khỏe
                  </CardTitle>
                  <CardDescription className="text-sky-100 text-lg max-w-2xl mx-auto">
                    Gửi câu hỏi và theo dõi các thắc mắc của bạn về sức khỏe con
                    em
                  </CardDescription>
                </div>

                {/* Full-width Tabs Navigation */}
                <TabsList className="flex w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl h-14">
                  <TabsTrigger
                    value="new-feedback"
                    className="flex-1 text-center font-semibold rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-lg data-[state=active]:z-10 transition-all duration-300 text-base text-white/90 hover:text-white hover:bg-white/5"
                  >
                    ✍️ Gửi thắc mắc mới
                  </TabsTrigger>
                  <TabsTrigger
                    value="my-feedback"
                    className="flex-1 text-center font-semibold rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-lg data-[state=active]:z-10 transition-all duration-300 text-base text-white/90 hover:text-white hover:bg-white/5"
                  >
                    📋 Thắc mắc của tôi
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content for New Feedback */}
              <TabsContent value="new-feedback" className="mt-0">
                <div className="bg-gradient-to-b from-sky-50 to-white border-b-4 border-sky-500/20">
                  <div className="px-8 py-6">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">✍️</span>
                      </div>
                      <h2 className="text-2xl font-bold text-sky-800">
                        Gửi thắc mắc mới
                      </h2>
                    </div>
                  </div>
                </div>

                <CardContent className="p-8 space-y-8 bg-white">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="category"
                          className="text-sky-700 font-semibold text-base"
                        >
                          Loại thắc mắc
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            setFormData({ ...formData, category: value })
                          }
                        >
                          <SelectTrigger className="border-sky-200 focus:border-sky-500 focus:ring-sky-500 rounded-xl h-14 bg-sky-50/30 hover:bg-sky-50/50 transition-colors">
                            <SelectValue placeholder="Chọn loại thắc mắc của bạn" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-sky-200">
                            <SelectItem
                              value="illness"
                              className="rounded-lg py-3"
                            >
                              🩺 Bệnh tật
                            </SelectItem>
                            <SelectItem
                              value="nutrition"
                              className="rounded-lg py-3"
                            >
                              🍎 Dinh dưỡng
                            </SelectItem>
                            <SelectItem
                              value="medicine"
                              className="rounded-lg py-3"
                            >
                              💊 Thuốc
                            </SelectItem>
                            <SelectItem
                              value="environment"
                              className="rounded-lg py-3"
                            >
                              🌍 Môi trường
                            </SelectItem>
                            <SelectItem
                              value="vaccine"
                              className="rounded-lg py-3"
                            >
                              💉 Vaccine
                            </SelectItem>
                            <SelectItem
                              value="mental"
                              className="rounded-lg py-3"
                            >
                              🧠 Tâm lý
                            </SelectItem>
                            <SelectItem
                              value="development"
                              className="rounded-lg py-3"
                            >
                              📈 Phát triển
                            </SelectItem>
                            <SelectItem
                              value="prevention"
                              className="rounded-lg py-3"
                            >
                              🛡️ Phòng chống
                            </SelectItem>
                            <SelectItem
                              value="general"
                              className="rounded-lg py-3"
                            >
                              💬 Chung
                            </SelectItem>
                            <SelectItem
                              value="emergency"
                              className="rounded-lg py-3"
                            >
                              🚨 Khẩn cấp
                            </SelectItem>
                            <SelectItem
                              value="other"
                              className="rounded-lg py-3"
                            >
                              ❓ Khác
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="title"
                          className="text-sky-700 font-semibold text-base"
                        >
                          Tiêu đề thắc mắc
                        </Label>
                        <Input
                          id="title"
                          placeholder="Nhập tiêu đề ngắn gọn và rõ ràng"
                          className="border-sky-200 focus:border-sky-500 focus:ring-sky-500 rounded-xl h-14 bg-sky-50/30 hover:bg-sky-50/50 transition-colors text-base"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="content"
                        className="text-sky-700 font-semibold text-base"
                      >
                        Mô tả chi tiết
                      </Label>
                      <Textarea
                        id="content"
                        placeholder="Mô tả chi tiết tình trạng sức khỏe, triệu chứng, thời gian diễn ra... để chúng tôi có thể tư vấn chính xác nhất"
                        className="min-h-[140px] border-sky-200 focus:border-sky-500 focus:ring-sky-500 rounded-xl resize-none bg-sky-50/30 hover:bg-sky-50/50 transition-colors text-base"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="flex justify-center pt-6">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed text-base font-semibold"
                        disabled={isSubmitting}
                      >
                        <Send className="mr-3 h-5 w-5" />
                        {isSubmitting ? "Đang gửi..." : "Gửi thắc mắc ngay"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </TabsContent>

              {/* Tab Content for My Feedback */}
              <TabsContent value="my-feedback" className="mt-0">
                <CardContent className="p-8 bg-white">
                  {isLoading ? (
                    <div className="text-center py-20">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-sky-500 to-sky-600 rounded-full animate-pulse mb-6 shadow-lg">
                        <ThumbsUp className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-sky-600 text-xl font-medium">
                        Đang tải thắc mắc...
                      </p>
                      <p className="text-sky-400 text-sm mt-2">
                        Vui lòng chờ trong giây lát
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {feedbacks.length === 0 ? (
                        <div className="py-20 text-center">
                          <div className="inline-flex items-center justify-center w-20 h-20 bg-sky-100 rounded-full mb-6 shadow-inner">
                            <Send className="w-10 h-10 text-sky-500" />
                          </div>
                          <h3 className="text-xl font-semibold text-sky-800 mb-2">
                            Chưa có thắc mắc nào
                          </h3>
                          <p className="text-sky-500 text-base mb-4">
                            Hãy gửi thắc mắc đầu tiên của bạn để nhận tư vấn!
                          </p>
                          <Button
                            onClick={() => {
                              // Chuyển sang tab 'Gửi thắc mắc mới'
                              const tabs = document
                                .querySelector('[data-state="active"]')
                                ?.parentElement?.querySelector(
                                  '[value="new-feedback"]'
                                ) as HTMLElement;
                              if (tabs) tabs.click();
                            }}
                            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-xl"
                          >
                            Gửi thắc mắc ngay
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-6 p-4 bg-sky-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold">
                                {feedbacks.length}
                              </div>
                              <span className="text-sky-700 font-medium">
                                Tổng cộng {feedbacks.length} thắc mắc
                              </span>
                            </div>
                          </div>

                          {feedbacks.map((feedback, index) => (
                            <div
                              key={feedback._id}
                              className="bg-gradient-to-r from-white to-sky-50/50 hover:from-sky-50/30 hover:to-sky-50/70 transition-all duration-300 rounded-2xl p-6 border-2 border-sky-100 hover:border-sky-200 shadow-md hover:shadow-lg"
                            >
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-sky-500 to-sky-600 rounded-full text-white text-sm font-bold shadow-lg">
                                      #{index + 1}
                                    </div>
                                    <h3 className="text-xl font-bold text-sky-800 line-clamp-2">
                                      {feedback.title}
                                    </h3>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-sky-600">
                                    <span className="bg-white px-4 py-2 rounded-full border border-sky-200 shadow-sm">
                                      📅{" "}
                                      {new Date(
                                        feedback.createdAt
                                      ).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                        getCategoryInfo(feedback.category).color
                                      }`}
                                    >
                                      {getCategoryLabel(feedback.category)}
                                    </span>
                                  </div>
                                </div>
                                <Badge
                                  variant={getStatusVariant(feedback.status)}
                                  className={`${getStatusColor(
                                    feedback.status
                                  )} px-4 py-2 rounded-full text-sm font-semibold shadow-sm flex-shrink-0 border-2 border-white`}
                                >
                                  {feedback.status === "pending"
                                    ? "⏳ Chờ xử lý"
                                    : "✅ Đã phản hồi"}
                                </Badge>
                              </div>

                              <div className="space-y-5">
                                <div className="bg-white rounded-xl p-5 border-l-4 border-sky-400 shadow-sm">
                                  <h4 className="font-bold text-sky-800 mb-3 flex items-center gap-2">
                                    <span>📝</span>
                                    Nội dung thắc mắc:
                                  </h4>
                                  <p className="text-sky-700 leading-relaxed text-base">
                                    {feedback.description}
                                  </p>
                                </div>

                                {feedback.response && (
                                  <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl p-6 text-white shadow-lg border-4 border-sky-200">
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                                        <Star className="w-5 h-5" />
                                      </div>
                                      <h4 className="font-bold text-xl">
                                        Phản hồi từ nhà trường
                                      </h4>
                                    </div>
                                    <div className="bg-white/15 rounded-xl p-5 backdrop-blur-sm border border-white/20">
                                      <p className="text-base leading-relaxed">
                                        {feedback.response}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
