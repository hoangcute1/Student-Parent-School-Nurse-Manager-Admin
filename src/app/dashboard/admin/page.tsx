"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUsers, User } from "@/lib/api";
import { Users, ShieldCheck, UserCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    parentUsers: 0,
    staffUsers: 0,
    adminUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth("admin");

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const users = await getUsers();

        setStats({
          totalUsers: users.length,
          parentUsers: users.filter((user) => user.role === "parent").length,
          staffUsers: users.filter((user) => user.role === "staff").length,
          adminUsers: users.filter((user) => user.role === "admin").length,
        });
      } catch (error) {
        console.error("Không thể tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (!user) return null;

  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Bảng điều khiển quản trị</h1>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <p className="ml-2 text-muted-foreground">Đang tải thống kê...</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tổng số người dùng
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-foreground">
                  {stats.totalUsers}
                </CardDescription>
              </div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Tất cả người dùng đã đăng ký trong hệ thống
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Phụ huynh
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-foreground">
                  {stats.parentUsers}
                </CardDescription>
              </div>
              <UserCircle className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Phụ huynh học sinh
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Nhân viên
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-foreground">
                  {stats.staffUsers}
                </CardDescription>
              </div>
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Nhân viên y tế trường học
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Quản trị viên
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-foreground">
                  {stats.adminUsers}
                </CardDescription>
              </div>
              <ShieldCheck className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Quản trị viên hệ thống
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-8 rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-bold">Quyền hạn quản trị</h2>
        <p className="text-muted-foreground">
          Với tư cách quản trị viên, bạn có toàn quyền truy cập vào hệ thống.
          Bạn có thể:
        </p>
        <ul className="mt-4 list-inside list-disc space-y-2 text-muted-foreground">
          <li>Quản lý tất cả người dùng và vai trò của họ</li>
          <li>Xem và cập nhật cài đặt hệ thống</li>
          <li>Theo dõi hoạt động và nhật ký hệ thống</li>
          <li>Quản lý hồ sơ sức khỏe và tiêm chủng</li>
          <li>Tạo và quản lý sự kiện, thông báo</li>
        </ul>
      </div>
    </div>
  );
}
