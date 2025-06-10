"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Users,
  Activity,
  ArrowLeft,
  Edit,
  UserCheck,
  AlertTriangle,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

export default function ExamResults() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isAddResultOpen, setIsAddResultOpen] = useState(false);
  const [isScheduleConsultOpen, setIsScheduleConsultOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const handleAddResult = () => {
    setIsAddResultOpen(false);
    alert("Đã cập nhật kết quả khám thành công!");
  };

  const handleScheduleConsult = (student: any) => {
    setSelectedStudent(student);
    setIsScheduleConsultOpen(true);
  };

  const handleConfirmConsult = () => {
    setIsScheduleConsultOpen(false);
    setSelectedStudent(null);
    alert("Đã đặt lịch hẹn tư vấn thành công!");
  };

  const handleHealthCheck = (student: any) => {
    alert(`Bắt đầu kiểm tra sức khỏe cho học sinh: ${student.studentName}`);
  };

  if (selectedClass) {
    const classResults = examResultsData.filter(
      (result) => result.class === selectedClass
    );
    const checkedCount = classResults.length;
    const totalStudents =
      classesData.find((c) => c.name === selectedClass)?.studentCount || 0;
    const normalCount = classResults.filter(
      (r) => r.result === "Bình thường"
    ).length;
    const abnormalCount = classResults.filter(
      (r) => r.result !== "Bình thường"
    ).length;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedClass(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-teal-800">
              Kết quả khám lớp {selectedClass}
            </h1>
            <p className="text-teal-600">
              Theo dõi kết quả khám sức khỏe học sinh
            </p>
          </div>
        </div>

        {/* Class Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Đã khám
              </CardTitle>
              <ClipboardCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">
                {checkedCount}
              </div>
              <p className="text-xs text-blue-600">/{totalStudents} học sinh</p>
              <Progress
                value={(checkedCount / totalStudents) * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Bình thường
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">
                {normalCount}
              </div>
              <p className="text-xs text-green-600">
                {Math.round((normalCount / checkedCount) * 100)}% kết quả tốt
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">
                Cần theo dõi
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800">
                {abnormalCount}
              </div>
              <p className="text-xs text-orange-600">Cần chú ý đặc biệt</p>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Chưa khám
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">
                {totalStudents - checkedCount}
              </div>
              <p className="text-xs text-purple-600">Cần lên lịch</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-teal-800">
                  Kết quả khám lớp {selectedClass}
                </CardTitle>
                <CardDescription className="text-teal-600">
                  Danh sách kết quả khám sức khỏe của học sinh
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất báo cáo
                </Button>
                <Dialog
                  open={isAddResultOpen}
                  onOpenChange={setIsAddResultOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Cập nhật kết quả
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Cập nhật kết quả khám sức khỏe</DialogTitle>
                      <DialogDescription>
                        Nhập kết quả khám chi tiết cho học sinh
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="student">Học sinh</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn học sinh" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student1">
                                Nguyễn Văn An
                              </SelectItem>
                              <SelectItem value="student2">
                                Trần Thị Bình
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="examType">Loại khám</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại khám" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">
                                Khám tổng quát
                              </SelectItem>
                              <SelectItem value="dental">Răng miệng</SelectItem>
                              <SelectItem value="vision">Thị lực</SelectItem>
                              <SelectItem value="hearing">Thính lực</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="height">Chiều cao (cm)</Label>
                          <Input id="height" placeholder="VD: 115" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Cân nặng (kg)</Label>
                          <Input id="weight" placeholder="VD: 20" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bmi">BMI</Label>
                          <Input id="bmi" placeholder="Tự động tính" disabled />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Kết quả tổng quát</Label>
                        <RadioGroup defaultValue="normal">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="normal" id="normal" />
                            <Label htmlFor="normal">Bình thường</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="follow-up" id="follow-up" />
                            <Label htmlFor="follow-up">Cần theo dõi</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="abnormal" id="abnormal" />
                            <Label htmlFor="abnormal">Bất thường</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú chi tiết</Label>
                        <Textarea
                          id="notes"
                          placeholder="Mô tả chi tiết kết quả khám, các dấu hiệu bất thường (nếu có)..."
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recommendations">Khuyến nghị</Label>
                        <Textarea
                          id="recommendations"
                          placeholder="Khuyến nghị điều trị, theo dõi hoặc tái khám..."
                          rows={3}
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddResultOpen(false)}
                        >
                          Hủy
                        </Button>
                        <Button
                          className="bg-teal-600 hover:bg-teal-700"
                          onClick={handleAddResult}
                        >
                          Lưu kết quả
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
                  placeholder="Tìm kiếm theo tên học sinh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Loại khám" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="general">Khám tổng quát</SelectItem>
                  <SelectItem value="dental">Răng miệng</SelectItem>
                  <SelectItem value="vision">Thị lực</SelectItem>
                  <SelectItem value="hearing">Thính lực</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Học sinh</TableHead>
                    <TableHead>Loại khám</TableHead>
                    <TableHead>Ngày khám</TableHead>
                    <TableHead>Chiều cao</TableHead>
                    <TableHead>Cân nặng</TableHead>
                    <TableHead>BMI</TableHead>
                    <TableHead>Kết quả</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">
                        {result.studentName}
                      </TableCell>
                      <TableCell>{result.examType}</TableCell>
                      <TableCell>{result.examDate}</TableCell>
                      <TableCell>{result.height}</TableCell>
                      <TableCell>{result.weight}</TableCell>
                      <TableCell>{result.bmi}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            result.result === "Bình thường"
                              ? "default"
                              : "destructive"
                          }
                          className={
                            result.result === "Bình thường"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }
                        >
                          {result.result}
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
                          <Button variant="ghost" size="sm" title="Chỉnh sửa">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Kiểm tra sức khỏe"
                            onClick={() => handleHealthCheck(result)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                          {result.result !== "Bình thường" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Đặt lịch tư vấn"
                              onClick={() => handleScheduleConsult(result)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" title="Tải xuống">
                            <Download className="h-4 w-4" />
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

        {/* Schedule Consultation Dialog */}
        <Dialog
          open={isScheduleConsultOpen}
          onOpenChange={setIsScheduleConsultOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Đặt lịch hẹn tư vấn riêng</DialogTitle>
              <DialogDescription>
                Đặt lịch tư vấn cho học sinh có dấu hiệu bất thường
              </DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-medium text-orange-900">
                    Thông tin học sinh
                  </h4>
                  <p className="text-sm text-orange-700 mt-1">
                    <strong>Tên:</strong> {selectedStudent.studentName}
                  </p>
                  <p className="text-sm text-orange-700">
                    <strong>Kết quả khám:</strong> {selectedStudent.result}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="consultDate">Ngày hẹn</Label>
                    <Input id="consultDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consultTime">Giờ hẹn</Label>
                    <Input id="consultTime" type="time" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor">Bác sĩ tư vấn</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn bác sĩ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr1">
                        BS. Nguyễn Văn A - Nhi khoa
                      </SelectItem>
                      <SelectItem value="dr2">BS. Trần Thị B - Mắt</SelectItem>
                      <SelectItem value="dr3">
                        BS. Lê Văn C - Răng hàm mặt
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Lý do tư vấn</Label>
                  <Textarea
                    id="reason"
                    placeholder="Mô tả chi tiết lý do cần tư vấn..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentContact">Liên hệ phụ huynh</Label>
                  <Input
                    id="parentContact"
                    placeholder="Số điện thoại phụ huynh"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsScheduleConsultOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleConfirmConsult}
                  >
                    Đặt lịch hẹn
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
        <h1 className="text-3xl font-bold tracking-tight text-teal-800">
          Kết quả Khám sức khỏe
        </h1>
        <p className="text-teal-600">
          Quản lý và theo dõi kết quả khám sức khỏe theo từng lớp
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-teal-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-teal-700">
              Tổng đã khám
            </CardTitle>
            <ClipboardCheck className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-800">235</div>
            <p className="text-xs text-teal-600">94.8% học sinh</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Bình thường
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">198</div>
            <p className="text-xs text-blue-600">84.3% kết quả tốt</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Cần theo dõi
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">37</div>
            <p className="text-xs text-orange-600">15.7% cần chú ý</p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Tuần này
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">42</div>
            <p className="text-xs text-green-600">Lượt khám mới</p>
          </CardContent>
        </Card>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {classesData.map((classInfo) => {
          const classResults = examResultsData.filter(
            (result) => result.class === classInfo.name
          );
          const checkedCount = classResults.length;
          const normalCount = classResults.filter(
            (r) => r.result === "Bình thường"
          ).length;
          const abnormalCount = classResults.filter(
            (r) => r.result !== "Bình thường"
          ).length;

          return (
            <Card
              key={classInfo.id}
              className="border-teal-100 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedClass(classInfo.name)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-teal-800 flex items-center justify-between">
                  Lớp {classInfo.name}
                  <Badge className="bg-teal-100 text-teal-800">
                    {checkedCount}/{classInfo.studentCount}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-teal-600">
                  Tỷ lệ khám:{" "}
                  {Math.round((checkedCount / classInfo.studentCount) * 100)}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bình thường:</span>
                    <span className="font-medium text-green-600">
                      {normalCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cần theo dõi:</span>
                    <span className="font-medium text-orange-600">
                      {abnormalCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Chưa khám:</span>
                    <span className="font-medium text-gray-600">
                      {classInfo.studentCount - checkedCount}
                    </span>
                  </div>
                </div>
                <Progress
                  value={(checkedCount / classInfo.studentCount) * 100}
                  className="mt-3"
                />
                <Button
                  className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
                  size="sm"
                >
                  Xem kết quả
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

const classesData = [
  { id: 1, name: "1A", studentCount: 25 },
  { id: 2, name: "1B", studentCount: 24 },
  { id: 3, name: "2A", studentCount: 26 },
  { id: 4, name: "2B", studentCount: 25 },
  { id: 5, name: "3A", studentCount: 27 },
  { id: 6, name: "3B", studentCount: 26 },
  { id: 7, name: "4A", studentCount: 23 },
  { id: 8, name: "4B", studentCount: 24 },
  { id: 9, name: "5A", studentCount: 22 },
  { id: 10, name: "5B", studentCount: 21 },
];

const examResultsData = [
  {
    id: 1,
    studentName: "Nguyễn Văn An",
    class: "1A",
    examType: "Khám tổng quát",
    examDate: "15/12/2024",
    height: "115 cm",
    weight: "20 kg",
    bmi: "15.1",
    result: "Bình thường",
  },
  {
    id: 2,
    studentName: "Trần Thị Bình",
    class: "1A",
    examType: "Thị lực",
    examDate: "14/12/2024",
    height: "122 cm",
    weight: "23 kg",
    bmi: "15.4",
    result: "Cần theo dõi",
  },
  {
    id: 3,
    studentName: "Lê Hoàng Cường",
    class: "2A",
    examType: "Răng miệng",
    examDate: "13/12/2024",
    height: "118 cm",
    weight: "21 kg",
    bmi: "15.1",
    result: "Bình thường",
  },
  {
    id: 4,
    studentName: "Phạm Minh Dương",
    class: "1A",
    examType: "Khám tổng quát",
    examDate: "12/12/2024",
    height: "120 cm",
    weight: "22 kg",
    bmi: "15.3",
    result: "Cần theo dõi",
  },
  {
    id: 5,
    studentName: "Hoàng Thị Lan",
    class: "2A",
    examType: "Thị lực",
    examDate: "11/12/2024",
    height: "125 cm",
    weight: "24 kg",
    bmi: "15.4",
    result: "Bình thường",
  },
];
