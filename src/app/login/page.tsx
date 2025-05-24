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
import { storeAuthData, getAuthToken } from "@/lib/auth";
import type { AuthResponse } from "@/lib/types";

export default function LoginPage() {
  const [isLoadingParent, setIsLoadingParent] = useState<boolean>(false);
  const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(false);
  const [parentFormData, setParentFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [staffFormData, setStaffFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("parent");
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    if (getAuthToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const validateForm = (data: LoginCredentials): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};
    let isValid = true;

    // Email validation
    if (!data.email) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    // Password validation
    if (!data.password) {
      newErrors.password = "Mật khẩu không được để trống";
      isValid = false;
    } else if (data.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setParentFormData((prev) => ({
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

  const handleStaffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setStaffFormData((prev) => ({
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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    formData: LoginCredentials,
    role: "parent" | "staff"
  ) => {
    e.preventDefault();

    // Set loading state based on role
    if (role === "parent") {
      setIsLoadingParent(true);
    } else {
      setIsLoadingStaff(true);
    }

    try {
      // Add role to credentials
      const credentials = { ...formData, role };

      // Login user
      const response = await loginUser(credentials);

      // Store auth data
      storeAuthData(response);

      // Show success message
      toast({
        title: "Đăng nhập thành công",
        description: "Đang chuyển hướng...",
      });

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      let message = "Có lỗi xảy ra khi đăng nhập";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          message = "Email hoặc mật khẩu không chính xác";
        } else if (error.message.includes("403")) {
          message = "Tài khoản của bạn không có quyền truy cập";
        }
      }

      setErrors({ general: message });
      toast({
        variant: "destructive",
        title: "Đăng nhập thất bại",
        description: message,
      });
    } finally {
      // Reset loading state
      if (role === "parent") {
        setIsLoadingParent(false);
      } else {
        setIsLoadingStaff(false);
      }
    }
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
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Đăng nhập vào tài khoản
          </h1>
          <p className="text-sm text-muted-foreground">
            Nhập thông tin đăng nhập của bạn để truy cập hệ thống
          </p>
        </div>
        <Tabs
          defaultValue="parent"
          className="w-full"
          onValueChange={(value) => {
            setActiveTab(value);
            // Reset form data and errors when switching tabs
            if (value === "parent") {
              setParentFormData({ email: "", password: "" });
            } else {
              setStaffFormData({ email: "", password: "" });
            }
            setErrors({});
          }}
        >
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
              <form
                onSubmit={(e) => handleSubmit(e, parentFormData, "parent")}
              >
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
                      value={parentFormData.email}
                      onChange={handleParentChange}
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
                        value={parentFormData.password}
                        onChange={handleParentChange}
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
                  <div className="flex w-full gap-2">
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={isLoadingParent}
                    >
                      {isLoadingParent ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                    <Button
                      className="w-full"
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/")}
                    >
                      Quay lại
                    </Button>
                  </div>
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
              <form onSubmit={(e) => handleSubmit(e, staffFormData, "staff")}>
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
                      value={staffFormData.email}
                      onChange={handleStaffChange}
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
                        value={staffFormData.password}
                        onChange={handleStaffChange}
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
                  <div className="flex w-full gap-2">
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={isLoadingStaff}
                    >
                      {isLoadingStaff ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                    <Button
                      className="w-full"
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/")}
                    >
                      Quay lại
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
