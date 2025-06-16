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
import {
  requestStaffLoginOTP,
  requestAdminLoginOTP,
  type LoginRequestCredentials,
} from "@/lib/api/api";
import { loginStaffOTP, loginAdminOTP } from "@/lib/api/auth";

export function StaffLoginForm() {
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
  };  const verifyOTP = async (otp: string) => {
    try {
      console.log(`Verifying OTP:`, otp);
      console.log("Using email:", formData.email);

      // Thử đăng nhập cả staff và admin song song
      let staffPromise = loginStaffOTP(formData.email, otp).catch(error => {
        console.log("Staff login failed:", error);
        return null;
      });
      
      let adminPromise = loginAdminOTP(formData.email, otp).catch(error => {
        console.log("Admin login failed:", error);
        return null;
      });
      
      // Chờ cả hai kết quả
      const [staffResult, adminResult] = await Promise.all([
        staffPromise,
        adminPromise
      ]);
      
      // Kiểm tra kết quả
      if (staffResult === true) {
        toast({
          title: "Đăng nhập thành công (Nhân viên y tế)",
          description: "Đang chuyển hướng...",
        });
        setShowOTP(false);
        router.push("/cms");
        return;
      }
      
      if (adminResult === true) {
        toast({
          title: "Đăng nhập thành công (Quản trị viên)",
          description: "Đang chuyển hướng...",
        });
        setShowOTP(false);
        router.push("/cms");
        return;
      }
      
      // Nếu cả hai đều thất bại
      throw new Error("Xác thực OTP thất bại. Email hoặc OTP không hợp lệ.");
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
      // Thử gửi OTP cho cả staff và admin song song
      let staffPromise = requestStaffLoginOTP({
        ...formData,
      }).catch(error => {
        console.log("Failed to resend staff OTP:", error);
        return null;
      });
      
      let adminPromise = requestAdminLoginOTP({
        ...formData,
      }).catch(error => {
        console.log("Failed to resend admin OTP:", error);
        return null;
      });
      
      // Chờ cả hai kết quả
      const [staffResult, adminResult] = await Promise.all([
        staffPromise,
        adminPromise
      ]);
      
      // Kiểm tra nếu ít nhất một loại OTP đã gửi thành công
      if (staffResult || adminResult) {
        toast({
          title: "Đã gửi lại mã OTP",
          description: "Vui lòng kiểm tra email của bạn",
        });
      } else {
        throw new Error("Không thể gửi lại OTP");
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi lại mã OTP",
        variant: "destructive",
      });
    }
  };const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm(formData)) return;

    setIsLoading(true);
    try {
      // Thử gửi OTP cho cả staff và admin song song
      let staffPromise = requestStaffLoginOTP({
        ...formData,
      }).catch(error => {
        console.log("Failed to send staff OTP:", error);
        return null;
      });
      
      let adminPromise = requestAdminLoginOTP({
        ...formData,
      }).catch(error => {
        console.log("Failed to send admin OTP:", error);
        return null;
      });
      
      // Chờ cả hai kết quả
      const [staffResult, adminResult] = await Promise.all([
        staffPromise,
        adminPromise
      ]);
      
      // Kiểm tra nếu ít nhất một loại OTP đã gửi thành công
      if (staffResult || adminResult) {
        setShowOTP(true);
        toast({
          title: "Thành công",
          description: "Mã OTP đã được gửi đến email của bạn",
        });
      } else {
        throw new Error("Không thể gửi OTP. Email hoặc mật khẩu không hợp lệ.");
      }
    } catch (error) {
      console.error("Login error:", error);
      let message = "Có lỗi xảy ra khi đăng nhập";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          message = "Email hoặc mật khẩu không chính xác";
        } else if (error.message.includes("403")) {
          message = "Tài khoản của bạn không có quyền truy cập";
        } else {
          message = error.message;
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
      {" "}
      <CardHeader>
        <CardTitle>Đăng nhập Portal Quản lý</CardTitle>
        <CardDescription>
          Quản lý sức khỏe học sinh và sự kiện y tế
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
            <Label htmlFor="email">Email</Label>{" "}
            <Input
              id="email"
              type="email"
              placeholder="nhập email đăng nhập"
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
          </div>
        </CardContent>
        <CardFooter>
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
