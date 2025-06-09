import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, Home, LogOut, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { parentNav, studentNav } from "../_constants/sidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [showStudentSection, setShowStudentSection] = useState(true);
  const [showStudentDetails, setShowStudentDetails] = useState(true);
  const [showParentSection, setShowParentSection] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 transform border-r bg-blue-50",
        "grid grid-rows-[auto_minmax(0,1fr)_auto]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Header section - fixed size */}
      <div className="p-4 border-b border-blue-200">
        <div className="flex items-center gap-3">
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
      </div>

      {/* Main navigation section - với custom scrollbar */}
      <div className="overflow-y-auto 
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-track]:rounded-lg
        [&::-webkit-scrollbar-thumb]:bg-blue-200
        [&::-webkit-scrollbar-thumb]:rounded
        [&::-webkit-scrollbar-thumb]:border-2
        [&::-webkit-scrollbar-thumb]:border-blue-50
        hover:[&::-webkit-scrollbar-thumb]:bg-blue-300
        [&::-webkit-scrollbar-thumb]:transition-colors
        [&::-webkit-scrollbar]:hover:w-2"
      >
        <div className="p-4 space-y-4">
          {/* Parent navigation with animation */}
          <div className="space-y-4">
            <button
              onClick={() => setShowParentSection(!showParentSection)}
              className="flex items-center justify-between w-full text-blue-400 hover:text-blue-600 transition-all duration-300"
            >
              <span className="text-sm">Chung</span>
              <div className={cn(
                "transform transition-transform duration-300",
                showParentSection ? "rotate-180" : "rotate-0"
              )}>
                <ChevronDown className="h-4 w-4" />
              </div>
            </button>

            <div className={cn(
              "grid transition-all duration-300 ease-in-out",
              showParentSection 
                ? "grid-rows-[1fr] opacity-100" 
                : "grid-rows-[0fr] opacity-0"
            )}>
              <div className="overflow-hidden">
                <nav className="grid gap-1">
                  {parentNav.map((item) => {
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
              </div>
            </div>
          </div>

          {/* Student section with improved animations */}
          <div className="space-y-4">
            <button
              onClick={() => setShowStudentSection(!showStudentSection)}
              className="flex items-center justify-between w-full text-blue-400 hover:text-blue-600 transition-all duration-300"
            >
              <span className="text-sm">Học sinh</span>
              <div className={cn(
                "transform transition-transform duration-300",
                showStudentSection ? "rotate-180" : "rotate-0"
              )}>
                <ChevronDown className="h-4 w-4" />
              </div>
            </button>

            <div className={cn(
              "grid transition-all duration-300 ease-in-out",
              showStudentSection 
                ? "grid-rows-[1fr] opacity-100" 
                : "grid-rows-[0fr] opacity-0"
            )}>
              <div className="overflow-hidden">
                {/* Student info card with improved animations */}
                <div className="space-y-4">
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
                      <button
                        onClick={() => setShowStudentDetails(!showStudentDetails)}
                        className="flex items-center gap-2 group transition-all duration-300"
                      >
                        <div>
                          <div className="font-medium text-blue-800">Nguyễn Văn An</div>
                          <div className="text-xs text-blue-600">Lớp 1A • HS2025001</div>
                        </div>
                        <div className={cn(
                          "transform transition-transform duration-300",
                          showStudentDetails ? "rotate-180" : "rotate-0"
                        )}>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Student nav with improved animations */}
                  <div className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    showStudentDetails 
                      ? "grid-rows-[1fr] opacity-100 translate-y-0"
                      : "grid-rows-[0fr] opacity-0 -translate-y-2"
                  )}>
                    <div className="overflow-hidden">
                      <nav className="grid gap-1">
                        {studentNav.map((item) => {
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer section - fixed size */}
      <div className="sticky bottom-0 border-t border-blue-200 p-4 bg-blue-50">
        <div className="space-y-4">
          {/* Support card */}
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
          {/* Logout button */}
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
