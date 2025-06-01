import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Heart,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  User,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const navLinks = [
    { href: "/dashboard", icon: Home, label: "Tổng quát" },
    {
      href: "/dashboard/health-records",
      icon: Heart,
      label: "Hồ sơ sức khỏe",
      description: "Trang chủ và thông tin con em",
    },
    {
      href: "/dashboard/medications",
      icon: Heart,
      label: "Gui thuoc",
      description: "Gửi thuốc cho con em",
    },
    {
      href: "/dashboard/health-results",
      icon: Heart,
      label: "Ket qua kham",
      description: "kết quả khám của con em",
    },
    // {
    //   href: "/dashboard/resources",
    //   icon: Users,
    //   label: "Lich su benh an",
    //   description: "Thông tin và hướng dẫn sức khỏe",
    // },
    // {
    //   href: "/dashboard/events",
    //   icon: Heart,
    //   label: "Su kien y te",
    //   description: "Sự kiện y tế và thông báo",
    // },
    // {
    //   href: "/dashboard/feedback",
    //   icon: Heart,
    //   label: "Phan hoi",
    //   description: "Gửi phản hồi và ý kiến",
    // },
  ];
  return (
    <aside
      className={cn(
      "fixed left-0 top-0 z-40 h-screen w-64 transform border-r bg-background transition-all duration-200 ease-in-out bg-blue-50 overflow-y-auto",
      isOpen ? "translate-x-0" : "-translate-x-full",
      "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]"
      )}
    >
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="flex items-center gap-3 border-blue-200 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="font-bold text-blue-800 text-lg">HEALTH CARE</div>
            <div className="text-xs text-blue-600">Dành cho phụ huynh</div>
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-700 text-xs mt-1"
            >
              Phụ huynh
            </Badge>
          </div>
        </div>
        <div className="border-b border-blue-200">
          <p className="text-blue-400 text-md">Chung</p>
        </div>

        <nav className="border-b border-blue-200 ">
          <Link
            href="/"
            className="flex items-center gap-4 rounded-lg px-4 py-3 text-blue-700 transition-all hover:text-blue-900 hover:bg-blue-100 group border border-transparent hover:border-blue-200"
          >
            <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <div className="flex-1">
              <div className="font-medium">AAAA</div>
              <div className="text-xs text-blue-600 mt-0.5">BBBB</div>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-4 rounded-lg px-4 py-3 text-blue-700 transition-all hover:text-blue-900 hover:bg-blue-100 group border border-transparent hover:border-blue-200"
          >
            <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <div className="flex-1">
              <div className="font-medium">AAAA</div>
              <div className="text-xs text-blue-600 mt-0.5">BBBB</div>
            </div>
          </Link>
          <p className="text-blue-400 text-md">Student</p>
        </nav>

        <div className="bg-white rounded-lg border border-blue-200 p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-blue-200">
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="Nguyễn Văn An"
              />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                NA
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-blue-800">Nguyễn Văn An</div>
              <div className="text-xs text-blue-600">Lớp 1A • HS2025001</div>
            </div>
          </div>
        </div>

        <nav className="grid gap-1 text-sm font-medium">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 rounded-lg px-4 py-3 text-blue-700 transition-all hover:text-blue-900 hover:bg-blue-100 group border border-transparent hover:border-blue-200"
            >
              <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-blue-600 mt-0.5">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="rounded-lg border border-blue-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-medium text-blue-800">Hỗ trợ</h3>
            </div>
            <p className="text-xs text-blue-600">
              Cần hỗ trợ? Liên hệ với nhân viên y tế qua tin nhắn hoặc gọi số
              hotline.
            </p>
            <Button
              size="sm"
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
            >
              Liên hệ hỗ trợ
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </aside>
  );
}
