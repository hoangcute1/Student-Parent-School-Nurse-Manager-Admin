"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/lib/roles";
import { useAuthStore } from "@/stores/auth-store";

// Kiểm tra trạng thái đăng nhập và phân quyền - Chỉ cho phép Parent
export default function CheckAuth({ children }: { children: React.ReactNode }) {
  const { user, role, isAuthenticated } = useAuthStore();
  const router = useRouter();
  console.log("Kiểm tra quyền truy cập Dashboard", role);
  useEffect(() => {
    // Nếu không đăng nhập, chuyển hướng về trang đăng nhập
    if (!isAuthenticated) {
      console.log("Không có người dùng đã đăng nhập, chuyển hướng về login");
      router.replace("/login");
      return;
    }

    if (user) {
      if (role != "parent") {
        console.log(
          "Người dùng không có quyền truy cập Dashboard, chuyển hướng về trang chủ", role
        );
        router.replace("/");
        return;
      }
    }

    // Chỉ redirect khi đã kiểm tra xong, không có user từ API và không có user từ localStorage
    if (!user) {
      console.log("Không có người dùng đã đăng nhập, chuyển hướng về login");
      router.replace("/login");
    }
  }, [user, router]);

  return <>{children}</>;
}
