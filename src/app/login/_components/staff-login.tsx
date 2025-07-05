"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { OTPDialog } from "./otp-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { loginStaffOTP, requestStaffLoginOTP } from "@/lib/api/auth";
import { LoginRequestCredentials } from "@/lib/type/auth";
import LoginGoogle from "./login-google";

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
      console.log("Verifying OTP in staff login:", otp);
      console.log("Using email:", formData.email);

      // Hiển thị loading trước khi xác thực
      toast({
        title: "Đang xác thực",
        description: "Vui lòng đợi trong giây lát...",
      });

      // Sử dụng AuthService để xác thực OTP và đăng nhập
      const { success } = await loginStaffOTP(formData.email, otp);

      if (success) {
        toast({
          title: "Đăng nhập thành công",
          description: "Đang chuyển hướng...",
        });
        router.push("/cms");
        setShowOTP(false);
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
      await requestStaffLoginOTP({
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
      // Hiển thị thông tin chi tiết hơn để debug
      console.log("Đang yêu cầu OTP cho staff login với dữ liệu:", {
        email: formData.email,
        passwordProvided: formData.password ? "Yes" : "No",
        passwordLength: formData.password.length,
      });

      // First step: request OTP
      const result = await requestStaffLoginOTP({
        ...formData,
      });
      console.log("Kết quả yêu cầu OTP:", result);

      setShowOTP(true);
      toast({
        title: "Thành công",
        description: "Mã OTP đã được gửi đến email của bạn",
      });
    } catch (error) {
      console.error("Login error:", error);
      let message = "Có lỗi xảy ra khi đăng nhập";

      if (error instanceof Error) {
        console.error("Chi tiết lỗi:", error.message);
        if (error.message.includes("401")) {
          message = "Email hoặc mật khẩu không chính xác";
        } else if (error.message.includes("403")) {
          message = "Tài khoản của bạn không có quyền truy cập";
        } else if (error.message.includes("404")) {
          message = "Không tìm thấy tài khoản với email này";
        } else if (error.message.includes("network")) {
          message =
            "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-sky-700 to-gray-900 bg-clip-text text-transparent mb-2">
          Đăng nhập dành cho nhân viên y tế
        </h3>
        <p className="text-gray-600 text-sm">
          Quản lý và theo dõi sức khỏe học sinh
        </p>
      </div>

      {/* Error Alert */}
      {errors.general && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{errors.general}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-sky-500">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-sky-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <Input
              id="email"
              type="email"
              placeholder="nguyenvanb@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className={`pl-10 h-12 border-gray-300 focus:border-sky-500 focus:ring-sky-500 transition-all duration-200 hover:border-sky-300 ${
                errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Mật khẩu
            </Label>
            <Link
              href="/forgot-password"
              className="text-sm text-sky-600 hover:text-sky-800 font-medium transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-sky-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Nhập mật khẩu của bạn"
              className={`pl-10 pr-12 h-12 border-gray-300 focus:border-sky-500 focus:ring-sky-500 transition-all duration-200 hover:border-sky-300 ${
                errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-4 pt-2">
          <Button
            className="w-full h-12 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang đăng nhập...
              </div>
            ) : (
              "Đăng nhập"
            )}
          </Button>

          <Button
            className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors"
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
          >
            Quay lại
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Hoặc</span>
          </div>
        </div>

        {/* Google Login */}
        <div className="w-full">
          <LoginGoogle/>
        </div>
      </form>

      {/* OTP Dialog */}
      <OTPDialog
        open={showOTP}
        onOpenChange={setShowOTP}
        onVerify={verifyOTP}
        onResend={resendOTP}
      />
    </div>
  );
}
