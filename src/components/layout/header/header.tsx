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
    title: "Sự kiện y tế",
    href: "/dashboard/events",
  },
  {
    title: "Xem phản hồi",
    href: "/dashboard/feedback",
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-gradient-to-r from-blue-100 to-white px-4">
      <Link href="/" className="flex items-center gap-2">
        <Heart className="h-6 w-6 text-red-500" />
        <span className="text-xl font-bold text-blue-900">Y Tế Học Đường</span>
      </Link>

      <nav className="hidden md:flex items-center gap-6">
        <Link
          href="/"
          className="text-sm font-medium text-blue-800 hover:text-blue-600 transition-colors"
        >
          Trang chủ
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium text-blue-800 hover:text-blue-600 transition-colors">
            Tính năng
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-48 bg-white/95 backdrop-blur-sm border-blue-100"
          >
            {features.map((feature, index) => (
              <DropdownMenuItem key={index}>
                <Link
                  href={feature.href}
                  className="w-full text-blue-800 hover:text-blue-600"
                >
                  {feature.title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          href="/#resources"
          className="text-sm font-medium text-blue-800 hover:text-blue-600 transition-colors"
        >
          Tài liệu
        </Link>

        <Link
          href="/#blog"
          className="text-sm font-medium text-blue-800 hover:text-blue-600 transition-colors"
        >
          Blog
        </Link>
      </nav>
      <div className="flex gap-2">
        <User />
      </div>
    </header>
  );
}
