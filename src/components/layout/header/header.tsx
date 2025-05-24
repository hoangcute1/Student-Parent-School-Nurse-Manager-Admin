import { Heart } from "lucide-react";
import Link from "next/link";
import User from "@/components/layout/header/user";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2 pl-4">
        <Heart className="h-6 w-6 text-red-500" />
        <span className="text-xl font-bold">Y Tế Học Đường</span>
      </div>
      <nav className="hidden md:flex items-center gap-6">
        <Link
          href="/"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Trang chủ
        </Link>
        <Link
          href="#features"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Tính năng
        </Link>
        <Link
          href="#resources"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Tài nguyên
        </Link>
      </nav>
      <User />
    </header>
  ) }