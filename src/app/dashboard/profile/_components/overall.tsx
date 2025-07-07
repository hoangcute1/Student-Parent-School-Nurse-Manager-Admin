"use client";

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
import { useParentStudentsStore } from "@/stores/parent-students-store";
import { HealthRecordDialog } from "./health-record-dialog";

export default function Overall() {
  const { selectedStudent } = useParentStudentsStore();

  // Hiển thị thông báo nếu không có học sinh nào được chọn
  if (!selectedStudent) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-800">
            Thông tin tổng quan sức khỏe
          </h1>
        </div>
        <Card className="border-blue-100 bg-blue-50/30">
          <CardContent className="p-6">
            <div className="text-center text-blue-600">
              Chưa có học sinh nào được chọn. Vui lòng chọn học sinh từ sidebar.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
    if (!date) return "Chưa cập nhật";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Thông tin tổng quan sức khỏe
        </h1>
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
                  {selectedStudent.student.name?.charAt(0).toUpperCase() ||
                    "HS"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-blue-800">
                  {selectedStudent.student.name || "Chưa có tên"}
                </h3>
                <p className="text-blue-600">
                  Lớp {selectedStudent.student.class?.name || "Chưa phân lớp"} •
                  Mã học sinh: {selectedStudent.student.studentId}
                </p>
                <p className="text-sm text-blue-500">
                  Ngày sinh: {formatDate(selectedStudent.student.birth)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="rounded-lg border bg-card p-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-blue-600">
                    Chiều cao
                  </h4>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Cập nhật gần đây
                  </Badge>
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-blue-800">
                    {selectedStudent.healthRecord?.height || "--"}
                  </span>
                  <span className="text-sm text-blue-600 ml-1">cm</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-600">Bình thường</span>
                    <span className="text-blue-600">
                      {selectedStudent.healthRecord?.height
                        ? "Đã cập nhật"
                        : "Chưa có dữ liệu"}
                    </span>
                  </div>
                  <Progress
                    value={selectedStudent.healthRecord?.height ? 60 : 0}
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
                    Cập nhật gần đây
                  </Badge>
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-blue-800">
                    {selectedStudent.healthRecord?.weight || "--"}
                  </span>
                  <span className="text-sm text-blue-600 ml-1">kg</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-600">Bình thường</span>
                    <span className="text-blue-600">
                      {selectedStudent.healthRecord?.weight
                        ? "Đã cập nhật"
                        : "Chưa có dữ liệu"}
                    </span>
                  </div>
                  <Progress
                    value={selectedStudent.healthRecord?.weight ? 55 : 0}
                    className="h-2 bg-blue-100"
                    indicatorClassName="bg-blue-500"
                  />
                </div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-blue-600">Thị lực</h4>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Cập nhật gần đây
                  </Badge>
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-blue-800">
                    {selectedStudent.healthRecord?.vision || "--"}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-600">
                      {selectedStudent.healthRecord?.vision === "Bình thường"
                        ? "Bình thường"
                        : selectedStudent.healthRecord?.vision
                        ? "Cần theo dõi"
                        : "Chưa kiểm tra"}
                    </span>
                    <span className="text-blue-600">
                      {selectedStudent.healthRecord?.vision
                        ? "Đã cập nhật"
                        : "Chưa có dữ liệu"}
                    </span>
                  </div>
                  <Progress
                    value={
                      selectedStudent.healthRecord?.vision === "Bình thường"
                        ? 100
                        : selectedStudent.healthRecord?.vision
                        ? 50
                        : 0
                    }
                    className="h-2 bg-blue-100"
                    indicatorClassName={
                      selectedStudent.healthRecord?.vision === "Bình thường"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <HealthRecordDialog
            student={selectedStudent}
            trigger={
              <Button
                variant="outline"
                className="w-full group border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                Xem hồ sơ sức khỏe đầy đủ
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            }
          />
        </CardFooter>
      </Card>
    </div>
  );
}
