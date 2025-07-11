"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  Clock,
  UserX,
  Syringe,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { fetchData } from "@/lib/api/api";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Student {
  vaccination_id: string;
  student: {
    _id: string;
    name: string;
    student_id: string;
  };
  status: string;
  parent_response_notes?: string;
  rejection_reason?: string;
  vaccination_result?: string;
  recommendations?: string;
  follow_up_required?: boolean;
  vaccination_notes?: string;
}

interface ClassDetail {
  class_id: string;
  class_name: string;
  students: Student[];
  status_counts: {
    approved: number;
    pending: number;
    rejected: number;
    completed: number;
  };
}

interface Props {
  eventId: string;
  classId: string;
}

export default function VaccinationClassDetail({ eventId, classId }: Props) {
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form states for vaccination result
  const [vaccinationResult, setVaccinationResult] = useState("");
  const [vaccinationNotes, setVaccinationNotes] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined);
  const [updatingResult, setUpdatingResult] = useState(false);

  // Vaccination-specific form fields
  const [vaccineReaction, setVaccineReaction] = useState("");
  const [injectionSite, setInjectionSite] = useState("");
  const [reactionSeverity, setReactionSeverity] = useState("");
  const [adverseEvents, setAdverseEvents] = useState("");

  useEffect(() => {
    fetchClassDetail();
  }, [eventId, classId]);

  const fetchClassDetail = async () => {
    try {
      const data = await fetchData<ClassDetail>(
        `/vaccination-schedules/events/${eventId}/classes/${classId}`
      );
      setClassDetail(data);
    } catch (error) {
      console.error("Error fetching class detail:", error);
      toast.error("Không thể tải chi tiết lớp học");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Rejected":
        return <UserX className="h-4 w-4 text-red-500" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const openResultDialog = (student: Student) => {
    setSelectedStudent(student);
    setVaccinationResult(student.vaccination_result || "");
    setVaccinationNotes(student.vaccination_notes || "");
    setRecommendations(student.recommendations || "");
    setFollowUpRequired(student.follow_up_required || false);
    setFollowUpDate(undefined);

    // Reset vaccination-specific fields
    setVaccineReaction("");
    setInjectionSite("");
    setReactionSeverity("");
    setAdverseEvents("");

    // Parse and populate existing results if available
    if (student.vaccination_result) {
      try {
        const parsedResult = JSON.parse(student.vaccination_result);
        setVaccineReaction(parsedResult.reaction || "");
        setInjectionSite(parsedResult.injection_site || "");
        setReactionSeverity(parsedResult.reaction_severity || "");
        setAdverseEvents(parsedResult.adverse_events || "");
      } catch (error) {
        console.error("Error parsing vaccination result:", error);
      }
    }

    setIsDialogOpen(true);
  };

  const closeResultDialog = () => {
    setSelectedStudent(null);
    setVaccinationResult("");
    setVaccinationNotes("");
    setRecommendations("");
    setFollowUpRequired(false);
    setFollowUpDate(undefined);

    // Reset vaccination-specific fields
    setVaccineReaction("");
    setInjectionSite("");
    setReactionSeverity("");
    setAdverseEvents("");

    setIsDialogOpen(false);
  };

  const handleUpdateResult = async () => {
    if (!selectedStudent) return;

    setUpdatingResult(true);

    try {
      // Prepare vaccination result data
      const vaccinationData = {
        reaction: vaccineReaction,
        injection_site: injectionSite,
        reaction_severity: reactionSeverity,
        adverse_events: adverseEvents,
        type: "Tiêm chủng",
      };

      const updateData = {
        vaccination_result: JSON.stringify(vaccinationData),
        vaccination_notes: vaccinationNotes,
        recommendations: recommendations,
        follow_up_required: followUpRequired,
        follow_up_date: followUpDate?.toISOString(),
      };

      await fetchData(
        `/vaccination-schedules/${selectedStudent.vaccination_id}/result`,
        {
          method: "PUT",
          body: JSON.stringify(updateData),
        }
      );

      toast.success("Cập nhật kết quả tiêm chủng thành công!");
      closeResultDialog();
      fetchClassDetail(); // Refresh data
    } catch (error) {
      console.error("Error updating vaccination result:", error);
      toast.error("Không thể cập nhật kết quả tiêm chủng");
    } finally {
      setUpdatingResult(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-blue-600">Đang tải...</div>
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          Không tìm thấy thông tin lớp học
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Class Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800">
            Lớp {classDetail.class_name}
          </CardTitle>
          <CardDescription>
            Quản lý kết quả tiêm chủng cho {classDetail.students.length} học
            sinh
          </CardDescription>

          {/* Status Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {classDetail.status_counts.pending}
              </div>
              <div className="text-sm text-gray-500">Chờ phản hồi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {classDetail.status_counts.approved}
              </div>
              <div className="text-sm text-gray-500">Đã đồng ý</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {classDetail.status_counts.rejected}
              </div>
              <div className="text-sm text-gray-500">Đã từ chối</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {classDetail.status_counts.completed}
              </div>
              <div className="text-sm text-gray-500">Hoàn thành</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách học sinh</CardTitle>
          <CardDescription>
            Click vào "Cập nhật kết quả" để nhập thông tin sau khi tiêm chủng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Học sinh</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ghi chú phụ huynh</TableHead>
                <TableHead>Kết quả tiêm</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classDetail.students.map((student) => (
                <TableRow key={student.vaccination_id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.student.name}</div>
                      <div className="text-sm text-gray-500">
                        {student.student.student_id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(student.status)}
                      <Badge
                        variant={
                          student.status === "Completed"
                            ? "default"
                            : student.status === "Approved"
                            ? "secondary"
                            : student.status === "Rejected"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {student.status === "Pending"
                          ? "Chờ phản hồi"
                          : student.status === "Approved"
                          ? "Đã đồng ý"
                          : student.status === "Rejected"
                          ? "Đã từ chối"
                          : "Hoàn thành"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      {student.status === "Rejected" &&
                      student.rejection_reason ? (
                        <p className="text-sm text-red-600">
                          Lý do từ chối: {student.rejection_reason}
                        </p>
                      ) : student.parent_response_notes ? (
                        <p className="text-sm text-gray-600">
                          {student.parent_response_notes}
                        </p>
                      ) : (
                        <span className="text-gray-400">Chưa có ghi chú</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.vaccination_result ? (
                      <Badge className="bg-green-100 text-green-800">
                        Đã cập nhật
                      </Badge>
                    ) : (
                      <span className="text-gray-400">Chưa cập nhật</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {student.status === "Approved" && (
                      <Button
                        size="sm"
                        onClick={() => openResultDialog(student)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Syringe className="w-3 h-3 mr-1" />
                        Cập nhật kết quả
                      </Button>
                    )}
                    {student.status === "Completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openResultDialog(student)}
                      >
                        Xem kết quả
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Vaccination Result Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Syringe className="w-5 h-5" />
              Cập nhật kết quả tiêm chủng
            </DialogTitle>
            <DialogDescription>
              {selectedStudent &&
                `Học sinh: ${selectedStudent.student.name} (${selectedStudent.student.student_id})`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Vaccination Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                Thông tin tiêm chủng
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reaction">Phản ứng sau tiêm</Label>
                  <Select
                    value={vaccineReaction}
                    onValueChange={setVaccineReaction}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phản ứng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Bình thường</SelectItem>
                      <SelectItem value="mild_pain">
                        Đau nhẹ tại chỗ tiêm
                      </SelectItem>
                      <SelectItem value="swelling">
                        Sưng tại chỗ tiêm
                      </SelectItem>
                      <SelectItem value="fever">Sốt nhẹ</SelectItem>
                      <SelectItem value="allergic">Phản ứng dị ứng</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="injection-site">Vị trí tiêm</Label>
                  <Select
                    value={injectionSite}
                    onValueChange={setInjectionSite}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vị trí" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left_arm">Cánh tay trái</SelectItem>
                      <SelectItem value="right_arm">Cánh tay phải</SelectItem>
                      <SelectItem value="left_thigh">Đùi trái</SelectItem>
                      <SelectItem value="right_thigh">Đùi phải</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="reaction-severity">Mức độ phản ứng</Label>
                <Select
                  value={reactionSeverity}
                  onValueChange={setReactionSeverity}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Đánh giá mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không có</SelectItem>
                    <SelectItem value="mild">Nhẹ</SelectItem>
                    <SelectItem value="moderate">Vừa</SelectItem>
                    <SelectItem value="severe">Nặng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="adverse-events">Biến cố bất lợi (nếu có)</Label>
                <Textarea
                  id="adverse-events"
                  value={adverseEvents}
                  onChange={(e) => setAdverseEvents(e.target.value)}
                  placeholder="Mô tả chi tiết các biến cố bất lợi sau tiêm..."
                  rows={3}
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                Ghi chú và khuyến nghị
              </h4>

              <div>
                <Label htmlFor="vaccination-notes">Ghi chú tiêm chủng</Label>
                <Textarea
                  id="vaccination-notes"
                  value={vaccinationNotes}
                  onChange={(e) => setVaccinationNotes(e.target.value)}
                  placeholder="Ghi chú về quá trình tiêm chủng..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="recommendations">Khuyến nghị</Label>
                <Textarea
                  id="recommendations"
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  placeholder="Khuyến nghị cho phụ huynh..."
                  rows={3}
                />
              </div>
            </div>

            {/* Follow-up */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="follow-up"
                  checked={followUpRequired}
                  onCheckedChange={(checked) =>
                    setFollowUpRequired(checked as boolean)
                  }
                />
                <Label htmlFor="follow-up">Cần tái khám/theo dõi</Label>
              </div>

              {followUpRequired && (
                <div>
                  <Label>Ngày hẹn tái khám</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !followUpDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {followUpDate ? (
                          format(followUpDate, "dd/MM/yyyy", { locale: vi })
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={followUpDate}
                        onSelect={setFollowUpDate}
                        initialFocus
                        locale={vi}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={closeResultDialog}>
              Hủy
            </Button>
            <Button
              onClick={handleUpdateResult}
              disabled={updatingResult}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updatingResult ? "Đang cập nhật..." : "Cập nhật kết quả"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
