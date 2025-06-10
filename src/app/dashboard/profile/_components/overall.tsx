import { Progress } from "@/components/layout/sidebar/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Overall() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Thông tin tổng quan sức khỏe
        </h1>
        <p className="text-blue-600">
            Đây là mục tổng quan về sức khỏe của học sinh, bao gồm các thông tin
            cơ bản và các chỉ số sức khỏe quan trọng. Bạn có thể xem chi tiết từng
            mục bằng cách nhấp vào các liên kết bên dưới.
        </p>
      </div>
      <Card className="border-blue-100 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Activity className="mr-2 h-5 w-5 text-blue-600" />
            Thông tin học sinh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-blue-200">
                <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                  NA
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-blue-800">
                  Nguyễn Văn An
                </h3>
                <p className="text-blue-600">Lớp 1A • Mã học sinh: HS2025001</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="rounded-lg border bg-card p-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-blue-600">
                    Chiều cao
                  </h4>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Cập nhật 10/05/2025
                  </Badge>
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-blue-800">115</span>
                  <span className="text-sm text-blue-600 ml-1">cm</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-600">Bình thường</span>
                    <span className="text-blue-600">
                      Cao hơn 2cm so với lần trước
                    </span>
                  </div>
                  <Progress
                    value={60}
                    className="h-2 bg-blue-100"
                    indicatorClassName="bg-blue-500"
                  />
                </div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-blue-600">
                    Cân nặng
                  </h4>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Cập nhật 10/05/2025
                  </Badge>
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-blue-800">22</span>
                  <span className="text-sm text-blue-600 ml-1">kg</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-600">Bình thường</span>
                    <span className="text-blue-600">
                      Tăng 1kg so với lần trước
                    </span>
                  </div>
                  <Progress
                    value={55}
                    className="h-2 bg-blue-100"
                    indicatorClassName="bg-blue-500"
                  />
                </div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-blue-600">Thị lực</h4>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Cập nhật 10/05/2025
                  </Badge>
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-blue-800">
                    10/10
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-600">Bình thường</span>
                    <span className="text-blue-600">Không thay đổi</span>
                  </div>
                  <Progress
                    value={100}
                    className="h-2 bg-blue-100"
                    indicatorClassName="bg-green-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/dashboard/health-records" className="w-full">
            <Button
              variant="outline"
              className="w-full group border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              Xem hồ sơ sức khỏe đầy đủ
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
