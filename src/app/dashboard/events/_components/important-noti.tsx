import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar, Clock } from "lucide-react";

export default function ImportantNoti() {
  return (
    <Card className="border-red-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-red-800">
          <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
          Thông báo quan trọng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg border border-red-100 bg-red-50">
            <div className="rounded-full bg-red-100 p-2">
              <Calendar className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium">Tiêm chủng vắc-xin phòng cúm</h4>
              <p className="text-sm text-gray-600 mt-1">
                Nhà trường sẽ tổ chức tiêm chủng vắc-xin phòng cúm vào ngày
                25/05/2025. Vui lòng xác nhận đồng ý cho con tham gia trước ngày
                20/05/2025.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Xác nhận đồng ý
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-100"
                >
                  Từ chối
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border">
            <div className="rounded-full bg-amber-100 p-2">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium">
                Kiểm tra sức khỏe định kỳ - Học kỳ 1
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Kiểm tra sức khỏe định kỳ cho học sinh khối 1 sẽ diễn ra vào
                ngày 20/05/2025. Vui lòng chuẩn bị sổ khám sức khỏe cho con em.
              </p>
              <div className="mt-2">
                <Badge variant="outline" className="bg-amber-50 text-amber-700">
                  <Clock className="mr-1 h-3 w-3" />
                  Còn 5 ngày nữa
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
