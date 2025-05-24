"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  FileText,
  MessageSquare,
  Shield,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth, logout } from "@/lib/auth";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    records: 128,
    events: 24,
    vaccinations: 56,
    medicalChecks: 32,
  });

  // Lấy thông tin thống kê (trong ứng dụng thực tế sẽ gọi API)
  useEffect(() => {
    if (user) {
      // Ở đây có thể gọi API để lấy thống kê thực tế
      // Ví dụ: const fetchStats = async () => { const data = await fetch('/api/stats'); setStats(await data.json()); }
      // fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
          <p className="text-gray-500">
            Xem tổng quan về các hoạt động y tế học đường
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Hồ sơ sức khỏe
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.records}</div>
            <p className="text-xs text-gray-500">Hồ sơ đã khai báo</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/health-records" className="w-full">
              <Button variant="outline" className="w-full">
                Xem chi tiết
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sự kiện y tế</CardTitle>
            <Shield className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.events}</div>
            <p className="text-xs text-gray-500">Sự kiện trong tháng</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/events" className="w-full">
              <Button variant="outline" className="w-full">
                Xem chi tiết
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tiêm chủng</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vaccinations}</div>
            <p className="text-xs text-gray-500">Đợt tiêm sắp tới</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/vaccinations" className="w-full">
              <Button variant="outline" className="w-full">
                Xem chi tiết
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tin nhắn</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500">Tin nhắn chưa đọc</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/messages" className="w-full">
              <Button variant="outline" className="w-full">
                Xem chi tiết
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Sự kiện sắp tới</CardTitle>
            <CardDescription>
              Các hoạt động y tế sắp diễn ra tại trường
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Kiểm tra sức khỏe định kỳ - Học kỳ 1",
                  date: "20/05/2025",
                  description:
                    "Kiểm tra sức khỏe tổng quát cho học sinh khối 1, 5, 9",
                },
                {
                  title: "Tiêm chủng vắc-xin phòng cúm",
                  date: "25/05/2025",
                  description:
                    "Tiêm chủng cho học sinh đã đăng ký và được phụ huynh đồng ý",
                },
                {
                  title: "Tư vấn dinh dưỡng học đường",
                  date: "01/06/2025",
                  description:
                    "Chương trình tư vấn dinh dưỡng cho phụ huynh và học sinh",
                },
              ].map((event, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-lg border p-4"
                >
                  <div className="grid place-items-center rounded-lg bg-gray-100 p-3">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="grid gap-1">
                    <h3 className="font-semibold">{event.title}</h3>
                    <time className="text-sm text-gray-500">{event.date}</time>
                    <p className="text-sm text-gray-500">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Xem tất cả sự kiện
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Thông báo mới</CardTitle>
            <CardDescription>
              Các thông báo gần đây từ nhà trường
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Cập nhật quy trình xử lý sự cố y tế",
                  time: "2 giờ trước",
                },
                {
                  title: "Thông báo về dịch bệnh mùa hè",
                  time: "1 ngày trước",
                },
                {
                  title: "Lịch kiểm tra sức khỏe định kỳ",
                  time: "3 ngày trước",
                },
                {
                  title: "Hướng dẫn khai báo hồ sơ sức khỏe",
                  time: "1 tuần trước",
                },
              ].map((notification, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-100">
                    <span className="text-xs font-bold text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Xem tất cả thông báo
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
