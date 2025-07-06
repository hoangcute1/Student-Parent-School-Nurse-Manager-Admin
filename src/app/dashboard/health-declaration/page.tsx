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
  EditHealthRecordDialog,
  EditHealthRecordFormValues,
} from "./_components/edit-health-record-dialog";
import { HealthRecordDialog } from "../profile/_components/health-record-dialog";

export default function ParentHealthRecords() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Hiển thị tất cả hồ sơ của phụ huynh (không lọc theo học sinh được chọn)
  const filteredData = studentsData.filter((eachStudent) =>
    eachStudent.student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-sky-200 p-6 md:p-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-sky-800">
              🩺 Hồ sơ Sức khỏe
            </h1>
            <p className="text-sky-600 text-lg">
              Quản lý và theo dõi thông tin sức khỏe của học sinh
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-sky-200 overflow-hidden">
          <div className="p-6 border-b border-sky-100">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-sky-800">
                Danh sách hồ sơ sức khỏe
              </h2>
              <p className="text-sky-600">
                Tổng hợp thông tin sức khỏe của tất cả học sinh
              </p>
            </div>
          </div>

          <div className="p-6">
            {/* Search Section */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-sky-400" />
                <Input
                  placeholder="Tìm kiếm học sinh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-sky-200 focus:border-sky-400 focus:ring-sky-200 rounded-xl shadow-sm h-12 text-base"
                />
              </div>
            </div>

            {/* Table Section */}
            <div className="rounded-xl border border-sky-200 shadow-sm overflow-hidden bg-white">
              <Table className="min-w-[900px]">
                <TableHeader className="bg-gradient-to-r from-sky-100 to-blue-100">
                  <TableRow className="border-sky-200">
                    <TableHead className="text-sky-800 font-semibold text-base">
                      Họ và tên
                    </TableHead>
                    <TableHead className="text-sky-800 font-semibold text-base">
                      Lớp
                    </TableHead>
                    <TableHead className="text-sky-800 font-semibold text-base">
                      Dị ứng
                    </TableHead>
                    <TableHead className="text-sky-800 font-semibold text-base">
                      Bệnh mãn tính
                    </TableHead>
                    <TableHead className="text-sky-800 font-semibold text-base">
                      Thị lực
                    </TableHead>
                    <TableHead className="text-sky-800 font-semibold text-base">
                      Cập nhật lần cuối
                    </TableHead>
                    <TableHead className="text-right text-sky-800 font-semibold text-base">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
                          <p className="text-sky-600 text-lg font-medium">
                            Đang tải dữ liệu...
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredData.length === 0 ? (
                    <TableRow key="none">
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="text-6xl">👥</div>
                          <p className="text-sky-500 text-xl font-medium">
                            Không có dữ liệu hồ sơ sức khỏe
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((eachStudent, idx) => (
                      <TableRow
                        key={eachStudent.student._id || idx}
                        className="hover:bg-sky-50 transition-colors border-sky-100"
                      >
                        <TableCell className="font-medium text-sky-900 text-base">
                          {eachStudent.student.name}
                        </TableCell>
                        <TableCell className="text-sky-800 font-medium">
                          {eachStudent.student.class.name}
                        </TableCell>
                        <TableCell>
                          {eachStudent.healthRecord?.allergies ? (
                            <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200 px-3 py-1 rounded-full font-medium">
                              {eachStudent.healthRecord.allergies}
                            </Badge>
                          ) : (
                            <span className="text-sky-400 italic">
                              Không có
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {eachStudent.healthRecord?.chronic_conditions ? (
                            <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 px-3 py-1 rounded-full font-medium">
                              {eachStudent.healthRecord.chronic_conditions}
                            </Badge>
                          ) : (
                            <span className="text-sky-400 italic">
                              Không có
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              (eachStudent.healthRecord?.vision ===
                              "Bình thường"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
                                : "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200") +
                              " px-3 py-1 rounded-full font-medium"
                            }
                          >
                            {eachStudent.healthRecord?.vision || "Không rõ"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sky-700 font-medium">
                          {eachStudent.healthRecord?.updated_at ? (
                            new Date(
                              eachStudent.healthRecord.updated_at
                            ).toLocaleDateString("vi-VN")
                          ) : (
                            <span className="text-sky-400">Chưa cập nhật</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-sky-700 hover:bg-sky-100 rounded-full p-2 h-10 w-10"
                              >
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-xl shadow-lg border border-sky-200 bg-white min-w-[160px] p-2"
                            >
                              <HealthRecordDialog
                                student={eachStudent}
                                trigger={
                                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 rounded-lg text-sky-700 hover:bg-sky-50 cursor-pointer transition-colors">
                                    <Eye className="h-4 w-4" />
                                    <span>Xem hồ sơ</span>
                                  </DropdownMenuItem>
                                }
                              />
                              <DropdownMenuItem
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sky-700 hover:bg-sky-50 cursor-pointer transition-colors"
                                onClick={() => handleEditRecord(eachStudent)}
                              >
                                <Edit className="h-4 w-4" />
                                <span>Cập nhật</span>
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
          </div>
        </div>
      </div>

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
