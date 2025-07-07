"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParentLoginForm } from "./_components/parent-login";
import { StaffLoginForm } from "./_components/staff-login";
import { useAuthStore } from "@/stores/auth-store";
import { AdminLoginForm } from "./_components/admin-login";

export default function LoginPage() {
  const router = useRouter();
  const { profile, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      console.log(profile, user, isAuthenticated);
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-sky-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-blue-100 rounded-full opacity-15 animate-bounce" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-sky-50 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-20 right-1/3 w-48 h-48 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-sky-200 rounded-full opacity-30 animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Header với logo */}
      <div className="mb-8 text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="relative p-3 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
            <Heart className="h-8 w-8 text-white transition-all duration-300 group-hover:scale-110" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-3xl font-bold bg-gradient-to-r from-sky-700 via-blue-600 to-sky-700 bg-clip-text text-transparent">
              Y Tế Học Đường
            </span>
            <span className="text-sm text-sky-600 font-medium opacity-80">
              Chăm sóc sức khỏe học sinh
            </span>
          </div>
        </Link>
      </div>

      {/* Main content */}
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-sky-700 to-gray-900 bg-clip-text text-transparent mb-3">
            Đăng nhập vào tài khoản
          </h1>
          <p className="text-gray-600 text-lg">
            Nhập thông tin đăng nhập của bạn để truy cập hệ thống
          </p>
        </div>

        {/* Card container với shadow đẹp hơn */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-sky-100 overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
          {/* Tabs header */}
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-200">
            <Tabs defaultValue="parent" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto rounded-none">
                <TabsTrigger
                  value="parent"
                  className="py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-sky-500 data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-none bg-transparent hover:bg-white/50 transition-all duration-200"
                >
                  <div className="text-center">
                    <div className="font-semibold">Phụ huynh</div>
                    <div className="text-xs opacity-70 mt-1">Theo dõi con em</div>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="staff"
                  className="py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-sky-500 data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-none bg-transparent hover:bg-white/50 transition-all duration-200"
                >
                  <div className="text-center">
                    <div className="font-semibold">Nhân viên y tế</div>
                    <div className="text-xs opacity-70 mt-1">Chăm sóc học sinh</div>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-sky-500 data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-none bg-transparent hover:bg-white/50 transition-all duration-200"
                >
                  <div className="text-center">
                    <div className="font-semibold">Nhân viên quản lý</div>
                    <div className="text-xs opacity-70 mt-1">Quản trị hệ thống</div>
                  </div>
                </TabsTrigger>
              </TabsList>
              
              {/* Content với padding đẹp hơn */}
              <div className="p-8">
                <TabsContent value="parent" className="mt-0">
                  <ParentLoginForm />
                </TabsContent>
                <TabsContent value="staff" className="mt-0">
                  <StaffLoginForm />
                </TabsContent>
                <TabsContent value="admin" className="mt-0">
                  <AdminLoginForm />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-sky-600 transition-colors duration-200">
              Chính sách bảo mật
            </Link>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <Link href="/terms" className="hover:text-sky-600 transition-colors duration-200">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
