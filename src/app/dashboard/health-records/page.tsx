"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash,
  ChevronUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { getStudents } from "@/lib/api";
import type { Student } from "@/lib/types";

export default function HealthRecordsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "allergies" | "chronic" | "vaccinations"
  >("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, [page, pageSize, searchQuery, activeFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudents(page, pageSize);
      setStudents(response.data); // Changed from response.students to response.data
      setTotalStudents(response.total);
    } catch (err) {
      let errorMessage = "Không thể tải dữ liệu sinh viên.";
      if (err instanceof Error) {
        if (err.message.includes("401")) {
          errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
        } else if (err.message.includes("403")) {
          errorMessage = "Bạn không có quyền truy cập dữ liệu này.";
        } else if (err.message.includes("404")) {
          errorMessage = "Không tìm thấy dữ liệu sinh viên.";
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalStudents / pageSize);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (
    value: "all" | "allergies" | "chronic" | "vaccinations"
  ) => {
    setActiveFilter(value);
    setPage(1); // Reset to first page when changing filters
  };

  const handleDelete = async (studentId: string) => {
    // TODO: Implement delete functionality
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ này?")) {
      console.log("Delete student:", studentId);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchStudents} variant="outline" className="mt-4">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hồ sơ sức khỏe</h1>
          <p className="text-gray-500">
            Quản lý thông tin sức khỏe của học sinh
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/health-records/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm hồ sơ mới
            </Button>
          </Link>
        </div>
      </div>
      <Tabs
        value={activeFilter}
        onValueChange={(v: any) => handleFilterChange(v)}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="allergies">Dị ứng</TabsTrigger>
            <TabsTrigger value="chronic">Bệnh mãn tính</TabsTrigger>
            <TabsTrigger value="vaccinations">Tiêm chủng</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Tìm kiếm..."
                className="w-full rounded-lg pl-8 md:w-[300px]"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Lọc</span>
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Xuất</span>
            </Button>
          </div>
        </div>
        <TabsContent value={activeFilter} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách hồ sơ sức khỏe</CardTitle>
              <CardDescription>
                Hiển thị {students.length} / {totalStudents} hồ sơ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead >Dị ứng</TableHead>
                    <TableHead>Bệnh mãn tính</TableHead>
                    <TableHead>Thị lực</TableHead>
                    <TableHead>Cập nhật lần cuối</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.allergies || "Không"}</TableCell>
                      <TableCell>
                        {student.chronicDiseases || "Không"}
                      </TableCell>
                      <TableCell>{student.vision || "Chưa cập nhật"}</TableCell>
                      <TableCell>
                        {new Date(student.updatedAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu onOpenChange={(open) => setOpenMenuId(open ? student._id : null)}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <span>Chi tiết</span>
                              {openMenuId === student._id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/health-records/${student._id}/edit`} className="flex items-center">
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Chỉnh sửa</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(student._id)}
                              className="text-red-600 focus:text-red-600 cursor-pointer"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Xóa</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {students.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">Số mục mỗi trang</p>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(v) => setPageSize(Number(v))}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue>{pageSize}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500">Trang</span>
                    <span className="font-medium">{page}</span>
                    <span className="text-sm text-gray-500">
                      / {totalPages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="allergies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách học sinh có dị ứng</CardTitle>
              <CardDescription>
                Thông tin về các loại dị ứng của học sinh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Loại dị ứng</TableHead>
                    <TableHead>Mức độ</TableHead>
                    <TableHead>Biểu hiện</TableHead>
                    <TableHead>Xử lý khi phát sinh</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "Nguyễn Văn An",
                      class: "1A",
                      type: "Hải sản",
                      severity: "Trung bình",
                      symptoms: "Nổi mề đay, ngứa",
                      treatment: "Uống thuốc kháng histamine",
                    },
                    {
                      name: "Lê Hoàng Cường",
                      class: "3C",
                      type: "Phấn hoa",
                      severity: "Nhẹ",
                      symptoms: "Hắt hơi, chảy nước mũi",
                      treatment: "Uống thuốc kháng histamine",
                    },
                    {
                      name: "Hoàng Thị Lan",
                      class: "5B",
                      type: "Đậu phộng",
                      severity: "Nặng",
                      symptoms: "Khó thở, sưng mặt",
                      treatment: "Tiêm EpiPen, đưa đến bệnh viện ngay",
                    },
                  ].map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {record.name}
                      </TableCell>
                      <TableCell>{record.class}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.severity}</TableCell>
                      <TableCell>{record.symptoms}</TableCell>
                      <TableCell>{record.treatment}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Chi tiết
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chronic" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách học sinh có bệnh mãn tính</CardTitle>
              <CardDescription>
                Thông tin về các bệnh mãn tính của học sinh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Bệnh mãn tính</TableHead>
                    <TableHead>Thuốc điều trị</TableHead>
                    <TableHead>Lưu ý đặc biệt</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "Trần Thị Bình",
                      class: "2B",
                      condition: "Hen suyễn",
                      medication: "Ventolin (khi cần)",
                      notes: "Tránh hoạt động thể chất quá sức",
                    },
                    {
                      name: "Hoàng Thị Lan",
                      class: "5B",
                      condition: "Tiểu đường type 1",
                      medication: "Insulin",
                      notes: "Theo dõi đường huyết, có thể cần tiêm insulin",
                    },
                  ].map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {record.name}
                      </TableCell>
                      <TableCell>{record.class}</TableCell>
                      <TableCell>{record.condition}</TableCell>
                      <TableCell>{record.medication}</TableCell>
                      <TableCell>{record.notes}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Chi tiết
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vaccinations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử tiêm chủng</CardTitle>
              <CardDescription>
                Thông tin về các mũi tiêm chủng của học sinh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Loại vắc-xin</TableHead>
                    <TableHead>Ngày tiêm</TableHead>
                    <TableHead>Nơi tiêm</TableHead>
                    <TableHead>Phản ứng sau tiêm</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "Nguyễn Văn An",
                      class: "1A",
                      vaccine: "Sởi-Quai bị-Rubella",
                      date: "15/01/2025",
                      location: "Trung tâm Y tế Quận 1",
                      reaction: "Không",
                    },
                    {
                      name: "Trần Thị Bình",
                      class: "2B",
                      vaccine: "Viêm não Nhật Bản",
                      date: "20/02/2025",
                      location: "Bệnh viện Nhi Đồng",
                      reaction: "Sốt nhẹ",
                    },
                    {
                      name: "Lê Hoàng Cường",
                      class: "3C",
                      vaccine: "Cúm mùa",
                      date: "10/03/2025",
                      location: "Trường học",
                      reaction: "Không",
                    },
                  ].map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {record.name}
                      </TableCell>
                      <TableCell>{record.class}</TableCell>
                      <TableCell>{record.vaccine}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.location}</TableCell>
                      <TableCell>{record.reaction}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Chi tiết
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
