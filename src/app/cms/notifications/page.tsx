"use client";

import { useState } from "react";
import {
  Bell,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Search,
} from "lucide-react";
import {
  notificationsList,
  checkupSchedule,
  responseStats,
  channelEffectiveness,
  notificationResponses,
  type Notification,
  type CheckupSchedule,
  type ResponseStat,
  type ChannelEffectiveness,
  type NotificationResponse,
} from "./_constants/data";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function HealthCheckupNotifications() {
  const [isCreateNotificationOpen, setIsCreateNotificationOpen] =
    useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>("");

  const filteredNotifications = notificationsList.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || notification.status === selectedStatus;
    const matchesDate =
      !dateFilter || notification.checkupDate.includes(dateFilter);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleSendNotification = async (notification: Notification) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Replace with actual API call
      if (Math.random() > 0.1) {
        // 90% success rate for demo
        // Update notification status
        notification.status = "Đã gửi";
        notification.sentDate = new Date().toLocaleDateString("vi-VN");

        // Show success message using toast or alert
        alert(`Đã gửi thông báo thành công: ${notification.title}`);
      } else {
        throw new Error("Có lỗi khi gửi thông báo");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      alert("Lỗi: " + (err instanceof Error ? err.message : "Có lỗi xảy ra"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNotification = async (draft: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Replace with actual API call
      if (Math.random() > 0.1) {
        // 90% success rate for demo
        setIsCreateNotificationOpen(false);
        alert(
          draft
            ? "Đã lưu bản nháp thành công"
            : "Đã tạo và gửi thông báo khám định kỳ thành công!"
        );
      } else {
        throw new Error(
          draft ? "Có lỗi khi lưu bản nháp" : "Có lỗi khi tạo thông báo"
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      alert("Lỗi: " + (err instanceof Error ? err.message : "Có lỗi xảy ra"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-purple-800">
          Thông báo Khám định kỳ
        </h1>
        <p className="text-purple-600">
          Quản lý và gửi thông báo khám sức khỏe định kỳ cho học sinh
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Tổng thông báo
            </CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">24</div>
            <p className="text-xs text-blue-600">Thông báo tháng này</p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Đã gửi
            </CardTitle>
            <Send className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">18</div>
            <p className="text-xs text-green-600">Thông báo đã gửi</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Đang chờ
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">4</div>
            <p className="text-xs text-orange-600">Chờ gửi</p>
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Khẩn cấp
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">2</div>
            <p className="text-xs text-red-600">Cần gửi ngay</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-blue-50">
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Danh sách thông báo
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Lịch khám định kỳ
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Báo cáo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-blue-800">
                    Danh sách thông báo khám định kỳ
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Quản lý các thông báo khám sức khỏe định kỳ
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsCreateNotificationOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo thông báo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <div
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm thông báo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="sent">Đã gửi</SelectItem>
                    <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm theo ngày khám..."
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Đối tượng</TableHead>
                    <TableHead>Ngày khám</TableHead>
                    <TableHead>Ngày gửi</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Phản hồi</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell className="font-medium">
                        {notification.title}
                      </TableCell>
                      <TableCell>{notification.target}</TableCell>
                      <TableCell>{notification.checkupDate}</TableCell>
                      <TableCell>{notification.sentDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            notification.status === "Đã gửi"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            notification.status === "Đã gửi"
                              ? "bg-green-100 text-green-800"
                              : notification.status === "Đã lên lịch"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {notification.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {notification.responses}/
                          {notification.totalRecipients}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-blue-50"
                            onClick={() => {
                              setSelectedNotification(notification);
                              setIsDetailOpen(true);
                            }}
                          >
                            Chi tiết
                          </Button>
                          {notification.status === "Bản nháp" && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() =>
                                handleSendNotification(notification)
                              }
                            >
                              Gửi
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
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Lịch khám định kỳ</CardTitle>
              <CardDescription className="text-blue-600">
                Kế hoạch khám sức khỏe định kỳ theo từng khối lớp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {checkupSchedule.map((schedule, index) => (
                  <Card key={index} className="border-blue-100">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-blue-800">
                            {schedule.grade}
                          </CardTitle>
                          <CardDescription className="text-blue-600">
                            {schedule.period}
                          </CardDescription>
                        </div>
                        <Badge
                          className={
                            schedule.status === "Hoàn thành"
                              ? "bg-green-100 text-green-800"
                              : schedule.status === "Đang tiến hành"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-orange-100 text-orange-800"
                          }
                        >
                          {schedule.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày khám:</span>
                          <span className="font-medium">{schedule.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Địa điểm:</span>
                          <span className="font-medium">
                            {schedule.location}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Đã thông báo:</span>
                          <span className="font-medium">
                            {schedule.notified}/{schedule.total}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800">
                  Thống kê phản hồi
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Tỷ lệ phản hồi thông báo khám định kỳ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {responseStats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-blue-100"
                    >
                      <div className="flex items-center gap-3">
                        <stat.icon className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-blue-800">
                            {stat.label}
                          </div>
                          <div className="text-sm text-blue-600">
                            {stat.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-800">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-500">
                          {stat.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800">
                  Hiệu quả thông báo
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Đánh giá hiệu quả các kênh thông báo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelEffectiveness.map((channel, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700 font-medium">
                          {channel.name}
                        </span>
                        <span className="text-blue-800">{channel.rate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${channel.rate}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Đã gửi: {channel.sent} | Phản hồi: {channel.responses}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog tạo thông báo */}
      <Dialog
        open={isCreateNotificationOpen}
        onOpenChange={setIsCreateNotificationOpen}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-blue-800">
              Tạo thông báo khám định kỳ
            </DialogTitle>
            <DialogDescription className="text-blue-600">
              Tạo và gửi thông báo khám sức khỏe định kỳ cho học sinh
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="notification-title">Tiêu đề thông báo *</Label>
                <Input
                  id="notification-title"
                  placeholder="VD: Thông báo khám sức khỏe định kỳ học kỳ I"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkup-type">Loại khám *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại khám" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Khám tổng quát</SelectItem>
                    <SelectItem value="dental">Khám răng miệng</SelectItem>
                    <SelectItem value="vision">Khám mắt</SelectItem>
                    <SelectItem value="hearing">Khám tai mũi họng</SelectItem>
                    <SelectItem value="vaccination">Tiêm chủng</SelectItem>
                    <SelectItem value="special">Khám chuyên khoa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-group">Đối tượng khám *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đối tượng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả học sinh</SelectItem>
                    <SelectItem value="grade1">Khối lớp 1</SelectItem>
                    <SelectItem value="grade2">Khối lớp 2</SelectItem>
                    <SelectItem value="grade3">Khối lớp 3</SelectItem>
                    <SelectItem value="grade4">Khối lớp 4</SelectItem>
                    <SelectItem value="grade5">Khối lớp 5</SelectItem>
                    <SelectItem value="specific">Học sinh cụ thể</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkup-date">Ngày khám *</Label>
                <Input id="checkup-date" type="date" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkup-time">Thời gian khám</Label>
                <Input id="checkup-time" placeholder="VD: 8:00 - 11:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkup-location">Địa điểm khám *</Label>
                <Input
                  id="checkup-location"
                  placeholder="VD: Phòng y tế trường"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor-info">Thông tin bác sĩ</Label>
              <Input
                id="doctor-info"
                placeholder="VD: BS. Nguyễn Văn A - Bệnh viện Nhi Trung ương"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preparation">Chuẩn bị trước khám</Label>
              <Textarea
                id="preparation"
                placeholder="VD: Học sinh cần nhịn ăn 8 tiếng trước khi khám, mang theo sổ khám sức khỏe..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notification-content">Nội dung thông báo *</Label>
              <Textarea
                id="notification-content"
                placeholder="Nội dung chi tiết thông báo gửi đến phụ huynh..."
                rows={5}
                defaultValue="Kính gửi Quý phụ huynh,

Nhà trường thông báo lịch khám sức khỏe định kỳ cho các em học sinh như sau:

- Thời gian: [Ngày khám]
- Địa điểm: [Địa điểm khám]
- Đối tượng: [Đối tượng khám]

Đề nghị Quý phụ huynh lưu ý và chuẩn bị cho con em mình tham gia khám sức khỏe đầy đủ.

Trân trọng cảm ơn!"
              />
            </div>

            <div className="space-y-2">
              <Label>Kênh gửi thông báo</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "SMS",
                  "Email",
                  "Zalo",
                  "Thông báo trường",
                  "Giấy mời",
                  "Website",
                ].map((channel) => (
                  <label key={channel} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded"
                      defaultChecked={["SMS", "Thông báo trường"].includes(
                        channel
                      )}
                    />
                    <span className="text-sm">{channel}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="send-time">Thời gian gửi</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Gửi ngay</SelectItem>
                    <SelectItem value="schedule">Lên lịch gửi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reminder">Nhắc nhở</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tần suất nhắc" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không nhắc</SelectItem>
                    <SelectItem value="1day">1 ngày trước</SelectItem>
                    <SelectItem value="3days">3 ngày trước</SelectItem>
                    <SelectItem value="1week">1 tuần trước</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateNotificationOpen(false)}
              >
                Hủy
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handleCreateNotification(false)}
                disabled={isLoading}
              >
                Tạo và gửi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog chi tiết thông báo */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Chi tiết thông báo: {selectedNotification?.title}
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết và thống kê phản hồi
            </DialogDescription>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Thông tin chung</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Đối tượng:</span>
                      <span className="font-medium">
                        {selectedNotification.target}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ngày khám:</span>
                      <span className="font-medium">
                        {selectedNotification.checkupDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ngày gửi:</span>
                      <span className="font-medium">
                        {selectedNotification.sentDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trạng thái:</span>
                      <Badge className="bg-green-100 text-green-800">
                        {selectedNotification.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Thống kê phản hồi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Tỷ lệ phản hồi</span>
                        <span className="font-medium">
                          {Math.round(
                            (selectedNotification.responses /
                              selectedNotification.totalRecipients) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-bold text-green-800">
                            {selectedNotification.responses}
                          </div>
                          <div className="text-green-600">Đã phản hồi</div>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <div className="font-bold text-orange-800">
                            {selectedNotification.totalRecipients -
                              selectedNotification.responses}
                          </div>
                          <div className="text-orange-600">Chưa phản hồi</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Danh sách phản hồi</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Học sinh</TableHead>
                        <TableHead>Lớp</TableHead>
                        <TableHead>Phụ huynh</TableHead>
                        <TableHead>Phản hồi</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Ghi chú</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notificationResponses.map((response, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {response.studentName}
                          </TableCell>
                          <TableCell>{response.class}</TableCell>
                          <TableCell>{response.parentName}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                response.status === "Đồng ý"
                                  ? "bg-green-100 text-green-800"
                                  : response.status === "Từ chối"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {response.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{response.responseTime}</TableCell>
                          <TableCell>{response.note}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
