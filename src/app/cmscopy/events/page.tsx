"use client";

import { useEffect, useState } from "react";
import { getAllStudents} from "@/lib/api/student";
import { getAllStaffs } from "@/lib/api/staff";
import {
  AlertTriangle,
  Plus,
  Search,
  Clock,
  User,
  MapPin,
  Phone,
  FileText,
  CheckCircle,

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Student } from "@/lib/type/students";
import { fetchData } from "@/lib/api/api";

export default function MedicalEvents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // State for modals
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [updateEventOpen, setUpdateEventOpen] = useState(false);
  const [processEventOpen, setProcessEventOpen] = useState(false);
  const [viewEventDetailsOpen, setViewEventDetailsOpen] = useState(false);
  const [emergencyProcessOpen, setEmergencyProcessOpen] = useState(false);

  // State for selected event
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const [treatmentHistories, setTreatmentHistories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Form schema for adding/updating event
  const eventFormSchema = z.object({
    title: z.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự"),
    student: z.string().min(2, "Tên học sinh phải có ít nhất 2 ký tự"),
    class: z.string().min(1, "Vui lòng chọn lớp"),
    location: z.string().min(1, "Vui lòng nhập địa điểm"),
    priority: z.enum(["Cao", "Trung bình", "Thấp"]),
    description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
    contactStatus: z.string().optional(),
    reporter: z.string().optional(),
  });

  // Form for adding new event
  const addEventForm = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      student: "",
      class: "",
      location: "",
      priority: "Trung bình",
      description: "",
      contactStatus: "Chưa liên hệ",
      reporter: "",
    },
  });

  // Form for updating event
  const updateEventForm = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      student: "",
      class: "",
      location: "",
      priority: "Trung bình",
      description: "",
      contactStatus: "Chưa liên hệ",
      reporter: "",
    },
  });

  // Process event form
  const processFormSchema = z.object({
    status: z.enum(["processing", "completed", "waiting"]),
    notes: z.string().min(5, "Ghi chú phải có ít nhất 5 ký tự"),
    contactParent: z.boolean(),
    actionTaken: z.string().min(5, "Hành động phải có ít nhất 5 ký tự"),
  });

  const processEventForm = useForm<z.infer<typeof processFormSchema>>({
    resolver: zodResolver(processFormSchema),
    defaultValues: {
      status: "processing",
      notes: "",
      contactParent: false,
      actionTaken: "",
    },
  });

  // Emergency process form
  const emergencyFormSchema = z.object({
    immediateAction: z.string().min(5, "Hành động phải có ít nhất 5 ký tự"),
    notifyParent: z.boolean(),
    transferToHospital: z.boolean(),
    hospitalName: z.string().optional(),
    notes: z.string().optional(),
  });

  const emergencyProcessForm = useForm<z.infer<typeof emergencyFormSchema>>({
    resolver: zodResolver(emergencyFormSchema),
    defaultValues: {
      immediateAction: "",
      notifyParent: true,
      transferToHospital: false,
      hospitalName: "",
      notes: "",
    },
  });

  
  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setStudentsLoading(true);
      setStudentsError(null);
      const data = await getAllStudents();
      setStudents(data);
      console.log("Students loaded:", data);
    } catch (error: any) {
      const errorMessage = error?.message || "Không thể tải danh sách sinh viên";
      setStudentsError(errorMessage);
      setStudents([]);
      console.error("Error fetching students:", error);
    } finally {
      setStudentsLoading(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);


  // Handle form submissions
  const onAddEvent = (data: z.infer<typeof eventFormSchema>) => {
    console.log("Add event data:", data);
    // Add logic to save new event
    // For now, just close the modal
    setAddEventOpen(false);
    addEventForm.reset();
  };

  const onUpdateEvent = (data: z.infer<typeof eventFormSchema>) => {
    console.log("Update event data:", data);
    // Add logic to update event
    setUpdateEventOpen(false);
  };

  const onProcessEvent = (data: z.infer<typeof processFormSchema>) => {
    console.log("Process event data:", data);
    // Add logic to process event
    setProcessEventOpen(false);
  };

  const onEmergencyProcess = (data: z.infer<typeof emergencyFormSchema>) => {
    console.log("Emergency process data:", data);
    // Add logic for emergency handling
    setEmergencyProcessOpen(false);
  };

  // Handle opening modals with event data
  const handleViewDetails = (event: any) => {
    setSelectedEvent(event);
    setViewEventDetailsOpen(true);
  };

  const handleUpdateEvent = (event: any) => {
    setSelectedEvent(event);
    updateEventForm.reset({
      title: event.title,
      student: event.student,
      class: event.class,
      location: event.location,
      priority: event.priority,
      description: event.description,
      contactStatus: event.contactStatus || "Chưa liên hệ",
      reporter: event.reporter || "",
    });
    setUpdateEventOpen(true);
  };

  const handleProcessEvent = (event: any) => {
    setSelectedEvent(event);
    processEventForm.reset();
    setProcessEventOpen(true);
  };

  const handleEmergencyProcess = (event: any) => {
    setSelectedEvent(event);
    emergencyProcessForm.reset();
    setEmergencyProcessOpen(true);
  };

  // Show loading state for initial data load
  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-teal-800">
            Sự cố Y tế
          </h1>
          <p className="text-teal-600">
            Quản lý và xử lý các sự cố y tế đột xuất
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-teal-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-teal-800">
          Sự cố Y tế
        </h1>
        <p className="text-teal-600">
          Quản lý và xử lý các sự cố y tế đột xuất
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Sự kiện hôm nay
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">5</div>
            <p className="text-xs text-red-600">Cần xử lý ngay</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Đang xử lý
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">8</div>
            <p className="text-xs text-orange-600">Theo dõi tiếp</p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Đã xử lý
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">42</div>
            <p className="text-xs text-green-600">Tuần này</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Tổng sự kiện
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">156</div>
            <p className="text-xs text-blue-600">Tháng này</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-teal-50">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
          >
            Đang xử lý
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
          >
            Đã xử lý
          </TabsTrigger>
          <TabsTrigger
            value="emergency"
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
          >
            Khẩn cấp
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
          >
            Báo cáo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-teal-800">
                    Sự kiện đang xử lý
                  </CardTitle>
                  <CardDescription className="text-teal-600">
                    Danh sách các sự cố y tế cần theo dõi và xử lý
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700"
                  onClick={() => setAddEventOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm sự kiện
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm sự kiện..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="new">Mới</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="waiting">Chờ phụ huynh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {activeEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${event.priority === "Cao"
                        ? "border-l-red-500 bg-red-50"
                        : event.priority === "Trung bình"
                          ? "border-l-yellow-500 bg-yellow-50"
                          : "border-l-blue-500 bg-blue-50"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {event.student} - {event.class}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          event.priority === "Cao" ? "destructive" : "secondary"
                        }
                        className={
                          event.priority === "Cao"
                            ? "bg-red-100 text-red-800"
                            : event.priority === "Trung bình"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }
                      >
                        {event.priority}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>Đã liên hệ: {event.contactStatus}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateEvent(event)}
                        >
                          Cập nhật
                        </Button>
                        <Button
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700"
                          onClick={() => handleProcessEvent(event)}
                        >
                          Xử lý
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-teal-800">Sự kiện đã xử lý</CardTitle>
              <CardDescription className="text-teal-600">
                Lịch sử các sự cố y tế đã được giải quyết
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {event.student} - {event.class} | {event.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        Đã xử lý
                      </Badge>{" "}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(event)}
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

        <TabsContent value="emergency" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-800">Sự kiện khẩn cấp</CardTitle>
              <CardDescription className="text-red-600">
                Các trường hợp cần xử lý ngay lập tức
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyEvents.map((event, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border-2 border-red-200 bg-red-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <h4 className="font-semibold text-red-900">
                          {event.title}
                        </h4>
                      </div>
                      <Badge className="bg-red-100 text-red-800">
                        KHẨN CẤP
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-red-800">
                          <strong>Học sinh:</strong> {event.student}
                        </p>
                        <p className="text-sm text-red-800">
                          <strong>Lớp:</strong> {event.class}
                        </p>
                        <p className="text-sm text-red-800">
                          <strong>Thời gian:</strong> {event.time}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-red-800">
                          <strong>Địa điểm:</strong> {event.location}
                        </p>
                        <p className="text-sm text-red-800">
                          <strong>Người báo:</strong> {event.reporter}
                        </p>
                        <p className="text-sm text-red-800">
                          <strong>Liên hệ PH:</strong> {event.parentContact}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-red-700 mb-3">
                      {event.description}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleEmergencyProcess(event)}
                      >
                        Xử lý ngay
                      </Button>{" "}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-700"
                        onClick={() => handleViewDetails(event)}
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

        <TabsContent value="reports" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-teal-800">
                  Thống kê theo loại sự kiện
                </CardTitle>
                <CardDescription className="text-teal-600">
                  Phân loại sự cố y tế trong tháng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eventTypeStats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-teal-100"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full ${stat.color}`}
                        ></div>
                        <div>
                          <div className="font-medium text-teal-800">
                            {stat.type}
                          </div>
                          <div className="text-sm text-teal-600">
                            {stat.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-teal-800">
                          {stat.count}
                        </div>
                        <div className="text-xs text-gray-500">
                          {stat.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-teal-800">
                  Thời gian xử lý trung bình
                </CardTitle>
                <CardDescription className="text-teal-600">
                  Hiệu quả xử lý sự cố y tế
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {responseTimeStats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-teal-700 font-medium">
                          {stat.priority}
                        </span>
                        <span className="text-teal-800">{stat.avgTime}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${stat.color}`}
                          style={{ width: `${stat.performance}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Mục tiêu: {stat.target} | Hiệu suất: {stat.performance}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Event Dialog */}
      <Dialog open={addEventOpen} onOpenChange={setAddEventOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-teal-800">
              Thêm sự cố y tế
            </DialogTitle>
            <DialogDescription className="text-teal-600">
              Nhập thông tin về sự cố y tế mới
            </DialogDescription>
          </DialogHeader>

          <Form {...addEventForm}>
            <form
              onSubmit={addEventForm.handleSubmit(onAddEvent)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={addEventForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề sự kiện</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addEventForm.control}
                  name="student"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Học sinh</FormLabel>
                      <Select onValueChange={(val) => {
                        field.onChange(val);
                        setSelectedStudentId(val);
                      }} disabled={studentsLoading}>
                        <SelectTrigger className="w-full">
                          {studentsLoading ? "Đang tải..." : "Chọn học sinh"}
                        </SelectTrigger>
                        <SelectContent>
                          {studentsError ? (
                            <div className="p-2 text-red-600 text-sm">
                              {studentsError}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={fetchStudents}
                                className="ml-2"
                              >
                                Thử lại
                              </Button>
                            </div>
                          ) : students.length === 0 && !studentsLoading ? (
                            <div className="p-2 text-gray-500 text-sm">
                              Không có sinh viên nào
                            </div>
                          ) : (
                            students.map(student => (
                              <SelectItem key={student._id} value={student._id}>
                                {student.name} ({student.studentId})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addEventForm.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lớp</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn lớp" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Lớp 1A">Lớp 1A</SelectItem>
                          <SelectItem value="Lớp 1B">Lớp 1B</SelectItem>
                          <SelectItem value="Lớp 2A">Lớp 2A</SelectItem>
                          <SelectItem value="Lớp 2B">Lớp 2B</SelectItem>
                          <SelectItem value="Lớp 3A">Lớp 3A</SelectItem>
                          <SelectItem value="Lớp 3B">Lớp 3B</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addEventForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa điểm</FormLabel>
                      <FormControl>
                        <Input placeholder="Địa điểm xảy ra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addEventForm.control}
                  name="reporter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Người báo cáo</FormLabel>
                      <FormControl>
                        <Input placeholder="Người báo cáo sự kiện" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addEventForm.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mức độ ưu tiên</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn mức độ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cao">Cao</SelectItem>
                          <SelectItem value="Trung bình">Trung bình</SelectItem>
                          <SelectItem value="Thấp">Thấp</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={addEventForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả chi tiết</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết về sự cố y tế"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addEventForm.control}
                name="contactStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái liên hệ phụ huynh</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Trạng thái liên hệ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Chưa liên hệ">
                          Chưa liên hệ
                        </SelectItem>
                        <SelectItem value="Đang gọi">Đang gọi</SelectItem>
                        <SelectItem value="Đã liên hệ">Đã liên hệ</SelectItem>
                        <SelectItem value="Phụ huynh">
                          Phụ huynh đang đến
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddEventOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                  Lưu sự kiện
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Update Event Dialog */}
      <Dialog open={updateEventOpen} onOpenChange={setUpdateEventOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-teal-800">
              Cập nhật sự cố y tế
            </DialogTitle>
            <DialogDescription className="text-teal-600">
              Cập nhật thông tin về sự cố y tế
            </DialogDescription>
          </DialogHeader>

          <Form {...updateEventForm}>
            <form
              onSubmit={updateEventForm.handleSubmit(onUpdateEvent)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={updateEventForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề sự kiện</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateEventForm.control}
                  name="student"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Học sinh</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn học sinh" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {studentsError ? (
                            <div className="p-2 text-red-600 text-sm">
                              {studentsError}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={fetchStudents}
                                className="ml-2"
                              >
                                Thử lại
                              </Button>
                            </div>
                          ) : students.length === 0 && !studentsLoading ? (
                            <div className="p-2 text-gray-500 text-sm">
                              Không có sinh viên nào
                            </div>
                          ) : studentsLoading ? (
                            <div className="p-2 text-gray-500 text-sm">
                              Đang tải danh sách sinh viên...
                            </div>
                          ) : (
                            students.map((student) => (
                              <SelectItem key={student._id} value={student._id}>
                                {student.name} ({student.studentId})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateEventForm.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lớp</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn lớp" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Lớp 1A">Lớp 1A</SelectItem>
                          <SelectItem value="Lớp 1B">Lớp 1B</SelectItem>
                          <SelectItem value="Lớp 2A">Lớp 2A</SelectItem>
                          <SelectItem value="Lớp 2B">Lớp 2B</SelectItem>
                          <SelectItem value="Lớp 3A">Lớp 3A</SelectItem>
                          <SelectItem value="Lớp 3B">Lớp 3B</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateEventForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa điểm</FormLabel>
                      <FormControl>
                        <Input placeholder="Địa điểm xảy ra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateEventForm.control}
                  name="reporter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Người báo cáo</FormLabel>
                      <FormControl>
                        <Input placeholder="Người báo cáo sự kiện" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateEventForm.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mức độ ưu tiên</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn mức độ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cao">Cao</SelectItem>
                          <SelectItem value="Trung bình">Trung bình</SelectItem>
                          <SelectItem value="Thấp">Thấp</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={updateEventForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả chi tiết</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết về sự cố y tế"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateEventForm.control}
                name="contactStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái liên hệ phụ huynh</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Trạng thái liên hệ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Chưa liên hệ">
                          Chưa liên hệ
                        </SelectItem>
                        <SelectItem value="Đang gọi">Đang gọi</SelectItem>
                        <SelectItem value="Đã liên hệ">Đã liên hệ</SelectItem>
                        <SelectItem value="Phụ huynh">
                          Phụ huynh đang đến
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUpdateEventOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                  Cập nhật
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Process Event Dialog */}
      <Dialog open={processEventOpen} onOpenChange={setProcessEventOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-teal-800">
              Xử lý sự cố y tế
            </DialogTitle>
            <DialogDescription className="text-teal-600">
              Ghi chú và cập nhật trạng thái xử lý sự cố y tế
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <h4 className="font-medium text-gray-800">
                {selectedEvent.title}
              </h4>
              <div className="text-sm text-gray-600 mt-1">
                <div>
                  {selectedEvent.student} - {selectedEvent.class}
                </div>
                <div>
                  {selectedEvent.location} - {selectedEvent.time}
                </div>
              </div>
            </div>
          )}

          <Form {...processEventForm}>
            <form
              onSubmit={processEventForm.handleSubmit(onProcessEvent)}
              className="space-y-4"
            >
              <FormField
                control={processEventForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái xử lý</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="processing">Đang xử lý</SelectItem>
                        <SelectItem value="waiting">Chờ phụ huynh</SelectItem>
                        <SelectItem value="completed">Đã xử lý xong</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={processEventForm.control}
                name="actionTaken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hành động đã thực hiện</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả hành động đã thực hiện"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={processEventForm.control}
                name="contactParent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Đã liên hệ phụ huynh</FormLabel>
                      <FormDescription>
                        Đánh dấu nếu đã liên hệ với phụ huynh về sự kiện này
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={processEventForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú bổ sung</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Thêm ghi chú về tình trạng học sinh, hướng dẫn tiếp theo, v.v."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setProcessEventOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                  Hoàn tất xử lý
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Event Details Dialog */}
      <Dialog
        open={viewEventDetailsOpen}
        onOpenChange={setViewEventDetailsOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-teal-800">
              Chi tiết sự cố y tế
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-teal-800">
                    {selectedEvent.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <Badge
                      className={
                        selectedEvent.priority === "Cao"
                          ? "bg-red-100 text-red-800"
                          : selectedEvent.priority === "Trung bình"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }
                    >
                      {selectedEvent.priority || "Đã xử lý"}
                    </Badge>
                    <span>{selectedEvent.time || selectedEvent.date}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Học sinh</p>
                    <p className="font-medium">{selectedEvent.student}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Lớp</p>
                    <p className="font-medium">{selectedEvent.class}</p>
                  </div>
                  {selectedEvent.location && (
                    <div>
                      <p className="text-gray-500">Địa điểm</p>
                      <p className="font-medium">{selectedEvent.location}</p>
                    </div>
                  )}
                  {selectedEvent.reporter && (
                    <div>
                      <p className="text-gray-500">Người báo cáo</p>
                      <p className="font-medium">{selectedEvent.reporter}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedEvent.description && (
                <div>
                  <h4 className="font-medium text-gray-700">Mô tả</h4>
                  <p className="mt-1 text-gray-600">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {selectedEvent.contactStatus && (
                <div>
                  <h4 className="font-medium text-gray-700">
                    Trạng thái liên hệ
                  </h4>
                  <p className="mt-1 text-gray-600">
                    {selectedEvent.contactStatus}
                  </p>
                </div>
              )}

              {selectedEvent.parentContact && (
                <div>
                  <h4 className="font-medium text-gray-700">
                    Thông tin phụ huynh
                  </h4>
                  <p className="mt-1 text-gray-600">
                    {selectedEvent.parentContact}
                  </p>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setViewEventDetailsOpen(false)}
                >
                  Đóng
                </Button>
                {!selectedEvent.date && ( // Only show for active events, not completed ones
                  <Button
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={() => {
                      setViewEventDetailsOpen(false);
                      handleProcessEvent(selectedEvent);
                    }}
                  >
                    Xử lý sự kiện
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Emergency Process Dialog */}
      <Dialog
        open={emergencyProcessOpen}
        onOpenChange={setEmergencyProcessOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-red-800">
              Xử lý sự kiện khẩn cấp
            </DialogTitle>
            <DialogDescription className="text-red-600">
              Hành động nhanh cho trường hợp cần xử lý ngay
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md">
              <h4 className="font-medium text-red-800">
                {selectedEvent.title}
              </h4>
              <div className="text-sm text-red-700 mt-1">
                <div>
                  {selectedEvent.student} - {selectedEvent.class}
                </div>
                <div>
                  {selectedEvent.location} - {selectedEvent.time}
                </div>
              </div>
            </div>
          )}

          <Form {...emergencyProcessForm}>
            <form
              onSubmit={emergencyProcessForm.handleSubmit(onEmergencyProcess)}
              className="space-y-4"
            >
              <FormField
                control={emergencyProcessForm.control}
                name="immediateAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hành động khẩn cấp</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả hành động khẩn cấp đã thực hiện"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={emergencyProcessForm.control}
                name="notifyParent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Thông báo cho phụ huynh</FormLabel>
                      <FormDescription>
                        Đã liên hệ với phụ huynh về tình trạng khẩn cấp
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={emergencyProcessForm.control}
                name="transferToHospital"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Chuyển đến bệnh viện</FormLabel>
                      <FormDescription>
                        Trường hợp cần chuyển đến cơ sở y tế
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={emergencyProcessForm.control}
                name="hospitalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên bệnh viện/Cơ sở y tế</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên bệnh viện/cơ sở y tế (nếu có)"
                        {...field}
                        disabled={
                          !emergencyProcessForm.watch("transferToHospital")
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={emergencyProcessForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú bổ sung</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Thêm ghi chú quan trọng về tình trạng, thuốc men, xử lý..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEmergencyProcessOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  Xác nhận xử lý khẩn cấp
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const activeEvents = [
  {
    title: "Học sinh bị dị ứng thức ăn",
    student: "Nguyễn Văn An",
    class: "Lớp 1A",
    time: "11:30 - 16/12/2024",
    location: "Phòng ăn",
    priority: "Cao",
    description:
      "Học sinh xuất hiện mề đay và ngứa sau khi ăn trưa. Đã sơ cứu ban đầu và cách ly khỏi nguồn dị ứng.",
    contactStatus: "Phụ huynh",
  },
  {
    title: "Té ngã trong sân chơi",
    student: "Trần Thị Bình",
    class: "Lớp 2B",
    time: "10:15 - 16/12/2024",
    location: "Sân chơi",
    priority: "Trung bình",
    description:
      "Học sinh bị té ngã khi chơi, xây xát nhẹ ở đầu gối. Đã vệ sinh và băng bó vết thương.",
    contactStatus: "Chưa liên hệ",
  },
  {
    title: "Đau bụng đột ngột",
    student: "Lê Hoàng Cường",
    class: "Lớp 3A",
    time: "14:20 - 16/12/2024",
    location: "Lớp học",
    priority: "Trung bình",
    description:
      "Học sinh than đau bụng, có dấu hiệu buồn nôn. Đang theo dõi và cho nghỉ ngơi.",
    contactStatus: "Đang gọi",
  },
];

const completedEvents = [
  {
    title: "Sốt cao",
  },
  {
    title: "Chảy máu cam",
    student: "Hoàng Văn Em",
    class: "Lớp 1B",
    date: "14/12/2024",
  },
  {
    title: "Đau đầu",
    student: "Nguyễn Thị Giang",
    class: "Lớp 3B",
    date: "13/12/2024",
  },
];

const emergencyEvents = [
  {
    title: "Ngạt thở do dị ứng nghiêm trọng",
    student: "Trần Văn Hùng",
    class: "Lớp 2A",
    time: "13:45 - 16/12/2024",
    location: "Phòng ăn",
    reporter: "Cô Lan - Giáo viên",
    parentContact: "Đã gọi - Đang đến",
    description:
      "Học sinh có phản ứng dị ứng nghiêm trọng với tôm, khó thở, sưng mặt. Đã tiêm thuốc khẩn cấp và chuẩn bị chuyển viện.",
  },
];

const eventTypeStats = [
  {
    type: "Té ngã, chấn thương",
    description: "Tai nạn trong hoạt động",
    count: 45,
    percentage: 29,
    color: "bg-red-500",
  },
  {
    type: "Dị ứng thức ăn",
    description: "Phản ứng dị ứng",
    count: 28,
    percentage: 18,
    color: "bg-orange-500",
  },
  {
    type: "Sốt, cảm lạnh",
    description: "Bệnh thông thường",
    count: 35,
    percentage: 22,
    color: "bg-yellow-500",
  },
  {
    type: "Đau bụng",
    description: "Vấn đề tiêu hóa",
    count: 25,
    percentage: 16,
    color: "bg-green-500",
  },
  {
    type: "Khác",
    description: "Các trường hợp khác",
    count: 23,
    percentage: 15,
    color: "bg-blue-500",
  },
];

const responseTimeStats = [
  {
    priority: "Khẩn cấp",
    avgTime: "2 phút",
    target: "< 3 phút",
    performance: 95,
    color: "bg-green-500",
  },
  {
    priority: "Cao",
    avgTime: "8 phút",
    target: "< 10 phút",
    performance: 88,
    color: "bg-yellow-500",
  },
  {
    priority: "Trung bình",
    avgTime: "18 phút",
    target: "< 20 phút",
    performance: 92,
    color: "bg-blue-500",
  },
  {
    priority: "Thấp",
    avgTime: "35 phút",
    target: "< 45 phút",
    performance: 85,
    color: "bg-gray-500",
  },
];


