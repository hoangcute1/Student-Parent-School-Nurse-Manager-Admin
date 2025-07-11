"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navLinks } from "../_constants/sidebar";
import { Eye, Shield } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">CMS Admin</h1>
          <p className="text-xs text-gray-500">Chỉ xem dữ liệu</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span>{link.label}</span>
                  <Eye className="w-3 h-3 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {link.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Eye className="w-4 h-4" />
          <span>Chế độ chỉ xem</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Admin không thể chỉnh sửa dữ liệu
        </p>
      </div>
    </div>
  );
}
