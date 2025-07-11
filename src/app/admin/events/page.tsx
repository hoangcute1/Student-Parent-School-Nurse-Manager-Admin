"use client";

import { useEffect, useState } from "react";
import { Plus, Clock, Download, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
import {
  createTreatmentHistory,
  getAllTreatmentHistories,
  updateTreatmentHistory,
} from "@/lib/api/treatment-history";
import { Student } from "@/lib/type/students";
import { Staff } from "@/lib/type/staff";
import { TreatmentHistory } from "@/lib/type/treatment-history";
import { EventStats } from "./components/stats-cards";
import { FilterBar } from "./_components/filter-bar";
import { EventTable } from "./components/event-table";

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

  // State for selected event
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // State for initial loading and data
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [eventList, setEventList] = useState<any[]>([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);

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

  useEffect(() => {
    setIsInitialLoading(true);

    // Fetch students and staffs
    Promise.all([getAllStudents(), getAllStaffs()])
      .then(([studentsData, staffsData]) => {
        setStudents(studentsData);
        setStaffs(staffsData);
      })
      .catch((error) => {
        setStudentsError(error.message);
      })
      .finally(() => {
        setIsInitialLoading(false);
      });
    getAllTreatmentHistories()
      .then((data) => {
        console.log("Fetched treatment histories:", data);
        setEventList(data);
      })
      .catch(() => setEventError("Không thể tải danh sách sự cố"))
      .finally(() => setEventLoading(false));
  }, []);

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
      // Gửi dữ liệu tới API treatment-history
      // Gửi dữ liệu tới API treatment-history
      await createTreatmentHistory({
        title: data.title,
        student: data.student,
        reporter: data.reporter,
        class: data.class,
        location: data.location,
        priority: data.priority,
        description: data.description,
        contactStatus: data.contactStatus,
      });

      // Refresh danh sách events ngay sau khi tạo thành công
      const updatedEvents = await getAllTreatmentHistories();
      const processedData = ensureCreatedAt(updatedEvents);
      setEventList(processedData);

      setAddEventOpen(false);
      addEventForm.reset();
      alert("Thêm sự cố y tế thành công!");
    } catch (error) {
      alert("Không thể thêm sự cố mới!");
      console.error(error);
    }
  };

  const onUpdateEvent = (data: z.infer<typeof eventFormSchema>) => {
    console.log("Update event data:", data);
    // Add logic to update event
    setUpdateEventOpen(false);
  };

  const onProcessEvent = async (data: z.infer<typeof processFormSchema>) => {
    try {
      console.log("Process event data:", data);
      console.log("Event ID being processed:", data._id);

      // Cập nhật treatment history với thông tin xử lý
      await updateTreatmentHistory(data._id, {
        status: data.status,
        notes: data.notes,
        contactParent: data.contactParent,
        actionTaken: data.actionTaken,
      });

      // Refresh danh sách events sau khi cập nhật
      const updatedEvents = await getAllTreatmentHistories();
      const processedData = ensureCreatedAt(updatedEvents);
      setEventList(processedData);

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
        alert("Không tìm thấy thông tin sự cố!");
        return;
      }

      // Cập nhật treatment history với thông tin xử lý khẩn cấp
      await updateTreatmentHistory(selectedEvent._id, {
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
      const updatedEvents = await getAllTreatmentHistories();
      const processedData = ensureCreatedAt(updatedEvents);
      setEventList(processedData);

      setEmergencyProcessOpen(false);
      emergencyProcessForm.reset();
      alert("Xử lý sự cố khẩn cấp thành công!");
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
  const filteredEvents = eventList.filter((event) => {
    const eventStudent =
      typeof event.student === "object" && event.student?.name
        ? event.student.name
        : typeof event.student === "string"
        ? event.student
        : "";

    const matchesSearch =
      eventStudent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    total: eventList.length,
    pending: eventList.filter((e) => e.status === "pending").length,
    processing: eventList.filter((e) => e.status === "processing").length,
    resolved: eventList.filter((e) => e.status === "resolved").length,
    high: eventList.filter((e) => e.priority === "Cao").length,
    medium: eventList.filter((e) => e.priority === "Trung bình").length,
    low: eventList.filter((e) => e.priority === "Thấp").length,
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
    setEventLoading(true);
    getAllTreatmentHistories()
      .then((data) => {
        console.log("Fetched treatment histories:", data);
        // Đảm bảo mỗi sự kiện có ngày tạo
        const processedData = ensureCreatedAt(data);
        console.log("Processed data with ensured createdAt:", processedData);
        setEventList(processedData);
      })
      .catch((error) => {
        console.error("Error fetching treatment histories:", error);
        setEventError("Không thể tải danh sách sự cố y tế");
      })
      .finally(() => setEventLoading(false));
  }, []);

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

  if (eventLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-sky-800">
            Quản lý sự cố y tế
          </h1>
          <p className="text-sky-600">
            Theo dõi và xử lý các sự cố y tế trong trường học
          </p>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="text-sky-600">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-sky-800">
            Quản lý sự cố y tế
          </h1>
          <p className="text-sky-600">
            Theo dõi và xử lý các sự cố y tế trong trường học
          </p>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">{eventError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-sky-800">
          Quản lý sự cố y tế
        </h1>
        <p className="text-sky-600">
          Theo dõi và xử lý các sự cố y tế trong trường học
        </p>
      </div>

      {/* Stats Cards */}
      <EventStats stats={stats} />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Button
            onClick={() => setAddEventOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm sự cố
          </Button>
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="border-sky-200 text-sky-700 hover:bg-sky-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
        <Button
          onClick={() => {
            setEventLoading(true);
            getAllTreatmentHistories()
              .then((data) => {
                // Đảm bảo mỗi sự kiện có ngày tạo
                const processedData = ensureCreatedAt(data);
                setEventList(processedData);
              })
              .catch((error) => {
                console.error("Error refreshing treatment histories:", error);
                setEventError("Không thể tải danh sách sự kiện");
              })
              .finally(() => setEventLoading(false));
          }}
          variant="outline"
          className="border-sky-200 text-sky-700 hover:bg-sky-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setSelectedStatus}
        onPriorityFilterChange={setSelectedPriority}
        onDateFilterChange={setSelectedDate}
      />

      {/* Events Table */}
      <EventTable
        events={filteredEvents}
        onView={handleViewDetails}
        onEdit={handleUpdateEvent}
        onProcess={handleProcessEvent}
      />

      {/* Add Event Dialog */}
      <Dialog open={addEventOpen} onOpenChange={setAddEventOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-teal-800">Thêm sự cố y tế</DialogTitle>
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
                      <FormLabel>Tiêu đề sự cố</FormLabel>
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
                              students.map((student) => (
                                <SelectItem
                                  key={student.student._id}
                                  value={student.student._id}
                                >
                                  {student.student.name} ({student.student._id})
                                </SelectItem>
                              ))
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn người báo cáo" />
                          </SelectTrigger>
                          <SelectContent>
                            {staffs.length === 0 ? (
                              <div className="p-2 text-gray-500 text-sm">
                                Không có nhân viên
                              </div>
                            ) : (
                              staffs.map((staff) => (
                                <SelectItem key={staff._id} value={staff._id}>
                                  {staff.profile?.name} - {staff.user.role}
                                </SelectItem>
                              ))
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
                  Lưu sự cố
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
                      <FormLabel>Tiêu đề sự cố</FormLabel>
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
                              students.map((student: any) => (
                                <SelectItem
                                  key={student.student?._id || student._id}
                                  value={student.student?._id || student._id}
                                >
                                  {student.student?.name || student.name} (
                                  {student.student?._id || student._id})
                                </SelectItem>
                              ))
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
                        <Input placeholder="Người báo cáo sự cố" {...field} />
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
                  {/* Safely access student name and class */}
                  {typeof selectedEvent.student === "object" &&
                  selectedEvent.student !== null
                    ? `${selectedEvent.student.name || "Không rõ"} - ${
                        selectedEvent.student.class || "Không rõ"
                      }`
                    : selectedEvent.student || "Không rõ"}
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
                        <SelectItem value="resolved">Chờ phụ huynh</SelectItem>
                        <SelectItem value="pending">Đã xử lý xong</SelectItem>
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
                        Đánh dấu nếu đã liên hệ với phụ huynh về sự cố này
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
                    <Clock className="w-4 h-4" />
                    <span>
                      {selectedEvent.createdAt
                        ? new Date(selectedEvent.createdAt).toLocaleString(
                            "vi-VN",
                            {
                              dateStyle: "full",
                              timeStyle: "medium",
                            }
                          )
                        : "Không rõ thời gian tạo"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Học sinh:</span>{" "}
                    <span className="text-gray-600">
                      {typeof selectedEvent.student === "object" &&
                      selectedEvent.student !== null
                        ? selectedEvent.student.name
                        : selectedEvent.student || "Không rõ"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Lớp:</span>{" "}
                    <span className="text-gray-600">{selectedEvent.class}</span>
                  </div>
                  {selectedEvent.location && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Địa điểm:
                      </span>{" "}
                      <span className="text-gray-600">
                        {selectedEvent.location}
                      </span>
                    </div>
                  )}
                  {selectedEvent.reporter && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Người báo cáo:
                      </span>{" "}
                      <span className="text-gray-600">
                        {selectedEvent.reporter}
                      </span>
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
                {!selectedEvent.status && (
                  <Button
                    onClick={() => {
                      setViewEventDetailsOpen(false);
                      handleProcessEvent(selectedEvent);
                    }}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Xử lý sự cố
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
              Xử lý sự cố khẩn cấp
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
