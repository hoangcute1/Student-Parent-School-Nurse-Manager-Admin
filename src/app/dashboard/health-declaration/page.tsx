"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit,
  AlertTriangle,
  Heart,
  Shield,
} from "lucide-react";
import { useHealthRecordStore } from "@/stores/health-record-store";
import { useStudentStore } from "@/stores/student-store";
import { useAuthStore } from "@/stores/auth-store";
import { HealthRecord as ApiHealthRecord } from "@/lib/type/health-record";
import { Student } from "@/lib/type/students";

// UI Health Record Interface for compatibility with existing UI
interface HealthRecord {
  id: string;
  studentName: string;
  class: {
    name: string;
    id: string;
  } | null; // Class can be null if not assigned
  
  allergies: string | null;
  chronicDisease: string | null;
  vision: string;
  lastUpdated: string;
  rawData: ApiHealthRecord | null; // Store the complete API data
  studentData: Student | null; // Store the student data
}

interface AllergyRecord {
  studentName: string;
  class: string;
  foodAllergies: string | null;
  drugAllergies: string | null;
  otherAllergies: string | null;
  emergencyAction?: string;
}

interface ChronicDiseaseRecord {
  studentName: string;
  class: string;
  disease: string;
  condition: string;
  medication: string;
  notes: string;
}

interface Vaccine {
  name: string;
  completed: boolean;
}

