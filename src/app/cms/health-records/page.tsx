"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HealthRecordsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Hồ sơ sức khỏe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Trang quản lý hồ sơ sức khỏe học sinh đang được phát triển.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
