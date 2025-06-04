import { Button } from "@/components/ui/button";
import { Database, Heart, LogOut, Settings, Shield, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "../_constants/sidebar";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 transform border-r bg-background transition-all duration-200 ease-in-out bg-blue-50 overflow-y-auto scrollbar-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full max-h-screen flex-col gap-2 p-4">
        <div className="flex items-center gap-3 border-b border-blue-200 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="font-bold text-blue-800 text-lg">
              HEALTH CARE CMS
            </div>
            <div className="text-xs text-blue-600">Hệ thống quản lý y tế</div>
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-700 text-xs mt-1"
            >
              <Shield className="mr-1 h-3 w-3" />
              Nhân viên y tế
            </Badge>
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div className="bg-white rounded-lg border border-blue-200 p-3 mb-4">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-blue-800">248</div>
              <div className="text-xs text-blue-600">Học sinh</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">12</div>
              <div className="text-xs text-blue-600">Cần theo dõi</div>
            </div>
          </div>
        </div>

        <nav className="grid gap-1 text-sm font-medium overflow-y-auto">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-lg px-4 py-3 text-blue-700 transition-all hover:text-blue-900 hover:bg-blue-100 group border border-transparent hover:border-blue-200 ${
                  isActive ? "bg-blue-100" : ""
                }`}
              >
                <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-blue-600 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="rounded-lg border border-blue-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-medium text-blue-800">Hệ thống</h3>
            </div>
            <p className="text-xs text-blue-600">
              Phiên bản 2.1.0 • Cập nhật lần cuối: 15/05/2025
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full mt-3 border-blue-200 text-blue-700"
            >
              Kiểm tra cập nhật
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-blue-200 text-blue-700 hover:bg-blue-100 focus:outline-none focus:bg-blue-100 focus:border-blue-400"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </aside>
  );
}
