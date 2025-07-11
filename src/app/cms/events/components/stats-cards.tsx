import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
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

interface EventStatsProps {
  stats: {
    total: number;
    pending: number;
    processing: number;
    resolved: number;
    high: number;
    medium: number;
    low: number;
  };
  trends?: {
    total: { value: number; isPositive: boolean };
    pending: { value: number; isPositive: boolean };
    processing: { value: number; isPositive: boolean };
    resolved: { value: number; isPositive: boolean };
  };
}

export function EventStats({ stats, trends }: EventStatsProps) {
  const resolutionRate =
    stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
  const pendingRate =
    stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Tổng sự kiện"
        value={stats.total}
        icon={<AlertTriangle className="w-5 h-5 text-sky-600" />}
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
        icon={<Clock className="w-5 h-5 text-orange-600" />}
        color="border-orange-200"
        trend={
          trends?.pending
            ? {
                value: trends.pending.value,
                label: "so với tháng trước",
                isPositive: !trends.pending.isPositive, // Giảm pending là tốt
              }
            : undefined
        }
      />
      {/* <StatsCard
        title="Đang xử lý"
        value={stats.processing}
        icon={<Activity className="w-5 h-5 text-blue-600" />}
        color="border-blue-200"
        trend={
          trends?.processing
            ? {
                value: trends.processing.value,
                label: "so với tháng trước",
                isPositive: trends.processing.isPositive,
              }
            : undefined
        }
      /> */}
     
      <StatsCard
        title="Ưu tiên cao"
        value={stats.high}
        icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
        color="border-red-200"
      />
       <StatsCard
        title="Đã giải quyết"
        value={stats.resolved}
        icon={<CheckCircle className="w-5 h-5 text-green-600" />}
        color="border-green-200"
        trend={
          trends?.resolved
            ? {
                value: trends.resolved.value,
                label: "so với tháng trước",
                isPositive: trends.resolved.isPositive,
              }
            : undefined
        }
      />
      
    </div>
  );
}
