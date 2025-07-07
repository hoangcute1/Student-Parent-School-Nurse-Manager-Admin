import { Heart, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, adminNavLinks } from "../_constants/sidebar";
import { cn } from "@/lib/utils";

import { useAuthStore } from "@/stores/auth-store";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, role } = useAuthStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 transform border-r bg-background transition-all duration-200 ease-in-out bg-sky-50 overflow-y-auto scrollbar-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full max-h-screen flex-col gap-2 p-4">
        <Link
          href="/"
          className="flex items-center gap-3 border-b border-sky-200 pb-4 group"
        >
          <div className="relative p-2 rounded-xl bg-gradient-to-br from-red-400 to-red-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Heart className="h-7 w-7 text-white transition-all duration-300 group-hover:scale-110" />
          </div>
          <div>
            <div className="font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 bg-clip-text text-transparent text-lg">
              Y Tế Học Đường
            </div>
            <div className="text-xs text-sky-500 font-medium opacity-80">
              Hệ thống quản lý y tế
            </div>
            <Badge
              variant="outline"
              className="bg-sky-100 text-sky-700 text-xs mt-1"
            >
              <Shield className="mr-1 h-3 w-3" />
              {role === "admin" ? "Quản trị viên" : "Nhân viên y tế"}
            </Badge>
          </div>
        </Link>
        {/* Thống kê nhanh */}
        <div className="bg-white rounded-lg border border-sky-200 p-3 mb-4">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-sky-800">248</div>
              <div className="text-xs text-sky-600">Học sinh</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">12</div>
              <div className="text-xs text-sky-600">Cần theo dõi</div>
            </div>
          </div>
        </div>{" "}
        <nav className="grid gap-1 text-sm font-medium overflow-y-auto">
          {role === "admin" && (
            <>
              <div className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-2 mt-2">
                Quản lý hệ thống
              </div>
              {adminNavLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 rounded-lg px-4 py-3 text-sky-700 transition-all hover:text-sky-900 hover:bg-sky-100 group border border-transparent hover:border-sky-200 ${
                      isActive ? "bg-sky-100" : ""
                    }`}
                  >
                    <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-sky-600 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
              <div className="border-t border-sky-200 my-2" />
            </>
          )}

          {/* Standard navigation links */}
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-lg px-4 py-3 text-sky-700 transition-all hover:text-sky-900 hover:bg-sky-100 group border border-transparent hover:border-sky-200 ${
                  isActive ? "bg-sky-100" : ""
                }`}
              >
                <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-sky-600 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
