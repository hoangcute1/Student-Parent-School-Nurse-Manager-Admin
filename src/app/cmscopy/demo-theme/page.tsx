"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  UserCheck,
  Pill,
  Package,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Download,
  Plus,
} from "lucide-react";

export default function DemoThemePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl shadow-lg mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-sky-800 bg-clip-text text-transparent">
            Demo Theme Sky Blue & White
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Giao diện mới với màu chủ đạo sky blue và white cho hệ thống quản lý
          </p>
        </div>

        {/* Stats Cards Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <Users className="h-6 w-6 text-sky-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Tổng số học sinh
                  </p>
                  <p className="text-2xl font-bold text-sky-700">1,234</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Hoạt động</p>
                  <p className="text-2xl font-bold text-green-700">1,180</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Cần theo dõi
                  </p>
                  <p className="text-2xl font-bold text-yellow-700">54</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <Package className="h-6 w-6 text-sky-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Thuốc trong kho
                  </p>
                  <p className="text-2xl font-bold text-sky-700">89</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar Demo */}
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-sky-100 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sky-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm..."
                className="pl-10 h-11 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg transition-all duration-200"
              />
            </div>

            <div className="flex gap-3">
              <Select>
                <SelectTrigger className="w-[180px] h-11 border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-lg">
                  <Filter className="w-4 h-4 mr-2 text-sky-400" />
                  <SelectValue placeholder="Bộ lọc" />
                </SelectTrigger>
                <SelectContent className="border-sky-200 shadow-lg">
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="h-11 px-4 border-sky-200 hover:bg-sky-50 transition-all duration-200 rounded-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Buttons Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sky-800">Primary Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
                Thêm mới
              </Button>
              <Button className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg">
                <CheckCircle className="w-4 h-4 mr-2" />
                Xác nhận
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sky-800">Secondary Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full border-sky-200 hover:bg-sky-50 transition-all duration-200 rounded-lg"
              >
                Hủy bỏ
              </Button>
              <Button
                variant="outline"
                className="w-full border-sky-200 hover:bg-sky-50 transition-all duration-200 rounded-lg"
              >
                Đặt lại
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sky-800">Navigation Cards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-sky-50 to-sky-100/50 rounded-lg border border-sky-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-200 rounded-lg">
                    <Users className="w-5 h-5 text-sky-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sky-800">
                      Quản lý học sinh
                    </h3>
                    <p className="text-sm text-sky-600">
                      Xem và quản lý thông tin
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-sky-50 to-sky-100/50 rounded-lg border border-sky-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-200 rounded-lg">
                    <Pill className="w-5 h-5 text-sky-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sky-800">
                      Quản lý thuốc
                    </h3>
                    <p className="text-sm text-sky-600">Theo dõi kho thuốc</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card className="bg-white/80 backdrop-blur-sm border-sky-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-white border-b border-sky-100">
            <CardTitle className="text-xl font-semibold text-sky-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Cải tiến giao diện hoàn thành
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-sky-800 mb-3">
                  Các trang đã cập nhật:
                </h3>
                <ul className="space-y-2 text-sky-700">
                  <li>• /cmscopy/manage-parents</li>
                  <li>• /cmscopy/manage-staffs</li>
                  <li>• /cmscopy/manage-students</li>
                  <li>• /cmscopy/medications</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-sky-800 mb-3">
                  Các thành phần đã cải thiện:
                </h3>
                <ul className="space-y-2 text-sky-700">
                  <li>• Background gradient sky-50 → white</li>
                  <li>• Stats cards với sky blue theme</li>
                  <li>• Filter bars hiện đại</li>
                  <li>• Buttons với gradient effects</li>
                  <li>• Tables với hover effects</li>
                  <li>• Dialogs và forms</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
