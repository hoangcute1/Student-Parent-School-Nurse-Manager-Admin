"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Eye, MoreVertical, Search, Filter, FileDown, Clock, CheckCircle, Phone, Plus, AlertTriangle, ClipboardCheck, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface HealthResult {
  id: string;
  studentName: string;
  studentId: string;
  gender: string;
  dateOfBirth: string;
  height: number;
  weight: number;
  bmi: number;
  bmiStatus: string;
  vision: string;
  dental: string;
  notes: string;
  date: string;
}

interface ClassHealthResultListProps {
  className: string;
  classId?: string;
  completed?: number;
  total?: number;
  onRecordClick?: (student: any) => void;
  onNotifyClick?: (student: any) => void;
}

const mockHealthResults: HealthResult[] = [
  {
    id: "HR001",
    studentName: "Nguyễn Văn An",
    studentId: "ST001",
    gender: "Nam",
    dateOfBirth: "15/05/2016",
    height: 135.5,
    weight: 32.8,
    bmi: 17.9,
    bmiStatus: "Bình thường",
    vision: "Bình thường",
    dental: "Sâu răng nhẹ",
    notes: "Cần theo dõi tình trạng răng, đề nghị khám nha khoa định kỳ",
    date: "10/04/2025",
  },
  {
    id: "HR002",
    studentName: "Trần Thị Bình",
    studentId: "ST002",
    gender: "Nữ",
    dateOfBirth: "22/07/2016",
    height: 132.0,
    weight: 28.5,
    bmi: 16.3,
    bmiStatus: "Thiếu cân",
    vision: "Cận thị nhẹ",
    dental: "Bình thường",
    notes: "Cần bổ sung dinh dưỡng và theo dõi thị lực",
    date: "10/04/2025",
  },
  {
    id: "HR003",
    studentName: "Lê Minh Cường",
    studentId: "ST003",
    gender: "Nam",
    dateOfBirth: "03/11/2016",
    height: 138.2,
    weight: 38.4,
    bmi: 20.1,
    bmiStatus: "Thừa cân nhẹ",
    vision: "Bình thường",
    dental: "Bình thường",
    notes: "Cần tăng cường vận động và điều chỉnh chế độ ăn",
    date: "10/04/2025",
  },
  {
    id: "HR004",
    studentName: "Phạm Thị Dung",
    studentId: "ST004",
    gender: "Nữ",
    dateOfBirth: "18/02/2016",
    height: 133.5,
    weight: 30.1,
    bmi: 16.9,
    bmiStatus: "Bình thường",
    vision: "Cận thị nhẹ",
    dental: "Bình thường",
    notes: "Cần kiểm tra thị lực định kỳ",
    date: "10/04/2025",
  },
  {
    id: "HR005",
    studentName: "Hoàng Văn Đức",
    studentId: "ST005",
    gender: "Nam",
    dateOfBirth: "07/09/2016",
    height: 136.0,
    weight: 33.2,
    bmi: 17.9,
    bmiStatus: "Bình thường",
    vision: "Bình thường",
    dental: "Bình thường",
    notes: "Sức khỏe tổng thể tốt",
    date: "10/04/2025",
  },
];

