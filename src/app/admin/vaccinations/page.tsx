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
  Download,
  Bell,
} from "lucide-react";
import ClassVaccinationList from "./_components/class-vaccination-list";

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
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
  const [selectedVaccineInfo, setSelectedVaccineInfo] = useState<VaccineInfo | null>(null);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [isScheduleDetailOpen, setIsScheduleDetailOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isVaccineResultOpen, setIsVaccineResultOpen] = useState(false);
  const [selectedScheduleForClass, setSelectedScheduleForClass] = useState<Schedule | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);

  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedScheduleForClass(schedule);
    setSelectedSchedule(schedule);
    setIsVaccineResultOpen(true);
  };

  const handleClassClick = (classInfo: ClassProgress) => {
    setSelectedClass(classInfo.class);
    setIsVaccineResultOpen(false);
    setIsScheduleDetailOpen(true);
  };

  const handleRecordClick = (student: any) => {
    setSelectedStudent(student);
    setIsRecordDialogOpen(true);
  };

  const handleNotifyClick = (student: any) => {
    setSelectedStudent(student);
    setIsNotificationDialogOpen(true);
  };

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
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-blue-800">Lịch tiêm chủng</CardTitle>
              <CardDescription className="text-blue-600">
                Kế hoạch tiêm chủng cho học sinh
              </CardDescription>
            </div>{" "}
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsCreateScheduleOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo lịch tiêm
            </Button>
            {/* Dialog tạo lịch tiêm */}
            <Dialog
              open={isCreateScheduleOpen}
              onOpenChange={setIsCreateScheduleOpen}
            >
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCreateScheduleOpen(false)}
                    >
                      ← Quay lại
                    </Button>
                    <div>
                      <DialogTitle>
                        Tạo lịch tiêm chủng cho {selectedClass}
                      </DialogTitle>
                      <DialogDescription>
                        Lập kế hoạch tiêm chủng cho học sinh
                      </DialogDescription>
                    </div>
                  </div>
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
                          <SelectItem value="flu">Vắc-xin cúm mùa</SelectItem>
                          <SelectItem value="hepatitis">
                            Vắc-xin viêm gan B
                          </SelectItem>
                          <SelectItem value="measles">Vắc-xin sởi</SelectItem>
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
                              <strong>Tên:</strong> {selectedVaccineInfo.name}
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
                                  selectedTargets.filter((t) => t !== target)
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
                          <strong>Đã chọn:</strong> {selectedTargets.join(", ")}
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
                    <Input id="location" placeholder="VD: Phòng y tế trường" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor">Bác sĩ thực hiện</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn bác sĩ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dr1">BS. Nguyễn Văn A</SelectItem>
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
                          alert("Vui lòng chọn ít nhất một đối tượng tiêm!");
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
                className="flex items-center justify-between p-4 rounded-lg border border-blue-100 hover:bg-blue-50 cursor-pointer"
                onClick={() => handleScheduleClick(schedule)}
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
                      schedule.status === "Hoàn thành" ? "default" : "secondary"
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
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Dialog danh sách lớp và kết quả tiêm */}
      <Dialog open={isVaccineResultOpen} onOpenChange={setIsVaccineResultOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>Danh sách lớp tham gia tiêm {selectedScheduleForClass?.vaccine}</DialogTitle>
              <DialogDescription>
                Ngày tiêm: {selectedScheduleForClass?.date}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            {classVaccinationProgress.map((classInfo) => (
              <Card
                key={classInfo.class}
                className="cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => handleClassClick(classInfo)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{classInfo.class}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">
                      Sĩ số: {classInfo.total} học sinh
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Đã tiêm:</span>
                      <span>{classInfo.completed}/{classInfo.total}</span>
                    </div>
                    <Progress
                      value={(classInfo.completed / classInfo.total) * 100}
                      className="h-2"
                    />
                    <Badge
                      className={
                        classInfo.completed === classInfo.total
                          ? "bg-green-100 text-green-800"
                          : classInfo.completed > 0
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {classInfo.completed === classInfo.total
                        ? "Hoàn thành"
                        : classInfo.completed > 0
                        ? "Đang tiến hành"
                        : "Chưa bắt đầu"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialog chi tiết lịch tiêm */}{" "}
      <Dialog open={isScheduleDetailOpen} onOpenChange={setIsScheduleDetailOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsScheduleDetailOpen(false);
                  setIsVaccineResultOpen(true);
                }}
              >
                ← Quay lại
              </Button>
              <div>
                <DialogTitle className="text-2xl">
                  Chi tiết lịch tiêm: {selectedSchedule?.vaccine}
                </DialogTitle>
                <DialogDescription className="mt-2">
                  Thông tin chi tiết về tiến độ tiêm chủng - {selectedClass}
                </DialogDescription>
              </div>
            </div>
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
                            )}%
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
              </div>              <ClassVaccinationList
                className={selectedClass || "Lớp 1A"}
                completed={selectedSchedule.completed}
                total={selectedSchedule.total}
                onRecordClick={handleRecordClick}
                onNotifyClick={handleNotifyClick}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Dialog ghi nhận kết quả tiêm */}
      <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ghi nhận kết quả tiêm chủng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin tiêm chủng cho học sinh {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Phản ứng sau tiêm</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức độ phản ứng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có phản ứng</SelectItem>
                  <SelectItem value="mild">Nhẹ (sốt nhẹ, đau tại chỗ)</SelectItem>
                  <SelectItem value="moderate">Trung bình (sốt cao, phát ban)</SelectItem>
                  <SelectItem value="severe">Nặng (cần theo dõi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Theo dõi sau tiêm</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn hình thức theo dõi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không cần theo dõi</SelectItem>
                  <SelectItem value="24h">Theo dõi 24h</SelectItem>
                  <SelectItem value="48h">Theo dõi 48h</SelectItem>
                  <SelectItem value="72h">Theo dõi 72h</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea placeholder="Nhập các ghi chú về phản ứng, triệu chứng..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRecordDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => {
                setIsRecordDialogOpen(false);
                // TODO: Save vaccination record
              }}>
                Lưu
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog gửi thông báo */}
      <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gửi thông báo phụ huynh</DialogTitle>
            <DialogDescription>
              Gửi thông báo cho phụ huynh học sinh {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nội dung thông báo</Label>
              <Textarea 
                placeholder="Nhập nội dung thông báo cho phụ huynh..."
                rows={4} 
              />
            </div>
            <div className="space-y-2">
              <Label>Mức độ ưu tiên</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức độ ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="urgent">Khẩn cấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-start space-x-2">
              <input type="checkbox" id="sms" className="mt-1" />
              <Label htmlFor="sms" className="text-sm">
                Gửi kèm tin nhắn SMS cho phụ huynh
              </Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => {
                setIsNotificationDialogOpen(false);
                // TODO: Send notification
              }}>
                Gửi thông báo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
