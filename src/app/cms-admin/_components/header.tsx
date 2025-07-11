"use client";

import React from "react";
import { Bell, Search, User, Eye, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              CMS Admin Dashboard
            </h2>
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              <Eye className="w-3 h-3 mr-1" />
              Read Only
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm dữ liệu..."
              className="pl-10"
              disabled
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" disabled>
            <Bell className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Admin</p>
              <p className="text-gray-500">Chỉ xem</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
