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
          <CardTitle className="text-blue-800 text-2xl font-bold">
            Danh sách hồ sơ sức khỏe
          </CardTitle>
          <CardDescription className="text-blue-600">
            Tổng hợp thông tin sức khỏe của tất cả học sinh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400 rounded-lg shadow-sm"
              />
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 shadow-sm overflow-x-auto bg-white">
            <Table className="min-w-[900px]">
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="text-blue-700 font-semibold">
                    Họ và tên
                  </TableHead>
                  <TableHead className="text-blue-700 font-semibold">
                    Lớp
                  </TableHead>
                  <TableHead className="text-blue-700 font-semibold">
                    Dị ứng
                  </TableHead>
                  <TableHead className="text-blue-700 font-semibold">
                    Bệnh mãn tính
                  </TableHead>
                  <TableHead className="text-blue-700 font-semibold">
                    Thị lực
                  </TableHead>
                  <TableHead className="text-blue-700 font-semibold">
                    Cập nhật lần cuối
                  </TableHead>
                  <TableHead className="text-right text-blue-700 font-semibold">
                    Chi tiết
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                      <p className="mt-2 text-base text-blue-500">
                        Đang tải dữ liệu...
                      </p>
                    </TableCell>
                  </TableRow>
                ) : studentsData.length === 0 ? (
                  <TableRow key="none">
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-blue-400 text-lg">
                        Không có dữ liệu hồ sơ sức khỏe
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  studentsData.map((eachStudent, idx) => (
                    <TableRow
                      key={eachStudent.student._id || idx}
                      className="hover:bg-blue-50 transition"
                    >
                      <TableCell className="font-medium text-blue-900 text-sm md:text-base">
                        {eachStudent.student.name}
                      </TableCell>
                      <TableCell className="text-blue-800 font-medium">
                        {eachStudent.student.class.name}
                      </TableCell>
                      <TableCell>
                        {eachStudent.healthRecord?.allergies ? (
                          <Badge
                            variant="destructive"
                            className="bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded-full text-sm font-semibold shadow-sm transition-colors duration-150 hover:bg-red-200 hover:text-red-900"
                          >
                            {eachStudent.healthRecord.allergies}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 italic">Không</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {eachStudent.healthRecord?.chronic_conditions ? (
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-700 border border-orange-200 px-2 py-1 rounded-full text-sm font-semibold shadow-sm transition-colors duration-150 hover:bg-orange-200 hover:text-orange-900"
                          >
                            {eachStudent.healthRecord.chronic_conditions}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 italic">Không</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            (eachStudent.healthRecord?.vision === "Bình thường"
                              ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 hover:text-green-900"
                              : "bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-900") +
                            " px-2 py-1 rounded-full text-sm font-semibold shadow-sm transition-colors duration-150"
                          }
                        >
                          {eachStudent.healthRecord?.vision || "Không rõ"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-blue-700 font-medium">
                        {eachStudent.healthRecord?.updated_at ? (
                          new Date(
                            eachStudent.healthRecord.updated_at
                          ).toLocaleDateString("vi-VN")
                        ) : (
                          <span className="text-gray-400">Chưa cập nhật</span>
                        )}
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
          <DialogContent className="max-w-xl w-full px-1 py-2 md:max-w-2xl md:px-6 md:py-8 rounded-2xl shadow-2xl border border-blue-100 bg-white">
            <DialogHeader>
              <DialogTitle
                className="text-2xl font-bold text-blue-700 mb-4 truncate"
                title={selectedRecord.student.name}
              >
                Thông tin học sinh: {selectedRecord.student.name}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-x-auto">
              {/* Thông tin học sinh */}
              <div className="bg-blue-50 rounded p-2 border border-blue-100 shadow-sm mb-4 mx-auto w-full max-w-2xl">
                <div className="font-bold text-blue-600 mb-2 text-base md:text-lg text-center">
                  Thông tin học sinh
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 w-full">
                  <div className="flex gap-2 items-center py-1">
                    <span className="font-semibold text-gray-600 min-w-[80px]">
                      Mã HS:
                    </span>
                    <span
                      className="text-gray-900 break-all truncate"
                      title={selectedRecord.student.studentId}
                    >
                      {selectedRecord.student.studentId}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center py-1">
                    <span className="font-semibold text-gray-600 min-w-[80px]">
                      Lớp:
                    </span>
                    <span
                      className="text-gray-900 break-all truncate"
                      title={selectedRecord.student.class?.name}
                    >
                      {selectedRecord.student.class?.name || "Chưa phân lớp"}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center py-1">
                    <span className="font-semibold text-gray-600 min-w-[80px]">
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
                  <div className="flex gap-2 items-center py-1">
                    <span className="font-semibold text-gray-600 min-w-[80px]">
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
              </div>
              {/* Thông tin sức khỏe */}
              <div className="bg-white rounded p-4 border border-green-200 shadow-md mx-auto w-full max-w-2xl">
                <div className="font-bold text-green-800 mb-3 text-xl text-center">
                  Hồ sơ sức khỏe
                </div>
                <table className="w-full text-base md:text-lg">
                  <tbody>
                    <tr>
                      <td className="font-semibold text-gray-700 w-48 align-top py-1">
                        Dị ứng
                      </td>
                      <td className="text-gray-900 py-1">
                        {selectedRecord.healthRecord?.allergies || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700 w-48 align-top py-1">
                        Bệnh mãn tính
                      </td>
                      <td className="text-gray-900 py-1">
                        {selectedRecord.healthRecord?.chronic_conditions ||
                          "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700 w-48 align-top py-1">
                        Chiều cao
                      </td>
                      <td className="text-gray-900 py-1">
                        {selectedRecord.healthRecord?.height || "N/A"} cm
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700 w-48 align-top py-1">
                        Cân nặng
                      </td>
                      <td className="text-gray-900 py-1">
                        {selectedRecord.healthRecord?.weight || "N/A"} kg
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700 w-48 align-top py-1">
                        Thị lực
                      </td>
                      <td className="text-gray-900 py-1">
                        {selectedRecord.healthRecord?.vision || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700 w-48 align-top py-1">
                        Thính lực
                      </td>
                      <td className="text-gray-900 py-1">
                        {selectedRecord.healthRecord?.hearing || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700 w-48 align-top py-1">
                        Nhóm máu
                      </td>
                      <td className="text-gray-900 py-1">
                        {selectedRecord.healthRecord?.blood_type || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700 w-48 align-top py-1">
                        Ngày tạo
                      </td>
                      <td className="text-gray-900 py-1">
                        {selectedRecord.healthRecord?.created_at
                          ? new Date(
                              selectedRecord.healthRecord.created_at
                            ).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700 w-48 align-top py-1">
                        Lịch sử bệnh án
                      </td>
                      <td className="text-gray-900 py-1 whitespace-pre-line">
                        {selectedRecord.healthRecord?.treatment_history ||
                          "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700 w-48 align-top py-1">
                        Ghi chú
                      </td>
                      <td className="text-gray-900 py-1 whitespace-pre-line">
                        {selectedRecord.healthRecord?.notes || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700 w-48 align-top py-1">
                        Cập nhật lần cuối
                      </td>
                      <td className="text-gray-900 py-1">
                        {selectedRecord.healthRecord.updated_at
                          ? new Date(
                              selectedRecord.healthRecord.updated_at
                            ).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
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
