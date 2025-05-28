"use client";

import { User } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Baby, Book, Calendar, Activity, FileText, Shield } from "lucide-react";
import Link from "next/link";


interface ParentDashboardProps {
  user: User;
}

export function ParentDashboard({ user }: ParentDashboardProps) {
  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bảng điều khiển
          </h1>
          <p className="text-gray-500">
            Quản lý thông tin sức khỏe của con bạn
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/children">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <Baby className="h-8 w-8 text-pink-500" />
              <div>
                <CardTitle>Quản lý con</CardTitle>
                <CardDescription>Thêm và quản lý thông tin con</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Thêm thông tin con, cập nhật hồ sơ và quản lý thông tin cá nhân
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/health">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <CardTitle>Tổng quan sức khỏe</CardTitle>
                <CardDescription>
                  Xem tổng quan thông tin sức khỏe
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>Xem tổng quan về thông tin sức khỏe, tiêm chủng và sự kiện</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/vaccinations">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <Shield className="h-8 w-8 text-green-500" />
              <div>
                <CardTitle>Tiêm chủng</CardTitle>
                <CardDescription>
                  Theo dõi lịch sử và kế hoạch tiêm chủng
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>Quản lý thông tin về vắc xin và lịch tiêm chủng</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/events">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div>
                <CardTitle>Sự kiện y tế</CardTitle>
                <CardDescription>
                  Lịch khám sức khỏe và sự kiện y tế
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>Xem lịch khám sức khỏe định kỳ và sự kiện y tế</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/growth">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <Activity className="h-8 w-8 text-red-500" />
              <div>
                <CardTitle>Biểu đồ tăng trưởng</CardTitle>
                <CardDescription>
                  Theo dõi sự phát triển của con
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>Xem biểu đồ tăng trưởng chiều cao, cân nặng</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/reports">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <Book className="h-8 w-8 text-amber-500" />
              <div>
                <CardTitle>Báo cáo y tế</CardTitle>
                <CardDescription>Xem báo cáo y tế trường học</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>Truy cập báo cáo khám sức khỏe định kỳ</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
