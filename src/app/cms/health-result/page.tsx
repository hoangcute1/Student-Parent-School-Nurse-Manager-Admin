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
  TrendingUp,
  Users,
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

export default function ExamResults() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-teal-800">
          Kết quả Khám sức khỏe
        </h1>
        <p className="text-teal-600">
          Quản lý và theo dõi kết quả khám sức khỏe học sinh
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-teal-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-teal-700">
              Đã khám
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

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-teal-50">
          <TabsTrigger
            value="results"
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
          >
            Kết quả khám
          </TabsTrigger>
          <TabsTrigger
            value="periodic"
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
          >
            Khám định kỳ
          </TabsTrigger>

          <TabsTrigger
            value="statistics"
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
          >
            Thống kê
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-teal-800">
                    Kết quả khám sức khỏe
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
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm kết quả
                  </Button>
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
                      <TableHead>Lớp</TableHead>
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
                    {examResultsData.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">
                          {result.studentName}
                        </TableCell>
                        <TableCell>{result.class}</TableCell>
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
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
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
        </TabsContent>

        <TabsContent value="periodic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-teal-800">
                Khám sức khỏe định kỳ
              </CardTitle>
              <CardDescription className="text-teal-600">
                Lịch trình và kết quả khám sức khỏe định kỳ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {periodicExams.map((exam, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-teal-100 hover:bg-teal-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                        <ClipboardCheck className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-teal-800">
                          {exam.title}
                        </h4>
                        <p className="text-sm text-teal-600">
                          {exam.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          Thời gian: {exam.schedule}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {exam.completed}/{exam.total}
                        </p>
                        <p className="text-xs text-gray-500">Hoàn thành</p>
                      </div>
                      <Badge
                        variant={
                          exam.status === "Hoàn thành" ? "default" : "secondary"
                        }
                        className={
                          exam.status === "Hoàn thành"
                            ? "bg-green-100 text-green-800"
                            : exam.status === "Đang tiến hành"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {exam.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-teal-800">
                  Thống kê theo tháng
                </CardTitle>
                <CardDescription className="text-teal-600">
                  Số liệu khám sức khỏe trong các tháng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyStats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-teal-100"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-teal-600" />
                        <div>
                          <div className="font-medium text-teal-800">
                            {stat.month}
                          </div>
                          <div className="text-sm text-teal-600">
                            {stat.exams} lượt khám
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-teal-800">
                          {stat.normalRate}%
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          {stat.trend}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-teal-800">Phân tích BMI</CardTitle>
                <CardDescription className="text-teal-600">
                  Phân bố chỉ số BMI của học sinh
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bmiAnalysis.map((analysis, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-teal-700 font-medium">
                          {analysis.category}
                        </span>
                        <span className="text-teal-800">
                          {analysis.count} học sinh ({analysis.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${analysis.color}`}
                          style={{ width: `${analysis.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

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
    class: "2A",
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
    class: "1B",
    examType: "Răng miệng",
    examDate: "13/12/2024",
    height: "118 cm",
    weight: "21 kg",
    bmi: "15.1",
    result: "Bình thường",
  },
];

const periodicExams = [
  {
    title: "Khám sức khỏe đầu năm học",
    description: "Khám tổng quát cho tất cả học sinh",
    schedule: "Tháng 9/2024",
    completed: 248,
    total: 248,
    status: "Hoàn thành",
  },
  {
    title: "Khám sức khỏe giữa năm",
    description: "Khám định kỳ 6 tháng",
    schedule: "Tháng 12/2024",
    completed: 180,
    total: 248,
    status: "Đang tiến hành",
  },
  {
    title: "Khám chuyên khoa mắt",
    description: "Kiểm tra thị lực định kỳ",
    schedule: "Tháng 1/2025",
    completed: 0,
    total: 248,
    status: "Chưa bắt đầu",
  },
];

const specialistExams = [
  {
    specialty: "Khám mắt",
    description: "Kiểm tra thị lực và các bệnh về mắt",
    examined: 235,
    normal: 198,
    followUp: 37,
  },
  {
    specialty: "Khám răng miệng",
    description: "Kiểm tra sức khỏe răng miệng",
    examined: 240,
    normal: 180,
    followUp: 60,
  },
  {
    specialty: "Khám tai mũi họng",
    description: "Kiểm tra thính lực và TMH",
    examined: 220,
    normal: 205,
    followUp: 15,
  },
];

const monthlyStats = [
  {
    month: "Tháng 12/2024",
    exams: 156,
    normalRate: 85,
    trend: "+5%",
  },
  {
    month: "Tháng 11/2024",
    exams: 142,
    normalRate: 82,
    trend: "+3%",
  },
  {
    month: "Tháng 10/2024",
    exams: 168,
    normalRate: 88,
    trend: "+7%",
  },
];

const bmiAnalysis = [
  {
    category: "Thiếu cân",
    count: 25,
    percentage: 10,
    color: "bg-blue-500",
  },
  {
    category: "Bình thường",
    count: 180,
    percentage: 73,
    color: "bg-green-500",
  },
  {
    category: "Thừa cân",
    count: 35,
    percentage: 14,
    color: "bg-orange-500",
  },
  {
    category: "Béo phì",
    count: 8,
    percentage: 3,
    color: "bg-red-500",
  },
];
