"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect would happen here after successful login
    }, 1000)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <Heart className="h-6 w-6 text-red-500" />
        <span className="font-bold">Y Tế Học Đường</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập vào tài khoản</h1>
          <p className="text-sm text-muted-foreground">Nhập thông tin đăng nhập của bạn để truy cập hệ thống</p>
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
                <CardDescription>Quản lý hồ sơ sức khỏe của con bạn</CardDescription>
              </CardHeader>
              <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="example@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <Link href="/forgot-password" className="text-xs text-blue-500 hover:underline">
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <Input id="password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                  <p className="mt-4 text-center text-sm text-gray-500">
                    Chưa có tài khoản?{" "}
                    <Link href="/register" className="text-blue-500 hover:underline">
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
                <CardDescription>Quản lý sức khỏe học sinh và sự kiện y tế</CardDescription>
              </CardHeader>
              <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staff-id">Mã nhân viên</Label>
                    <Input id="staff-id" placeholder="NV12345" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="staff-password">Mật khẩu</Label>
                      <Link href="/forgot-password" className="text-xs text-blue-500 hover:underline">
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <Input id="staff-password" type="password" required />
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
  )
}
