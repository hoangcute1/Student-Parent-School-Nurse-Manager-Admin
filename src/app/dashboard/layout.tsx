import type React from "react"
import Link from "next/link"
import {
  Bell,
  Calendar,
  FileText,
  Heart,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <Home className="h-5 w-5" />
                Trang chủ
              </Link>
              <Link
                href="/dashboard/health-records"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <FileText className="h-5 w-5" />
                Hồ sơ sức khỏe
              </Link>
              <Link
                href="/dashboard/events"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <Shield className="h-5 w-5" />
                Sự kiện y tế
              </Link>
              <Link
                href="/dashboard/vaccinations"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <Calendar className="h-5 w-5" />
                Tiêm chủng
              </Link>
              <Link
                href="/dashboard/messages"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <MessageSquare className="h-5 w-5" />
                Tin nhắn
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <User className="h-5 w-5" />
                Hồ sơ
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <Settings className="h-5 w-5" />
                Cài đặt
              </Link>
            </nav>
            <div className="mt-auto">
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogOut className="h-5 w-5" />
                Đăng xuất
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          <Link href="/" className="font-bold">
            Y Tế Học Đường
          </Link>
        </div>
        <div className="flex-1"></div>
        <Button variant="outline" size="icon" className="rounded-full">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Thông báo</span>
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <User className="h-4 w-4" />
          <span className="sr-only">Tài khoản</span>
        </Button>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-gray-50/40 md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <nav className="grid gap-1 text-sm font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <Home className="h-4 w-4" />
                Trang chủ
              </Link>
              <Link
                href="/dashboard/health-records"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <FileText className="h-4 w-4" />
                Hồ sơ sức khỏe
              </Link>
              <Link
                href="/dashboard/events"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <Shield className="h-4 w-4" />
                Sự kiện y tế
              </Link>
              <Link
                href="/dashboard/vaccinations"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <Calendar className="h-4 w-4" />
                Tiêm chủng
              </Link>
              <Link
                href="/dashboard/messages"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <MessageSquare className="h-4 w-4" />
                Tin nhắn
              </Link>
            </nav>
            <div className="mt-auto space-y-2">
              <nav>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
                >
                  <User className="h-4 w-4" />
                  Hồ sơ
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
                >
                  <Settings className="h-4 w-4" />
                  Cài đặt
                </Link>
              </nav>
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
