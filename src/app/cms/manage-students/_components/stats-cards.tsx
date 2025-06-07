"use client";

import { Users, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsData {
  total: number;
  healthy: number;
  monitoring: number;
  urgent: number;
}

interface StatsCardsProps {
  stats: StatsData;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-blue-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-800">
                {stats.total}
              </div>
              <div className="text-sm text-blue-600">Tổng học sinh</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-green-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-800">
                {stats.healthy}
              </div>
              <div className="text-sm text-green-600">Sức khỏe tốt</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-yellow-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold text-yellow-800">
                {stats.monitoring}
              </div>
              <div className="text-sm text-yellow-600">Cần theo dõi</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-red-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-bold">!</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-800">
                {stats.urgent}
              </div>
              <div className="text-sm text-red-600">Khẩn cấp</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
