"use client";

import {
  Users,
  FileText,
  Activity,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Pill,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/layout/sidebar/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function CMSPage() {
  const router = useRouter();
  const [processingAlert, setProcessingAlert] = useState<string | null>(null);

  const handleProcessAlert = async (alertId: string) => {
    setProcessingAlert(alertId);
    try {
      // Thực hiện các thao tác xử lý cảnh báo ở đây
      // Đây là nơi bạn sẽ gọi API để xử lý cảnh báo
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Giả lập thời gian xử lý
      toast({
        title: "Đã xử lý cảnh báo",
        description: "Cảnh báo đã được xử lý thành công",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xử lý cảnh báo. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setProcessingAlert(null);
    }
  };

  const handleViewDetails = (alertId: string) => {
    // Điều hướng đến trang chi tiết cảnh báo
    router.push(`/cms/alerts/${alertId}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Tổng quan hệ thống 
        </h1>
        <p className="text-blue-600">
          Tổng quan hệ thống quản lý sức khỏe học đường
        </p>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-100 hover:border-blue-300 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Tổng học sinh
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">248</div>
            <p className="text-xs text-blue-600">+12 so với tháng trước</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100 hover:border-orange-300 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Cần theo dõi
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">12</div>
            <p className="text-xs text-orange-600">
              Học sinh có vấn đề sức khỏe
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-100 hover:border-green-300 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Sự kiện hôm nay
            </CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">5</div>
            <p className="text-xs text-green-600">Sự cố y tế đã xử lý</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 hover:border-blue-300 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Tiêm chủng
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">85%</div>
            <p className="text-xs text-blue-600">Tỷ lệ hoàn thành đợt tiêm</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-blue-50">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Tổng quan
          </TabsTrigger>
          <TabsTrigger
            value="alerts"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Cảnh báo
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Hoạt động gần đây
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Báo cáo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-800">
                  Thống kê sức khỏe theo lớp
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Tỷ lệ học sinh có vấn đề sức khỏe theo từng lớp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {classHealthStats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700 font-medium">
                        {stat.class}
                      </span>
                      <span className="text-blue-800">
                        {stat.issues}/{stat.total} học sinh
                      </span>
                    </div>
                    <Progress
                      value={(stat.issues / stat.total) * 100}
                      className="h-2 bg-blue-100"
                      indicatorClassName={
                        stat.issues > 2 ? "bg-red-500" : "bg-green-500"
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-800">Kho thuốc</CardTitle>
                <CardDescription className="text-blue-600">
                  Tình trạng thuốc trong kho
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {medicineInventory.map((medicine, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <Pill className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-800">
                          {medicine.name}
                        </div>
                        <div className="text-sm text-blue-600">
                          {medicine.quantity} còn lại
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        medicine.status === "Đầy đủ" ? "default" : "destructive"
                      }
                      className={
                        medicine.status === "Đầy đủ"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {medicine.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6 space-y-4">
          <div className="space-y-4">
            {healthAlerts.map((alert, index) => (
              <Card
                key={index}
                className={`border-l-4 ${
                  alert.priority === "Cao"
                    ? "border-l-red-500 bg-red-50"
                    : alert.priority === "Trung bình"
                    ? "border-l-yellow-500 bg-yellow-50"
                    : "border-l-blue-500 bg-blue-50"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{alert.title}</CardTitle>
                    <Badge
                      variant={
                        alert.priority === "Cao" ? "destructive" : "secondary"
                      }
                      className={
                        alert.priority === "Cao"
                          ? "bg-red-100 text-red-800"
                          : alert.priority === "Trung bình"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {alert.priority}
                    </Badge>
                  </div>
                  <CardDescription>
                    {alert.student} • {alert.class}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{alert.description}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleProcessAlert(alert.id)}
                      disabled={processingAlert === alert.id}
                    >
                      {processingAlert === alert.id
                        ? "Đang xử lý..."
                        : "Xử lý ngay"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-200 text-blue-700"
                      onClick={() => handleViewDetails(alert.id)}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6 space-y-4">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg border border-blue-100 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <activity.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-blue-800">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-blue-600 mt-1">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-blue-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report, index) => (
              <Card
                key={index}
                className="border-blue-100 hover:border-blue-300 transition-all duration-300 cursor-pointer"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <report.icon className="h-5 w-5 text-blue-600" />
                    {report.title}
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-800 mb-2">
                    {report.value}
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">
                      {report.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const classHealthStats = [
  { class: "Lớp 1A", total: 25, issues: 2 },
  { class: "Lớp 1B", total: 24, issues: 1 },
  { class: "Lớp 2A", total: 26, issues: 3 },
  { class: "Lớp 2B", total: 25, issues: 1 },
  { class: "Lớp 3A", total: 27, issues: 4 },
  { class: "Lớp 3B", total: 26, issues: 1 },
];

const medicineInventory = [
  { name: "Paracetamol 500mg", quantity: "120 viên", status: "Đầy đủ" },
  { name: "Cetirizine 10mg", quantity: "15 viên", status: "Sắp hết" },
  { name: "Salbutamol xịt", quantity: "3 ống", status: "Sắp hết" },
  { name: "Vitamin C", quantity: "200 viên", status: "Đầy đủ" },
];

const healthAlerts = [
  {
    id: "1",
    title: "Học sinh bị dị ứng thức ăn",
    student: "Nguyễn Văn An",
    class: "Lớp 1A",
    priority: "Cao",
    description:
      "Học sinh có phản ứng dị ứng sau khi ăn trưa, xuất hiện mề đay và ngứa. Cần xử lý ngay.",
  },
  {
    id: "2",
    title: "Sốt cao cần theo dõi",
    student: "Trần Thị Bình",
    class: "Lớp 2B",
    priority: "Trung bình",
    description:
      "Học sinh sốt 38.5°C, đã cho uống thuốc hạ sốt. Cần theo dõi thêm.",
  },
  {
    id: "3",
    title: "Thuốc sắp hết hạn",
    student: "Hệ thống",
    class: "Kho thuốc",
    priority: "Thấp",
    description: "5 loại thuốc sẽ hết hạn trong vòng 30 ngày tới.",
  },
];

const recentActivities = [
  {
    title: "Cập nhật hồ sơ sức khỏe",
    description: "Nguyễn Văn An - Lớp 1A đã được cập nhật kết quả khám định kỳ",
    time: "5 phút trước",
    icon: FileText,
  },
  {
    title: "Xử lý sự cố y tế",
    description:
      "Trần Thị Bình - Lớp 2B bị té ngã, đã sơ cứu và thông báo phụ huynh",
    time: "15 phút trước",
    icon: Activity,
  },
  {
    title: "Cấp phát thuốc",
    description: "Đã cấp Paracetamol cho Lê Hoàng Cường - Lớp 3C",
    time: "30 phút trước",
    icon: Pill,
  },
  {
    title: "Tiêm chủng hoàn thành",
    description: "Hoàn thành tiêm vắc-xin cúm cho 25 học sinh lớp 1A",
    time: "1 giờ trước",
    icon: Shield,
  },
];

const reports = [
  {
    title: "Tỷ lệ tiêm chủng",
    description: "Tỷ lệ hoàn thành tiêm chủng tháng này",
    value: "85%",
    trend: "+5% so với tháng trước",
    icon: Shield,
  },
  {
    title: "Sự cố y tế",
    description: "Tổng số sự cố y tế đã xử lý",
    value: "42",
    trend: "-8% so với tháng trước",
    icon: Activity,
  },
  {
    title: "Hồ sơ cập nhật",
    description: "Số hồ sơ sức khỏe được cập nhật",
    value: "156",
    trend: "+12% so với tháng trước",
    icon: FileText,
  },
];
