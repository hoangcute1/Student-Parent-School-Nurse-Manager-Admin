"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Edit, MoreHorizontal } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EditHealthRecordDialog,
  EditHealthRecordFormValues,
} from "./_components/edit-health-record-dialog";

export default function ParentHealthRecords() {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<ParentStudents | null>(
    null
  );
  const [selectedEditRecord, setSelectedEditRecord] =
    useState<ParentStudents | null>(null);

  const {
    studentsData,
    isLoading,
    error,
    fetchStudentsByParent,
    updateStudent,
  } = useParentStudentsStore();

  useEffect(() => {
    fetchStudentsByParent();
  }, [fetchStudentsByParent]);

  const handleViewDetail = (record: ParentStudents) => {
    setSelectedRecord(record);
    setIsViewDialogOpen(true);
  };

  const handleEditRecord = (record: ParentStudents) => {
    setSelectedEditRecord(record);
    setIsEditDialogOpen(true);
  };

  const handleUpdateHealthRecord = async (data: EditHealthRecordFormValues) => {
    if (selectedEditRecord) {
      try {
        await updateStudent(selectedEditRecord.student._id, {
          allergies: data.allergies,
          chronic_conditions: data.chronic_conditions,
          height: data.height,
          weight: data.weight,
          vision: data.vision,
          hearing: data.hearing,
          blood_type: data.blood_type,
          treatment_history: data.treatment_history,
          notes: data.notes,
        });
        setIsEditDialogOpen(false);
        setSelectedEditRecord(null);
        alert("Cập nhật học sinh thành công");
        fetchStudentsByParent();
      } catch (error: any) {
        console.error("Error updating student:", error.message, error);
        alert(
          `Không thể cập nhật học sinh: ${
            error.message || "Lỗi không xác định"
          }`
        );
      }
    }
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
                    <TableRow key={eachStudent.student._id || idx}>
                      <TableCell className="font-medium">
                        {eachStudent.student.name}
                      </TableCell>
                      <TableCell>{eachStudent.student.class.name}</TableCell>
                      <TableCell>
                        {eachStudent.healthRecord?.allergies ? (
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
                          {eachStudent.healthRecord?.vision || "Không rõ"}
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-700 hover:bg-blue-100 rounded-full p-2"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-lg shadow-lg border border-blue-100 bg-white min-w-[160px] p-1"
                          >
                            <DropdownMenuItem
                              className="flex items-center gap-2 px-3 py-2 rounded-md text-blue-700 hover:bg-blue-50 cursor-pointer transition"
                              onClick={() => handleViewDetail(eachStudent)}
                            >
                              <Eye className="h-4 w-4" />
                              <span>Xem hồ sơ</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 px-3 py-2 rounded-md text-blue-700 hover:bg-blue-50 cursor-pointer transition"
                              onClick={() => handleEditRecord(eachStudent)}
                            >
                              <Edit className="h-4 w-4" />
                              <span>Khai báo</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog for viewing student details */}
      {selectedRecord && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl p-8 rounded-2xl shadow-2xl border border-blue-100 bg-white">
            <DialogHeader>
              <DialogTitle
                className="text-2xl font-bold text-blue-700 mb-4 truncate"
                title={selectedRecord.student.name}
              >
                Thông tin học sinh: {selectedRecord.student.name}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin học sinh */}
              <div className="col-span-1 space-y-2">
                <div className="font-bold text-blue-600 mb-2">
                  Thông tin học sinh
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[110px]">
                    Mã học sinh:
                  </span>
                  <span
                    className="text-gray-900 break-all max-w-[180px] truncate"
                    title={selectedRecord.student.studentId}
                  >
                    {selectedRecord.student.studentId}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[110px]">
                    Lớp:
                  </span>
                  <span
                    className="text-gray-900 break-all max-w-[180px] truncate"
                    title={selectedRecord.student.class?.name}
                  >
                    {selectedRecord.student.class?.name || "Chưa phân lớp"}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[110px]">
                    Ngày sinh:
                  </span>
                  <span className="text-gray-900">
                    {selectedRecord.student.birth
                      ? new Date(
                          selectedRecord.student.birth
                        ).toLocaleDateString("vi-VN")
                      : ""}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[110px]">
                    Giới tính:
                  </span>
                  <span className="text-gray-900">
                    {selectedRecord.student.gender === "male"
                      ? "Nam"
                      : selectedRecord.student.gender === "female"
                      ? "Nữ"
                      : "Không rõ"}
                  </span>
                </div>
              </div>
              {/* Thông tin phụ huynh */}
              <div className="col-span-1 space-y-2">
                <div className="font-bold text-blue-600 mb-2">
                  Thông tin phụ huynh
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[110px]">
                    ID phụ huynh:
                  </span>
                  <span
                    className="text-gray-900 break-all max-w-[180px] truncate"
                    title={selectedRecord.parent?._id}
                  >
                    {selectedRecord.parent?._id || "N/A"}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[110px]">
                    Tài khoản:
                  </span>
                  <span
                    className="text-gray-900 break-all max-w-[180px] truncate"
                    title={selectedRecord.parent?.user}
                  >
                    {selectedRecord.parent?.user || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-blue-100 my-6"></div>
            {/* Thông tin sức khỏe */}
            <div className="space-y-2">
              <div className="font-bold text-blue-600 mb-2">Hồ sơ sức khỏe</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[120px]">
                    Dị ứng:
                  </span>
                  <span
                    className="text-gray-900 break-all max-w-[180px] truncate"
                    title={selectedRecord.healthRecord?.allergies}
                  >
                    {selectedRecord.healthRecord?.allergies || "N/A"}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[120px]">
                    Bệnh mãn tính:
                  </span>
                  <span
                    className="text-gray-900 break-all max-w-[180px] truncate"
                    title={selectedRecord.healthRecord?.chronic_conditions}
                  >
                    {selectedRecord.healthRecord?.chronic_conditions || "N/A"}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[120px]">
                    Chiều cao:
                  </span>
                  <span className="text-gray-900">
                    {selectedRecord.healthRecord?.height || "N/A"} cm
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[120px]">
                    Cân nặng:
                  </span>
                  <span className="text-gray-900">
                    {selectedRecord.healthRecord?.weight || "N/A"} kg
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[120px]">
                    Thị lực:
                  </span>
                  <span className="text-gray-900">
                    {selectedRecord.healthRecord?.vision || "N/A"}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[120px]">
                    Thính lực:
                  </span>
                  <span className="text-gray-900">
                    {selectedRecord.healthRecord?.hearing || "N/A"}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[120px]">
                    Nhóm máu:
                  </span>
                  <span className="text-gray-900">
                    {selectedRecord.healthRecord?.blood_type || "N/A"}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[120px]">
                    Lịch sử bệnh án:
                  </span>
                  <span
                    className="text-gray-900 break-all max-w-[180px] truncate"
                    title={selectedRecord.healthRecord?.treatment_history}
                  >
                    {selectedRecord.healthRecord?.treatment_history || "N/A"}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap col-span-2">
                  <span className="font-semibold text-gray-600 min-w-[120px]">
                    Ghi chú:
                  </span>
                  <span
                    className="text-gray-900 break-all max-w-[380px] truncate"
                    title={selectedRecord.healthRecord?.notes}
                  >
                    {selectedRecord.healthRecord?.notes || "N/A"}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[120px]">
                    Ngày tạo hồ sơ:
                  </span>
                  <span className="text-gray-900">
                    {selectedRecord.healthRecord?.created_at
                      ? new Date(
                          selectedRecord.healthRecord.created_at
                        ).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-semibold text-gray-600 min-w-[120px]">
                    Cập nhật lần cuối:
                  </span>
                  <span className="text-gray-900">
                    {selectedRecord.healthRecord.updated_at
                      ? new Date(
                          selectedRecord.healthRecord.updated_at
                        ).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Dialog for editing student details */}
      {selectedEditRecord && (
        <EditHealthRecordDialog
          onSubmit={handleUpdateHealthRecord}
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedEditRecord(null);
          }}
          defaultValues={{
            allergies: selectedEditRecord.healthRecord?.allergies || "",
            chronic_conditions:
              selectedEditRecord.healthRecord?.chronic_conditions || "",
            height: selectedEditRecord.healthRecord?.height || "",
            weight: selectedEditRecord.healthRecord?.weight || "",
            vision: selectedEditRecord.healthRecord?.vision || "",
            hearing: selectedEditRecord.healthRecord?.hearing || "",
            blood_type: selectedEditRecord.healthRecord?.blood_type || "",
            treatment_history:
              selectedEditRecord.healthRecord?.treatment_history || "",
            notes: selectedEditRecord.healthRecord?.notes || "",
          }}
          studentName={selectedEditRecord.student.name}
        />
      )}
    </div>
  );
}
