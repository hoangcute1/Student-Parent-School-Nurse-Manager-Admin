"use client";

import { useState } from "react";
import { AlertTriangle, Phone, Hospital, User, Clock, MapPin, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const emergencyFormSchema = z.object({
  title: z.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự"),
  student: z.string().min(2, "Vui lòng chọn học sinh"),
  class: z.string().min(1, "Vui lòng chọn lớp"),
  location: z.string().min(1, "Vui lòng nhập địa điểm"),
  priority: z.enum(["Cao", "Trung bình", "Thấp"]),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  contactStatus: z.string().min(1, "Vui lòng nhập trạng thái liên hệ"),
  // Các trường khẩn cấp
  immediateAction: z.string().optional(),
  notifyParent: z.boolean(),
  transferToHospital: z.boolean(),
  hospitalName: z.string().optional(),
  emergencyNotes: z.string().optional(),
});

export default function EmergencyFormDemo() {
  const [priority, setPriority] = useState<"Cao" | "Trung bình" | "Thấp">("Trung bình");
  const [isEmergency, setIsEmergency] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([
    { id: "student1", name: "Nguyễn Văn A", class: "Lớp 1A" },
    { id: "student2", name: "Trần Thị B", class: "Lớp 1B" },
    { id: "student3", name: "Lê Văn C", class: "Lớp 2A" },
    { id: "student4", name: "Phạm Thị D", class: "Lớp 1A" },
    { id: "student5", name: "Hoàng Văn E", class: "Lớp 1B" },
    { id: "student6", name: "Vũ Thị F", class: "Lớp 2A" },
  ]);
  const [allStudents] = useState([
    { id: "student1", name: "Nguyễn Văn A", class: "Lớp 1A" },
    { id: "student2", name: "Trần Thị B", class: "Lớp 1B" },
    { id: "student3", name: "Lê Văn C", class: "Lớp 2A" },
    { id: "student4", name: "Phạm Thị D", class: "Lớp 1A" },
    { id: "student5", name: "Hoàng Văn E", class: "Lớp 1B" },
    { id: "student6", name: "Vũ Thị F", class: "Lớp 2A" },
  ]);

  const form = useForm<z.infer<typeof emergencyFormSchema>>({
    resolver: zodResolver(emergencyFormSchema),
    defaultValues: {
      title: "",
      student: "",
      class: "",
      location: "",
      priority: "Trung bình",
      description: "",
      contactStatus: "Chưa liên hệ",
      immediateAction: "",
      notifyParent: false,
      transferToHospital: false,
      hospitalName: "",
      emergencyNotes: "",
    },
  });

  const handlePriorityChange = (value: "Cao" | "Trung bình" | "Thấp") => {
    setPriority(value);
    setIsEmergency(value === "Cao");
    form.setValue("priority", value);
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    form.setValue("class", value);
    
    if (!value || value === "") {
      setFilteredStudents(allStudents);
      form.setValue("student", "");
      return;
    }
    
    // Lọc học sinh theo lớp đã chọn
    const filtered = allStudents.filter((student) => student.class === value);
    setFilteredStudents(filtered);
    form.setValue("student", ""); // Reset student selection
  };

  const onSubmit = (data: z.infer<typeof emergencyFormSchema>) => {
    console.log("Form data:", data);
    alert("Demo: Form đã được gửi!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className={`transition-all duration-300 ${
          isEmergency 
            ? "border-2 border-red-500 bg-gradient-to-br from-red-50 to-pink-50 shadow-2xl" 
            : "border border-gray-200"
        }`}>
          <CardHeader className={`${
            isEmergency 
              ? "bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg" 
              : "bg-teal-600 text-white"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isEmergency ? (
                  <AlertTriangle className="w-8 h-8 animate-pulse" />
                ) : (
                  <FileText className="w-8 h-8" />
                )}
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {isEmergency ? "🚨 THÊM SỰ CỐ KHẨN CẤP" : "Thêm sự cố y tế"}
                  </CardTitle>
                  <p className="text-sm opacity-90">
                    {isEmergency 
                      ? "Sự cố nghiêm trọng - Cần xử lý ngay lập tức!" 
                      : "Nhập thông tin về sự cố y tế mới"
                    }
                  </p>
                </div>
              </div>
              {isEmergency && (
                <Badge variant="destructive" className="text-lg px-4 py-2 animate-pulse">
                  ⚠️ KHẨN CẤP
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Emergency Alert */}
            {isEmergency && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-r-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <div>
                    <h4 className="font-bold text-red-800">⚠️ SỰ CỐ KHẨN CẤP</h4>
                    <p className="text-red-700 text-sm">
                      Vui lòng xử lý ngay lập tức và tuân thủ quy trình khẩn cấp!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Checklist */}
            {isEmergency && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-bold text-yellow-800 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  ✅ Checklist khẩn cấp:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Đánh giá tình trạng học sinh</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Gọi cấp cứu (nếu cần)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Liên hệ phụ huynh ngay</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Chuẩn bị chuyển viện</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Ghi chép đầy đủ</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Thông báo ban giám hiệu</span>
                  </div>
                </div>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isEmergency ? "text-red-700 font-semibold" : ""}>
                          Tiêu đề sự kiện
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nhập tiêu đề" 
                            {...field}
                            className={isEmergency ? "border-red-300 focus:border-red-500" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="student"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isEmergency ? "text-red-700 font-semibold" : ""}>
                          Học sinh
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className={isEmergency ? "border-red-300" : ""}>
                              <SelectValue placeholder="Chọn học sinh" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredStudents.length === 0 ? (
                                <div className="p-2 text-gray-500 text-sm">
                                  {selectedClass ? "Không có học sinh trong lớp này" : "Vui lòng chọn lớp trước"}
                                </div>
                              ) : (
                                filteredStudents.map((student) => (
                                  <SelectItem key={student.id} value={student.id}>
                                    {student.name} - {student.class}
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
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isEmergency ? "text-red-700 font-semibold" : ""}>
                          Lớp
                        </FormLabel>
                        <Select
                          onValueChange={(value) => handleClassChange(value)}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={isEmergency ? "border-red-300" : ""}>
                              <SelectValue placeholder="Chọn lớp" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Lớp 1A">Lớp 1A</SelectItem>
                            <SelectItem value="Lớp 1B">Lớp 1B</SelectItem>
                            <SelectItem value="Lớp 2A">Lớp 2A</SelectItem>
                            <SelectItem value="Lớp 2B">Lớp 2B</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isEmergency ? "text-red-700 font-semibold" : ""}>
                          Địa điểm
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Địa điểm xảy ra" 
                            {...field}
                            className={isEmergency ? "border-red-300 focus:border-red-500" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isEmergency ? "text-red-700 font-semibold" : ""}>
                          Mức độ ưu tiên
                        </FormLabel>
                        <Select
                          onValueChange={(value: "Cao" | "Trung bình" | "Thấp") => {
                            handlePriorityChange(value);
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={isEmergency ? "border-red-300" : ""}>
                              <SelectValue placeholder="Chọn mức độ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Cao" className="text-red-600 font-semibold">
                              🚨 Cao (Khẩn cấp)
                            </SelectItem>
                            <SelectItem value="Trung bình">⚡ Trung bình</SelectItem>
                            <SelectItem value="Thấp">📋 Thấp</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isEmergency ? "text-red-700 font-semibold" : ""}>
                          Trạng thái liên hệ phụ huynh
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={isEmergency ? "border-red-300" : ""}>
                              <SelectValue placeholder="Trạng thái liên hệ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Chưa liên hệ">Chưa liên hệ</SelectItem>
                            <SelectItem value="Đang gọi">Đang gọi</SelectItem>
                            <SelectItem value="Đã liên hệ">Đã liên hệ</SelectItem>
                            <SelectItem value="Phụ huynh đang đến">Phụ huynh đang đến</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isEmergency ? "text-red-700 font-semibold" : ""}>
                        Mô tả chi tiết
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả chi tiết về sự cố y tế"
                          className={`min-h-[100px] ${
                            isEmergency ? "border-red-300 focus:border-red-500" : ""
                          }`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Emergency Fields - Only show when priority is HIGH */}
                {isEmergency && (
                  <div className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-lg font-bold text-red-800 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Thông tin khẩn cấp
                    </h3>

                    <FormField
                      control={form.control}
                      name="immediateAction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-700 font-semibold">
                            Hành động tức thì đã thực hiện
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Mô tả hành động khẩn cấp đã thực hiện..."
                              className="min-h-[80px] border-red-300 focus:border-red-500"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-red-600">
                            Ghi chép ngay những hành động đã thực hiện để xử lý khẩn cấp
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="notifyParent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-red-700 font-semibold flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
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
                        control={form.control}
                        name="transferToHospital"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-red-700 font-semibold flex items-center">
                                <Hospital className="w-4 h-4 mr-2" />
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

                    {form.watch("transferToHospital") && (
                      <FormField
                        control={form.control}
                        name="hospitalName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-700 font-semibold">
                              Tên bệnh viện
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tên bệnh viện dự định chuyển đến"
                                className="border-red-300 focus:border-red-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="emergencyNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-700 font-semibold">
                            Ghi chú khẩn cấp
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ghi chép thêm thông tin khẩn cấp..."
                              className="min-h-[60px] border-red-300 focus:border-red-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    className="px-6"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    className={`px-6 font-bold ${
                      isEmergency 
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-lg" 
                        : "bg-teal-600 hover:bg-teal-700"
                    }`}
                  >
                    {isEmergency ? (
                      <>
                        🚨 LƯU VÀ XỬ LÝ KHẨN CẤP
                      </>
                    ) : (
                      "Lưu sự kiện"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Demo Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-bold text-blue-800 mb-2">📋 Hướng dẫn demo:</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Chọn "Mức độ ưu tiên" = "Cao" để xem giao diện khẩn cấp</li>
            <li>• Chọn "Trung bình" hoặc "Thấp" để xem giao diện bình thường</li>
            <li>• Tích "Cần chuyển bệnh viện" để hiện thêm trường bệnh viện</li>
            <li>• Điền thông tin và bấm "Lưu" để xem demo</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 