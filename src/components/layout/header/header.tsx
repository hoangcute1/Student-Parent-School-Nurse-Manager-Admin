import { Heart, ChevronDown } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import User from "./user";


const features = [
  {
    title: "Khai báo hồ sơ sức khỏe",
    href: "/dashboard/health-declaration",
  },
  {
    title: "Gửi thuốc",
    href: "/dashboard/medications",
  },
  {
    title: "Nhận kết quả",
    href: "/dashboard/profile",
  },
  {
    title: "Lịch sử bệnh án",
    href: "/dashboard/resources",
  },
  {
    title: "Sự cố y tế",
    href: "/dashboard/events",
  },
  {
    title: "Xem phản hồi",
    href: "/dashboard/feedback",
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-white/20 bg-gradient-to-r from-blue-50 via-white to-blue-50 px-6 backdrop-blur-xl shadow-lg">
      <Link href="/" className="flex items-center gap-3 header-logo group">
        <div className="relative p-2 rounded-xl bg-gradient-to-br from-red-400 to-red-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
          <Heart className="h-7 w-7 text-white logo-heart transition-all duration-300 group-hover:scale-110" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 bg-clip-text text-transparent">
            Y Tế Học Đường
          </span>
          <span className="text-xs text-blue-500 font-medium opacity-80">
            Chăm sóc sức khỏe học sinh
          </span>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-12">
        <Link
          href="/"
          className="relative px-4 py-2 text-sm font-semibold text-blue-800 hover:text-blue-600 transition-all duration-300 group rounded-lg hover:bg-blue-50/50"
        >
          <span className="relative z-10 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            Trang chủ
          </span>
          <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="relative px-4 py-2 flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-600 transition-all duration-300 group outline-none rounded-lg hover:bg-blue-50/50">
            <span className="relative z-10 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              Tính năng
            </span>
            <ChevronDown className="h-4 w-4 transition-all duration-300 group-hover:rotate-180 group-hover:text-purple-500" />
            <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-64 bg-white/95 backdrop-blur-xl border border-blue-100/50 shadow-2xl rounded-2xl mt-3 p-2 animate-in slide-in-from-top-3 duration-300"
          >
            {features.map((feature, index) => (
              <DropdownMenuItem 
                key={index}
                className="rounded-xl mx-0 my-1 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-0 p-0"
              >
                <Link
                  href={feature.href}
                  className="w-full text-blue-800 hover:text-blue-600 py-3 px-4 rounded-xl transition-all duration-300 flex items-center gap-4 group"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 group-hover:scale-125 transition-transform duration-300"></div>
                  <span className="font-medium">{feature.title}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          href="/#resources"
          className="relative px-4 py-2 text-sm font-semibold text-blue-800 hover:text-blue-600 transition-all duration-300 group rounded-lg hover:bg-blue-50/50"
        >
          <span className="relative z-10 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            Tài liệu
          </span>
          <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
        </Link>

        <Link
          href="/#blog"
          className="relative px-4 py-2 text-sm font-semibold text-blue-800 hover:text-blue-600 transition-all duration-300 group rounded-lg hover:bg-blue-50/50"
        >
          <span className="relative z-10 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            Blog
          </span>
          <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
        </Link>
      </nav>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-3">
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-blue-300 to-transparent"></div>
        </div>
        <User />
      </div>
    </header>
  );
}
