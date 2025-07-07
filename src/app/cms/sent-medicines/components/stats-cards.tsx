import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Clock,
  Activity,
  CheckCircle,
  X,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
}

function StatsCard({ title, value, icon, color, trend }: StatsCardProps) {
  return (
    <Card
      className={`${color} bg-white/70 backdrop-blur-sm border-2 hover:shadow-lg transition-all duration-200`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div className="p-2 rounded-full bg-white/80">{icon}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp
                className={`w-4 h-4 ${trend.isPositive ? "" : "rotate-180"}`}
              />
              <span>
                {trend.value}% {trend.label}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MedicineDeliveryStatsProps {
  stats: {
    total: number;
    pending: number;
    progress: number;
    completed: number;
    cancelled: number;
  };
  trends?: {
    total: { value: number; isPositive: boolean };
    pending: { value: number; isPositive: boolean };
    progress: { value: number; isPositive: boolean };
    completed: { value: number; isPositive: boolean };
    cancelled: { value: number; isPositive: boolean };
  };
}

export function MedicineDeliveryStats({
  stats,
  trends,
}: MedicineDeliveryStatsProps) {
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const pendingRate =
    stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
      <StatsCard
        title="Tổng đơn thuốc"
        value={stats.total}
        icon={<Package className="w-5 h-5 text-sky-600" />}
        color="border-sky-200"
        trend={
          trends?.total
            ? {
                value: trends.total.value,
                label: "so với tháng trước",
                isPositive: trends.total.isPositive,
              }
            : undefined
        }
      />

      <StatsCard
        title="Chờ xử lý"
        value={stats.pending}
        icon={<Clock className="w-5 h-5 text-yellow-600" />}
        color="border-yellow-200"
        trend={
          trends?.pending
            ? {
                value: trends.pending.value,
                label: "so với tháng trước",
                isPositive: !trends.pending.isPositive, // Ít hơn là tốt
              }
            : undefined
        }
      />

      <StatsCard
        title="Đang thực hiện"
        value={stats.progress}
        icon={<Activity className="w-5 h-5 text-blue-600" />}
        color="border-blue-200"
        trend={
          trends?.progress
            ? {
                value: trends.progress.value,
                label: "so với tháng trước",
                isPositive: trends.progress.isPositive,
              }
            : undefined
        }
      />

      <StatsCard
        title="Đã hoàn thành"
        value={stats.completed}
        icon={<CheckCircle className="w-5 h-5 text-green-600" />}
        color="border-green-200"
        trend={
          trends?.completed
            ? {
                value: trends.completed.value,
                label: "so với tháng trước",
                isPositive: trends.completed.isPositive,
              }
            : undefined
        }
      />

      <StatsCard
        title="Đã hủy"
        value={stats.cancelled}
        icon={<X className="w-5 h-5 text-red-600" />}
        color="border-red-200"
        trend={
          trends?.cancelled
            ? {
                value: trends.cancelled.value,
                label: "so với tháng trước",
                isPositive: !trends.cancelled.isPositive, // Ít hơn là tốt
              }
            : undefined
        }
      />

      <Card className="border-purple-200 bg-white/70 backdrop-blur-sm border-2 hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tỷ lệ hoàn thành
            </CardTitle>
            <div className="p-2 rounded-full bg-white/80">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {completionRate}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface QuickStatsProps {
  stats: {
    total: number;
    pending: number;
    progress: number;
    completed: number;
    cancelled: number;
  };
  timeRange: string;
}

export function QuickStats({ stats, timeRange }: QuickStatsProps) {
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const activeRate =
    stats.total > 0
      ? Math.round(((stats.pending + stats.progress) / stats.total) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-sky-200 bg-gradient-to-br from-sky-50 to-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tổng đơn thuốc
              </p>
              <p className="text-2xl font-bold text-sky-700">{stats.total}</p>
              <p className="text-xs text-gray-500">{timeRange}</p>
            </div>
            <div className="p-3 bg-sky-100 rounded-full">
              <Package className="w-6 h-6 text-sky-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tỷ lệ hoàn thành
              </p>
              <p className="text-2xl font-bold text-green-700">
                {completionRate}%
              </p>
              <p className="text-xs text-gray-500">Đã hoàn thành / Tổng số</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đang xử lý</p>
              <p className="text-2xl font-bold text-orange-700">
                {activeRate}%
              </p>
              <p className="text-xs text-gray-500">
                Chờ xử lý + Đang thực hiện
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
