import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  RefreshCw,
  Package,
  Clock,
  Activity,
  CheckCircle,
  X,
} from "lucide-react";

export default function Loading() {
  // Skeleton loader components
  const SkeletonCard = () => (
    <Card className="border-sky-200 bg-white/70 backdrop-blur-sm animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-16 mt-2"></div>
      </CardHeader>
    </Card>
  );

  const SkeletonTable = () => (
    <Card className="border-sky-200 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 p-3 bg-sky-50/50 rounded-t-md">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>

          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-4 p-3 border-b border-gray-100"
            >
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  {j < 2 && (
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded w-80 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-9 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Animation Center */}
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <RefreshCw className="w-12 h-12 text-sky-500 animate-spin mx-auto" />
            <div>
              <p className="text-sky-600 text-lg font-medium">
                Đang tải dữ liệu...
              </p>
              <p className="text-gray-500 text-sm">
                Vui lòng chờ trong giây lát
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Filters Skeleton */}
        <Card className="border-sky-200 bg-white/70 backdrop-blur-sm animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <SkeletonTable />
      </div>
    </div>
  );
}