export default function ClassHealthResultList({
  className,
  classId,
  completed,
  total,
  onRecordClick,
  onNotifyClick
}: ClassHealthResultListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResult, setSelectedResult] = useState<HealthResult | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Filtered results based on search term
  const filteredResults = mockHealthResults.filter(
    (result) =>
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetail = (result: HealthResult) => {
    setSelectedResult(result);
    setShowDetailDialog(true);
  };

  const getBmiStatusColor = (status: string) => {
    switch (status) {
      case "Thiếu cân":
        return "bg-yellow-100 text-yellow-800";
      case "Bình thường":
        return "bg-green-100 text-green-800";
      case "Thừa cân nhẹ":
        return "bg-orange-100 text-orange-800";
      case "Béo phì":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-teal-800">
          Kết quả khám sức khỏe - {className}
        </CardTitle>
        <CardDescription className="text-teal-600">
          Danh sách kết quả khám sức khỏe định kỳ của học sinh
        </CardDescription>

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm học sinh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <FileDown className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-teal-50">
                <TableHead className="font-medium text-teal-800">
                  Học sinh
                </TableHead>
                <TableHead className="font-medium text-teal-800">
                  Chiều cao (cm)
                </TableHead>
                <TableHead className="font-medium text-teal-800">
                  Cân nặng (kg)
                </TableHead>
                <TableHead className="font-medium text-teal-800">BMI</TableHead>
                <TableHead className="font-medium text-teal-800">
                  Thị lực
                </TableHead>
                <TableHead className="font-medium text-teal-800">
                  Răng miệng
                </TableHead>
                <TableHead className="font-medium text-teal-800">
                  Ngày khám
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div className="font-medium">{result.studentName}</div>
                      <div className="text-sm text-gray-500">
                        {result.studentId}
                      </div>
                    </TableCell>
                    <TableCell>{result.height}</TableCell>
                    <TableCell>{result.weight}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{result.bmi.toFixed(1)}</span>
                        <Badge
                          variant="secondary"
                          className={getBmiStatusColor(result.bmiStatus)}
                        >
                          {result.bmiStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{result.vision}</TableCell>
                    <TableCell>{result.dental}</TableCell>
                    <TableCell>{result.date}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Mở menu</span>
                          </Button>
                        </DropdownMenuTrigger>                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetail(result)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          {onRecordClick && (
                            <DropdownMenuItem
                              onClick={() => onRecordClick(result)}
                            >
                              <ClipboardCheck className="h-4 w-4 mr-2" />
                              Cập nhật kết quả
                            </DropdownMenuItem>
                          )}
                          {onNotifyClick && (
                            <DropdownMenuItem
                              onClick={() => onNotifyClick(result)}
                            >
                              <Bell className="h-4 w-4 mr-2" />
                              Thông báo phụ huynh
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-gray-500"
                  >
                    Không tìm thấy kết quả nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Dialog chi tiết kết quả khám */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-teal-800">
                Chi tiết kết quả khám sức khỏe
              </DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về kết quả khám sức khỏe của học sinh
              </DialogDescription>
            </DialogHeader>

            {selectedResult && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">
                      Thông tin học sinh
                    </h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Họ tên:</span>{" "}
                        {selectedResult.studentName}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Mã học sinh:</span>{" "}
                        {selectedResult.studentId}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Giới tính:</span>{" "}
                        {selectedResult.gender}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Ngày sinh:</span>{" "}
                        {selectedResult.dateOfBirth}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700">
                      Thông tin đợt khám
                    </h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Ngày khám:</span>{" "}
                        {selectedResult.date}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Mã kết quả:</span>{" "}
                        {selectedResult.id}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Lớp:</span> {className}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Kết quả đo chỉ số
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-teal-50 border border-teal-100">
                      <p className="text-sm text-teal-600">Chiều cao</p>
                      <p className="text-xl font-bold text-teal-800">
                        {selectedResult.height} cm
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-teal-50 border border-teal-100">
                      <p className="text-sm text-teal-600">Cân nặng</p>
                      <p className="text-xl font-bold text-teal-800">
                        {selectedResult.weight} kg
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-teal-50 border border-teal-100">
                      <p className="text-sm text-teal-600">Chỉ số BMI</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-bold text-teal-800">
                          {selectedResult.bmi.toFixed(1)}
                        </p>
                        <Badge
                          variant="secondary"
                          className={getBmiStatusColor(
                            selectedResult.bmiStatus
                          )}
                        >
                          {selectedResult.bmiStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Kết quả khám chuyên khoa
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Thị lực</p>
                      <p className="text-sm mt-1">{selectedResult.vision}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Răng miệng</p>
                      <p className="text-sm mt-1">{selectedResult.dental}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Ghi chú</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {selectedResult.notes}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-end">
                  <Button
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={() => setShowDetailDialog(false)}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
