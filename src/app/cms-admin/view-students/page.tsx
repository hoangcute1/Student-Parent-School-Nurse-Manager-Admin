"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Eye, 
  Search, 
  Users, 
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  GraduationCap
} from "lucide-react";

interface Student {
  _id: string;
  name: string;
  studentId: string;
  class: string;
  birthDate: string;
  gender: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  healthStatus: "Tốt" | "Cần theo dõi" | "Có vấn đề";
  createdAt: string;
}

export default function ViewStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStudents([
        {
          _id: "1",
          name: "Nguyễn Văn An",
          studentId: "HS001",
          class: "Lớp 1A",
          birthDate: "2018-05-15",
          gender: "Nam",
          parentName: "Nguyễn Thị Lan",
          parentPhone: "0901234567",
          parentEmail: "lan.nguyen@email.com",
          address: "123 Đường ABC, Quận 1, TP.HCM",
          healthStatus: "Tốt",
          createdAt: "2024-01-10T08:00:00Z"
        },
        {
          _id: "2",
          name: "Trần Thị Mai",
          studentId: "HS002",
          class: "Lớp 2B",
          birthDate: "2017-08-22",
          gender: "Nữ",
          parentName: "Trần Văn Hùng",
          parentPhone: "0912345678",
          parentEmail: "hung.tran@email.com",
          address: "456 Đường XYZ, Quận 2, TP.HCM",
          healthStatus: "Cần theo dõi",
          createdAt: "2024-01-08T09:30:00Z"
        },
        {
          _id: "3",
          name: "Lê Văn Nam",
          studentId: "HS003",
          class: "Lớp 3C",
          birthDate: "2016-12-10",
          gender: "Nam",
          parentName: "Lê Thị Hoa",
          parentPhone: "0923456789",
          parentEmail: "hoa.le@email.com",
          address: "789 Đường DEF, Quận 3, TP.HCM",
          healthStatus: "Tốt",
          createdAt: "2024-01-05T10:15:00Z"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getHealthStatusBadge = (status: string) => {
    switch (status) {
      case "Tốt":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Tốt
          </Badge>
        );
      case "Cần theo dõi":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Cần theo dõi
          </Badge>
        );
      case "Có vấn đề":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Có vấn đề
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setShowDetails(true);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Xem quản lý học sinh</h1>
            <p className="text-gray-600">Danh sách tất cả học sinh - Chỉ xem</p>
          </div>
        </div>
        <Badge variant="outline" className="text-purple-600 border-purple-200">
          <Eye className="w-3 h-3 mr-1" />
          Read Only
        </Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, mã học sinh, lớp hoặc tên phụ huynh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-sm text-gray-600">Tổng học sinh</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {students.filter(s => s.healthStatus === "Tốt").length}
                </p>
                <p className="text-sm text-gray-600">Sức khỏe tốt</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {students.filter(s => s.healthStatus === "Cần theo dõi").length}
                </p>
                <p className="text-sm text-gray-600">Cần theo dõi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {students.filter(s => s.healthStatus === "Có vấn đề").length}
                </p>
                <p className="text-sm text-gray-600">Có vấn đề</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách học sinh</CardTitle>
          <CardDescription>
            Hiển thị {filteredStudents.length} / {students.length} học sinh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <Badge variant="outline">{student.studentId}</Badge>
                      {getHealthStatusBadge(student.healthStatus)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>{student.class}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{calculateAge(student.birthDate)} tuổi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{student.parentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{student.parentPhone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(student)}
                    className="ml-4"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Không tìm thấy học sinh nào</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Details Modal */}
      {showDetails && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Chi tiết học sinh</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Họ và tên</label>
                    <p className="text-gray-900 font-medium">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mã học sinh</label>
                    <p className="text-gray-900">{selectedStudent.studentId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Lớp</label>
                    <p className="text-gray-900">{selectedStudent.class}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Giới tính</label>
                    <p className="text-gray-900">{selectedStudent.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ngày sinh</label>
                    <p className="text-gray-900">
                      {new Date(selectedStudent.birthDate).toLocaleDateString("vi-VN")}
                      ({calculateAge(selectedStudent.birthDate)} tuổi)
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tình trạng sức khỏe</label>
                    <div className="mt-1">
                      {getHealthStatusBadge(selectedStudent.healthStatus)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Parent Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Thông tin phụ huynh
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Họ và tên</label>
                    <p className="text-gray-900">{selectedStudent.parentName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                    <p className="text-gray-900">{selectedStudent.parentPhone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{selectedStudent.parentEmail}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Địa chỉ
                </h3>
                <p className="text-gray-900">{selectedStudent.address}</p>
              </div>

              {/* System Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Thông tin hệ thống
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ngày tạo hồ sơ</label>
                    <p className="text-gray-900">
                      {new Date(selectedStudent.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowDetails(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
