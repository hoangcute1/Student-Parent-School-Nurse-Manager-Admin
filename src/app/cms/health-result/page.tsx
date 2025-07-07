"use client";

import { useState, useMemo } from "react";
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
  ArrowUpDown,
  Filter,
  Activity,
  Calendar,
  ClipboardCheck,
  AlertTriangle,
  Eye,
  Edit,
  UserCheck,
  ArrowLeft,
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
import ClassHealthList from "./_components/class-health-list";

interface ExamInfo {
  name: string;
  description: string;
  type: string;
}

interface Schedule {
  examType: string;
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

interface ExamDetail {
  name: string;
  class: string;
  status: string;
  examDate: string | null;
  result: string;
  issues: string | null;
}

const examSchedule: Schedule[] = [
  {
    examType: "Khám sức khỏe định kỳ",
    targetGroup: "Tất cả học sinh lớp 1-3",
    date: "20/12/2024",
    completed: 85,
    total: 100,
    status: "Đang tiến hành",
  },
  {
    examType: "Khám nha khoa",
    targetGroup: "Học sinh lớp 1",
    date: "15/11/2024",
    completed: 45,
    total: 45,
    status: "Hoàn thành",
  },
  {
    examType: "Khám mắt",
    targetGroup: "Học sinh lớp 2",
    date: "25/12/2024",
    completed: 0,
    total: 52,
    status: "Chưa bắt đầu",
  },
];

const classExamProgress: ClassProgress[] = [
  { class: "Lớp 1A", completed: 23, total: 25 },
  { class: "Lớp 1B", completed: 22, total: 24 },
  { class: "Lớp 2A", completed: 24, total: 26 },
  { class: "Lớp 2B", completed: 25, total: 25 },
  { class: "Lớp 3A", completed: 25, total: 27 },
  { class: "Lớp 3B", completed: 24, total: 26 },
];

const monthlyStats: MonthlyStat[] = [
  {
    label: "Tổng lượt khám",
    description: "Số lượt khám trong tháng",
    value: "156",
    trend: "+12%",
    icon: Shield,
  },
  {
    label: "Học sinh mới",
    description: "Lần đầu khám sức khỏe",
    value: "28",
    trend: "+8%",
    icon: Users,
  },
  {
    label: "Hoàn thành",
    description: "Học sinh đã khám xong",
    value: "42",
    trend: "+15%",
    icon: CheckCircle,
  },
];

export default function HealthResults() {
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
  const [selectedExamInfo, setSelectedExamInfo] = useState<ExamInfo | null>(
    null
  );
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [isScheduleDetailOpen, setIsScheduleDetailOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isExamResultOpen, setIsExamResultOpen] = useState(false);
  const [selectedScheduleForClass, setSelectedScheduleForClass] =
    useState<Schedule | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);

  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedScheduleForClass(schedule);
    setIsExamResultOpen(true);
  };

  const handleClassClick = (classInfo: ClassProgress) => {
    setSelectedClass(classInfo.class);
    setIsExamResultOpen(false);
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
        <h1 className="text-3xl font-bold tracking-tight text-sky-800">
          Quản lý Khám Sức Khỏe
        </h1>
        <p className="text-sky-600">Theo dõi lịch khám và kết quả sức khỏe</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-sky-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sky-700">
              Tỷ lệ khám sức khỏe
            </CardTitle>
            <Shield className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-800">85%</div>
            <p className="text-xs text-sky-600">
              Hoàn thành đợt khám hiện tại
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Đã khám
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">210</div>
            <p className="text-xs text-green-600">Học sinh đã khám xong</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Chưa khám
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">38</div>
            <p className="text-xs text-orange-600">Học sinh cần khám</p>
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Có vấn đề
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">5</div>
            <p className="text-xs text-red-600">Cần theo dõi đặc biệt</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-sky-800">
                Lịch khám sức khỏe
              </CardTitle>
              <CardDescription className="text-sky-600">
                Kế hoạch khám sức khỏe cho học sinh
              </CardDescription>
            </div>
            <Button
              size="sm"
              className="bg-sky-600 hover:bg-sky-700"
              onClick={() => setIsCreateScheduleOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo lịch khám
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {examSchedule.map((schedule, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-sky-100 hover:bg-sky-50 cursor-pointer"
                onClick={() => handleScheduleClick(schedule)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
                    <Shield className="h-6 w-6 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sky-800">
                      {schedule.examType}
                    </h4>
                    <p className="text-sm text-sky-600">
                      {schedule.targetGroup}
                    </p>
                    <p className="text-xs text-gray-500">
                      Ngày khám: {schedule.date}
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
                        ? "bg-sky-100 text-sky-800"
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

      {/* Dialog tạo lịch khám */}
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
                  Tạo lịch khám sức khỏe cho {selectedClass}
                </DialogTitle>
                <DialogDescription>
                  Lập kế hoạch khám sức khỏe cho học sinh
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exam-type">Loại khám sức khỏe *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại khám" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Khám tổng quát</SelectItem>
                    <SelectItem value="dental">Khám nha khoa</SelectItem>
                    <SelectItem value="eye">Khám mắt</SelectItem>
                    <SelectItem value="growth">Khám tăng trưởng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Đối tượng khám * (Có thể chọn nhiều)</Label>
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
                          setSelectedTargets([...selectedTargets, target]);
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
                <Label htmlFor="schedule-date">Ngày khám</Label>
                <Input id="schedule-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-time">Giờ bắt đầu</Label>
                <Input id="schedule-time" type="time" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Địa điểm khám</Label>
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
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                placeholder="Ghi chú về lịch khám, lưu ý đặc biệt..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent-notification">Thông báo phụ huynh</Label>
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
                className="bg-sky-600 hover:bg-sky-700"
                onClick={() => {
                  if (selectedTargets.length === 0) {
                    alert("Vui lòng chọn ít nhất một đối tượng khám!");
                    return;
                  }
                  setIsCreateScheduleOpen(false);
                  alert("Đã tạo lịch khám sức khỏe thành công!");
                }}
              >
                Tạo lịch khám
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog danh sách lớp và kết quả khám */}
      <Dialog open={isExamResultOpen} onOpenChange={setIsExamResultOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>
                Danh sách lớp tham gia khám {selectedScheduleForClass?.examType}
              </DialogTitle>
              <DialogDescription>
                Ngày khám: {selectedScheduleForClass?.date}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            {classExamProgress.map((classInfo) => (
              <Card
                key={classInfo.class}
                className="cursor-pointer hover:border-sky-500 transition-colors"
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
                      <span>Đã khám:</span>
                      <span>
                        {classInfo.completed}/{classInfo.total}
                      </span>
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
                          ? "bg-sky-100 text-sky-800"
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

      {/* Dialog chi tiết lịch khám */}
      <Dialog
        open={isScheduleDetailOpen}
        onOpenChange={setIsScheduleDetailOpen}
      >
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsScheduleDetailOpen(false);
                  setIsExamResultOpen(true);
                }}
              >
                ← Quay lại
              </Button>
              <div>
                <DialogTitle className="text-2xl">
                  Chi tiết lịch khám: {selectedSchedule?.examType}
                </DialogTitle>
                <DialogDescription className="mt-2">
                  Thông tin chi tiết về tiến độ khám sức khỏe - {selectedClass}
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
                      <span>Loại khám:</span>
                      <span className="font-medium">
                        {selectedSchedule.examType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đối tượng:</span>
                      <span className="font-medium">
                        {selectedSchedule.targetGroup}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ngày khám:</span>
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
                          <div className="text-green-600">Đã khám</div>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <div className="font-bold text-orange-800">
                            {selectedSchedule.total -
                              selectedSchedule.completed}
                          </div>
                          <div className="text-orange-600">Chưa khám</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <ClassHealthList
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

      {/* Dialog ghi nhận kết quả khám */}
      <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ghi nhận kết quả khám sức khỏe</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin khám cho học sinh {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Kết quả khám</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn kết quả khám" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Bình thường</SelectItem>
                  <SelectItem value="mild">Nhẹ (cần theo dõi)</SelectItem>
                  <SelectItem value="moderate">Trung bình (tư vấn)</SelectItem>
                  <SelectItem value="severe">Nặng (điều trị)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kế hoạch theo dõi</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn kế hoạch theo dõi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không cần theo dõi</SelectItem>
                  <SelectItem value="weekly">Theo dõi hàng tuần</SelectItem>
                  <SelectItem value="monthly">Theo dõi hàng tháng</SelectItem>
                  <SelectItem value="quarterly">Theo dõi 3 tháng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                placeholder="Nhập các ghi chú về tình trạng sức khỏe, lời khuyên..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsRecordDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  setIsRecordDialogOpen(false);
                  // TODO: Save health record
                }}
              >
                Lưu
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog gửi thông báo */}
      <Dialog
        open={isNotificationDialogOpen}
        onOpenChange={setIsNotificationDialogOpen}
      >
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
              <Button
                variant="outline"
                onClick={() => setIsNotificationDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  setIsNotificationDialogOpen(false);
                  // TODO: Send notification
                }}
              >
                Gửi thông báo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
