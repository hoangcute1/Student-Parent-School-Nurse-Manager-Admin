"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Package,
  History,
  TestTube,
  Activity,
  ArrowRight,
  Pill,
  FileText,
  Settings,
  Trash2,
} from "lucide-react";

export default function NavigationPage() {
  const router = useRouter();

  const pages = [
    {
      title: "🧪 Test Export",
      description: "Test nhanh chức năng xuất thuốc với 1 click",
      url: "/test-export",
      icon: TestTube,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "🔴 Test Export Live",
      description: "Test xuất thuốc live với real-time monitoring",
      url: "/test-export-live",
      icon: TestTube,
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
    },
    {
      title: "🔄 Cross-Tab Test",
      description: "Test đồng bộ dữ liệu giữa các tabs/pages",
      url: "/cross-tab-test",
      icon: Activity,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100",
    },
    {
      title: "📈 Export History Test",
      description: "Test cross-tab sync cụ thể cho export history",
      url: "/export-history-test",
      icon: History,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "🎭 Demo Export",
      description: "Demo showcase với nhiều scenarios tự động",
      url: "/demo-export",
      icon: Activity,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    {
      title: "💊 CMS Medications",
      description: "Quản lý thuốc với chức năng xuất thuốc",
      url: "/cms/medications",
      icon: Pill,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "📋 CMSCopy Medications",
      description: "Quản lý thuốc phiên bản copy với xuất thuốc",
      url: "/cmscopy/medications",
      icon: Package,
      color: "from-sky-500 to-sky-600",
      bgColor: "from-sky-50 to-sky-100",
    },
    {
      title: "📊 Export History",
      description: "Lịch sử xuất thuốc với filter nâng cao",
      url: "/cmscopy/medications/export-history",
      icon: History,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
    },
    {
      title: "📋 Test Guide",
      description: "Hướng dẫn test chi tiết toàn bộ chức năng",
      url: "/TEST_GUIDE.md",
      icon: FileText,
      color: "from-gray-500 to-gray-600",
      bgColor: "from-gray-50 to-gray-100",
      external: true,
    },
    {
      title: "🧪 Test Workflow",
      description: "Test toàn bộ workflow xuất thuốc từng bước một",
      url: "/test-workflow",
      icon: TestTube,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    {
      title: "🗑️ Clear Data",
      description: "Xóa toàn bộ data test để bắt đầu lại từ đầu",
      url: "/clear-data",
      icon: Trash2,
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
    },
  ];

  const handleNavigation = (page: any) => {
    if (page.external) {
      window.open(page.url, "_blank");
    } else {
      router.push(page.url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-3xl shadow-xl mb-4">
            <Settings className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-700 to-cyan-800 bg-clip-text text-transparent">
            🧭 Navigation Center
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trung tâm điều hướng cho tất cả các trang test và demo chức năng
            xuất thuốc
          </p>
        </div>

        {/* Status Banner */}
        <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-800 font-semibold">
                  System Status: READY
                </span>
              </div>
              <span className="text-emerald-600">•</span>
              <span className="text-emerald-700">
                Chức năng xuất thuốc hoàn thành 100%
              </span>
              <span className="text-emerald-600">•</span>
              <span className="text-emerald-700">Production Ready 🚀</span>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, index) => {
            const IconComponent = page.icon;
            return (
              <Card
                key={index}
                className={`bg-gradient-to-br ${page.bgColor} border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group`}
                onClick={() => handleNavigation(page)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 bg-gradient-to-r ${page.color} rounded-xl shadow-lg`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-gray-900">
                    {page.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {page.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full border-gray-300 hover:bg-white/50 group-hover:border-gray-400 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation(page);
                    }}
                  >
                    {page.external ? "Xem hướng dẫn" : "Truy cập ngay"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800 text-center">
              ⚡ Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/test-export")}
                className="border-green-300 hover:bg-green-50 text-green-700"
              >
                🚀 Quick Test
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/cross-tab-test")}
                className="border-emerald-300 hover:bg-emerald-50 text-emerald-700"
              >
                🔄 Cross-Tab Test
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  router.push("/cmscopy/medications/export-history")
                }
                className="border-orange-300 hover:bg-orange-50 text-orange-700"
              >
                📊 View History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Footer */}
        <div className="text-center space-y-2 text-gray-500 text-sm">
          <p>
            🎯 <strong>Mục tiêu:</strong> Test và demo chức năng xuất thuốc hoàn
            chỉnh
          </p>
          <p>
            ⚡ <strong>Tình trạng:</strong> Sẵn sàng cho production
          </p>
          <p>
            🔧 <strong>Tech Stack:</strong> Next.js + TypeScript + Zustand +
            Tailwind + Shadcn/ui
          </p>
        </div>
      </div>
    </div>
  );
}
