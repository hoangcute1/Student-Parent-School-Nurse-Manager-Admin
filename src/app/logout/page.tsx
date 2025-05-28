"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we're automatically logging out
    const autoLogout = new URLSearchParams(window.location.search).get("auto");
    if (autoLogout === "true") {
      handleLogout();
    }
  }, []);
  const handleLogout = () => {
    setIsLoggingOut(true);
    // Perform logout
    logout();

    // Redirect after a short delay to show the logout animation
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

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
        <Card>
          <CardHeader>
            <CardTitle>Đăng xuất</CardTitle>
            <CardDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoggingOut ? (
              <div className="flex flex-col items-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Đang đăng xuất...
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Khi đăng xuất, bạn sẽ được chuyển hướng về trang đăng nhập.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoggingOut}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              Đăng xuất
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
