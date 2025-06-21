"use client";

import {
  UserRound,
  UserPlus,
  User,
  BarChartBig,
  UsersRound,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  totalStaffs: number;
  activeStaffs: number;
  newStaffs: number;
  departments: number;
}

export function StatsCards({
  totalStaffs,
  activeStaffs,
  newStaffs,
  departments,
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-blue-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-600">
            Tổng số nhân viên
          </CardTitle>
          <UserRound className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{totalStaffs}</div>
          <p className="text-xs text-blue-500">Nhân viên trong hệ thống</p>
        </CardContent>
      </Card>
      <Card className="border-green-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-600">
            Đang làm việc
          </CardTitle>
          <User className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">
            {activeStaffs}
          </div>
          <p className="text-xs text-green-500">Nhân viên đang hoạt động</p>
        </CardContent>
      </Card>
      <Card className="border-orange-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-600">
            Nhân viên mới
          </CardTitle>
          <UserPlus className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{newStaffs}</div>
          <p className="text-xs text-orange-500">Trong tháng này</p>
        </CardContent>
      </Card>
      <Card className="border-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-600">
            Phòng ban
          </CardTitle>
          <UsersRound className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">
            {departments}
          </div>
          <p className="text-xs text-purple-500">Phòng ban trong trường</p>
        </CardContent>
      </Card>
    </div>
  );
}
