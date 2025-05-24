import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Eye, EyeOff, Link } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { LoginCredentials } from "@/lib/api";
import { useState } from "react";

interface ParentLoginProps {
  handleSubmit: (e: React.FormEvent, formData: any, type: string) => void;
  parentFormData: {
    email: string;
    password: string;
  };
  handleParentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: {
    general?: string;
    email?: string;
    password?: string;
  };
  setErrors: React.Dispatch<
    React.SetStateAction<{
      general?: string;
      email?: string;
      password?: string;
    }>
  >;
  isLoadingParent: boolean;
  toggleShowPassword: () => void;
  showPassword: boolean;
}

export default function ParentLogIn({
  handleSubmit,
  isLoadingParent,
  toggleShowPassword,
  showPassword,
  parentFormData,
  errors,
  setErrors,
}: ParentLoginProps) {
  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const [parentFormData, setParentFormData] = useState<LoginCredentials>({
      email: "",
      password: "",
    });
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
  const Router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Đăng nhập dành cho phụ huynh</CardTitle>
        <CardDescription>Quản lý hồ sơ sức khỏe của con bạn</CardDescription>
      </CardHeader>
      <form onSubmit={(e) => handleSubmit(e, parentFormData, "parent")}>
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
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
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
            <Button className="w-full" type="submit" disabled={isLoadingParent}>
              {isLoadingParent ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
            <Button
              className="w-full"
              type="button"
              variant="outline"
              onClick={() => Router.push("/")}
            >
              Quay lại
            </Button>
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Đăng ký
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