interface VaccinationRecord {
  studentName: string;
  class: string;
  completionRate: number;
  vaccines: Vaccine[];
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ParentHealthRecords() {  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(
    null
  );
  
  const { records, isLoading: isLoadingRecords, error: recordsError, fetchRecords } = useHealthRecordStore();
  const { students, isLoading: isLoadingStudents, error: studentsError, fetchStudents } = useStudentStore();
  const { user, isAuthenticated, role } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated && role === "parent") {
      fetchStudents();
      fetchRecords();
    }
  }, [isAuthenticated, role, fetchRecords, fetchStudents]);
  
  // Map student data to UI health records
  const healthRecords: HealthRecord[] = students.map((student) => {
    // Find health record for this student if it exists
    const studentRecord = records.find(record => record.student?.studentId === student._id);
    
    // Transform class data to match HealthRecord interface
    const classData = typeof student.class === 'object' && student.class 
      ? { name: student.class.name, id: student.class._id }
      : null;
    
    return {
      id: student._id,
      studentName: student.name || "Không có tên",
      class: classData,
      allergies: studentRecord?.allergies && studentRecord.allergies.length > 0 ? "Có" : null,
      chronicDisease: studentRecord?.chronic_conditions && studentRecord.chronic_conditions.length > 0 ? "Có" : null,
      vision: studentRecord?.vision || "Chưa cập nhật",
      lastUpdated: studentRecord?.updated_at 
        ? new Date(studentRecord.updated_at).toLocaleDateString("vi-VN") 
        : "Chưa cập nhật",
      rawData: studentRecord || null,
      studentData: student
    };
  });
  
  // Filter records based on search term and category
  const filteredRecords = healthRecords.filter((record) => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedCategory === "all") return matchesSearch;
    if (selectedCategory === "allergies") return matchesSearch && record.allergies;
    if (selectedCategory === "chronic") return matchesSearch && record.chronicDisease;
    return matchesSearch;
  });

  const handleSubmitRecord = () => {
    setIsAddRecordOpen(false);
    alert(
      selectedRecord
        ? "Đã cập nhật hồ sơ sức khỏe thành công!"
        : "Đã thêm hồ sơ sức khỏe mới thành công!"
    );
    setSelectedRecord(null);
  };

  const handleViewDetail = (record: HealthRecord) => {
    setSelectedRecord(record);
    setIsDetailViewOpen(true);
  };

  const handleEditRecord = (record: HealthRecord) => {
    setSelectedRecord(record);
    setIsAddRecordOpen(true);
  };

  const handleAddDialogOpenChange = (open: boolean) => {
    setIsAddRecordOpen(open);
    if (!open) {
      setSelectedRecord(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Hồ sơ Sức khỏe
        </h1>
        <p className="text-blue-600">Quản lý thông tin sức khỏe của học sinh</p>
      </div>      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Tổng hồ sơ
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{healthRecords.length}</div>
            <p className="text-xs text-blue-600">Học sinh đã khai báo</p>
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Có dị ứng
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">
              {healthRecords.filter(record => record.allergies).length}
            </div>
            <p className="text-xs text-red-600">Cần chú ý đặc biệt</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Bệnh mãn tính
            </CardTitle>
            <Heart className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">
              {healthRecords.filter(record => record.chronicDisease).length}
            </div>
            <p className="text-xs text-orange-600">Cần theo dõi</p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              BMI bình thường
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>            <div className="text-2xl font-bold text-green-800">
              {healthRecords.filter(record => {
                if (!record.rawData || !record.rawData.height || !record.rawData.weight) return false;
                const height = record.rawData.height / 100; // cm to m
                const weight = record.rawData.weight;
                const bmi = weight / (height * height);
                return bmi >= 18.5 && bmi <= 24.9;
              }).length}
            </div>
            <p className="text-xs text-green-600">Có chỉ số BMI tốt</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <TabsList className="bg-blue-50">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              value="allergies"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Dị ứng
            </TabsTrigger>
            <TabsTrigger
              value="chronic"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Bệnh mãn tính
            </TabsTrigger>
            <TabsTrigger
              value="vaccination"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Tiêm chủng
            </TabsTrigger>
          </TabsList>

          <Dialog
            open={isAddRecordOpen}
            onOpenChange={handleAddDialogOpenChange}
          >
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Câp nhật mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedRecord
                    ? "Chỉnh sửa hồ sơ sức khỏe"
                    : "Khai báo hồ sơ sức khỏe học sinh"}
                </DialogTitle>
                <DialogDescription>
                  Vui lòng điền đầy đủ thông tin sức khỏe của con em
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Thông tin cơ bản */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-800">
                    Thông tin cơ bản
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="student">Học sinh</Label>
                      <Select
                        defaultValue={
                          selectedRecord ? "selected-student" : undefined
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn học sinh" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedRecord ? (
                            <SelectItem value="selected-student">
                              {selectedRecord.studentName} -{" "}
                              {selectedRecord.class?.name}
                            </SelectItem>
                          ) : (
                            <>
                              <SelectItem value="student1">
                                Nguyễn Văn An - Lớp 1A
                              </SelectItem>
                              <SelectItem value="student2">
                                Trần Thị Bình - Lớp 2B
                              </SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Nhóm máu</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhóm máu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="AB">AB</SelectItem>
                          <SelectItem value="O">O</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Dị ứng */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-800">Dị ứng</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="no-allergy"
                        defaultChecked={
                          selectedRecord ? !selectedRecord.allergies : false
                        }
                      />
                      <Label htmlFor="no-allergy">Không có dị ứng</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Dị ứng thức ăn</Label>
                        <div className="space-y-2">
                          {[
                            "Hải sản",
                            "Đậu phộng",
                            "Sữa",
                            "Trứng",
                            "Gluten",
                          ].map((item) => (
                            <div
                              key={item}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox id={`food-${item}`} />
                              <Label htmlFor={`food-${item}`}>{item}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Dị ứng thuốc</Label>
                        <div className="space-y-2">
                          {["Penicillin", "Aspirin", "Ibuprofen", "Sulfa"].map(
                            (item) => (
                              <div
                                key={item}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox id={`drug-${item}`} />
                                <Label htmlFor={`drug-${item}`}>{item}</Label>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="other-allergies">Dị ứng khác</Label>
                      <Textarea
                        id="other-allergies"
                        placeholder="Mô tả các dị ứng khác..."
                      />
                    </div>
                  </div>
                </div>

                {/* Bệnh mãn tính */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800">
                    Bệnh mãn tính
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "Hen suyễn",
                      "Tiểu đường",
                      "Tim mạch",
                      "Thận",
                      "Gan",
                      "Khác",
                    ].map((disease) => (
                      <div
                        key={disease}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox id={`chronic-${disease}`} />
                        <Label htmlFor={`chronic-${disease}`}>{disease}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chronic-details">
                      Chi tiết bệnh mãn tính
                    </Label>
                    <Textarea
                      id="chronic-details"
                      placeholder="Mô tả chi tiết về bệnh mãn tính..."
                    />
                  </div>
                </div>

                {/* Tiền sử điều trị */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-800">
                    Tiền sử điều trị
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="no-surgery" />
                      <Label htmlFor="no-surgery">Chưa từng phẫu thuật</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="surgery-history">
                        Lịch sử phẫu thuật
                      </Label>
                      <Textarea
                        id="surgery-history"
                        placeholder="Mô tả các ca phẫu thuật đã thực hiện..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hospitalization">Lịch sử nhập viện</Label>
                      <Textarea
                        id="hospitalization"
                        placeholder="Mô tả các lần nhập viện..."
                      />
                    </div>
                  </div>
                </div>

                {/* Thị lực và thính lực */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-800">
                    Thị lực và Thính lực
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>Thị lực</Label>
                      <RadioGroup defaultValue="normal">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="vision-normal" />
                          <Label htmlFor="vision-normal">Bình thường</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="myopia" id="vision-myopia" />
                          <Label htmlFor="vision-myopia">Cận thị</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="hyperopia"
                            id="vision-hyperopia"
                          />
                          <Label htmlFor="vision-hyperopia">Viễn thị</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="astigmatism"
                            id="vision-astigmatism"
                          />
                          <Label htmlFor="vision-astigmatism">Loạn thị</Label>
                        </div>
                      </RadioGroup>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor="left-eye">Mắt trái</Label>
                          <Input id="left-eye" placeholder="VD: 10/10" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="right-eye">Mắt phải</Label>
                          <Input id="right-eye" placeholder="VD: 10/10" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Thính lực</Label>
                      <RadioGroup defaultValue="normal">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="hearing-normal" />
                          <Label htmlFor="hearing-normal">Bình thường</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mild" id="hearing-mild" />
                          <Label htmlFor="hearing-mild">Giảm nhẹ</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="moderate"
                            id="hearing-moderate"
                          />
                          <Label htmlFor="hearing-moderate">Giảm vừa</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="severe" id="hearing-severe" />
                          <Label htmlFor="hearing-severe">Giảm nặng</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* Tiêm chủng */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-800">
                    Lịch sử tiêm chủng
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "BCG",
                      "Viêm gan B",
                      "DPT",
                      "Bại liệt",
                      "Sởi",
                      "Rubella",
                      "Quai bị",
                      "Thủy đậu",
                      "Cúm",
                      "Não mô cầu",
                    ].map((vaccine) => (
                      <div
                        key={vaccine}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox id={`vaccine-${vaccine}`} />
                        <Label htmlFor={`vaccine-${vaccine}`}>{vaccine}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vaccination-notes">
                      Ghi chú tiêm chủng
                    </Label>
                    <Textarea
                      id="vaccination-notes"
                      placeholder="Ghi chú về lịch sử tiêm chủng..."
                    />
                  </div>
                </div>

                {/* Thông tin liên hệ khẩn cấp */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-800">
                    Thông tin liên hệ khẩn cấp
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergency-contact">Người liên hệ</Label>
                      <Input
                        id="emergency-contact"
                        placeholder="Họ tên người liên hệ"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency-phone">Số điện thoại</Label>
                      <Input
                        id="emergency-phone"
                        placeholder="Số điện thoại khẩn cấp"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="family-doctor">Bác sĩ gia đình</Label>
                    <Input
                      id="family-doctor"
                      placeholder="Tên và số điện thoại bác sĩ gia đình"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleAddDialogOpenChange(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSubmitRecord}
                  >
                    {selectedRecord ? "Cập nhật" : "Lưu hồ sơ"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="all" className="mt-6">
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
                  </TableHeader>                  <TableBody>
                    {isLoadingRecords || isLoadingStudents ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          <p className="text-gray-500">Không có dữ liệu hồ sơ sức khỏe</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {record.studentName}
                          </TableCell>
                          <TableCell>{record.class?.name}</TableCell>
                          <TableCell>
                            {record.allergies ? (
                              <Badge
                                variant="destructive"
                                className="bg-red-100 text-red-800"
                              >
                                {record.allergies}
                              </Badge>
                            ) : (
                              <span className="text-gray-500">Không</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {record.chronicDisease ? (
                              <Badge
                                variant="secondary"
                                className="bg-orange-100 text-orange-800"
                              >
                                {record.chronicDisease}
                              </Badge>
                            ) : (
                              <span className="text-gray-500">Không</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.vision === "Bình thường"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                record.vision === "Bình thường"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {record.vision}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.lastUpdated}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetail(record)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditRecord(record)}
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
        </TabsContent>

        <TabsContent value="allergies" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-800">Học sinh có dị ứng</CardTitle>
              <CardDescription className="text-red-600">
                Danh sách học sinh cần chú ý về dị ứng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allergyRecords.map((record, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-red-100 bg-red-50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-red-900">
                          {record.studentName}
                        </h4>
                        <p className="text-sm text-red-700">{record.class}</p>
                      </div>
                      <Badge className="bg-red-100 text-red-800">Dị ứng</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Dị ứng thức ăn:</strong>{" "}
                        {record.foodAllergies || "Không"}
                      </p>
                      <p className="text-sm">
                        <strong>Dị ứng thuốc:</strong>{" "}
                        {record.drugAllergies || "Không"}
                      </p>
                      <p className="text-sm">
                        <strong>Dị ứng khác:</strong>{" "}
                        {record.otherAllergies || "Không"}
                      </p>
                      {record.emergencyAction && (
                        <p className="text-sm">
                          <strong>Xử lý khẩn cấp:</strong>{" "}
                          {record.emergencyAction}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chronic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-800">Bệnh mãn tính</CardTitle>
              <CardDescription className="text-orange-600">
                Học sinh có bệnh mãn tính cần theo dõi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chronicDiseaseRecords.map((record, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-orange-100 bg-orange-50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-orange-900">
                          {record.studentName}
                        </h4>
                        <p className="text-sm text-orange-700">
                          {record.class}
                        </p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">
                        {record.disease}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Tình trạng:</strong> {record.condition}
                      </p>
                      <p className="text-sm">
                        <strong>Thuốc đang dùng:</strong> {record.medication}
                      </p>
                      <p className="text-sm">
                        <strong>Lưu ý:</strong> {record.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccination" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">
                Tình trạng tiêm chủng
              </CardTitle>
              <CardDescription className="text-green-600">
                Theo dõi lịch sử tiêm chủng của học sinh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vaccinationRecords.map((record, index) => (
                  <Card key={index} className="border-green-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-green-800">
                        {record.studentName}
                      </CardTitle>
                      <CardDescription className="text-green-600">
                        {record.class}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Tỷ lệ hoàn thành:</span>
                          <Badge className="bg-green-100 text-green-800">
                            {record.completionRate}%
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {record.vaccines.map((vaccine, vIndex) => (
                            <div
                              key={vIndex}
                              className="flex justify-between text-xs"
                            >
                              <span>{vaccine.name}</span>
                              <span
                                className={
                                  vaccine.completed
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {vaccine.completed ? "✓" : "✗"}
                              </span>
                            </div>
                          ))}
                        </div>
                        <Button
                          className="w-full mt-3 bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Health Record Detail View Dialog */}
      <Dialog open={isDetailViewOpen} onOpenChange={setIsDetailViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-blue-800">
              {selectedRecord?.studentName} - Chi tiết Hồ sơ sức khỏe
            </DialogTitle>
            <DialogDescription>
              Thông tin sức khỏe chi tiết của học sinh
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-6">              {/* Thông tin cơ bản */}
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Học sinh:
                    </p>
                    <p className="text-sm font-semibold">
                      {selectedRecord.studentName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Lớp:</p>
                    <p className="text-sm font-semibold">
                      {selectedRecord.class?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Cập nhật lần cuối:
                    </p>
                    <p className="text-sm font-semibold">
                      {selectedRecord.lastUpdated}
                    </p>
                  </div>                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Nhóm máu:
                    </p>
                    <p className="text-sm font-semibold">{selectedRecord.rawData?.blood_type || "Chưa cập nhật"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Chiều cao:
                    </p>
                    <p className="text-sm font-semibold">{selectedRecord.rawData?.height ? `${selectedRecord.rawData.height} cm` : "Chưa cập nhật"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Cân nặng:
                    </p>
                    <p className="text-sm font-semibold">{selectedRecord.rawData?.weight ? `${selectedRecord.rawData.weight} kg` : "Chưa cập nhật"}</p>
                  </div>
                </div>
              </div>              {/* Dị ứng */}
              <div className="rounded-lg border border-red-100 bg-red-50 p-4">                <h3 className="text-lg font-semibold text-red-800 mb-3">
                  Dị ứng
                </h3>
                {selectedRecord.allergies ? (
                  <div className="space-y-2">
                    {selectedRecord.rawData?.allergies?.map((allergy, index) => (
                      <div key={index} className="flex items-center">
                        <Badge className="bg-red-100 text-red-800 mr-2">
                          {allergy}
                        </Badge>
                      </div>
                    ))}
                    <p className="text-sm mt-3">
                      <strong>Lưu ý:</strong> Các dị ứng trên cần được theo dõi và tránh tiếp xúc với tác nhân gây dị ứng.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Không có dị ứng</p>
                )}
              </div>              {/* Bệnh mãn tính */}
              <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">                <h3 className="text-lg font-semibold text-orange-800 mb-3">
                  Bệnh mãn tính
                </h3>
                {selectedRecord.chronicDisease ? (
                  <div className="space-y-2">
                    {selectedRecord.rawData?.chronic_conditions?.map((condition, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <Badge className="bg-orange-100 text-orange-800 mr-2">
                          {condition}
                        </Badge>
                      </div>
                    ))}
                    <p className="text-sm mt-3">
                      <strong>Lưu ý:</strong> Các bệnh mãn tính trên cần được theo dõi thường xuyên và có kế hoạch điều trị phù hợp.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Không có bệnh mãn tính
                  </p>
                )}
              </div>

              {/* Thị lực và thính lực */}
              <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  Thị lực và Thính lực
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Thị lực:</p>
                    <Badge
                      className={
                        selectedRecord.vision === "Bình thường"
                          ? "bg-green-100 text-green-800 mt-1"
                          : "bg-yellow-100 text-yellow-800 mt-1"
                      }
                    >
                      {selectedRecord.vision}
                    </Badge>
                    {selectedRecord.vision !== "Bình thường" && (
                      <p className="text-sm mt-2">
                        Cần đeo kính khi học và đọc sách
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Thính lực:</p>
                    <Badge className="bg-green-100 text-green-800 mt-1">
                      Bình thường
                    </Badge>
                  </div>
                </div>              </div>

              {/* Lịch sử điều trị */}
              <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">
                  Lịch sử điều trị
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "BCG",
                    "Viêm gan B",
                    "DPT",
                    "Bại liệt",
                    "Sởi",
                    "Rubella",
                    "Quai bị",
                    "Thủy đậu",
                  ].map((vaccine) => (
                    <div
                      key={vaccine}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm">{vaccine}</span>
                      <Badge className="bg-green-100 text-green-800">✓</Badge>
                    </div>
                  ))}
                </div>
                <p className="text-sm mt-3">
                  <strong>Tỷ lệ hoàn thành:</strong> 95%
                </p>
              </div>

              {/* Thông tin liên hệ khẩn cấp */}
              <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-3">
                  Thông tin liên hệ khẩn cấp
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Phụ huynh:</strong> Nguyễn Văn Phụ huynh
                  </p>
                  <p className="text-sm">
                    <strong>Số điện thoại:</strong> 0987654321
                  </p>
                  <p className="text-sm">
                    <strong>Bác sĩ gia đình:</strong> Bs. Trần Văn A -
                    0123456789
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailViewOpen(false)}
                >
                  Đóng
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setIsDetailViewOpen(false);
                    handleEditRecord(selectedRecord);
                  }}
                >
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const healthRecordsData = [
  {
    id: 1,
    studentName: "Nguyễn Văn An",
    class: "1A",
    allergies: "Hải sản",
    chronicDisease: null,
    vision: "Bình thường",
    lastUpdated: "10/05/2025",
  },
  {
    id: 2,
    studentName: "Trần Thị Bình",
    class: "2B",
    allergies: null,
    chronicDisease: "Hen suyễn",
    vision: "Cận thị nhẹ",
    lastUpdated: "05/05/2025",
  },
  {
    id: 3,
    studentName: "Lê Hoàng Cường",
    class: "3C",
    allergies: "Phấn hoa",
    chronicDisease: null,
    vision: "Bình thường",
    lastUpdated: "01/05/2025",
  },
  {
    id: 4,
    studentName: "Phạm Minh Dương",
    class: "4A",
    allergies: null,
    chronicDisease: null,
    vision: "Bình thường",
    lastUpdated: "28/04/2025",
  },
  {
    id: 5,
    studentName: "Hoàng Thị Lan",
    class: "5B",
    allergies: "Đậu phộng",
    chronicDisease: "Tiểu đường type 1",
    vision: "Cận thị",
    lastUpdated: "25/04/2025",
  },
];

const allergyRecords = [
  {
    studentName: "Nguyễn Văn An",
    class: "Lớp 1A",
    foodAllergies: "Hải sản (tôm, cua, cá)",
    drugAllergies: "Penicillin",
    otherAllergies: "Không",
    emergencyAction: "Tiêm epinephrine, gọi 115 ngay lập tức",
  },
  {
    studentName: "Lê Hoàng Cường",
    class: "Lớp 3C",
    foodAllergies: "Không",
    drugAllergies: "Không",
    otherAllergies: "Phấn hoa, bụi nhà",
    emergencyAction: "Cho uống thuốc kháng histamine",
  },
  {
    studentName: "Hoàng Thị Lan",
    class: "Lớp 5B",
    foodAllergies: "Đậu phộng, các loại hạt",
    drugAllergies: "Aspirin",
    otherAllergies: "Không",
    emergencyAction: "Tiêm epinephrine, thông báo phụ huynh ngay",
  },
];

const chronicDiseaseRecords = [
  {
    studentName: "Trần Thị Bình",
    class: "Lớp 2B",
    disease: "Hen suyễn",
    condition: "Kiểm soát tốt",
    medication: "Salbutamol xịt khi cần",
    notes: "Tránh vận động mạnh, có sẵn thuốc xịt",
  },
  {
    studentName: "Hoàng Thị Lan",
    class: "Lớp 5B",
    disease: "Tiểu đường type 1",
    condition: "Ổn định",
    medication: "Insulin theo chỉ định bác sĩ",
    notes: "Kiểm tra đường huyết định kỳ, chế độ ăn đặc biệt",
  },
];

const vaccinationRecords = [
  {
    studentName: "Nguyễn Văn An",
    class: "Lớp 1A",
    completionRate: 95,
    vaccines: [
      { name: "BCG", completed: true },
      { name: "Viêm gan B", completed: true },
      { name: "DPT", completed: true },
      { name: "Bại liệt", completed: true },
      { name: "Sởi", completed: false },
    ],
  },
  {
    studentName: "Trần Thị Bình",
    class: "Lớp 2B",
    completionRate: 100,
    vaccines: [
      { name: "BCG", completed: true },
      { name: "Viêm gan B", completed: true },
      { name: "DPT", completed: true },
      { name: "Bại liệt", completed: true },
      { name: "Sởi", completed: true },
    ],
  },
  {
    studentName: "Lê Hoàng Cường",
    class: "Lớp 3C",
    completionRate: 90,
    vaccines: [
      { name: "BCG", completed: true },
      { name: "Viêm gan B", completed: true },
      { name: "DPT", completed: true },
      { name: "Bại liệt", completed: false },
      { name: "Sởi", completed: true },
    ],
  },
];
