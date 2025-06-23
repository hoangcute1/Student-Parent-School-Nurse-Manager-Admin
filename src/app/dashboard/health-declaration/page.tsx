"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Edit } from "lucide-react";
interface Vaccine {
  name: string;
  completed: boolean;
}

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParentStudentsStore } from "@/stores/parent-students-store";
import { ParentStudents } from "@/lib/type/parent-students";

export default function ParentHealthRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<ParentStudents | null>(
    null
  );
  const { studentsData, isLoading, error, fetchStudentsByParent } =
    useParentStudentsStore();

  useEffect(() => {
    fetchStudentsByParent();
  }, [fetchStudentsByParent]);

  const handleViewDetail = (record: ParentStudents) => {
    setSelectedRecord(record);
  };

  const handleEditRecord = (record: ParentStudents) => {
    setSelectedRecord(record);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Hồ sơ Sức khỏe
        </h1>
        <p className="text-blue-600">Quản lý thông tin sức khỏe của học sinh</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800">
            Danh sách hồ sơ sức khỏe
          </CardTitle>
          <CardDescription className="text-blue-600">
            Tổng hợp thông tin sức khỏe của tất cả học sinh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Lớp</TableHead>
                  <TableHead>Dị ứng</TableHead>
                  <TableHead>Bệnh mãn tính</TableHead>
                  <TableHead>Thị lực</TableHead>
                  <TableHead>Cập nhật lần cuối</TableHead>
                  <TableHead className="text-right">Chi tiết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Đang tải dữ liệu...
                      </p>
                    </TableCell>
                  </TableRow>
                ) : studentsData.length === 0 ? (
                  <TableRow key="none">
                    <TableCell colSpan={7} className="text-center py-4">
                      <p className="text-gray-500">
                        Không có dữ liệu hồ sơ sức khỏe
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  studentsData.map((eachStudent, idx) => (
                    <TableRow key={eachStudent._id || idx}>
                      <TableCell className="font-medium">
                        {eachStudent.student.name}
                      </TableCell>
                      <TableCell>{eachStudent.student.class.name}</TableCell>
                      <TableCell>
                        {eachStudent.healthRecord.allergies ? (
                          <Badge
                            variant="destructive"
                            className="bg-red-100 text-red-800"
                          >
                            {eachStudent.healthRecord.allergies}
                          </Badge>
                        ) : (
                          <span className="text-gray-500">Không</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {eachStudent.healthRecord?.chronic_conditions ? (
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-800"
                          >
                            {eachStudent.healthRecord.chronic_conditions}
                          </Badge>
                        ) : (
                          <span className="text-gray-500">Không</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            eachStudent.healthRecord?.vision === "Bình thường"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {eachStudent.healthRecord?.vision}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {eachStudent.healthRecord?.updated_at
                          ? new Date(
                              eachStudent.healthRecord.updated_at
                            ).toLocaleDateString("vi-VN")
                          : "Chưa cập nhật"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(eachStudent)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRecord(eachStudent)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
