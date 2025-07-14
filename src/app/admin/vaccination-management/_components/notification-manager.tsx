"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageCircle,
  Send,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";

interface Notification {
  id: string;
  scheduleId: string;
  scheduleName: string;
  type: "initial" | "reminder" | "urgent";
  recipients: number;
  sent: number;
  pending: number;
  failed: number;
  sentDate: string;
  status: "draft" | "sending" | "completed" | "failed";
}

interface NotificationManagerProps {
  onClose: () => void;
}

// Mock data - sẽ được thay thế bằng API calls
const mockNotifications: Notification[] = [];

export function NotificationManager({ onClose }: NotificationManagerProps) {
  const [notifications] = useState<Notification[]>(mockNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Đã gửi</Badge>;
      case "sending":
        return <Badge className="bg-blue-100 text-blue-800">Đang gửi</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Bản nháp</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Lỗi</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "initial":
        return <Badge variant="outline">Thông báo ban đầu</Badge>;
      case "reminder":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Nhắc nhở</Badge>
        );
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Khẩn cấp</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = notification.scheduleName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || notification.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <MessageCircle className="w-5 h-5" />
              Quản lý thông báo tiêm chủng
            </CardTitle>
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {!showCreateForm ? (
            <div className="space-y-6">
              {/* Filters và Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Tìm kiếm lịch tiêm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                      <SelectItem value="sending">Đang gửi</SelectItem>
                      <SelectItem value="completed">Đã gửi</SelectItem>
                      <SelectItem value="failed">Lỗi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Tạo thông báo mới
                </Button>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold text-blue-600">
                        {notifications.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        Tổng thông báo
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold text-green-600">
                        {
                          notifications.filter((n) => n.status === "completed")
                            .length
                        }
                      </div>
                      <div className="text-sm text-gray-600">Đã gửi</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                      <div className="text-2xl font-bold text-yellow-600">
                        {
                          notifications.filter(
                            (n) =>
                              n.status === "sending" || n.status === "draft"
                          ).length
                        }
                      </div>
                      <div className="text-sm text-gray-600">Chờ xử lý</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                      <div className="text-2xl font-bold text-red-600">
                        {notifications.reduce((sum, n) => sum + n.failed, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Lỗi gửi</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Notifications Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách thông báo</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lịch tiêm</TableHead>
                        <TableHead>Loại thông báo</TableHead>
                        <TableHead>Người nhận</TableHead>
                        <TableHead>Tiến độ gửi</TableHead>
                        <TableHead>Ngày gửi</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNotifications.map((notification) => (
                        <TableRow key={notification.id}>
                          <TableCell className="font-medium">
                            {notification.scheduleName}
                          </TableCell>
                          <TableCell>
                            {getTypeBadge(notification.type)}
                          </TableCell>
                          <TableCell>
                            <div className="text-center font-medium">
                              {notification.recipients}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="text-green-600 font-medium">
                                  {notification.sent}
                                </span>{" "}
                                /
                                <span className="text-gray-600">
                                  {" "}
                                  {notification.recipients}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{
                                    width: `${
                                      (notification.sent /
                                        notification.recipients) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              {notification.pending > 0 && (
                                <div className="text-xs text-yellow-600">
                                  {notification.pending} chờ gửi
                                </div>
                              )}
                              {notification.failed > 0 && (
                                <div className="text-xs text-red-600">
                                  {notification.failed} lỗi
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{notification.sentDate || "-"}</TableCell>
                          <TableCell>
                            {getStatusBadge(notification.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {notification.status === "draft" && (
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Send className="w-3 h-3 mr-1" />
                                  Gửi
                                </Button>
                              )}
                              {notification.status === "completed" &&
                                notification.type !== "urgent" && (
                                  <Button size="sm" variant="outline">
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    Nhắc nhở
                                  </Button>
                                )}
                              {notification.failed > 0 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600"
                                >
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Gửi lại
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : (
            <CreateNotificationForm onBack={() => setShowCreateForm(false)} />
          )}
        </CardContent>
      </div>
    </div>
  );
}

// Component tạo thông báo mới
function CreateNotificationForm({ onBack }: { onBack: () => void }) {
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [notificationType, setNotificationType] = useState("initial");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tạo thông báo mới</h3>
        <Button variant="outline" onClick={onBack}>
          Quay lại
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Chọn lịch tiêm
            </label>
            <Select
              value={selectedSchedule}
              onValueChange={setSelectedSchedule}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn lịch tiêm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Chọn lịch tiêm</SelectItem>
                {/* Sẽ được load từ API */}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Loại thông báo
            </label>
            <Select
              value={notificationType}
              onValueChange={setNotificationType}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="initial">Thông báo ban đầu</SelectItem>
                <SelectItem value="reminder">Nhắc nhở</SelectItem>
                <SelectItem value="urgent">Khẩn cấp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tiêu đề</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Nhập tiêu đề thông báo"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nội dung thông báo
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập nội dung thông báo..."
              rows={8}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            Gửi thông báo
          </Button>
          <Button variant="outline">Lưu bản nháp</Button>
          <Button variant="outline">Xem trước</Button>
        </div>
      </div>
    </div>
  );
}
