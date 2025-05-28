"use client";

import Link from "next/link";
import { FileText, Shield, Calendar, Baby, Activity, Book } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User, UserProfile } from "@/lib/types";

export function ParentDashboard({
  user,
  profile,
}: {
  user: User | null;
  profile: UserProfile | null;
}) {
  return (
    <section
      id="parent-dashboard"
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-2">
            Xin chào, {profile?.name || "Phụ huynh"}
          </h2>
          <p className="text-gray-600 max-w-[800px] mx-auto">
            Quản lý thông tin sức khỏe và theo dõi học sinh của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/health-records">
            <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <CardTitle>Hồ sơ sức khỏe</CardTitle>
                  <CardDescription>
                    Quản lý thông tin sức khỏe của con bạn
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>
                  Xem và cập nhật hồ sơ sức khỏe, lịch sử bệnh tật và thông tin
                  y tế khác
                </p>
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
                <p>
                  Quản lý thông tin về vắc xin, lịch tiêm chủng và nhận thông
                  báo nhắc nhở
                </p>
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
                <p>
                  Xem lịch khám sức khỏe định kỳ, sự kiện y tế tại trường và
                  đăng ký tham gia
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/children">
            <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <Baby className="h-8 w-8 text-pink-500" />
                <div>
                  <CardTitle>Quản lý con</CardTitle>
                  <CardDescription>
                    Thêm và quản lý thông tin con
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>
                  Thêm thông tin con, cập nhật hồ sơ và quản lý thông tin cá
                  nhân
                </p>
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
                <p>
                  Xem biểu đồ tăng trưởng chiều cao, cân nặng và các chỉ số sức
                  khỏe khác
                </p>
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
                <p>
                  Truy cập báo cáo khám sức khỏe định kỳ, thống kê và kết quả y
                  tế của con
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}
