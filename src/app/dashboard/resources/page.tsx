"use client";
import {
  Calendar,
  Download,
  Filter,
  Search,
  FileText,
  Clock,
  User,
  Bell,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParentStudentsStore } from "@/stores/parent-students-store";
import { useEffect, useState } from "react";
import { getParentId } from "@/lib/utils/parent-utils";
import { getTreatmentHistoryByParentId } from "@/lib/api/treatment-history";
import {
  getNotificationsByParentId,
  markNotificationAsRead,
} from "@/lib/api/notification";
import { TreatmentHistory } from "@/lib/type/treatment-history";
import { Notification } from "@/lib/type/notification";

export default function MedicalHistoryPage() {
  const { fetchStudentsByParent } = useParentStudentsStore();

  // State để lưu treatment history
  const [treatmentHistory, setTreatmentHistory] = useState<TreatmentHistory[]>(
    []
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationLoading, setNotificationLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parentId = await getParentId();
        console.log("Fetched parent ID:", parentId);

        if (parentId) {
          setLoading(true);
          setError(null);

          // Fetch treatment history và notifications đồng thời
          const [treatmentData, notificationData] = await Promise.all([
            getTreatmentHistoryByParentId(parentId),
            getNotificationsByParentId(parentId),
          ]);

          console.log("Treatment history data received:", treatmentData);
          console.log("Notifications data received:", notificationData);

          setTreatmentHistory(treatmentData);
          setNotifications(notificationData);
        } else {
          console.warn("No parent ID found");
          setError("Không tìm thấy thông tin phụ huynh.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchStudentsByParent]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setNotificationLoading(true);
      await markNotificationAsRead(notificationId);

      // Cập nhật state local
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setNotificationLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStudentName = (student: any) => {
    if (typeof student === "string") return student;
    if (typeof student === "object" && student?.name) return student.name;
    return "N/A";
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Tài nguyên phụ huynh
          </h1>
          <p className="text-blue-600">
            Theo dõi thông báo và lịch sử bệnh án của học sinh
          </p>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="text-blue-600">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  // Hiển thị error
  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Tài nguyên phụ huynh
          </h1>
          <p className="text-blue-600">
            Theo dõi thông báo và lịch sử bệnh án của học sinh
          </p>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Tài nguyên phụ huynh
        </h1>
        <p className="text-blue-600">
          Theo dõi thông báo và lịch sử bệnh án của học sinh
        </p>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-blue-50">
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Thông báo
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <Badge className="bg-red-500 text-white ml-1">
                {notifications.filter((n) => !n.isRead).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="medical-history"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Lịch sử bệnh án
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Thông báo từ trường học
              </CardTitle>
              <CardDescription className="text-blue-600">
                Các thông báo về sức khỏe và sự kiện y tế của học sinh
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Không có thông báo nào
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 rounded-lg border-l-4 ${
                        !notification.isRead
                          ? "border-l-blue-500 bg-blue-50"
                          : "border-l-gray-300 bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-full ${
                              notification.type === "MEDICAL_EVENT"
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {notification.type === "MEDICAL_EVENT" ? (
                              <AlertCircle className="w-4 h-4" />
                            ) : (
                              <Bell className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {notification.content}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Học sinh: {getStudentName(notification.student)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {formatDate(notification.createdAt || "")}
                          </span>
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkAsRead(notification._id)}
                              disabled={notificationLoading}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Đánh dấu đã đọc
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <p className="text-sm text-gray-700">
                          {notification.notes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical-history" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-blue-800">
                    Lịch sử bệnh án
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Theo dõi toàn bộ lịch sử bệnh án và điều trị của học sinh
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
                    <Input
                      type="search"
                      placeholder="Tìm kiếm bệnh án..."
                      className="w-[300px] pl-8 border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Download className="mr-2 h-4 w-4" />
                    Xuất lịch sử
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {treatmentHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có lịch sử bệnh án nào
                </div>
              ) : (
                <div className="space-y-6">
                  {treatmentHistory.map((entry, index) => (
                    <div key={entry._id} className="relative">
                      {index !== treatmentHistory.length - 1 && (
                        <div className="absolute left-6 top-12 h-full w-0.5 bg-blue-200"></div>
                      )}
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 border-2 border-blue-300">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <Card className="flex-1 border-blue-100 hover:border-blue-300 transition-all duration-300">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg text-blue-800">
                                  {entry.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-blue-600">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(entry.createdAt || "")}
                                  <span>•</span>
                                  <User className="h-4 w-4" />
                                  {getStudentName(entry.student)}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={`${
                                    entry.priority === "Cao"
                                      ? "bg-red-100 text-red-800"
                                      : entry.priority === "Trung bình"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {entry.priority}
                                </Badge>
                                <Badge variant="outline">
                                  {entry.status === "resolved"
                                    ? "Đã giải quyết"
                                    : entry.status === "processing"
                                    ? "Đang xử lý"
                                    : "Chờ xử lý"}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <p className="text-blue-700">
                                {entry.description}
                              </p>

                              {entry.location && (
                                <div className="bg-blue-50 rounded-lg p-3">
                                  <h4 className="font-medium text-blue-800 mb-1">
                                    Địa điểm:
                                  </h4>
                                  <p className="text-sm text-blue-700">
                                    {entry.location}
                                  </p>
                                </div>
                              )}

                              {entry.notes && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <h4 className="font-medium text-gray-800 mb-1">
                                    Ghi chú:
                                  </h4>
                                  <p className="text-sm text-gray-700">
                                    {entry.notes}
                                  </p>
                                </div>
                              )}

                              {entry.actionTaken && (
                                <div className="bg-green-50 rounded-lg p-3">
                                  <h4 className="font-medium text-green-800 mb-1">
                                    Hành động đã thực hiện:
                                  </h4>
                                  <p className="text-sm text-green-700">
                                    {entry.actionTaken}
                                  </p>
                                </div>
                              )}

                              {entry.contactParent && (
                                <div className="flex items-center gap-2 text-sm text-blue-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Đã liên hệ với phụ huynh</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getSeverityVariant(severity: string) {
  switch (severity) {
    case "Nghiêm trọng":
      return "destructive";
    case "Trung bình":
      return "secondary";
    case "Nhẹ":
      return "outline";
    default:
      return "outline";
  }
}

const medicalTimeline = [
  {
    date: "15/05/2025",
    title: "Khám sức khỏe định kỳ",
    doctor: "BS. Nguyễn Thị Hương",
    severity: "Nhẹ",
    description:
      "Khám sức khỏe tổng quát định kỳ. Học sinh có sức khỏe tốt, phát triển bình thường theo độ tuổi.",
    treatment: "Không cần điều trị đặc biệt, tiếp tục theo dõi phát triển.",
    medications: [],
    followUp: "6 tháng",
  },
  {
    date: "10/05/2025",
    title: "Viêm họng cấp",
    doctor: "BS. Trần Văn Minh",
    severity: "Trung bình",
    description:
      "Học sinh bị viêm họng cấp do virus, có triệu chứng đau họng, sốt nhẹ 37.8°C.",
    treatment: "Nghỉ ngơi, uống nhiều nước, súc miệng nước muối.",
    medications: ["Paracetamol 250mg", "Vitamin C"],
    followUp: "1 tuần",
  },
  {
    date: "25/04/2025",
    title: "Dị ứng thức ăn",
    doctor: "BS. Lê Thị Mai",
    severity: "Trung bình",
    description: "Phản ứng dị ứng sau khi ăn tôm, xuất hiện mề đay và ngứa.",
    treatment: "Tránh tiếp xúc với tôm và các loại hải sản khác.",
    medications: ["Cetirizine 5mg"],
    followUp: "2 tuần",
  },
  {
    date: "15/03/2025",
    title: "Té ngã trong sân chơi",
    doctor: "Y tá Nguyễn Thị Lan",
    severity: "Nhẹ",
    description: "Học sinh té ngã khi chơi, bị trầy xước nhẹ ở đầu gối.",
    treatment: "Vệ sinh vết thương, băng bó và theo dõi.",
    medications: ["Betadine", "Băng gạc"],
    followUp: "3 ngày",
  },
];
