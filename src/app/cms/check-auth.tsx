"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useHasRole } from "@/stores/auth-store";

// Kiểm tra trạng thái đăng nhập và phân quyền - Chỉ cho phép Staff và Admin
export default function CheckAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Nếu không đăng nhập, chuyển hướng về trang đăng nhập
    if (!isAuthenticated) {
      console.log("Không có người dùng đã đăng nhập, chuyển hướng về login");
      router.replace("/login");
      return;
    }

    // Nếu đã đăng nhập nhưng không có quyền staff hoặc admin
    if (role != "staff" && role != "admin") {
      console.log(
        "Người dùng không có quyền truy cập CMS, chuyển hướng về trang chủ"
      );
      router.replace("/");
      return;
    }
  }, [isAuthenticated, router]);

  // Hiển thị loading state khi đang kiểm tra xác thực
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-muted-foreground">
            Đang kiểm tra xác thực...
          </p>
        </div>
      </div>
    );
  }

  // Nếu có quyền phù hợp
  if (role === "staff" || role === "admin") {
    return <>{children}</>;
  }

  // Nếu không có quyền phù hợp
  return null;
}
