"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Heart, User, Activity, Calendar, Phone } from "lucide-react";
import { ParentStudents } from "@/lib/type/parent-students";

interface HealthRecordDialogProps {
  student: ParentStudents;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function HealthRecordDialog({
  student,
  trigger,
  open,
  onOpenChange,
}: HealthRecordDialogProps) {
  const formatDate = (date: Date | string) => {
    if (!date) return "Chưa cập nhật";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("vi-VN");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-blue-200 bg-white">
        <DialogHeader className="border-b border-blue-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-blue-800">
                Hồ sơ sức khỏe: {student.student.name}
              </DialogTitle>
              <DialogDescription className="text-blue-600 text-lg">
                Thông tin chi tiết về sức khỏe và lịch sử y tế của học sinh
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {/* Student Information */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-blue-800">
                <div className="h-6 w-6 bg-blue-500 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                Thông tin học sinh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-blue-600">
                    Họ và tên
                  </span>
                  <p className="text-blue-900 font-medium bg-white px-3 py-2 rounded-lg border border-blue-200">
                    {student.student.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-blue-600">
                    Mã học sinh
                  </span>
                  <p className="text-blue-900 font-medium bg-white px-3 py-2 rounded-lg border border-blue-200">
                    {student.student.studentId}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-blue-600">Lớp</span>
                  <p className="text-blue-900 font-medium bg-white px-3 py-2 rounded-lg border border-blue-200">
                    {student.student.class?.name || "Chưa phân lớp"}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-blue-600">
                    Ngày sinh
                  </span>
                  <p className="text-blue-900 font-medium bg-white px-3 py-2 rounded-lg border border-blue-200">
                    {formatDate(student.student.birth)}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-blue-600">
                    Giới tính
                  </span>
                  <p className="text-blue-900 font-medium bg-white px-3 py-2 rounded-lg border border-blue-200">
                    {student.student.gender === "male"
                      ? "Nam"
                      : student.student.gender === "female"
                        ? "Nữ"
                        : "Chưa xác định"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Measurements */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-green-800">
                <div className="h-6 w-6 bg-green-500 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                Chỉ số sức khỏe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-green-600">
                    Chiều cao
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="text-green-900 font-medium bg-white px-3 py-2 rounded-lg border border-green-200 flex-1">
                      {student.healthRecord?.height || "Chưa đo"}
                    </p>
                    {student.healthRecord?.height && (
                      <Badge className="bg-green-100 text-green-700">cm</Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-green-600">
                    Cân nặng
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="text-green-900 font-medium bg-white px-3 py-2 rounded-lg border border-green-200 flex-1">
                      {student.healthRecord?.weight || "Chưa đo"}
                    </p>
                    {student.healthRecord?.weight && (
                      <Badge className="bg-green-100 text-green-700">kg</Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-green-600">
                    Nhóm máu
                  </span>
                  <p className="text-green-900 font-medium bg-white px-3 py-2 rounded-lg border border-green-200">
                    {student.healthRecord?.blood_type || "Chưa xác định"}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-green-600">
                    Thị lực
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="text-green-900 font-medium bg-white px-3 py-2 rounded-lg border border-green-200 flex-1">
                      {student.healthRecord?.vision || "Chưa kiểm tra"}
                    </p>
                    {student.healthRecord?.vision && (
                      <Badge
                        className={
                          student.healthRecord.vision === "Bình thường"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {student.healthRecord.vision === "Bình thường"
                          ? "Tốt"
                          : "Cần theo dõi"}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-green-600">
                    Thính lực
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="text-green-900 font-medium bg-white px-3 py-2 rounded-lg border border-green-200 flex-1">
                      {student.healthRecord?.hearing || "Chưa kiểm tra"}
                    </p>
                    {student.healthRecord?.hearing && (
                      <Badge
                        className={
                          student.healthRecord.hearing === "Bình thường"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {student.healthRecord.hearing === "Bình thường"
                          ? "Tốt"
                          : "Cần theo dõi"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Conditions */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-amber-800">
                <div className="h-6 w-6 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                Tình trạng y tế
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-amber-600">
                    Dị ứng
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="text-amber-900 font-medium bg-white px-3 py-2 rounded-lg border border-amber-200 flex-1">
                      {student.healthRecord?.allergies || "Không có"}
                    </p>
                    {student.healthRecord?.allergies && (
                      <Badge className="bg-red-100 text-red-700">
                        Có dị ứng
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-amber-600">
                    Bệnh mãn tính
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="text-amber-900 font-medium bg-white px-3 py-2 rounded-lg border border-amber-200 flex-1">
                      {student.healthRecord?.chronic_conditions || "Không có"}
                    </p>
                    {student.healthRecord?.chronic_conditions && (
                      <Badge className="bg-orange-100 text-orange-700">
                        Cần theo dõi
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-amber-600">
                    Lịch sử điều trị
                  </span>
                  <p className="text-amber-900 font-medium bg-white px-3 py-2 rounded-lg border border-amber-200 min-h-[80px]">
                    {student.healthRecord?.treatment_history ||
                      "Không có lịch sử điều trị đặc biệt"}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-amber-600">
                    Ghi chú thêm
                  </span>
                  <p className="text-amber-900 font-medium bg-white px-3 py-2 rounded-lg border border-amber-200 min-h-[80px]">
                    {student.healthRecord?.notes || "Không có ghi chú thêm"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer với nút đóng */}
        <div className="border-t border-blue-100 pt-4 flex justify-end">
          <DialogClose asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              Đóng
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
