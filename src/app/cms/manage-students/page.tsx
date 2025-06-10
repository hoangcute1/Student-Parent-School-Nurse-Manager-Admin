"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  ArrowLeft,
  UserCheck,
  Activity,
} from "lucide-react";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Sample data for classes
const classesData = [
  {
    id: 1,
    name: "1A",
    teacher: "Cô Nguyễn Thị Lan",
    studentCount: 25,
    maleCount: 13,
    femaleCount: 12,
    averageAge: 6.2,
  },
  {
    id: 2,
    name: "1B",
    teacher: "Cô Trần Thị Hoa",
    studentCount: 24,
    maleCount: 12,
    femaleCount: 12,
    averageAge: 6.1,
  },
  {
    id: 3,
    name: "2A",
    teacher: "Cô Lê Thị Mai",
    studentCount: 26,
    maleCount: 14,
    femaleCount: 12,
    averageAge: 7.3,
  },
  {
    id: 4,
    name: "2B",
    teacher: "Cô Phạm Thị Nga",
    studentCount: 25,
    maleCount: 13,
    femaleCount: 12,
    averageAge: 7.2,
  },
  {
    id: 5,
    name: "3A",
    teacher: "Cô Hoàng Thị Linh",
    studentCount: 27,
    maleCount: 15,
    femaleCount: 12,
    averageAge: 8.1,
  },
  {
    id: 6,
    name: "3B",
    teacher: "Cô Vũ Thị Hương",
    studentCount: 26,
    maleCount: 14,
    femaleCount: 12,
    averageAge: 8.2,
  },
  {
    id: 7,
    name: "4A",
    teacher: "Cô Đặng Thị Thảo",
    studentCount: 23,
    maleCount: 11,
    femaleCount: 12,
    averageAge: 9.1,
  },
  {
    id: 8,
    name: "4B",
    teacher: "Cô Bùi Thị Loan",
    studentCount: 24,
    maleCount: 12,
    femaleCount: 12,
    averageAge: 9.0,
  },
  {
    id: 9,
    name: "5A",
    teacher: "Cô Ngô Thị Dung",
    studentCount: 22,
    maleCount: 10,
    femaleCount: 12,
    averageAge: 10.2,
  },
  {
    id: 10,
    name: "5B",
    teacher: "Cô Lý Thị Hạnh",
    studentCount: 21,
    maleCount: 9,
    femaleCount: 12,
    averageAge: 10.1,
  },
];

// Sample data for students
const studentsData = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    studentId: "HS2025001",
    class: "1A",
    birthDate: "2018-03-15",
    gender: "Nam",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    parentName: "Nguyễn Văn Bình",
    parentPhone: "0901234567",
    status: "Đang học",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    studentId: "HS2025002",
    class: "1A",
    birthDate: "2018-05-20",
    gender: "Nữ",
    address: "456 Đường DEF, Quận 2, TP.HCM",
    parentName: "Trần Văn Cường",
    parentPhone: "0902345678",
    status: "Đang học",
  },
  {
    id: 3,
    name: "Lê Hoàng Cường",
    studentId: "HS2025003",
    class: "2A",
    birthDate: "2017-08-10",
    gender: "Nam",
    address: "789 Đường GHI, Quận 3, TP.HCM",
    parentName: "Lê Thị Dung",
    parentPhone: "0903456789",
    status: "Đang học",
  },
];

export default function StudentsPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

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
    const classStudents = studentsData.filter(
      (student) => student.class === selectedClass
    );

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
            <p className="text-blue-600">Quản lý thông tin chi tiết học sinh</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-blue-800">
                  Học sinh lớp {selectedClass}
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Tổng số: {classStudents.length} học sinh
                </CardDescription>
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
                  {classStudents.map((student) => (
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
                  ))}
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
      </div>

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
            <div className="text-2xl font-bold text-blue-800">248</div>
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
            <div className="text-2xl font-bold text-green-800">12</div>
            <p className="text-xs text-green-600">Lớp học</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Mới nhập học
            </CardTitle>
            <Plus className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">15</div>
            <p className="text-xs text-orange-600">Tháng này</p>
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
            <div className="text-2xl font-bold text-purple-800">21</div>
            <p className="text-xs text-purple-600">Học sinh</p>
          </CardContent>
        </Card>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {classesData.map((classInfo) => (
          <Card
            key={classInfo.id}
            className="border-blue-100 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedClass(classInfo.name)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-blue-800 flex items-center justify-between">
                Lớp {classInfo.name}
                <Badge className="bg-blue-100 text-blue-800">
                  {classInfo.studentCount} HS
                </Badge>
              </CardTitle>
              <CardDescription className="text-blue-600">
                Giáo viên chủ nhiệm: {classInfo.teacher}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Nam:</span>
                  <span className="font-medium">{classInfo.maleCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Nữ:</span>
                  <span className="font-medium">{classInfo.femaleCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tuổi TB:</span>
                  <span className="font-medium">{classInfo.averageAge}</span>
                </div>
              </div>
              <Button
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                Xem danh sách
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
