"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Pill, 
  Heart, 
  ClipboardCheck, 
  TrendingUp, 
  Eye,
  BarChart3,
  Activity,
  Clock,
  CheckCircle
} from "lucide-react";

interface DashboardStats {
  totalStudents: number;
  totalEvents: number;
  totalMedicines: number;
  totalHealthRecords: number;
  pendingEvents: number;
  processingEvents: number;
  resolvedEvents: number;
}

export default function CMSAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalEvents: 0,
    totalMedicines: 0,
    totalHealthRecords: 0,
    pendingEvents: 0,
    processingEvents: 0,
    resolvedEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalStudents: 1250,
        totalEvents: 89,
        totalMedicines: 156,
        totalHealthRecords: 1180,
        pendingEvents: 12,
        processingEvents: 8,
        resolvedEvents: 69,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    color = "blue" 
  }: {
    title: string;
    value: number;
    icon: any;
    description: string;
    color?: string;
  }) => {
    const colorClasses = {
      blue: "border-blue-200 bg-blue-50",
      green: "border-green-200 bg-green-50",
      orange: "border-orange-200 bg-orange-50",
      purple: "border-purple-200 bg-purple-50",
      red: "border-red-200 bg-red-50",
    };

    return (
      <Card className={`${colorClasses[color as keyof typeof colorClasses]} border-2`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              {title}
            </CardTitle>
            <div className="p-2 bg-white rounded-full">
              <Icon className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {loading ? "..." : value.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Eye className="w-8 h-8 text-purple-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-purple-800 bg-clip-text text-transparent">
            CMS Admin Dashboard
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tổng quan hệ thống - Chế độ chỉ xem dữ liệu từ tất cả staff
        </p>
        <Badge variant="outline" className="mt-2 text-purple-600 border-purple-200">
          <Eye className="w-3 h-3 mr-1" />
          Read-Only Mode
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng học sinh"
          value={stats.totalStudents}
          icon={Users}
          description="Tất cả học sinh trong hệ thống"
          color="blue"
        />
        <StatCard
          title="Sự cố y tế"
          value={stats.totalEvents}
          icon={ClipboardCheck}
          description="Tổng số sự cố đã ghi nhận"
          color="red"
        />
        <StatCard
          title="Đơn thuốc"
          value={stats.totalMedicines}
          icon={Pill}
          description="Tổng đơn thuốc từ phụ huynh"
          color="green"
        />
        <StatCard
          title="Hồ sơ sức khỏe"
          value={stats.totalHealthRecords}
          icon={Heart}
          description="Hồ sơ khám sức khỏe"
          color="purple"
        />
      </div>

      {/* Event Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Chờ xử lý"
          value={stats.pendingEvents}
          icon={Clock}
          description="Sự cố chưa được xử lý"
          color="orange"
        />
        <StatCard
          title="Đang xử lý"
          value={stats.processingEvents}
          icon={Activity}
          description="Sự cố đang được xử lý"
          color="blue"
        />
        <StatCard
          title="Đã giải quyết"
          value={stats.resolvedEvents}
          icon={CheckCircle}
          description="Sự cố đã hoàn thành"
          color="green"
        />
      </div>

      {/* Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Truy cập nhanh
          </CardTitle>
          <CardDescription>
            Các trang thường xem nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a 
              href="/cms-admin/view-events"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ClipboardCheck className="w-6 h-6 text-red-600 mb-2" />
              <h3 className="font-medium">Sự cố y tế</h3>
              <p className="text-sm text-gray-600">Xem tất cả sự cố</p>
            </a>
            <a 
              href="/cms-admin/view-sent-medicines"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Pill className="w-6 h-6 text-green-600 mb-2" />
              <h3 className="font-medium">Thuốc gửi</h3>
              <p className="text-sm text-gray-600">Xem đơn thuốc</p>
            </a>
            <a 
              href="/cms-admin/view-students"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-medium">Học sinh</h3>
              <p className="text-sm text-gray-600">Danh sách học sinh</p>
            </a>
            <a 
              href="/cms-admin/view-health-result"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Heart className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="font-medium">Sức khỏe</h3>
              <p className="text-sm text-gray-600">Kết quả khám</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
