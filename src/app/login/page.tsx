"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthToken } from "@/lib/auth";
import { ParentLoginForm } from "./_components/parent-login";
import { StaffLoginForm } from "./_components/staff-login";

export default function LoginPage() {
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    if (getAuthToken()) {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2"
      >
        <Heart className="h-6 w-6 text-red-500" />
        <span className="font-bold">Y Tế Học Đường</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Đăng nhập vào tài khoản
          </h1>
          <p className="text-sm text-muted-foreground">
            Nhập thông tin đăng nhập của bạn để truy cập hệ thống
          </p>
        </div>
        <Tabs defaultValue="parent" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="parent">Phụ huynh</TabsTrigger>
            <TabsTrigger value="staff">Nhân viên y tế</TabsTrigger>
          </TabsList>
          <TabsContent value="parent">
            <ParentLoginForm />
          </TabsContent>
          <TabsContent value="staff">
            <StaffLoginForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
