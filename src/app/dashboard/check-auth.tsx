"use client";

import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/lib/roles";

// Kiểm tra trạng thái đăng nhập và phân quyền - Chỉ cho phép Parent
export default function CheckAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [localUser, setLocalUser] = useState<any>(null);
  const router = useRouter();
  
  // Kiểm tra localStorage ngay lập tức để xem có thông tin người dùng không
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("access_token") || localStorage.getItem("token");
        
        if (storedUser && token) {
          console.log("Đã tìm thấy thông tin người dùng trong localStorage");
          const parsedUser = JSON.parse(storedUser);
          setLocalUser(parsedUser);
          
          // Kiểm tra quyền ngay khi có thông tin từ localStorage
          const userType = parsedUser.userType || 'parent'; // Mặc định là parent nếu không có userType
          if (!hasPermission(userType, ["parent"])) {
            console.log("Người dùng không có quyền truy cập Dashboard, chuyển hướng về trang chủ");
            router.replace("/");
          }
        }
      } catch (error) {
        console.error("Lỗi khi đọc dữ liệu từ localStorage:", error);
      }
    }
  }, [router]);

  useEffect(() => {
    // Kiểm tra quyền từ API
    if (!loading && user) {
      if (!hasPermission(user.userType, ["parent"])) {
        console.log("Người dùng không có quyền truy cập Dashboard, chuyển hướng về trang chủ");
        router.replace("/");
        return;
      }
    }
    
    // Chỉ redirect khi đã kiểm tra xong, không có user từ API và không có user từ localStorage
    if (!loading && !user && !localUser) {
      console.log("Không có người dùng đã đăng nhập, chuyển hướng về login");
      router.replace("/login");
    }
  }, [user, loading, router, localUser]);
  
  // Hiển thị loading state khi đang kiểm tra xác thực
  if (loading && !localUser) {
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

  // Nếu có localUser với quyền phù hợp, hiển thị nội dung ngay lập tức
  if (localUser && hasPermission(localUser.userType || 'parent', ["parent"])) {
    return <>{children}</>;
  }

  // Nếu có user từ API với quyền phù hợp
  if (user && hasPermission(user.userType, ["parent"])) {
    return <>{children}</>;
  }

  // Nếu không có quyền phù hợp hoặc không có user
  return null;
}
