"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Users,
  AlertTriangle,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { getStudents } from "@/lib/api"; // Import API utility function

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  DialogTrigger,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Student {
  name: string;
  studentId: string;
  class: string;
  birthDate: string;
  parent: string;
  healthStatus: string;
  allergies: string | null;
  lastUpdate: string;
}

interface StatsData {
  total: number;
  healthy: number;
  monitoring: number;
  urgent: number;
}

interface NewStudentFormData {
  name: string;
  studentId: string;
  birthDate: string;
  gender: "male" | "female";
  class: string;
  allergies?: string;
  chronicDiseases?: string;
  vision?: string;
}

const studentFormSchema = z.object({
  name: z.string().min(1, { message: "Họ và tên không được để trống" }),
  studentId: z.string().min(1, { message: "Mã học sinh không được để trống" }),
  birthDate: z.string().min(1, { message: "Ngày sinh không được để trống" }),
  gender: z.enum(["male", "female"], {
    required_error: "Vui lòng chọn giới tính",
  }),
  class: z.string().min(1, { message: "Vui lòng chọn lớp" }),
  parentId: z.string().optional(),
  allergies: z.string().optional(),
  chronicDiseases: z.string().optional(),
  vision: z
    .enum(["normal", "myopia", "hyperopia", "astigmatism", "other"])
    .optional(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

export default function StudentsPage() {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    healthy: 0,
    monitoring: 0,
    urgent: 0,
  });
  const [open, setOpen] = useState(false);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      studentId: "",
      birthDate: "",
      gender: "male",
      class: "",
      parentId: "",
      allergies: "",
      chronicDiseases: "",
      vision: "normal",
    },
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);

        // Using the API utility function that handles authentication
        const response = await getStudents();
        console.log("API response:", response);

        // Map API response to the local Student interface format
        const students = response.data.map((student: any) => ({
          name: student.name,
          studentId: student.studentId,
          class: student.class || "N/A",
          birthDate: student.birth || "N/A",
          parent: "Parent Information", // Add default or get from API if available
          healthStatus: student.healthStatus || "Sức khỏe tốt", // Default value
          allergies: student.allergies,
          lastUpdate: new Date(student.updatedAt).toLocaleDateString("vi-VN"),
        }));

        console.log("Transformed student data:", students);
        setStudentData(students);

        // Calculate statistics
        const total = students.length;
        const healthy = students.filter(
          (student: Student) => student.healthStatus === "Sức khỏe tốt"
        ).length;
        const monitoring = students.filter(
          (student: Student) => student.healthStatus === "Cần theo dõi"
        ).length;
        const urgent = students.filter(
          (student: Student) => student.healthStatus === "Khẩn cấp"
        ).length;

        setStats({
          total,
          healthy,
          monitoring,
          urgent,
        });
      } catch (err: any) {
        console.error("Failed to fetch students:", err);
        setError(err.message);

        // Handle authentication errors specifically
        if (
          err.message.includes("401") ||
          err.message.toLowerCase().includes("unauthorized")
        ) {
          console.log("Authentication error detected, redirecting to login...");
          // Optional: Redirect to login page
          // window.location.href = "/login";
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const onSubmit = async (data: StudentFormValues) => {
    try {
      // TODO: Implement API call to create student
      console.log("Form submitted:", data);
      setOpen(false);
      form.reset();
      // After successful submission, refresh student list
      // await fetchStudents();
    } catch (err) {
      console.error("Failed to create student:", err);
      // Show error to user
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-800">
          Quản lý học sinh
        </h1>
        <p className="text-blue-600">
          Danh sách tất cả học sinh và thông tin sức khỏe của các em
        </p>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-800">
                  {stats.total}
                </div>
                <div className="text-sm text-blue-600">Tổng học sinh</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-800">
                  {stats.healthy}
                </div>
                <div className="text-sm text-green-600">Sức khỏe tốt</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-800">
                  {stats.monitoring}
                </div>
                <div className="text-sm text-yellow-600">Cần theo dõi</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-800">
                  {stats.urgent}
                </div>
                <div className="text-sm text-red-600">Khẩn cấp</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-800">Danh sách học sinh</CardTitle>
          <CardDescription className="text-blue-600">
            Quản lý thông tin và sức khỏe của tất cả học sinh trong trường
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
              <Input
                type="search"
                placeholder="Tìm kiếm theo tên, mã học sinh..."
                className="pl-8 border-blue-200 focus:border-blue-500"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px] border-blue-200">
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                <SelectItem value="1A">Lớp 1A</SelectItem>
                <SelectItem value="1B">Lớp 1B</SelectItem>
                <SelectItem value="2A">Lớp 2A</SelectItem>
                <SelectItem value="2B">Lớp 2B</SelectItem>
                <SelectItem value="3A">Lớp 3A</SelectItem>
                <SelectItem value="3B">Lớp 3B</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] border-blue-200">
                <SelectValue placeholder="Tình trạng sức khỏe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="good">Sức khỏe tốt</SelectItem>
                <SelectItem value="monitor">Cần theo dõi</SelectItem>
                <SelectItem value="urgent">Khẩn cấp</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Thêm học sinh
                  <Plus className="ml-2 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Thêm học sinh mới</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin của học sinh cần thêm vào hệ thống.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Họ và tên</FormLabel>
                              <FormControl>
                                <Input placeholder="Nguyễn Văn A" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="studentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mã học sinh</FormLabel>
                              <FormControl>
                                <Input placeholder="HS12345" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="birthDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày sinh</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Giới tính</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex gap-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male">Nam</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="female"
                                      id="female"
                                    />
                                    <Label htmlFor="female">Nữ</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
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
                                  <SelectItem value="1A">Lớp 1A</SelectItem>
                                  <SelectItem value="1B">Lớp 1B</SelectItem>
                                  <SelectItem value="2A">Lớp 2A</SelectItem>
                                  <SelectItem value="2B">Lớp 2B</SelectItem>
                                  <SelectItem value="3A">Lớp 3A</SelectItem>
                                  <SelectItem value="3B">Lớp 3B</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="parentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID phụ huynh</FormLabel>
                              <FormControl>
                                <Input placeholder="PH12345" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="allergies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dị ứng</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập các loại dị ứng (nếu có)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="chronicDiseases"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bệnh mãn tính</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập các bệnh mãn tính (nếu có)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vision"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thị lực</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn tình trạng" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="normal">
                                  Bình thường
                                </SelectItem>
                                <SelectItem value="myopia">Cận thị</SelectItem>
                                <SelectItem value="hyperopia">
                                  Viễn thị
                                </SelectItem>
                                <SelectItem value="astigmatism">
                                  Loạn thị
                                </SelectItem>
                                <SelectItem value="other">Khác</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setOpen(false)}
                      >
                        Hủy
                      </Button>
                      <Button type="submit">Thêm học sinh</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>{" "}
          <div className="rounded-md border border-blue-200">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="text-blue-800">Học sinh</TableHead>
                  <TableHead className="text-blue-800">Lớp</TableHead>
                  <TableHead className="text-blue-800">Ngày sinh</TableHead>
                  <TableHead className="text-blue-800">Phụ huynh</TableHead>
                  <TableHead className="text-blue-800">
                    Tình trạng sức khỏe
                  </TableHead>
                  <TableHead className="text-blue-800">Dị ứng</TableHead>
                  <TableHead className="text-blue-800">Cập nhật cuối</TableHead>
                  <TableHead className="text-right text-blue-800">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-10 text-blue-600"
                    >
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-10 text-red-500"
                    >
                      Lỗi: {error}
                    </TableCell>
                  </TableRow>
                ) : studentData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-10 text-blue-600"
                    >
                      Không có dữ liệu học sinh
                    </TableCell>
                  </TableRow>
                ) : (
                  studentData.map((student, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-blue-50 cursor-pointer"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-blue-200">
                            <AvatarImage
                              src={`/placeholder.svg?height=32&width=32&text=${student.name.charAt(
                                0
                              )}`}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-blue-800">
                              {student.name}
                            </div>
                            <div className="text-sm text-blue-600">
                              {student.studentId}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-blue-700">
                        {student.class}
                      </TableCell>
                      <TableCell className="text-blue-700">
                        {student.birthDate}
                      </TableCell>
                      <TableCell className="text-blue-700">
                        {student.parent}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getHealthStatusVariant(student.healthStatus)}
                          className={getHealthStatusColor(student.healthStatus)}
                        >
                          {student.healthStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-blue-700">
                        {student.allergies || "Không"}
                      </TableCell>
                      <TableCell className="text-blue-700">
                        {student.lastUpdate}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-700 hover:bg-blue-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-blue-700">
                              <Eye className="mr-2 h-4 w-4" />
                              Xem hồ sơ
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-blue-700">
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-blue-700">
                              <Plus className="mr-2 h-4 w-4" />
                              Thêm sự kiện y tế
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getHealthStatusVariant(status: string) {
  switch (status) {
    case "Sức khỏe tốt":
      return "default";
    case "Cần theo dõi":
      return "secondary";
    case "Khẩn cấp":
      return "destructive";
    default:
      return "outline";
  }
}

function getHealthStatusColor(status: string) {
  switch (status) {
    case "Sức khỏe tốt":
      return "bg-green-100 text-green-800";
    case "Cần theo dõi":
      return "bg-yellow-100 text-yellow-800";
    case "Khẩn cấp":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
