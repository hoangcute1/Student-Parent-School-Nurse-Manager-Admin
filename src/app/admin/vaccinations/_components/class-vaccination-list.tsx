"use client";

import { useState, useMemo } from "react";
import { Bell, Download, Search, ArrowUpDown, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ClassStudent {
  id: string;
  name: string;
  birthDate: string;
  vaccinationStatus: "Đã tiêm" | "Chưa tiêm" | "Chống chỉ định";
  vaccinationDate: string | "";
  reaction: string | "";
  followUp: string | "";
  hasIssue: boolean;
}

interface ClassVaccinationListProps {
  className: string;
  completed: number;
  total: number;
  onRecordClick: (student: ClassStudent) => void;
  onNotifyClick: (student: ClassStudent) => void;
}

const demoStudentsByClass: Record<string, ClassStudent[]> = {
  "Lớp 1A": [
    {
      id: "1A-1",
      name: "Nguyễn Văn An",
      birthDate: "15/05/2018",
      vaccinationStatus: "Đã tiêm",
      vaccinationDate: "15/06/2025",
      reaction: "Không",
      followUp: "",
      hasIssue: false,
    },
    {
      id: "1A-2",
      name: "Trần Thị Bình",
      birthDate: "22/03/2018",
      vaccinationStatus: "Đã tiêm",
      vaccinationDate: "15/06/2025",
      reaction: "Sưng nhẹ",
      followUp: "Theo dõi 24h",
      hasIssue: true,
    },
    {
      id: "1A-3",
      name: "Lê Hoàng Cường",
      birthDate: "10/08/2018",
      vaccinationStatus: "Chống chỉ định",
      vaccinationDate: "",
      reaction: "",
      followUp: "",
      hasIssue: true,
    },
  ],
  "Lớp 1B": [
    {
      id: "1B-1",
      name: "Phạm Minh Dương",
      birthDate: "05/11/2018",
      vaccinationStatus: "Chưa tiêm",
      vaccinationDate: "",
      reaction: "",
      followUp: "",
      hasIssue: false,
    },
    {
      id: "1B-2",
      name: "Hoàng Thị Em",
      birthDate: "30/07/2018",
      vaccinationStatus: "Đã tiêm",
      vaccinationDate: "15/06/2025",
      reaction: "Sốt nhẹ",
      followUp: "Theo dõi 48h",
      hasIssue: true,
    },
  ],
  "Lớp 2A": [
    {
      id: "2A-1",
      name: "Vũ Tuấn Phong",
      birthDate: "12/04/2018",
      vaccinationStatus: "Đã tiêm",
      vaccinationDate: "15/06/2025",
      reaction: "Không",
      followUp: "",
      hasIssue: false,
    },
    {
      id: "2A-2",
      name: "Đỗ Mai Linh",
      birthDate: "25/09/2018",
      vaccinationStatus: "Chưa tiêm",
      vaccinationDate: "",
      reaction: "",
      followUp: "",
      hasIssue: false,
    },
  ],
  "Lớp 2B": [
    {
      id: "2B-1",
      name: "Ngô Gia Bảo",
      birthDate: "18/02/2018",
      vaccinationStatus: "Chống chỉ định",
      vaccinationDate: "",
      reaction: "",
      followUp: "",
      hasIssue: true,
    },
  ],
  "Lớp 3A": [
    {
      id: "3A-1",
      name: "Lý Thu Thảo",
      birthDate: "08/06/2018",
      vaccinationStatus: "Đã tiêm",
      vaccinationDate: "15/06/2025",
      reaction: "Đau tại chỗ",
      followUp: "Theo dõi 24h",
      hasIssue: true,
    },
    {
      id: "3A-2",
      name: "Phan Minh Khôi",
      birthDate: "14/12/2018",
      vaccinationStatus: "Đã tiêm",
      vaccinationDate: "15/06/2025",
      reaction: "Không",
      followUp: "",
      hasIssue: false,
    },
  ],
};

export default function ClassVaccinationList({
  className,
  completed,
  total,
  onRecordClick,
  onNotifyClick,
}: ClassVaccinationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ClassStudent | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const students = demoStudentsByClass[className] || [];

  const filteredAndSortedStudents = useMemo(() => {
    let result = [...students];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.birthDate.includes(searchQuery)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(
        (student) => student.vaccinationStatus === statusFilter
      );
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === null) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === "") return 1;
        if (bValue === "") return -1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return sortConfig.direction === "asc" ? comparison : -comparison;
        }

        return 0;
      });
    }

    return result;
  }, [students, searchQuery, statusFilter, sortConfig]);

  const handleSort = (key: keyof ClassStudent) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-blue-800">
              Danh sách học sinh - {className}
            </CardTitle>
            <CardDescription className="text-blue-600">
              Ghi nhận và theo dõi kết quả tiêm chủng
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Tiến độ hoàn thành</div>
            <div className="flex items-center gap-2">
              <Progress
                value={(completed / total) * 100}
                className="w-32 h-2"
              />
              <span className="text-sm font-medium">
                {Math.round((completed / total) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm học sinh..."
                  className="pl-8 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue>
                    {statusFilter === "all"
                      ? "Tất cả trạng thái"
                      : statusFilter === "Đã tiêm"
                      ? "Đã tiêm"
                      : statusFilter === "Chưa tiêm"
                      ? "Chưa tiêm"
                      : "Chống chỉ định"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Đã tiêm">Đã tiêm</SelectItem>
                  <SelectItem value="Chưa tiêm">Chưa tiêm</SelectItem>
                  <SelectItem value="Chống chỉ định">Chống chỉ định</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {filteredAndSortedStudents.length} học sinh
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất danh sách
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-8 font-medium"
                    onClick={() => handleSort("name")}
                  >
                    Học sinh
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-8 font-medium"
                    onClick={() => handleSort("birthDate")}
                  >
                    Ngày sinh
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-8 font-medium"
                    onClick={() => handleSort("vaccinationStatus")}
                  >
                    Tình trạng tiêm
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-8 font-medium"
                    onClick={() => handleSort("vaccinationDate")}
                  >
                    Ngày tiêm
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Phản ứng</TableHead>
                <TableHead>Theo dõi</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedStudents.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.birthDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.vaccinationStatus === "Đã tiêm"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        student.vaccinationStatus === "Đã tiêm"
                          ? "bg-green-100 text-green-800"
                          : student.vaccinationStatus === "Chống chỉ định"
                          ? "bg-red-100 text-red-800"
                          : "bg-orange-100 text-orange-800"
                      }
                    >
                      {student.vaccinationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.vaccinationDate || "Chưa tiêm"}
                  </TableCell>
                  <TableCell>
                    {student.reaction ? (
                      <Badge
                        className={
                          student.reaction === "Không"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {student.reaction}
                      </Badge>
                    ) : (
                      "Chưa có"
                    )}
                  </TableCell>
                  <TableCell>
                    {student.followUp ? (
                      <Badge className="bg-blue-100 text-blue-800">
                        {student.followUp}
                      </Badge>
                    ) : (
                      "Không cần"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRecordClick(student)}
                      >
                        Ghi nhận
                      </Button>
                      {student.hasIssue && (
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => onNotifyClick(student)}
                        >
                          <Bell className="h-3 w-3 mr-1" />
                          Thông báo
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
