"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Calendar, FileText, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StaffDashboardPage() {
  const quickActions = [
    {
      title: "Thêm hồ sơ sức khỏe",
      description: "Tạo hồ sơ sức khỏe mới cho học sinh",
      icon: <FileText className="h-5 w-5" />,
      href: "/dashboard/health-records/new",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Cập nhật tiêm chủng",
      description: "Cập nhật thông tin tiêm chủng cho học sinh",
      icon: <Activity className="h-5 w-5" />,
      href: "/dashboard/vaccinations",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Tạo sự kiện y tế",
      description: "Tạo sự kiện y tế mới cho trường học",
      icon: <Calendar className="h-5 w-5" />,
      href: "/dashboard/events",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Danh sách học sinh",
      description: "Xem danh sách học sinh của trường",
      icon: <Users className="h-5 w-5" />,
      href: "/dashboard/users/students",
      color: "bg-amber-100 text-amber-700",
    },
  ];

  // Demo statistics
  const stats = [
    { title: "Tổng số hồ sơ", value: "256", description: "Hồ sơ sức khỏe" },
    {
      title: "Trạng thái tiêm chủng",
      value: "92%",
      description: "Đã tiêm đầy đủ",
    },
    { title: "Sự kiện sắp tới", value: "3", description: "Trong tuần này" },
    { title: "Cần kiểm tra", value: "24", description: "Hồ sơ cần cập nhật" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.title}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Thao tác nhanh</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="overflow-hidden">
              <div className={`p-2 ${action.color}`}>{action.icon}</div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={action.href}>
                  <Button className="w-full">Truy cập</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Thông báo gần đây</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                <h3 className="font-medium">Chiến dịch tiêm chủng sắp tới</h3>
                <p className="text-sm text-muted-foreground">
                  Chiến dịch tiêm chủng sẽ được tổ chức vào tuần tới. Vui lòng
                  chuẩn bị hồ sơ và thông báo cho phụ huynh.
                </p>
              </div>
              <div className="border-l-4 border-amber-500 bg-amber-50 p-4">
                <h3 className="font-medium">Cập nhật hồ sơ mới</h3>
                <p className="text-sm text-muted-foreground">
                  24 hồ sơ mới cần được cập nhật thông tin. Vui lòng xem danh
                  sách và hoàn thành trong tuần này.
                </p>
              </div>
              <div className="border-l-4 border-green-500 bg-green-50 p-4">
                <h3 className="font-medium">Kết quả khám sức khỏe định kỳ</h3>
                <p className="text-sm text-muted-foreground">
                  Kết quả khám sức khỏe định kỳ đã được cập nhật. Vui lòng xem
                  báo cáo chi tiết tại mục hồ sơ sức khỏe.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
