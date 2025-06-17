"use client";

import {
  Download,
  Filter,
  Search,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/layout/sidebar/progress";

// Component hiển thị thông tin chi tiết của lần khám
interface ExaminationDetailsProps {
  exam: {
    date: string;
    type: string;
    doctor: string;
    result: string;
    notes: string;
    measurements?: { name: string; value: string }[];
    location?: string;
    recommendations?: string;
    nextAppointment?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

function ExaminationDetailsDialog({
  exam,
  isOpen,
  onClose,
}: ExaminationDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-blue-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Chi tiết lần khám: {exam.type}
          </DialogTitle>
          <DialogDescription className="text-blue-600">
            Ngày khám: {exam.date}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-700">
                Bác sĩ khám:
              </div>
              <div className="text-blue-800">{exam.doctor}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-700">Kết quả:</div>
              <Badge
                variant={
                  exam.result === "Bình thường" ? "default" : "secondary"
                }
                className={
                  exam.result === "Bình thường"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {exam.result === "Bình thường" ? (
                  <CheckCircle className="mr-1 h-3 w-3" />
                ) : (
                  <AlertCircle className="mr-1 h-3 w-3" />
                )}
                {exam.result}
              </Badge>
            </div>
          </div>

          {exam.location && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-700">
                Địa điểm khám:
              </div>
              <div className="text-blue-800">{exam.location}</div>
            </div>
          )}

          {exam.measurements && exam.measurements.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-700">
                Các chỉ số:
              </div>
              <div className="bg-blue-50 rounded-lg p-3 grid grid-cols-2 gap-2">
                {exam.measurements.map((measurement, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-700">
                      {measurement.name}:
                    </span>
                    <span className="text-sm text-blue-800 font-semibold">
                      {measurement.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm font-medium text-blue-700">Ghi chú:</div>
            <div className="bg-blue-50 rounded-lg p-3 text-blue-800">
              {exam.notes}
            </div>
          </div>

          {exam.recommendations && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-700">
                Khuyến nghị:
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-blue-800">
                {exam.recommendations}
              </div>
            </div>
          )}

          {exam.nextAppointment && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-700">
                Lịch tái khám:
              </div>
              <div className="text-blue-800">{exam.nextAppointment}</div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function RegularResultsPage() {
  const [selectedExam, setSelectedExam] = useState<
    (typeof examinationHistory)[0] | null
  >(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleOpenDialog = (exam: (typeof examinationHistory)[0]) => {
    setSelectedExam(exam);
    setIsDetailsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDetailsOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Kết quả khám
        </h1>
        <p className="text-blue-600">
          Xem kết quả kiểm tra sức khỏe định kỳ và theo dõi sự phát triển của
          học sinh.
        </p>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-blue-50">
          <TabsTrigger
            value="recent"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Kết quả gần đây
          </TabsTrigger>
          <TabsTrigger
            value="vaccination"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Kết quả tiêm
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Lịch sử khám
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm kết quả..."
                  className="w-[300px] pl-8 border-blue-200 focus:border-blue-500"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentResults.map((result, index) => (
              <Card
                key={index}
                className="border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg text-blue-800">
                        {result.type}
                      </CardTitle>
                    </div>
                    <Badge
                      variant={
                        result.status === "Bình thường"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        result.status === "Bình thường"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {result.status === "Bình thường" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {result.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-blue-600">
                    Ngày khám: {result.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {result.measurements.map((measurement, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm font-medium text-blue-700">
                          {measurement.name}:
                        </span>
                        <span className="text-sm text-blue-800 font-semibold">
                          {measurement.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  {result.notes && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Ghi chú:</span>{" "}
                        {result.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="vaccination" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm kết quả..."
                  className="w-[300px] pl-8 border-blue-200 focus:border-blue-500"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentResults.map((result, index) => (
              <Card
                key={index}
                className="border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg text-blue-800">
                        {result.type}
                      </CardTitle>
                    </div>
                    <Badge
                      variant={
                        result.status === "Bình thường"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        result.status === "Bình thường"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {result.status === "Bình thường" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {result.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-blue-600">
                    Ngày khám: {result.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {result.measurements.map((measurement, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm font-medium text-blue-700">
                          {measurement.name}:
                        </span>
                        <span className="text-sm text-blue-800 font-semibold">
                          {measurement.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  {result.notes && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Ghi chú:</span>{" "}
                        {result.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="growth" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Biểu đồ chiều cao
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Theo dõi sự phát triển chiều cao theo thời gian
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Biểu đồ cân nặng
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Theo dõi sự phát triển cân nặng theo thời gian
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-4">
          <div className="rounded-md border border-blue-200">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="text-blue-800">Ngày khám</TableHead>
                  <TableHead className="text-blue-800">Loại khám</TableHead>
                  <TableHead className="text-blue-800">Bác sĩ khám</TableHead>
                  <TableHead className="text-blue-800">Kết quả</TableHead>
                  <TableHead className="text-blue-800">Ghi chú</TableHead>
                  <TableHead className="text-right text-blue-800">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examinationHistory.map((exam, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleOpenDialog(exam)}
                  >
                    <TableCell className="font-medium text-blue-800">
                      {exam.date}
                    </TableCell>
                    <TableCell className="text-blue-700">{exam.type}</TableCell>
                    <TableCell className="text-blue-700">
                      {exam.doctor}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          exam.result === "Bình thường"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          exam.result === "Bình thường"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {exam.result}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-blue-700">
                      {exam.notes}
                    </TableCell>{" "}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-700 hover:bg-blue-100"
                        onClick={() => handleOpenDialog(exam)}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {selectedExam && (
        <ExaminationDetailsDialog
          exam={selectedExam}
          isOpen={isDetailsOpen}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
}

const recentResults = [
  {
    type: "Khám sức khỏe định kỳ",
    date: "15/05/2025",
    status: "Bình thường",
    measurements: [
      { name: "Chiều cao", value: "115 cm" },
      { name: "Cân nặng", value: "22 kg" },
      { name: "BMI", value: "16.6" },
      { name: "Thị lực", value: "10/10" },
    ],
    notes: "Sức khỏe tổng quát tốt, phát triển bình thường theo độ tuổi.",
  },
  {
    type: "Khám răng miệng",
    date: "10/05/2025",
    status: "Cần theo dõi",
    measurements: [
      { name: "Răng sữa", value: "18 răng" },
      { name: "Răng vĩnh viễn", value: "2 răng" },
      { name: "Sâu răng", value: "1 răng" },
    ],
    notes: "Phát hiện 1 răng sâu nhẹ, cần điều trị sớm.",
  },
  {
    type: "Khám mắt",
    date: "05/05/2025",
    status: "Bình thường",
    measurements: [
      { name: "Thị lực mắt phải", value: "10/10" },
      { name: "Thị lực mắt trái", value: "10/10" },
      { name: "Nhãn áp", value: "Bình thường" },
    ],
    notes: "Thị lực tốt, không có dấu hiệu bất thường.",
  },
];

const examinationHistory = [
  {
    date: "15/05/2025",
    type: "Khám sức khỏe định kỳ",
    doctor: "BS. Nguyễn Thị Hương",
    result: "Bình thường",
    notes: "Sức khỏe tổng quát tốt, phát triển bình thường theo độ tuổi.",
    location: "Phòng y tế trường Tiểu học Ánh Dương",
    measurements: [
      { name: "Chiều cao", value: "115 cm" },
      { name: "Cân nặng", value: "22 kg" },
      { name: "BMI", value: "16.6" },
      { name: "Thị lực", value: "10/10" },
      { name: "Nhịp tim", value: "85 nhịp/phút" },
      { name: "Huyết áp", value: "90/60 mmHg" },
    ],
    recommendations: "Tiếp tục duy trì chế độ dinh dưỡng và vận động hợp lý.",
    nextAppointment: "15/11/2025",
  },
  {
    date: "10/05/2025",
    type: "Khám răng miệng",
    doctor: "BS. Trần Văn Minh",
    result: "Cần theo dõi",
    notes: "Phát hiện 1 răng sâu nhẹ, cần điều trị sớm.",
    location: "Phòng khám Nha khoa trường Tiểu học Ánh Dương",
    measurements: [
      { name: "Răng sữa", value: "18 răng" },
      { name: "Răng vĩnh viễn", value: "2 răng" },
      { name: "Sâu răng", value: "1 răng" },
      { name: "Cao răng", value: "Nhẹ" },
    ],
    recommendations:
      "Đặt lịch điều trị sâu răng trong vòng 2 tuần. Hướng dẫn vệ sinh răng miệng đúng cách.",
    nextAppointment: "24/05/2025",
  },
  {
    date: "05/05/2025",
    type: "Khám mắt",
    doctor: "BS. Lê Thị Mai",
    result: "Bình thường",
    notes: "Thị lực tốt, không có dấu hiệu bất thường.",
    location: "Phòng khám Mắt trường Tiểu học Ánh Dương",
    measurements: [
      { name: "Thị lực mắt phải", value: "10/10" },
      { name: "Thị lực mắt trái", value: "10/10" },
      { name: "Nhãn áp", value: "Bình thường" },
      { name: "Khô mắt", value: "Không" },
    ],
    recommendations:
      "Hạn chế thời gian sử dụng thiết bị điện tử, đảm bảo ánh sáng phù hợp khi đọc sách.",
    nextAppointment: "05/11/2025",
  },
  {
    date: "01/04/2025",
    type: "Khám sức khỏe định kỳ",
    doctor: "BS. Nguyễn Thị Hương",
    result: "Bình thường",
    notes: "Phát triển tốt, cần bổ sung vitamin D.",
    location: "Phòng y tế trường Tiểu học Ánh Dương",
    measurements: [
      { name: "Chiều cao", value: "114 cm" },
      { name: "Cân nặng", value: "21.5 kg" },
      { name: "BMI", value: "16.5" },
      { name: "Thị lực", value: "10/10" },
      { name: "Nhịp tim", value: "88 nhịp/phút" },
    ],
    recommendations: "Bổ sung vitamin D, tăng cường hoạt động ngoài trời.",
    nextAppointment: "01/10/2025",
  },
  {
    date: "15/01/2025",
    type: "Khám tim mạch",
    doctor: "BS. Phạm Văn Đức",
    result: "Bình thường",
    notes: "Tim mạch hoạt động bình thường, nhịp tim đều.",
    location: "Bệnh viện Nhi Trung ương",
    measurements: [
      { name: "Nhịp tim", value: "86 nhịp/phút" },
      { name: "Huyết áp", value: "90/60 mmHg" },
      { name: "ECG", value: "Bình thường" },
    ],
    recommendations: "Tiếp tục theo dõi định kỳ mỗi 6 tháng.",
    nextAppointment: "15/07/2025",
  },
];
