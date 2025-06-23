import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileText, Heart, Shield } from "lucide-react";

export default function HealthStatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="border-blue-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">
            Tổng hồ sơ
          </CardTitle>
          <FileText className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-800">
            {/* {healthRecords.length} */}
          </div>
          <p className="text-xs text-blue-600">Học sinh đã khai báo</p>
        </CardContent>
      </Card>

      <Card className="border-red-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-red-700">
            Có dị ứng
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-800">
            {/* {healthRecords.filter((record) => record.allergies).length} */}
          </div>
          <p className="text-xs text-red-600">Cần chú ý đặc biệt</p>
        </CardContent>
      </Card>

      <Card className="border-orange-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-orange-700">
            Bệnh mãn tính
          </CardTitle>
          <Heart className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-800">
            {/* {healthRecords.filter((record) => record.chronicDisease).length} */}
          </div>
          <p className="text-xs text-orange-600">Cần theo dõi</p>
        </CardContent>
      </Card>

      <Card className="border-green-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-green-700">
            BMI bình thường
          </CardTitle>
          <Shield className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-800"></div>
          <p className="text-xs text-green-600">Có chỉ số BMI tốt</p>
        </CardContent>
      </Card>
    </div>
  );
}
