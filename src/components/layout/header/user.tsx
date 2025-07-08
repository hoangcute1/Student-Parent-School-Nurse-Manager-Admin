"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings2, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Notification from "./noti";
import { useAuthStore } from "@/stores/auth-store";
import { logout, getAuthToken } from "@/lib/api/auth/token";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

export default function User() {
  const router = useRouter();
  const { user, profile, isAuthenticated, role, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra nếu có token trong localStorage nhưng chưa đăng nhập
  useEffect(() => {
    const token = getAuthToken();
    if (token && !isAuthenticated) {
      setIsLoading(true);
      // Đợi một khoảng thời gian ngắn để authInit hoàn thành
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Hiển thị trạng thái loading khi đang xác thực
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  // Nếu không đăng nhập, hiển thị nút đăng nhập
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            Đăng nhập
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex">
      <Notification />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-auto gap-2 px-2 select-none"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={profile?.avatar || ""}
                alt={profile?.name || user?.email || "User"}
              />
              <AvatarFallback>
                {profile?.name
                  ? profile.name.charAt(0).toUpperCase()
                  : user?.email
                    ? user.email.charAt(0).toUpperCase()
                    : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {profile?.name || user?.email || "Người dùng"}
              </span>
              <span className="text-xs text-muted-foreground">
                {role === "admin"
                  ? "Quản trị viên"
                  : role === "staff"
                    ? "Nhân viên y tế"
                    : role === "parent"
                      ? "Phụ huynh"
                      : null}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={
                role === "parent"
                  ? "/"
                  : role === "staff"
                    ? "/cms"
                    : role === "admin"
                      ? "/admin"
                      : "/"
              }
              className="flex w-full items-center"
            >
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Trang chủ</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex w-full items-center">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Thông tin cá nhân</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />{" "}
          {(role === "admin" || role === "staff") && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/cms" className="flex w-full items-center">
                  <Settings2 className="mr-2 h-4 w-4" />
                  <span>Bảng quản lý</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {role === "parent" && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex w-full items-center">
                  <Settings2 className="mr-2 h-4 w-4" />
                  <span>Bảng điều khiển</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem
            className="cursor-pointer text-red-600"
            onSelect={() => {
              toast({
                title: "Đăng xuất thành công",
                description: "Bạn đã đăng xuất khỏi hệ thống.",
                variant: "default",
              });
              setTimeout(() => {
                logout();
                clearAuth();
                router.push("/");
              }, 1500);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
