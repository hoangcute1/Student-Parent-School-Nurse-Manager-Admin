"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { OTPDialog } from "./otp-dialog";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { loginParentOTP, requestParentLoginOTP } from "@/lib/api/auth";
import { LoginRequestCredentials } from "@/lib/type/auth";
import LoginGoogle from "./login-google";

export function ParentLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginRequestCredentials>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

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

  const validateForm = (data: LoginRequestCredentials): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};
    let isValid = true;

    if (!data.email) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

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
  const verifyOTP = async (otp: string) => {
    try {
      console.log("Verifying OTP in parent login:", otp);
      console.log("Using email:", formData.email);

      // Sử dụng AuthService để xác thực OTP và đăng nhập
      const success = await loginParentOTP(formData.email, otp);

      if (success) {
        toast({
          title: "Đăng nhập thành công",
          description: "Đang chuyển hướng...",
        });

        setShowOTP(false);

        // Thêm delay ngắn để đảm bảo token được lưu và xử lý đúng
        setTimeout(() => {
          // Redirect to home page
          router.push("/");
          // Tải lại trang để đảm bảo fetch lại user data
          window.location.reload();
        }, 300);
      } else {
        throw new Error("Xác thực OTP thất bại");
      }
    } catch (error) {
      console.error("OTP Verification failed:", error);
      toast({
        title: "Xác thực thất bại",
        description:
          error instanceof Error ? error.message : "Vui lòng thử lại sau",
        variant: "destructive",
      });
    }
  };
  const resendOTP = async () => {
    try {
      console.log("Resending OTP with data:", { ...formData });
      await requestParentLoginOTP({
        ...formData,
      });
      toast({
        title: "Đã gửi lại mã OTP",
        description: "Vui lòng kiểm tra email của bạn",
      });
    } catch (error) {
      throw error;
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm(formData)) return;

    setIsLoading(true);
    try {
      // First step: request OTP
      console.log("Requesting OTP with data:", { ...formData });
      await requestParentLoginOTP({
        ...formData,
      });
      setShowOTP(true);
      toast({
        title: "Thành công",
        description: "Mã OTP đã được gửi đến email của bạn",
      });
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
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đăng nhập dành cho phụ huynh</CardTitle>
        <CardDescription>
          Theo dõi sức khỏe và lịch tiêm chủng của con bạn
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
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
              placeholder="nguyenvanb@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
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
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>{" "}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex w-full gap-2">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
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
            <LoginGoogle/>
          <OTPDialog
            open={showOTP}
            onOpenChange={setShowOTP}
            onVerify={verifyOTP}
            onResend={resendOTP}
          />
        </CardFooter>
      </form>
    </Card>
  );
}
