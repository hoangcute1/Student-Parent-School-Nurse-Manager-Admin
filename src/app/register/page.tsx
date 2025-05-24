"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Info } from "lucide-react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [formStep, setFormStep] = useState<number>(0);
  const router = useRouter();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (confirmPassword) {
      setPasswordMatch(e.target.value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Redirect using router after successful registration
      router.push("/dashboard");
    }, 1500);
  }

  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-10">
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2"
      >
        <Heart className="h-6 w-6 text-red-500" />
        <span className="font-bold">Y Tế Học Đường</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Đăng ký tài khoản
          </h1>
          <p className="text-sm text-muted-foreground">
            Tạo tài khoản để sử dụng hệ thống quản lý y tế học đường
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
                <CardTitle>Đăng ký dành cho phụ huynh</CardTitle>
                <CardDescription>
                  Tạo tài khoản để quản lý hồ sơ sức khỏe của con bạn
                </CardDescription>
              </CardHeader>
              <form onSubmit={onSubmit}>
                <CardContent>
                  {formStep === 0 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên</Label>
                        <Input
                          id="fullName"
                          placeholder="Nguyễn Văn A"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="0912345678"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Xác nhận mật khẩu
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={handleConfirmPasswordChange}
                          required
                        />
                        {!passwordMatch && confirmPassword && (
                          <p className="text-sm text-red-500">
                            Mật khẩu không khớp
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {formStep === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Thông tin học sinh</Label>
                        <p className="text-sm text-gray-500">
                          Thêm thông tin cơ bản về học sinh
                        </p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="studentName">
                                Họ và tên học sinh
                              </Label>
                              <Input
                                id="studentName"
                                placeholder="Nguyễn Văn B"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="studentDob">Ngày sinh</Label>
                              <Input id="studentDob" type="date" required />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="studentClass">Lớp</Label>
                              <Select>
                                <SelectTrigger id="studentClass">
                                  <SelectValue placeholder="Chọn lớp" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1A">1A</SelectItem>
                                  <SelectItem value="1B">1B</SelectItem>
                                  <SelectItem value="2A">2A</SelectItem>
                                  <SelectItem value="2B">2B</SelectItem>
                                  <SelectItem value="3A">3A</SelectItem>
                                  <SelectItem value="3B">3B</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="studentGender">Giới tính</Label>
                              <RadioGroup
                                id="studentGender"
                                defaultValue="male"
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="male" id="male" />
                                  <Label htmlFor="male">Nam</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="female" id="female" />
                                  <Label htmlFor="female">Nữ</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="studentId">
                              Mã học sinh (nếu có)
                            </Label>
                            <Input id="studentId" placeholder="HS12345" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="addMore" />
                        <label
                          htmlFor="addMore"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Thêm học sinh khác
                        </label>
                      </div>
                    </div>
                  )}

                  {formStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Xác nhận thông tin</Label>
                        <p className="text-sm text-gray-500">
                          Vui lòng kiểm tra lại thông tin trước khi hoàn tất
                          đăng ký
                        </p>
                      </div>
                      <div className="rounded-lg border p-4 space-y-4">
                        <div>
                          <h3 className="font-medium">Thông tin tài khoản</h3>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Họ và tên:</span>{" "}
                              Nguyễn Văn A
                            </div>
                            <div>
                              <span className="font-medium">Email:</span>{" "}
                              example@email.com
                            </div>
                            <div>
                              <span className="font-medium">
                                Số điện thoại:
                              </span>{" "}
                              0912345678
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium">Thông tin học sinh</h3>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Họ và tên:</span>{" "}
                              Nguyễn Văn B
                            </div>
                            <div>
                              <span className="font-medium">Ngày sinh:</span>{" "}
                              01/01/2015
                            </div>
                            <div>
                              <span className="font-medium">Lớp:</span> 3A
                            </div>
                            <div>
                              <span className="font-medium">Giới tính:</span>{" "}
                              Nam
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox id="terms" required />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Tôi đồng ý với các điều khoản và điều kiện
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Bằng cách đăng ký, bạn đồng ý với{" "}
                            <Link href="#" className="text-primary underline">
                              Điều khoản dịch vụ
                            </Link>{" "}
                            và{" "}
                            <Link href="#" className="text-primary underline">
                              Chính sách bảo mật
                            </Link>{" "}
                            của chúng tôi.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {formStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormStep(formStep - 1)}
                    >
                      Quay lại
                    </Button>
                  )}
                  {formStep === 0 && (
                    <div className="flex w-full justify-between">
                      <Link href="/login">
                        <Button variant="link" type="button">
                          Đã có tài khoản? Đăng nhập
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        onClick={() => setFormStep(1)}
                        disabled={
                          !password || !confirmPassword || !passwordMatch
                        }
                      >
                        Tiếp theo
                      </Button>
                    </div>
                  )}
                  {formStep === 1 && (
                    <Button type="button" onClick={() => setFormStep(2)}>
                      Tiếp theo
                    </Button>
                  )}
                  {formStep === 2 && (
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Đang đăng ký..." : "Hoàn tất đăng ký"}
                    </Button>
                  )}
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Đăng ký dành cho nhân viên y tế</CardTitle>
                <CardDescription>
                  Tạo tài khoản để quản lý sức khỏe học sinh và sự kiện y tế
                </CardDescription>
              </CardHeader>
              <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-800">
                          Lưu ý quan trọng
                        </h3>
                        <p className="text-sm text-yellow-700">
                          Tài khoản nhân viên y tế cần được xác thực bởi quản
                          trị viên trước khi có thể sử dụng đầy đủ chức năng.
                          Vui lòng liên hệ với quản trị viên sau khi đăng ký.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffId">Mã nhân viên</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative">
                            <Input
                              id="staffId"
                              placeholder="NV12345"
                              required
                            />
                            <Info className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            Mã nhân viên do nhà trường cấp. Nếu bạn chưa có, vui
                            lòng liên hệ với quản trị viên.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffFullName">Họ và tên</Label>
                    <Input
                      id="staffFullName"
                      placeholder="Nguyễn Thị Y Tá"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffEmail">Email</Label>
                    <Input
                      id="staffEmail"
                      type="email"
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffPhone">Số điện thoại</Label>
                    <Input
                      id="staffPhone"
                      type="tel"
                      placeholder="0912345678"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffPosition">Vị trí công tác</Label>
                    <Select>
                      <SelectTrigger id="staffPosition">
                        <SelectValue placeholder="Chọn vị trí" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nurse">Y tá</SelectItem>
                        <SelectItem value="doctor">Bác sĩ</SelectItem>
                        <SelectItem value="admin">Quản lý y tế</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffPassword">Mật khẩu</Label>
                    <Input id="staffPassword" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffConfirmPassword">
                      Xác nhận mật khẩu
                    </Label>
                    <Input id="staffConfirmPassword" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffCertificate">
                      Chứng chỉ hành nghề (nếu có)
                    </Label>
                    <Input
                      id="staffCertificate"
                      placeholder="Số chứng chỉ hành nghề"
                    />
                  </div>
                  <div className="pt-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox id="staffTerms" required />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="staffTerms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Tôi đồng ý với các điều khoản và điều kiện
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Bằng cách đăng ký, bạn đồng ý với{" "}
                          <Link href="#" className="text-primary underline">
                            Điều khoản dịch vụ
                          </Link>{" "}
                          và{" "}
                          <Link href="#" className="text-primary underline">
                            Chính sách bảo mật
                          </Link>{" "}
                          của chúng tôi.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href="/login">
                    <Button variant="link" type="button">
                      Đã có tài khoản? Đăng nhập
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang đăng ký..." : "Đăng ký"}
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
