"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Heart, AlertCircle, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { loginUser, type LoginCredentials } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};
    let isValid = true;

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await loginUser(formData);
      
      // Save user info or token to localStorage/sessionStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response.user));
        
        // Lưu token, ưu tiên access_token nếu có
        if (response.access_token) {
          localStorage.setItem("access_token", response.access_token);
        } else if (response.token) {
          localStorage.setItem("token", response.token);
        }
        
        // Lưu refresh_token nếu có
        if (response.refresh_token) {
          localStorage.setItem("refresh_token", response.refresh_token);
        }
        
        console.log("Đã lưu thông tin đăng nhập:", {
          user: response.user,
          hasAccessToken: !!response.access_token,
          hasToken: !!response.token,
          hasRefreshToken: !!response.refresh_token
        });
      }

      // Hiển thị thông báo thành công và đợi một chút trước khi chuyển hướng
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${response.user.email} quay trở lại!`,
      });

      // Sử dụng setTimeout để đảm bảo localStorage đã được cập nhật
      setTimeout(() => {
        // Sử dụng replace thay vì push để ngăn quay lại trang login
        router.replace("/dashboard");
      }, 500);
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error?.message || "Email hoặc mật khẩu không chính xác";
      setErrors({
        general: errorMessage,
      });
      toast({
        title: "Đăng nhập thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

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
            <Card>
              <CardHeader>
                <CardTitle>Đăng nhập dành cho phụ huynh</CardTitle>
                <CardDescription>
                  Quản lý hồ sơ sức khỏe của con bạn
                </CardDescription>
              </CardHeader>
              <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">
                  {errors.general && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.general}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-blue-500 hover:underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={errors.password ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="pt-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Đăng nhập mẫu cho phụ huynh:</strong>
                    </p>
                    <p>Email: nguyenvana@example.com</p>
                    <p>Mật khẩu: password123</p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                  <p className="mt-4 text-center text-sm text-gray-500">
                    Chưa có tài khoản?{" "}
                    <Link
                      href="/register"
                      className="text-blue-500 hover:underline"
                    >
                      Đăng ký
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Đăng nhập dành cho nhân viên y tế</CardTitle>
                <CardDescription>
                  Quản lý sức khỏe học sinh và sự kiện y tế
                </CardDescription>
              </CardHeader>
              <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">
                  {errors.general && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.general}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="staff@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-blue-500 hover:underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={errors.password ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div className="pt-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Đăng nhập mẫu cho nhân viên y tế:</strong>
                    </p>
                    <p>Email: staff@example.com</p>
                    <p>Mật khẩu: staffpass</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
