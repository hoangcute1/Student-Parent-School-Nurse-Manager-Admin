"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Activity,
} from "lucide-react";
import { API_URL } from "@/lib/env";

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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Sample data for classes

// Sample data for students

// Interface cho lớp học từ API
interface ClassItem {
  id: number;
  name: string;
  grade: string;
}

export default function StudentsPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Fetch danh sách lớp học từ API
  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/classes`);
      if (!response.ok) {
        throw new Error("Không thể lấy danh sách lớp học");
      }
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi khi lấy danh sách lớp học"
      );
      // Sử dụng dữ liệu mẫu nếu API không hoạt động (chỉ để demo)
      setClasses([
        { id: 1, name: "1A", grade: "1" },
        { id: 2, name: "1B", grade: "1" },
        { id: 3, name: "2A", grade: "2" },
        { id: 4, name: "2B", grade: "2" },
        { id: 5, name: "3A", grade: "3" },
      ]);
    } finally {
      setLoading(false);
    }
  };
  // Gọi API khi component được mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddStudent = () => {
    setIsAddStudentOpen(false);
    alert("Đã thêm học sinh thành công!");
  };

  const handleEditStudent = (student: any) => {
    setSelectedStudent(student);
    setIsEditStudentOpen(true);
  };

  const handleUpdateStudent = () => {
    setIsEditStudentOpen(false);
    setSelectedStudent(null);
    alert("Đã cập nhật thông tin học sinh thành công!");
  };

  const handleDeleteStudent = (studentId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa học sinh này?")) {
      alert("Đã xóa học sinh thành công!");
    }
  };

  const handleHealthCheck = (student: any) => {
    alert(`Bắt đầu kiểm tra sức khỏe cho học sinh: ${student.name}`);
  };
  if (selectedClass) {
    // Find the selected class details
    const classDetails = classes.find((c) => c.name === selectedClass) || {
      id: 0,
      name: selectedClass,
      grade: "",
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedClass(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-800">
              Danh sách học sinh lớp {selectedClass}
            </h1>
            <p className="text-blue-600">
              Khối {classDetails.grade} - Mã lớp: {classDetails.id}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-blue-800">
                  Học sinh lớp {selectedClass}
                </CardTitle>
                <CardDescription className="text-blue-600"></CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={isAddStudentOpen}
                  onOpenChange={setIsAddStudentOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm học sinh
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Thêm học sinh mới</DialogTitle>
                      <DialogDescription>
                        Nhập thông tin chi tiết của học sinh
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Họ và tên</Label>
                          <Input id="name" placeholder="Nhập họ tên học sinh" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="studentId">Mã học sinh</Label>
                          <Input id="studentId" placeholder="VD: HS2025001" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="birthDate">Ngày sinh</Label>
                          <Input id="birthDate" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Giới tính</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Nam</SelectItem>
                              <SelectItem value="female">Nữ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input id="address" placeholder="Nhập địa chỉ" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="parentName">Tên phụ huynh</Label>
                          <Input
                            id="parentName"
                            placeholder="Nhập tên phụ huynh"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parentPhone">SĐT phụ huynh</Label>
                          <Input
                            id="parentPhone"
                            placeholder="Nhập số điện thoại"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú</Label>
                        <Textarea
                          id="notes"
                          placeholder="Ghi chú thêm về học sinh..."
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddStudentOpen(false)}
                        >
                          Hủy
                        </Button>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={handleAddStudent}
                        >
                          Thêm học sinh
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm học sinh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Học sinh</TableHead>
                    <TableHead>Mã HS</TableHead>
                    <TableHead>Ngày sinh</TableHead>
                    <TableHead>Giới tính</TableHead>
                    <TableHead>Phụ huynh</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {classStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-gray-500">
                              {student.address}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {student.studentId}
                      </TableCell>
                      <TableCell>{student.birthDate}</TableCell>
                      <TableCell>{student.gender}</TableCell>
                      <TableCell>{student.parentName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === "Đang học"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            student.status === "Đang học"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Xem chi tiết"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Chỉnh sửa"
                            onClick={() => handleEditStudent(student)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Kiểm tra sức khỏe"
                            onClick={() => handleHealthCheck(student)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Xóa"
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Student Dialog */}
        <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin học sinh</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin chi tiết của học sinh
              </DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Họ và tên</Label>
                    <Input id="edit-name" defaultValue={selectedStudent.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-studentId">Mã học sinh</Label>
                    <Input
                      id="edit-studentId"
                      defaultValue={selectedStudent.studentId}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-birthDate">Ngày sinh</Label>
                    <Input
                      id="edit-birthDate"
                      type="date"
                      defaultValue={selectedStudent.birthDate}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-gender">Giới tính</Label>
                    <Select defaultValue={selectedStudent.gender}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Địa chỉ</Label>
                  <Input
                    id="edit-address"
                    defaultValue={selectedStudent.address}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-parentName">Tên phụ huynh</Label>
                    <Input
                      id="edit-parentName"
                      defaultValue={selectedStudent.parentName}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-parentPhone">SĐT phụ huynh</Label>
                    <Input
                      id="edit-parentPhone"
                      defaultValue={selectedStudent.parentPhone}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditStudentOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleUpdateStudent}
                  >
                    Cập nhật
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Quản lý Học sinh
        </h1>
        <p className="text-blue-600">
          Quản lý thông tin học sinh theo từng lớp
        </p>
      </div>{" "}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Tổng học sinh
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                "248" // Cần API để lấy thông tin thực tế
              )}
            </div>
            <p className="text-xs text-blue-600">Đang theo học</p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Số lớp
            </CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                classes.length
              )}
            </div>
            <p className="text-xs text-green-600">Lớp học</p>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Trung bình/lớp
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : classes.length > 0 ? (
                Math.round(248 / classes.length) // Cần API để lấy thông tin thực tế
              ) : (
                "0"
              )}
            </div>
            <p className="text-xs text-purple-600">Học sinh</p>
          </CardContent>
        </Card>
      </div>
      {/* Classes Grid */}
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
          <span className="ml-3 text-blue-700">Đang tải danh sách lớp...</span>
        </div>
      ) : error ? (
        <Card className="border-red-100 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-red-700">
              Không thể tải danh sách lớp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <Button
              onClick={fetchClasses}
              className="mt-4 bg-red-600 hover:bg-red-700"
              size="sm"
            >
              Thử lại
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classes.map((classItem) => (
            <Card
              key={classItem.id}
              className="border-blue-100 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedClass(classItem.name)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-blue-800 flex items-center justify-between">
                  Lớp {classItem.name}
                  <Badge className="bg-blue-100 text-blue-800">
                    Khối {classItem.grade}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Mã lớp: {classItem.id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mb-2">
                    <span className="text-xl font-bold">{classItem.grade}</span>
                  </div>
                  <div className="text-center mb-3">
                    <span className="text-gray-600">
                      Khối {classItem.grade} - Lớp {classItem.name}
                    </span>
                  </div>
                </div>
                <Button
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  Xem danh sách
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
