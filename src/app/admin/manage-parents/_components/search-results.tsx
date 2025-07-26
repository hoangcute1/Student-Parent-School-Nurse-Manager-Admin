"use client";

import { Search, Filter, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SearchResultsProps {
  searchQuery: string;
  classFilter: string;
  healthFilter: string;
  totalResults: number;
  totalOriginal: number;
}

export function SearchResults({
  searchQuery,
  classFilter,
  healthFilter,
  totalResults,
  totalOriginal,
}: SearchResultsProps) {
  const hasActiveFilters =
    searchQuery || classFilter !== "all" || healthFilter !== "all";

  if (!hasActiveFilters) {
    return null;
  }

  const getFilterDescription = () => {
    const filters = [];

    if (searchQuery) {
      filters.push(`tìm kiếm "${searchQuery}"`);
    }

    if (classFilter !== "all") {
      filters.push(`lớp ${classFilter}`);
    }

    if (healthFilter !== "all") {
      const healthLabels = {
        healthy: "khỏe mạnh",
        needs_attention: "cần theo dõi",
        chronic: "bệnh mãn tính",
      };
      filters.push(
        `tình trạng sức khỏe: ${
          healthLabels[healthFilter as keyof typeof healthLabels]
        }`
      );
    }

    return filters.join(", ");
  };

  return (
    <Card className="bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Search className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sky-800">Kết quả tìm kiếm</h3>
              <p className="text-sm text-sky-600">{getFilterDescription()}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              <span className="text-lg font-bold text-sky-700">
                {totalResults}
              </span>
            </div>
            <p className="text-xs text-sky-500">
              trong tổng số {totalOriginal} phụ huynh
            </p>
          </div>
        </div>

        {totalResults === 0 && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              Không tìm thấy kết quả nào phù hợp với bộ lọc hiện tại. Hãy thử
              thay đổi từ khóa tìm kiếm hoặc bộ lọc.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
