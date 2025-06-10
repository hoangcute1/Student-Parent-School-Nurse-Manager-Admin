"use client";

import { useState } from "react";
import {
  Shield,
  Plus,
  Search,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
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
import { Progress } from "@/components/ui/progress";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Types
interface VaccineInfo {
  name: string;
  doses: string;
  interval: string;
}

interface Schedule {
  vaccine: string;
  targetGroup: string;
  date: string;
  completed: number;
  total: number;
  status: string;
}

interface ClassProgress {
  class: string;
  completed: number;
  total: number;
}

interface MonthlyStat {
  label: string;
  description: string;
  value: string;
  trend: string;
  icon: any;
}

interface VaccinationRecord {
  id: number;
  studentName: string;
  class: string;
  vaccine: string;
  date: string;
  dose: string;
  reaction: string;
  status: string;
}

interface Vaccine {
  name: string;
  description: string;
  ageGroup: string;
  doses: string;
  interval: string;
  stock: number;
}

interface VaccinationDetail {
  name: string;
  class: string;
  status: string;
  vaccinationDate: string | null;
  reaction: string;
  issues: string | null;
}

type VaccineType = "flu" | "hepatitis" | "measles" | "polio" | "dpt";

const vaccineInfoMap: Record<VaccineType, VaccineInfo> = {
  flu: { name: "Vắc-xin cúm mùa", doses: "1 liều", interval: "Hàng năm" },
  hepatitis: {
    name: "Vắc-xin viêm gan B",
    doses: "3 liều",
    interval: "0, 1, 6 tháng",
  },
  measles: { name: "Vắc-xin sởi", doses: "2 liều", interval: "4 tuần" },
  polio: {
    name: "Vắc-xin bại liệt",
    doses: "4 liều",
    interval: "2, 4, 6, 18 tháng",
  },
  dpt: { name: "Vắc-xin DPT", doses: "3 liều", interval: "2, 4, 6 tháng" },
};

const vaccinationSchedule: Schedule[] = [
  {
    vaccine: "Vắc-xin cúm mùa",
    targetGroup: "Tất cả học sinh lớp 1-3",
    date: "20/12/2024",
    completed: 85,
    total: 100,
    status: "Đang tiến hành",
  },
  {
    vaccine: "Vắc-xin viêm gan B",
    targetGroup: "Học sinh lớp 1",
    date: "15/11/2024",
    completed: 45,
    total: 45,
    status: "Hoàn thành",
  },
  {
    vaccine: "Vắc-xin sởi",
    targetGroup: "Học sinh lớp 2",
    date: "25/12/2024",
    completed: 0,
    total: 52,
    status: "Chưa bắt đầu",
  },
];

const classVaccinationProgress: ClassProgress[] = [
  { class: "Lớp 1A", completed: 23, total: 25 },
  { class: "Lớp 1B", completed: 22, total: 24 },
  { class: "Lớp 2A", completed: 24, total: 26 },
  { class: "Lớp 2B", completed: 25, total: 25 },
  { class: "Lớp 3A", completed: 25, total: 27 },
  { class: "Lớp 3B", completed: 24, total: 26 },
];

const monthlyStats: MonthlyStat[] = [
  {
    label: "Tổng lượt tiêm",
    description: "Số lượt tiêm trong tháng",
    value: "156",
    trend: "+12%",
    icon: Shield,
  },
  {
    label: "Học sinh mới",
    description: "Bắt đầu chương trình tiêm",
    value: "28",
    trend: "+8%",
    icon: Users,
  },
  {
    label: "Hoàn thành",
    description: "Học sinh hoàn thành đủ liều",
    value: "42",
    trend: "+15%",
    icon: CheckCircle,
  },
];

const vaccinationRecords: VaccinationRecord[] = [
  {
    id: 1,
    studentName: "Nguyễn Văn An",
    class: "1A",
    vaccine: "Cúm mùa",
    date: "15/12/2024",
    dose: "Liều 1",
    reaction: "Không",
    status: "Hoàn thành",
  },
  {
    id: 2,
    studentName: "Trần Thị Bình",
    class: "2A",
    vaccine: "Viêm gan B",
    date: "14/12/2024",
    dose: "Liều 2",
    reaction: "Sưng nhẹ",
    status: "Hoàn thành",
  },
  {
    id: 3,
    studentName: "Lê Hoàng Cường",
    class: "1B",
    vaccine: "Cúm mùa",
    date: "13/12/2024",
    dose: "Liều 1",
    reaction: "Không",
    status: "Hoàn thành",
  },
];

const vaccineList: Vaccine[] = [
  {
    name: "Vắc-xin cúm mùa",
    description: "Phòng chống bệnh cúm mùa",
    ageGroup: "6 tháng - 18 tuổi",
    doses: "1 liều/năm",
    interval: "Hàng năm",
    stock: 120,
  },
  {
    name: "Vắc-xin viêm gan B",
    description: "Phòng chống viêm gan B",
    ageGroup: "Sơ sinh - 18 tuổi",
    doses: "3 liều",
    interval: "0, 1, 6 tháng",
    stock: 80,
  },
  {
    name: "Vắc-xin sởi",
    description: "Phòng chống bệnh sởi",
    ageGroup: "12 tháng - 15 tuổi",
    doses: "2 liều",
    interval: "4 tuần",
    stock: 45,
  },
  {
    name: "Vắc-xin bại liệt",
    description: "Phòng chống bệnh bại liệt",
    ageGroup: "2 tháng - 18 tuổi",
    doses: "4 liều",
    interval: "2, 4, 6, 18 tháng",
    stock: 25,
  },
];

const vaccinationDetailList: VaccinationDetail[] = [
  {
    name: "Nguyễn Văn An",
    class: "1A",
    status: "Đã tiêm",
    vaccinationDate: "15/12/2024",
    reaction: "Không",
    issues: null,
  },
  {
    name: "Trần Thị Bình",
    class: "1A",
    status: "Đã tiêm",
    vaccinationDate: "15/12/2024",
    reaction: "Sưng nhẹ",
    issues: null,
  },
  {
    name: "Lê Hoàng Cường",
    class: "1A",
    status: "Chưa tiêm",
    vaccinationDate: null,
    reaction: "Chưa có",
    issues: "Dị ứng",
  },
  {
    name: "Phạm Thị Dung",
    class: "1A",
    status: "Đã tiêm",
    vaccinationDate: "15/12/2024",
    reaction: "Không",
    issues: null,
  },
];

export default function Vaccination() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVaccine, setSelectedVaccine] = useState("all");
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
  const [selectedVaccineInfo, setSelectedVaccineInfo] =
    useState<VaccineInfo | null>(null);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [isScheduleDetailOpen, setIsScheduleDetailOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Quản lý Tiêm chủng
        </h1>
        <p className="text-blue-600">
          Theo dõi lịch tiêm chủng và tỷ lệ hoàn thành
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Tỷ lệ tiêm chủng
            </CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">85%</div>
            <p className="text-xs text-blue-600">
              Hoàn thành đợt tiêm hiện tại
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Đã tiêm
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">210</div>
            <p className="text-xs text-green-600">Học sinh đã hoàn thành</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Chưa tiêm
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">38</div>
            <p className="text-xs text-orange-600">Học sinh cần tiêm</p>
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Chống chỉ định
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">5</div>
            <p className="text-xs text-red-600">Không thể tiêm</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-blue-50">
          <TabsTrigger
            value="schedule"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Lịch tiêm
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Tiến độ
          </TabsTrigger>
          <TabsTrigger
            value="records"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Hồ sơ tiêm
          </TabsTrigger>
          <TabsTrigger
            value="vaccines"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Vắc-xin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-blue-800">
                    Lịch tiêm chủng
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Kế hoạch tiêm chủng cho học sinh
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsCreateScheduleOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo lịch tiêm
                </Button>
                <Dialog
                  open={isCreateScheduleOpen}
                  onOpenChange={setIsCreateScheduleOpen}
                >
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Tạo lịch tiêm chủng mới</DialogTitle>
                      <DialogDescription>
                        Lập kế hoạch tiêm chủng cho học sinh
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="vaccine-type">Loại vắc-xin *</Label>{" "}
                          <Select
                            onValueChange={(value: VaccineType) => {
                              setSelectedVaccineInfo(vaccineInfoMap[value]);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại vắc-xin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flu">
                                Vắc-xin cúm mùa
                              </SelectItem>
                              <SelectItem value="hepatitis">
                                Vắc-xin viêm gan B
                              </SelectItem>
                              <SelectItem value="measles">
                                Vắc-xin sởi
                              </SelectItem>
                              <SelectItem value="polio">
                                Vắc-xin bại liệt
                              </SelectItem>
                              <SelectItem value="dpt">Vắc-xin DPT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Thông tin vắc-xin</Label>
                          <div className="p-3 bg-blue-50 rounded-md text-sm">
                            {selectedVaccineInfo ? (
                              <div>
                                <p>
                                  <strong>Tên:</strong>{" "}
                                  {selectedVaccineInfo.name}
                                </p>
                                <p>
                                  <strong>Số liều:</strong>{" "}
                                  {selectedVaccineInfo.doses}
                                </p>
                                <p>
                                  <strong>Khoảng cách:</strong>{" "}
                                  {selectedVaccineInfo.interval}
                                </p>
                              </div>
                            ) : (
                              <p className="text-gray-500">
                                Chọn vắc-xin để xem thông tin
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Đối tượng tiêm * (Có thể chọn nhiều)</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            "Tất cả học sinh",
                            "Học sinh lớp 1",
                            "Học sinh lớp 2",
                            "Học sinh lớp 3",
                            "Học sinh lớp 4",
                            "Học sinh lớp 5",
                          ].map((target) => (
                            <label
                              key={target}
                              className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                className="rounded"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTargets([
                                      ...selectedTargets,
                                      target,
                                    ]);
                                  } else {
                                    setSelectedTargets(
                                      selectedTargets.filter(
                                        (t) => t !== target
                                      )
                                    );
                                  }
                                }}
                              />
                              <span className="text-sm">{target}</span>
                            </label>
                          ))}
                        </div>
                        {selectedTargets.length > 0 && (
                          <div className="mt-2 p-2 bg-green-50 rounded-md">
                            <p className="text-sm text-green-800">
                              <strong>Đã chọn:</strong>{" "}
                              {selectedTargets.join(", ")}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="schedule-date">Ngày tiêm</Label>
                          <Input id="schedule-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="schedule-time">Giờ bắt đầu</Label>
                          <Input id="schedule-time" type="time" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Địa điểm tiêm</Label>
                        <Input
                          id="location"
                          placeholder="VD: Phòng y tế trường"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="doctor">Bác sĩ thực hiện</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn bác sĩ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dr1">
                              BS. Nguyễn Văn A
                            </SelectItem>
                            <SelectItem value="dr2">BS. Trần Thị B</SelectItem>
                            <SelectItem value="dr3">BS. Lê Văn C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vaccine-quantity">
                          Số lượng vắc-xin cần thiết
                        </Label>
                        <Input
                          id="vaccine-quantity"
                          type="number"
                          placeholder="VD: 100"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú</Label>
                        <Textarea
                          id="notes"
                          placeholder="Ghi chú về lịch tiêm, lưu ý đặc biệt..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parent-notification">
                          Thông báo phụ huynh
                        </Label>
                        <Textarea
                          id="parent-notification"
                          placeholder="Nội dung thông báo gửi đến phụ huynh..."
                          rows={4}
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsCreateScheduleOpen(false)}
                        >
                          Hủy
                        </Button>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            if (selectedTargets.length === 0) {
                              alert(
                                "Vui lòng chọn ít nhất một đối tượng tiêm!"
                              );
                              return;
                            }
                            setIsCreateScheduleOpen(false);
                            alert("Đã tạo lịch tiêm chủng thành công!");
                          }}
                        >
                          Tạo lịch tiêm
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vaccinationSchedule.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-blue-100 hover:bg-blue-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800">
                          {schedule.vaccine}
                        </h4>
                        <p className="text-sm text-blue-600">
                          {schedule.targetGroup}
                        </p>
                        <p className="text-xs text-gray-500">
                          Ngày tiêm: {schedule.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {schedule.completed}/{schedule.total}
                        </p>
                        <Progress
                          value={(schedule.completed / schedule.total) * 100}
                          className="w-24 h-2 mt-1"
                        />
                      </div>
                      <Badge
                        variant={
                          schedule.status === "Hoàn thành"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          schedule.status === "Hoàn thành"
                            ? "bg-green-100 text-green-800"
                            : schedule.status === "Đang tiến hành"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {schedule.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setIsScheduleDetailOpen(true);
                        }}
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800">
                  Tiến độ theo lớp
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Tỷ lệ hoàn thành tiêm chủng từng lớp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {classVaccinationProgress.map((progress, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700 font-medium">
                        {progress.class}
                      </span>
                      <span className="text-blue-800">
                        {progress.completed}/{progress.total} (
                        {Math.round(
                          (progress.completed / progress.total) * 100
                        )}
                        %)
                      </span>
                    </div>
                    <Progress
                      value={(progress.completed / progress.total) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800">
                  Thống kê tháng này
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Số liệu tiêm chủng trong tháng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {monthlyStats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <stat.icon className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-800">
                          {stat.label}
                        </div>
                        <div className="text-sm text-blue-600">
                          {stat.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-800">
                        {stat.value}
                      </div>
                      <div className="text-xs text-green-600 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {stat.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="records" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">
                Hồ sơ tiêm chủng học sinh
              </CardTitle>
              <CardDescription className="text-blue-600">
                Chi tiết lịch sử tiêm chủng từng học sinh
              </CardDescription>
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
                <Select
                  value={selectedVaccine}
                  onValueChange={setSelectedVaccine}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Loại vắc-xin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="flu">Cúm</SelectItem>
                    <SelectItem value="hepatitis">Viêm gan B</SelectItem>
                    <SelectItem value="measles">Sởi</SelectItem>
                    <SelectItem value="polio">Bại liệt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Học sinh</TableHead>
                      <TableHead>Lớp</TableHead>
                      <TableHead>Vắc-xin</TableHead>
                      <TableHead>Ngày tiêm</TableHead>
                      <TableHead>Liều</TableHead>
                      <TableHead>Phản ứng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vaccinationRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.studentName}
                        </TableCell>
                        <TableCell>{record.class}</TableCell>
                        <TableCell>{record.vaccine}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.dose}</TableCell>
                        <TableCell>{record.reaction}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.status === "Hoàn thành"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              record.status === "Hoàn thành"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccines" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Danh sách vắc-xin</CardTitle>
              <CardDescription className="text-blue-600">
                Quản lý thông tin các loại vắc-xin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vaccineList.map((vaccine, index) => (
                  <Card key={index} className="border-blue-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-blue-800">
                        {vaccine.name}
                      </CardTitle>
                      <CardDescription className="text-blue-600">
                        {vaccine.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Độ tuổi:</span>
                          <span className="font-medium">
                            {vaccine.ageGroup}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Số liều:</span>
                          <span className="font-medium">{vaccine.doses}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Khoảng cách:</span>
                          <span className="font-medium">
                            {vaccine.interval}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tồn kho:</span>
                          <Badge
                            variant={
                              vaccine.stock > 50 ? "default" : "destructive"
                            }
                            className={
                              vaccine.stock > 50
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {vaccine.stock} liều
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog chi tiết lịch tiêm */}
      <Dialog
        open={isScheduleDetailOpen}
        onOpenChange={setIsScheduleDetailOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Chi tiết lịch tiêm: {selectedSchedule?.vaccine}
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về tiến độ tiêm chủng
            </DialogDescription>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Thông tin chung</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Vắc-xin:</span>
                      <span className="font-medium">
                        {selectedSchedule.vaccine}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đối tượng:</span>
                      <span className="font-medium">
                        {selectedSchedule.targetGroup}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ngày tiêm:</span>
                      <span className="font-medium">
                        {selectedSchedule.date}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tiến độ:</span>
                      <span className="font-medium">
                        {selectedSchedule.completed}/{selectedSchedule.total}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Thống kê</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Đã hoàn thành</span>
                          <span>
                            {Math.round(
                              (selectedSchedule.completed /
                                selectedSchedule.total) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            (selectedSchedule.completed /
                              selectedSchedule.total) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-bold text-green-800">
                            {selectedSchedule.completed}
                          </div>
                          <div className="text-green-600">Đã tiêm</div>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <div className="font-bold text-orange-800">
                            {selectedSchedule.total -
                              selectedSchedule.completed}
                          </div>
                          <div className="text-orange-600">Chưa tiêm</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Danh sách học sinh</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Học sinh</TableHead>
                        <TableHead>Lớp</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày tiêm</TableHead>
                        <TableHead>Phản ứng</TableHead>
                        <TableHead>Vấn đề</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vaccinationDetailList.map((student, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {student.name}
                          </TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                student.status === "Đã tiêm"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                student.status === "Đã tiêm"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }
                            >
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {student.vaccinationDate || "Chưa tiêm"}
                          </TableCell>
                          <TableCell>{student.reaction}</TableCell>
                          <TableCell>
                            {student.issues ? (
                              <Badge className="bg-red-100 text-red-800">
                                {student.issues}
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800">
                                Không
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
