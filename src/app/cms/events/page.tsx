"use client";

import { useEffect, useState } from "react";
import { Plus, Download, RefreshCw, AlertTriangle, Clock, User, Users, MapPin, FileText, PhoneCall, UserCheck, Flag } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTreatmentHistoryStore } from "@/stores/treatment-history-store";
import { useAuthStore } from "@/stores/auth-store";
import { createTreatmentHistory } from "@/lib/api/treatment-history";
import { EventStats } from "./components/stats-cards";
import { FilterBar } from "./_components/filter-bar";
import { EventTable } from "./components/event-table";
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
import { getAllStudents } from "@/lib/api/student";
import { getAllStaffs } from "@/lib/api/staff";
import { updateTreatmentHistory } from "@/lib/api/treatment-history";
import { Student } from "@/lib/type/students";
import { Staff } from "@/lib/type/staff";
import { TreatmentHistory } from "@/lib/type/treatment-history";
import { toast } from "@/components/ui/use-toast";

export default function MedicalEvents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  // State for modals
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [updateEventOpen, setUpdateEventOpen] = useState(false);
  const [processEventOpen, setProcessEventOpen] = useState(false);
  const [viewEventDetailsOpen, setViewEventDetailsOpen] = useState(false);
  const [emergencyProcessOpen, setEmergencyProcessOpen] = useState(false);

  // State for emergency mode
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  // State for selected event
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // State for initial loading and data
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [eventError, setEventError] = useState<string | null>(null);

  // State để lưu danh sách học sinh đã lọc theo lớp
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  // State để lưu danh sách lớp có học sinh
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);

  // Sử dụng store cho treatment history
  const {
    treatmentHistories,
    isLoading,
    error,
    fetchAllTreatmentHistories,
    updateTreatmentHistoryItem,
  } = useTreatmentHistoryStore();

  // Lấy thông tin user đang đăng nhập
  const { user, profile } = useAuthStore();

  // Form schema for adding/updating event

  const eventFormSchema = z.object({
    title: z.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự"),
    student: z.string().min(2, "Vui lòng chọn học sinh"), // ObjectId
    class: z.string().min(1, "Vui lòng chọn lớp"), // ObjectId
    reporter: z.string().min(1, "Vui lòng chọn người báo cáo"), // ObjectId
    description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
    location: z.string().min(1, "Vui lòng nhập địa điểm"),
    priority: z.enum(["Cao", "Trung bình", "Thấp"]),
    contactStatus: z.string().min(1, "Vui lòng nhập trạng thái liên hệ"),
    // Các trường khẩn cấp (optional)
    immediateAction: z.string().optional(),
    notifyParent: z.boolean().optional(),
    transferToHospital: z.boolean().optional(),
    hospitalName: z.string().optional(),
    emergencyNotes: z.string().optional(),
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
      immediateAction: "",
      notifyParent: false,
      transferToHospital: false,
      hospitalName: "",
      emergencyNotes: "",
    },
  });

  useEffect(() => {
    setIsInitialLoading(true);

    // Fetch students and staffs
    Promise.all([getAllStudents(), getAllStaffs()])
      .then(([studentsData, staffsData]) => {
        setStudents(studentsData);
        setFilteredStudents(studentsData); // Khởi tạo filteredStudents với tất cả học sinh

        // Tạo danh sách lớp có học sinh
        const classes = [
          ...new Set(
            studentsData.map((student) => student.class?.name).filter(Boolean)
          ),
        ];
        setAvailableClasses(classes);

        setStaffs(staffsData);
      })
      .catch((error) => {
        setStudentsError(error.message);
      })
      .finally(() => {
        setIsInitialLoading(false);
      });

    // Fetch treatment histories using store
    fetchAllTreatmentHistories();
  }, [fetchAllTreatmentHistories]);

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
    _id: z.string().min(1, "ID không được để trống"),
    status: z.enum(["processing", "resolved", "pending"]),
    notes: z.string().min(5, "Ghi chú phải có ít nhất 5 ký tự"),
    contactParent: z.boolean(),
    actionTaken: z.string().min(5, "Hành động phải có ít nhất 5 ký tự"),
  });

  const processEventForm = useForm<z.infer<typeof processFormSchema>>({
    resolver: zodResolver(processFormSchema),
    defaultValues: {
      _id: "",
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

  // Handle form submissions
  const onAddEvent = async (data: z.infer<typeof eventFormSchema>) => {
    try {
      console.log("Add event data:", data);

      // Tạo notes với thông tin khẩn cấp nếu có
      let notes = `Title: ${data.title} | Location: ${data.location} | Priority: ${data.priority} | Class: ${data.class} | Contact Status: ${data.contactStatus}`;

      if (data.priority === "Cao") {
        const emergencyInfo = [];
        if (data.immediateAction)
          emergencyInfo.push(`Hành động tức thì: ${data.immediateAction}`);
        if (data.notifyParent) emergencyInfo.push("Đã thông báo phụ huynh");
        if (data.transferToHospital)
          emergencyInfo.push(`Chuyển viện: ${data.hospitalName || "Không rõ"}`);
        if (data.emergencyNotes)
          emergencyInfo.push(`Ghi chú khẩn cấp: ${data.emergencyNotes}`);

        if (emergencyInfo.length > 0) {
          notes += ` | KHẨN CẤP: ${emergencyInfo.join(" | ")}`;
        }
      }

      // Gửi đúng schema backend yêu cầu
      await createTreatmentHistory({
        title: data.title,
        student: data.student,
        class: data.class,
        staff: data.reporter, // Changed from reporter to staff
        location: data.location,
        priority: data.priority,
        contactStatus: data.contactStatus,
        description: data.description,
        record: "507f1f77bcf86cd799439011", // ObjectId giả cho health record
        date: new Date().toISOString(), // Ngày hiện tại
        notes: notes,
      });

      // Refresh danh sách events ngay sau khi tạo thành công
      await fetchAllTreatmentHistories();

      setAddEventOpen(false);
      addEventForm.reset();
      setIsEmergencyMode(false); // Reset emergency mode

      if (data.priority === "Cao") {
        alert(
          "🚨 Thêm sự cố khẩn cấp thành công! Vui lòng xử lý ngay lập tức!"
        );
      } else {
        alert("Thêm sự cố y tế thành công!");
      }
    } catch (error) {
      alert("Không thể thêm sự kiện mới!");
      console.error(error);
    }
  };

  const onUpdateEvent = async (data: z.infer<typeof eventFormSchema>) => {
    try {
      console.log("Update event data:", data);

      if (!selectedEvent || !selectedEvent._id) {
        alert("Không tìm thấy thông tin sự kiện!");
        return;
      }

      // Gọi API cập nhật theo backend schema
      await updateTreatmentHistoryItem(selectedEvent._id, {
        student: data.student,
        staff: data.reporter || selectedEvent.staff || "Unknown Staff", // Changed from reporter to staff
        record: selectedEvent.record || "507f1f77bcf86cd799439011", // ObjectId giả
        date: selectedEvent.date || new Date().toISOString(),
        description: data.description,
        notes: `Title: ${data.title} | Location: ${data.location} | Priority: ${data.priority} | Class: ${data.class} | Contact Status: ${data.contactStatus}`,
      });

      setUpdateEventOpen(false);
      updateEventForm.reset();
      alert("Cập nhật sự cố y tế thành công!");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Không thể cập nhật sự cố y tế!");
    }
  };

  const onProcessEvent = async (data: z.infer<typeof processFormSchema>) => {
    try {
      console.log("Process event data:", data);
      console.log("Event ID being processed:", data._id);

      // Cập nhật treatment history với thông tin xử lý
      const existingEvent = treatmentHistories.find((e) => e._id === data._id);
      const currentNotes = existingEvent?.notes || "";
      const processInfo = `Contact Parent: ${data.contactParent} | Action: ${data.actionTaken} | Process Notes: ${data.notes}`;

      await updateTreatmentHistoryItem(data._id, {
        status: data.status, // Cập nhật trường status thực tế
        notes: currentNotes ? `${currentNotes} | ${processInfo}` : processInfo,
      });

      setProcessEventOpen(false);
      processEventForm.reset();
      alert("Cập nhật trạng thái xử lý thành công!");
    } catch (error) {
      console.error("Error processing event:", error);
      alert("Không thể cập nhật trạng thái xử lý!");
    }
  };

  const onEmergencyProcess = async (
    data: z.infer<typeof emergencyFormSchema>
  ) => {
    try {
      console.log("Emergency process data:", data);

      if (!selectedEvent || !selectedEvent._id) {
        alert("Không tìm thấy thông tin sự kiện!");
        return;
      }

      // Cập nhật treatment history với thông tin xử lý khẩn cấp
      await updateTreatmentHistoryItem(selectedEvent._id, {
        status: "processing", // Sử dụng trạng thái được định nghĩa trong schema
        actionTaken:
          data.immediateAction +
          (data.transferToHospital
            ? ` | Chuyển đến bệnh viện: ${data.hospitalName || "Không rõ"}`
            : ""),
        notes: data.notes || "",
        contactParent: data.notifyParent,
        priority: "Cao", // Tự động nâng mức độ ưu tiên lên cao
      });

      // Refresh danh sách events sau khi cập nhật
      await fetchAllTreatmentHistories();
      const processedData = ensureCreatedAt(treatmentHistories);
      // setEventList(processedData); // This line was removed as per the edit hint

      setEmergencyProcessOpen(false);
      emergencyProcessForm.reset();
      alert("Xử lý sự kiện khẩn cấp thành công!");
    } catch (error) {
      console.error("Error processing emergency:", error);
      alert("Không thể cập nhật xử lý khẩn cấp!");
    }
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
    console.log("Selected event for processing:", event);
    processEventForm.reset({
      _id: event._id || "",
      status: "processing",
      notes: "",
      contactParent: false,
      actionTaken: "",
    });
    setProcessEventOpen(true);
  };

  const handleEmergencyProcess = (event: any) => {
    setSelectedEvent(event);
    emergencyProcessForm.reset();
    setEmergencyProcessOpen(true);
  };

  // Filter events based on search and filters
  const filteredEvents = [...treatmentHistories]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      if (dateB !== dateA) return dateB - dateA;
      // Nếu thời gian bằng nhau, sort tiếp theo _id (nếu có)
      if (a._id && b._id) return b._id.localeCompare(a._id);
      return 0;
    })
    .filter((event) => {
      // Lấy tiêu đề từ title hoặc từ notes (nếu có)
      let eventTitle = event.title || "";
      if (!eventTitle && event.notes) {
        const match = event.notes.match(/Title: ([^|]+)/);
        if (match) eventTitle = match[1].trim();
      }
      // Loại bỏ sự kiện có tiêu đề 'Ngã cầu thang'
      if (eventTitle === "Ngã cầu thang") return false;

      const eventStudent =
        typeof event.student === "object" && event.student?.name
          ? event.student.name
          : typeof event.student === "string"
          ? event.student
          : "";

      const matchesSearch =
        eventStudent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || event.status === selectedStatus;

      const matchesPriority =
        selectedPriority === "all" || event.priority === selectedPriority;

      // Date filtering logic
      let matchesDate = true;
      if (selectedDate !== "all" && event.createdAt) {
        const eventDate = new Date(event.createdAt);
        const now = new Date();

        switch (selectedDate) {
          case "today":
            matchesDate = eventDate.toDateString() === now.toDateString();
            break;
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = eventDate >= weekAgo;
            break;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = eventDate >= monthAgo;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesDate;
    });

  // Calculate stats
  const stats = {
    total: treatmentHistories.length,
    pending: treatmentHistories.filter((e) => e.status === "pending").length,
    processing: treatmentHistories.filter((e) => e.status === "processing")
      .length,
    resolved: treatmentHistories.filter((e) => e.status === "resolved").length,
    high: treatmentHistories.filter((e) => e.priority === "Cao").length,
    medium: treatmentHistories.filter((e) => e.priority === "Trung bình")
      .length,
    low: treatmentHistories.filter((e) => e.priority === "Thấp").length,
  };

  // Handle export to Excel
  const handleExportExcel = () => {
    try {
      const headers = [
        "Tiêu đề",
        "Học sinh",
        "Lớp",
        "Địa điểm",
        "Mức độ ưu tiên",
        "Trạng thái",
        "Ngày tạo",
      ];
      const csvContent = [
        headers.join(","),
        ...filteredEvents.map((event) => {
          const studentName =
            typeof event.student === "object" && event.student?.name
              ? event.student.name
              : typeof event.student === "string"
              ? event.student
              : "N/A";

          return [
            `"${event.title || "N/A"}"`,
            `"${studentName}"`,
            `"${event.class || "N/A"}"`,
            `"${event.location || "N/A"}"`,
            `"${event.priority || "N/A"}"`,
            `"${event.status || "pending"}"`,
            `"${
              event.createdAt
                ? new Date(event.createdAt).toLocaleDateString("vi-VN")
                : "N/A"
            }"`,
          ].join(",");
        }),
      ].join("\n");

      const blob = new Blob(["\ufeff" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `danh-sach-su-kien-y-te-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  useEffect(() => {
    fetchAllTreatmentHistories()
      .then(() => {
        console.log("Fetched treatment histories successfully");
      })
      .catch((error) => {
        console.error("Error fetching treatment histories:", error);
      });
  }, [fetchAllTreatmentHistories]);

  // Hàm đảm bảo mỗi sự kiện có createdAt
  const ensureCreatedAt = (events: any[]) => {
    return events.map((event) => {
      if (!event.createdAt) {
        console.log("Adding missing createdAt to event:", event._id);
        return {
          ...event,
          createdAt: new Date().toISOString(),
        };
      }
      return event;
    });
  };

  // Hàm lọc học sinh theo lớp
  const filterStudentsByClass = (selectedClass: string) => {
    if (!selectedClass || selectedClass === "") {
      setFilteredStudents(students);
      return;
    }

    // Lọc học sinh theo lớp đã chọn
    const filtered = students.filter((student) => {
      // Kiểm tra lớp của học sinh - dựa trên cấu trúc dữ liệu thực tế
      const studentClassName = student.class?.name || "";
      return studentClassName === selectedClass;
    });

    setFilteredStudents(filtered);
  };

  const refreshEvents = () => {
    fetchAllTreatmentHistories();
  };

  // Tự động set reporter khi mở form thêm mới
  const handleOpenAddEvent = () => {
    setAddEventOpen(true);
    setIsEmergencyMode(false); // Reset emergency mode
    // Tự động set người báo cáo là user đang đăng nhập
    if (user && user._id) {
      addEventForm.setValue("reporter", user._id);
    } else {
      // Nếu không có _id, không set hoặc có thể báo lỗi
      addEventForm.setValue("reporter", "");
    }
  };

  const handlePriorityChange = (value: "Cao" | "Trung bình" | "Thấp") => {
    setIsEmergencyMode(value === "Cao");
    addEventForm.setValue("priority", value);
  };

  // Hàm xử lý khi click stats card
  const handleStatsCardClick = (type: string) => {
    if (type === "all") {
      setSelectedStatus("all");
      setSelectedPriority("all");
    } else if (type === "pending") {
      setSelectedStatus("pending");
      setSelectedPriority("all");
    } else if (type === "resolved") {
      setSelectedStatus("resolved");
      setSelectedPriority("all");
    } else if (type === "high") {
      setSelectedPriority("Cao");
      setSelectedStatus("all");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Loading Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
              >
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Loading Content */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            <div className="xl:col-span-1">
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-12 bg-gray-200 rounded-lg animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:col-span-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-200 rounded-lg animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quản lý sự cố y tế
                </h1>
                <p className="text-gray-600 mt-1">
                  Hệ thống theo dõi và xử lý sự cố y tế trong trường học
                </p>
              </div>
            </div>
          </div>

          {/* Error Content */}
          <div className="flex justify-center items-center py-16">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Đã xảy ra lỗi
              </h3>
              <p className="text-red-600 mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
              >
                Thử lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - Centered, icon on top, title and description below */}
        <div className="mb-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg flex items-center justify-center mb-4">
            <AlertTriangle className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý sự cố y tế</h1>
          <p className="text-gray-600 max-w-xl">
            Hệ thống theo dõi và xử lý sự cố y tế trong trường học
          </p>
        </div>

        {/* Stats Cards - 4 columns, soft color, icon right, rounded, shadow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-700">{stats.total}</div>
              <div className="text-sm text-gray-500 mt-1">Tổng sự kiện</div>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-500 mt-1">Chờ xử lý</div>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600">{stats.high}</div>
              <div className="text-sm text-gray-500 mt-1">Ưu tiên cao</div>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Flag className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-emerald-600">{stats.resolved}</div>
              <div className="text-sm text-gray-500 mt-1">Đã giải quyết</div>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Enhanced Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Quick Actions Card */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                {/* <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <span className="mr-2">⚡</span>
                    Thao tác nhanh
                  </CardTitle>
                </CardHeader> */}
                <CardContent className="p-6 space-y-4 flex flex-col items-center">
                  <Button
                    onClick={handleOpenAddEvent}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span className="font-medium">Thêm sự cố</span>
                  </Button>

                  <Button
                    onClick={handleExportExcel}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Download className="h-5 w-5" />
                    <span className="font-medium">Xuất Excel</span>
                  </Button>

                  {/* Đã xóa nút Làm mới */}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="xl:col-span-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <span className="mr-3">📋</span>
                      Danh sách sự cố y tế
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      Quản lý và theo dõi tất cả sự cố y tế trong hệ thống
                    </CardDescription>
                  </div>
                  {/* Xóa phần tổng số sự kiện */}
                  {/* <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-500">
                      Tổng: <span className="font-semibold text-gray-700">{filteredEvents.length}</span> sự kiện
                    </div>
                  </div> */}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <FilterBar
                    onSearchChange={setSearchTerm}
                    onStatusFilterChange={setSelectedStatus}
                    onPriorityFilterChange={setSelectedPriority}
                    onDateFilterChange={setSelectedDate}
                  />
                  <div className="mt-6">
                    <EventTable
                      events={filteredEvents}
                      onView={handleViewDetails}
                      onProcess={handleProcessEvent}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs: Add, Update, View, Process, EmergencyProcess giữ nguyên, chỉ chỉnh className cho đồng bộ style (bo góc, shadow, màu sắc) */}
      {/* ... giữ nguyên các Dialog, chỉ cần chỉnh className nếu cần */}
      {/* Add Event Dialog */}
      <Dialog open={addEventOpen} onOpenChange={setAddEventOpen}>
        <DialogContent
          className={`max-w-4xl max-h-[95vh] rounded-3xl shadow-2xl overflow-hidden border-0 ${
            isEmergencyMode
              ? "bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 border-2 border-red-200"
              : "bg-gradient-to-br from-white to-gray-50"
          }`}
        >
          <DialogHeader
            className={`sticky top-0 z-10 backdrop-blur-sm ${
              isEmergencyMode
                ? "bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-t-3xl shadow-lg"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-3xl shadow-lg"
            }`}
          >
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isEmergencyMode
                      ? "bg-red-500/20 backdrop-blur-sm"
                      : "bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  {isEmergencyMode ? (
                    <span className="text-2xl animate-pulse">🚨</span>
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <DialogTitle
                    className={`text-2xl font-bold ${
                      isEmergencyMode ? "text-white" : "text-white"
                    }`}
                  >
                    {isEmergencyMode
                      ? "THÊM SỰ CỐ KHẨN CẤP"
                      : " Thêm sự cố y tế"}
                  </DialogTitle>
                  <DialogDescription
                    className={`mt-1 ${
                      isEmergencyMode ? "text-red-100" : "text-blue-100"
                    }`}
                  >
                    {isEmergencyMode
                      ? "Sự cố nghiêm trọng - Cần xử lý ngay lập tức!"
                      : "Nhập thông tin chi tiết về sự cố y tế mới"}
                  </DialogDescription>
                </div>
              </div>
              {isEmergencyMode && (
                <div className="bg-red-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse border border-red-300">
                  ⚠️ KHẨN CẤP
                </div>
              )}
            </div>
          </DialogHeader>

          <Form {...addEventForm}>
            <form
              onSubmit={addEventForm.handleSubmit(onAddEvent)}
              className="space-y-6 max-h-[calc(95vh-200px)] overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              {/* Emergency Alert */}
              {isEmergencyMode && (
                <div className="mb-6 p-6 bg-gradient-to-r from-red-100 to-red-50 border-l-4 border-red-500 rounded-r-2xl shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">⚠️</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-red-800 text-lg mb-2">
                        {" "}
                        SỰ CỐ KHẨN CẤP
                      </h4>
                      <p className="text-red-700 text-base leading-relaxed">
                        Vui lòng xử lý ngay lập tức và tuân thủ quy trình khẩn
                        cấp! Đảm bảo an toàn cho học sinh là ưu tiên hàng đầu.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Emergency Checklist */}
              {isEmergencyMode && (
                <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl shadow-lg">
                  <h4 className="font-bold text-yellow-800 mb-4 flex items-center text-lg">
                    <span className="mr-3 text-xl">⏰</span>✅ Checklist khẩn
                    cấp:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {[
                      "Đánh giá tình trạng học sinh",
                      "Gọi cấp cứu (nếu cần)",
                      "Liên hệ phụ huynh ngay",
                      "Chuẩn bị chuyển viện",
                      "Ghi chép đầy đủ",
                      "Thông báo ban giám hiệu",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-2 bg-white/50 rounded-lg"
                      >
                        <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 font-medium">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Basic Information Section */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">📝</span>
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={addEventForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Tiêu đề sự kiện
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tiêu đề sự kiện..."
                            className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
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
                        <FormLabel className="text-gray-700 font-medium">
                          Học sinh
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Chọn học sinh" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {filteredStudents.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <User className="w-6 h-6 text-gray-400" />
                                  </div>
                                  Không có học sinh trong lớp này
                                </div>
                              ) : (
                                filteredStudents.map((student) => {
                                  const studentId = student.student?._id || "";
                                  const studentName =
                                    student.student?.name || "Không rõ";
                                  return (
                                    <SelectItem
                                      key={studentId}
                                      value={studentId}
                                      className="rounded-lg"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                          <User className="w-3 h-3 text-blue-600" />
                                        </div>
                                        <span>{studentName}</span>
                                      </div>
                                    </SelectItem>
                                  );
                                })
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addEventForm.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Lớp
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            filterStudentsByClass(value);
                            addEventForm.setValue("student", "");
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Chọn lớp" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            {availableClasses.length === 0 ? (
                              <div className="p-4 text-center text-gray-500 text-sm">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <Users className="w-6 h-6 text-gray-400" />
                                </div>
                                Không có lớp nào có học sinh
                              </div>
                            ) : (
                              availableClasses.map((className) => (
                                <SelectItem
                                  key={className}
                                  value={className}
                                  className="rounded-lg"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                      <Users className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span>{className}</span>
                                  </div>
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
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Địa điểm
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Địa điểm xảy ra sự cố..."
                            className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
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
                        <FormLabel className="text-gray-700 font-medium">
                          Người báo cáo
                        </FormLabel>
                        <FormControl>
                          <Input
                            value={
                              profile?.name || user?.email || "Không xác định"
                            }
                            disabled
                            className="rounded-xl bg-gray-50 text-gray-600 border-gray-200"
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500 flex items-center">
                          <span className="mr-1">🔒</span>
                          Tự động lấy từ tài khoản đang đăng nhập
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addEventForm.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={`font-medium ${
                            isEmergencyMode ? "text-red-700" : "text-gray-700"
                          }`}
                        >
                          Mức độ ưu tiên
                        </FormLabel>
                        <Select
                          onValueChange={(
                            value: "Cao" | "Trung bình" | "Thấp"
                          ) => {
                            handlePriorityChange(value);
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={`rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                                isEmergencyMode
                                  ? "border-red-300 bg-red-50"
                                  : ""
                              }`}
                            >
                              <SelectValue placeholder="Chọn mức độ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            <SelectItem
                              value="Cao"
                              className="text-red-600 font-semibold rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">🚨</span>
                                <span>Cao (Khẩn cấp)</span>
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="Trung bình"
                              className="rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">⚡</span>
                                <span>Trung bình</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Thấp" className="rounded-lg">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">📋</span>
                                <span>Thấp</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Description and Contact Status Section */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">📋</span>
                  Thông tin chi tiết
                </h3>
                <div className="space-y-6">
                  <FormField
                    control={addEventForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Mô tả chi tiết
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Mô tả chi tiết về sự cố y tế..."
                            className="min-h-[120px] rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
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
                        <FormLabel className="text-gray-700 font-medium">
                          Trạng thái liên hệ phụ huynh
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Trạng thái liên hệ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            <SelectItem
                              value="Chưa liên hệ"
                              className="rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                <span>Chưa liên hệ</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Đang gọi" className="rounded-lg">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <span>Đang gọi</span>
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="Đã liên hệ"
                              className="rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <span>Đã liên hệ</span>
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="Phụ huynh"
                              className="rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                <span>Phụ huynh đang đến</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Emergency Fields - Only show when priority is HIGH */}
              {isEmergencyMode && (
                <div className="bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">🚨</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-800">
                        Thông tin khẩn cấp
                      </h3>
                      <p className="text-red-600 text-sm">
                        Vui lòng điền đầy đủ thông tin khẩn cấp
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <FormField
                      control={addEventForm.control}
                      name="immediateAction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-700 font-semibold text-base">
                            🚨 Hành động tức thì đã thực hiện
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Mô tả chi tiết hành động khẩn cấp đã thực hiện..."
                              className="min-h-[100px] border-red-300 focus:border-red-500 rounded-xl resize-none bg-white/80"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-red-600 flex items-center">
                            <span className="mr-2">💡</span>
                            Ghi chép ngay những hành động đã thực hiện để xử lý
                            khẩn cấp
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={addEventForm.control}
                        name="notifyParent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-4 space-y-0 p-4 bg-white/60 rounded-xl border border-red-200">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="mt-1 w-5 h-5 text-red-600 border-red-300 rounded focus:ring-red-500"
                              />
                            </FormControl>
                            <div className="space-y-2 leading-none">
                              <FormLabel className="text-red-700 font-semibold flex items-center text-base">
                                <span className="mr-2 text-lg">📞</span>
                                Thông báo khẩn cấp cho phụ huynh
                              </FormLabel>
                              <FormDescription className="text-red-600">
                                Gửi SMS và gọi điện ngay lập tức
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={addEventForm.control}
                        name="transferToHospital"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-4 space-y-0 p-4 bg-white/60 rounded-xl border border-red-200">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="mt-1 w-5 h-5 text-red-600 border-red-300 rounded focus:ring-red-500"
                              />
                            </FormControl>
                            <div className="space-y-2 leading-none">
                              <FormLabel className="text-red-700 font-semibold flex items-center text-base">
                                <span className="mr-2 text-lg">🏥</span>
                                Cần chuyển bệnh viện
                              </FormLabel>
                              <FormDescription className="text-red-600">
                                Chuẩn bị chuyển viện khẩn cấp
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {addEventForm.watch("transferToHospital") && (
                      <FormField
                        control={addEventForm.control}
                        name="hospitalName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-700 font-semibold text-base">
                              🏥 Tên bệnh viện
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tên bệnh viện dự định chuyển đến..."
                                className="border-red-300 focus:border-red-500 rounded-xl bg-white/80"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={addEventForm.control}
                      name="emergencyNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-700 font-semibold text-base">
                            📝 Ghi chú khẩn cấp
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ghi chép thêm thông tin khẩn cấp..."
                              className="min-h-[80px] border-red-300 focus:border-red-500 rounded-xl resize-none bg-white/80"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <DialogFooter className="pt-6 border-t mt-8">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Hệ thống sẵn sàng</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setAddEventOpen(false);
                        setIsEmergencyMode(false);
                      }}
                      className="px-6 py-2 rounded-xl border-gray-300 hover:bg-gray-50"
                    >
                      <span className="mr-2">❌</span>
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className={`font-bold px-8 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        isEmergencyMode
                          ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                      }`}
                    >
                      {isEmergencyMode ? (
                        <>
                          <span className="mr-2 text-lg">🚨</span>
                          LƯU VÀ XỬ LÝ KHẨN CẤP
                        </>
                      ) : (
                        <>
                          <span className="mr-2">💾</span>
                          Lưu sự kiện
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Update Event Dialog */}
      <Dialog open={updateEventOpen} onOpenChange={setUpdateEventOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] rounded-3xl shadow-2xl overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50">
          <DialogHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-3xl shadow-lg">
            <div className="flex items-center space-x-4 p-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  ✏️ Cập nhật sự cố y tế
                </DialogTitle>
                <DialogDescription className="mt-1 text-emerald-100">
                  Cập nhật thông tin chi tiết về sự cố y tế
                </DialogDescription>
              </div>
            </div>
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
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn học sinh" />
                          </SelectTrigger>
                          <SelectContent>
                            {students.length === 0 ? (
                              <div className="p-2 text-gray-500 text-sm">
                                Không có học sinh
                              </div>
                            ) : (
                              students.map((student: any) => {
                                const studentId =
                                  student.student?._id || student._id || "";
                                const studentName =
                                  student.student?.name ||
                                  student.name ||
                                  "Không rõ";
                                return (
                                  <SelectItem key={studentId} value={studentId}>
                                    {studentName}
                                  </SelectItem>
                                );
                              })
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
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
                          {availableClasses.length === 0 ? (
                            <div className="p-2 text-gray-500 text-sm">
                              Không có lớp nào có học sinh
                            </div>
                          ) : (
                            availableClasses.map((className) => (
                              <SelectItem key={className} value={className}>
                                {className}
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
                  render={({ field }) => {
                    // Tìm staff theo ID
                    const staffId = field.value;
                    const staff = staffs.find((s) => s._id === staffId);
                    const staffName =
                      staff?.profile?.name ||
                      staff?.user?.email ||
                      "Không xác định";
                    return (
                      <FormItem>
                        <FormLabel>Người báo cáo</FormLabel>
                        <FormControl>
                          <Input
                            value={staffName}
                            disabled
                            className="bg-gray-50 text-gray-600"
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500">
                          Tự động lấy từ người tạo sự kiện, không thể thay đổi
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
        <DialogContent className="max-w-2xl rounded-2xl shadow-2xl">
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
                  {/* Safely access student name and class */}
                  {(() => {
                    if (
                      typeof selectedEvent.student === "object" &&
                      selectedEvent.student !== null
                    ) {
                      const studentName =
                        selectedEvent.student.name || "Không rõ";
                      const studentClass =
                        typeof selectedEvent.student.class === "object"
                          ? selectedEvent.student.class?.name || "Không rõ"
                          : selectedEvent.student.class || "Không rõ";
                      return `${studentName} - ${studentClass}`;
                    }
                    return selectedEvent.student || "Không rõ";
                  })()}
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
              {/* Hidden field for event ID */}
              <FormField
                control={processEventForm.control}
                name="_id"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input type="hidden" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

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
                        <SelectItem value="resolved">Đã giải quyết</SelectItem>
                        <SelectItem value="pending">Chờ xử lý</SelectItem>
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
        <DialogContent className="max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50">
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-3xl shadow-lg">
            <div className="flex items-center space-x-4 p-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <span>👁️</span>
                  {String(
                    selectedEvent
                      ? selectedEvent.title || "Không có tiêu đề"
                      : "Không có tiêu đề"
                  )}
                </DialogTitle>
                <DialogDescription className="mt-1 text-blue-100">
                  Thông tin chi tiết về sự cố y tế
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-6">
              {/* Thông tin tổng quan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-sky-50 rounded-lg p-4 border">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-700" />
                    <span className="font-medium text-gray-700">Học sinh:</span>
                    <span className="text-gray-800">
                      {(() => {
                        if (
                          typeof selectedEvent.student === "object" &&
                          selectedEvent.student !== null
                        ) {
                          return selectedEvent.student.name || "Không rõ";
                        }
                        return String(selectedEvent.student || "Không rõ");
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-700" />
                    <span className="font-medium text-gray-700">Lớp:</span>
                    <span className="text-gray-800">
                      {(() => {
                        if (
                          typeof selectedEvent.class === "object" &&
                          selectedEvent.class !== null
                        ) {
                          return selectedEvent.class.name || "Không rõ";
                        }
                        return String(selectedEvent.class || "Không rõ");
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-700" />
                    <span className="font-medium text-gray-700">Địa điểm:</span>
                    <span className="text-gray-800">
                      {String(selectedEvent.location || "Không rõ")}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-sky-700" />
                    <span className="font-medium text-gray-700">
                      Người báo cáo:
                    </span>
                    <span className="text-gray-800">
                      {(() => {
                        if (
                          typeof selectedEvent.staff === "object" &&
                          selectedEvent.staff !== null
                        ) {
                          // Ưu tiên profile.name, rồi user.email
                          return (
                            selectedEvent.staff.profile?.name ||
                            selectedEvent.staff.user?.email ||
                            profile?.name ||
                            user?.email ||
                            "Không rõ"
                          );
                        }
                        if (typeof selectedEvent.staff === "string") {
                          const staffObj = staffs.find(
                            (s) => s._id === selectedEvent.staff
                          );
                          return (
                            staffObj?.profile?.name ||
                            staffObj?.user?.email ||
                            profile?.name ||
                            user?.email ||
                            "Không rõ"
                          );
                        }
                        return profile?.name || user?.email || "Không rõ";
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-sky-700" />
                    <span className="font-medium text-gray-700">
                      Mức độ ưu tiên:
                    </span>
                    <span className="text-gray-800">
                      {String(selectedEvent.priority || "Không rõ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-700" />
                    <span className="font-medium text-gray-700">
                      Thời gian:
                    </span>
                    <span className="text-gray-800">
                      {selectedEvent.createdAt
                        ? new Date(selectedEvent.createdAt).toLocaleString(
                            "vi-VN",
                            {
                              dateStyle: "full",
                              timeStyle: "medium",
                            }
                          )
                        : "Không rõ"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mô tả */}
              <div className="bg-white rounded-lg border p-4">
                <h4 className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-700" />
                  Mô tả chi tiết
                </h4>
                <p className="text-gray-800">
                  {String(selectedEvent.description || "Không có mô tả")}
                </p>
              </div>

              {/* Trạng thái liên hệ phụ huynh */}
              <div className="bg-sky-50 rounded-lg border p-4 flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-teal-700" />
                <div>
                  <div className="font-semibold text-gray-700">
                    Trạng thái liên hệ phụ huynh
                  </div>
                  <div className="text-gray-800">
                    {(() => {
                      let contactStatus;
                      const validContactStatus = [
                        "Chưa liên hệ",
                        "Đang gọi",
                        "Đã liên hệ",
                        "Phụ huynh đang đến",
                      ];
                      if (
                        selectedEvent.contactStatus &&
                        validContactStatus.includes(selectedEvent.contactStatus)
                      ) {
                        contactStatus = selectedEvent.contactStatus;
                      } else if (selectedEvent.notes) {
                        const match = selectedEvent.notes.match(
                          /Contact Status: ([^|]+)/
                        );
                        if (
                          match &&
                          validContactStatus.includes(match[1].trim())
                        ) {
                          contactStatus = match[1].trim();
                        }
                      }
                      return contactStatus || "Không rõ";
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewEventDetailsOpen(false)}
            >
              Đóng
            </Button>
            {!selectedEvent?.status && selectedEvent && (
              <Button
                onClick={() => {
                  setViewEventDetailsOpen(false);
                  handleProcessEvent(selectedEvent);
                }}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Xử lý sự kiện
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Emergency Process Dialog */}
      <Dialog
        open={emergencyProcessOpen}
        onOpenChange={setEmergencyProcessOpen}
      >
        <DialogContent className="max-w-2xl rounded-2xl shadow-2xl">
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
                  Học sinh:{" "}
                  {typeof selectedEvent.student === "object" &&
                  selectedEvent.student !== null
                    ? selectedEvent.student.name
                    : selectedEvent.student || "Không rõ"}
                </div>
                <div>Địa điểm: {selectedEvent.location}</div>
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
                    <FormLabel>Hành động khẩn cấp đã thực hiện</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập hành động đã thực hiện ngay lập tức"
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
                        Đánh dấu nếu đã thông báo cho phụ huynh về tình trạng
                        khẩn cấp
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
                        onChange={(e) => {
                          field.onChange(e);
                          if (!e.target.checked) {
                            emergencyProcessForm.setValue("hospitalName", "");
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Chuyển đến bệnh viện</FormLabel>
                      <FormDescription>
                        Đánh dấu nếu học sinh đã được chuyển đến bệnh viện
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
                    <FormLabel>Tên bệnh viện</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên bệnh viện"
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
                        placeholder="Thêm ghi chú về tình trạng học sinh, hành động tiếp theo, v.v."
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
