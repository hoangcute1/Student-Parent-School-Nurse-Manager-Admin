"use client";

import { Search, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SearchStatsProps {
  searchQuery: string;
  totalResults: number;
  totalOriginal: number;
  searchTime?: number;
}

export function SearchStats({
  searchQuery,
  totalResults,
  totalOriginal,
  searchTime = 0,
}: SearchStatsProps) {
  if (!searchQuery) {
    return null;
  }

  const percentage =
    totalOriginal > 0 ? Math.round((totalResults / totalOriginal) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">
                Kết quả tìm kiếm
              </p>
              <p className="text-2xl font-bold text-blue-800">{totalResults}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-700">
                Tỷ lệ kết quả
              </p>
              <p className="text-2xl font-bold text-green-800">{percentage}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700">
                Thời gian tìm kiếm
              </p>
              <p className="text-2xl font-bold text-purple-800">
                {searchTime}ms
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
