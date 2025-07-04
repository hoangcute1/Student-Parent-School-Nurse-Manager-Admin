"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  MessageSquare,
  Eye,
  Reply,
  Clock,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth-store";

interface Notification {
  _id: string;
  feedback: {
    _id: string;
    title: string;
    description: string;
    response: string | null;
    status: string;
    createdAt: string;
  };
  recipient: {
    _id: string;
    email: string;
  };
  recipientRole: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("Fetching notifications...");
        const response = await fetch(
          "http://localhost:3001/test/notifications-no-auth"
        );
        const data = await response.json();
        console.log("Notifications data:", data);

        if (data.status === "success") {
          // Filter notifications for parent (recipient role = "parent")
          const parentNotifications = data.data.filter(
            (notif: any) => notif.recipientRole === "parent"
          );
          setNotifications(parentNotifications || []);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông báo",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [toast]);

  // Handle responding to feedback
  const handleRespondToFeedback = async (feedbackId: string) => {
    if (!responseText.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung phản hồi",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:3001/test/create-response-no-auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            feedback: feedbackId,
            responder: "684d08d98e8c9994a5e1ff43", // staff user ID
            response: responseText,
          }),
        }
      );

      const data = await response.json();
      console.log("Response created:", data);

      if (data.status === "success") {
        toast({
          title: "Thành công",
          description: "Đã gửi phản hồi thành công",
        });

        // Reset form
        setResponseText("");
        setSelectedFeedback(null);

        // Refresh notifications
        const notifResponse = await fetch(
          "http://localhost:3001/test/notifications-no-auth"
        );
        const notifData = await notifResponse.json();
        if (notifData.status === "success") {
          setNotifications(notifData.data || []);
        }
      } else {
        throw new Error(data.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      console.error("Error responding to feedback:", error);
      toast({
        title: "Lỗi",
        description: `Không thể gửi phản hồi: ${
          error?.message || "Vui lòng thử lại"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === "pending") {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Chờ xử lý
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Đã phản hồi
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-800">
          Thông báo & Phản hồi
        </h1>
        <p className="text-blue-600 text-sm md:text-base">
          Quản lý thông báo và phản hồi thắc mắc từ phụ huynh
        </p>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-blue-50">
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Bell className="mr-2 h-4 w-4" />
            Thông báo ({notifications.length})
          </TabsTrigger>
          <TabsTrigger
            value="respond"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Reply className="mr-2 h-4 w-4" />
            Phản hồi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-4 space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-blue-600">Đang tải thông báo...</p>
            </div>
          ) : notifications.length === 0 ? (
            <Card className="border-blue-100">
              <CardContent className="py-8 text-center">
                <Bell className="mx-auto h-12 w-12 text-blue-300 mb-4" />
                <p className="text-blue-600">Chưa có thông báo nào</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification._id}
                  className="border-blue-100 hover:border-blue-300 transition-all duration-300 shadow-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-blue-800 flex items-center">
                          <MessageSquare className="mr-2 h-5 w-5" />
                          {notification.feedback.title}
                        </CardTitle>
                        <CardDescription className="text-blue-600 text-sm">
                          {formatDate(notification.createdAt)} • Từ:{" "}
                          {notification.recipient.email}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(notification.feedback.status)}
                        {!notification.isRead && (
                          <Badge variant="destructive" className="text-xs">
                            Mới
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <h4 className="font-medium text-blue-800 mb-1 text-sm">
                        Nội dung thắc mắc:
                      </h4>
                      <p className="text-blue-700 text-sm leading-relaxed">
                        {notification.feedback.description}
                      </p>
                    </div>

                    {notification.feedback.response ? (
                      <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                        <h4 className="font-medium text-green-800 mb-1 text-sm">
                          Đã phản hồi:
                        </h4>
                        <p className="text-green-700 text-sm leading-relaxed">
                          {notification.feedback.response}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-600 text-sm">
                          Chưa có phản hồi
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-auto"
                          onClick={() =>
                            setSelectedFeedback(notification.feedback)
                          }
                        >
                          <Reply className="mr-2 h-4 w-4" />
                          Phản hồi
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="respond" className="mt-4 space-y-4">
          {selectedFeedback ? (
            <Card className="border-blue-100 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-blue-800 text-xl">
                  Phản hồi thắc mắc
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Tiêu đề: {selectedFeedback.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-medium text-blue-800 mb-1 text-sm">
                    Nội dung thắc mắc:
                  </h4>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    {selectedFeedback.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="response">Nội dung phản hồi</Label>
                  <Textarea
                    id="response"
                    placeholder="Nhập nội dung phản hồi cho phụ huynh..."
                    className="min-h-[120px] border-blue-200 focus:border-blue-500 resize-none"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFeedback(null);
                      setResponseText("");
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting || !responseText.trim()}
                    onClick={() =>
                      handleRespondToFeedback(selectedFeedback._id)
                    }
                  >
                    <Reply className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-blue-100">
              <CardContent className="py-8 text-center">
                <Reply className="mx-auto h-12 w-12 text-blue-300 mb-4" />
                <p className="text-blue-600">Chọn một thông báo để phản hồi</p>
                <p className="text-blue-500 text-sm mt-2">
                  Vào tab "Thông báo" và nhấn nút "Phản hồi"
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
