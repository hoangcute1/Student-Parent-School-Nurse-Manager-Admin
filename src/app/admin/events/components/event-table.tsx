"use client";

import React from "react";
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
import {
  AlertTriangle,
  Clock,
  Activity,
  CheckCircle,
  Eye,
  User,
  MapPin,
  Calendar,
  Edit,
} from "lucide-react";
import { TreatmentHistory } from "@/lib/type/treatment-history";

interface EventTableProps {
  events: TreatmentHistory[];
  onView: (event: TreatmentHistory) => void;
  onEdit?: (event: TreatmentHistory) => void;
  onProcess?: (event: TreatmentHistory) => void;
}

export function EventTable({
  events,
  onView,
  onEdit,
  onProcess,
}: EventTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            Chờ xử lý
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Activity className="w-3 h-3 mr-1" />
            Đang xử lý
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã giải quyết
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Cao":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Cao
          </Badge>
        );
      case "Trung bình":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Trung bình
          </Badge>
        );
      case "Thấp":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Thấp
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {priority}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string | undefined) => {
    console.log("Format date input:", dateString);

    if (!dateString) {
      console.log("No date string provided, returning N/A");
      return "N/A";
    }

    try {
      const date = new Date(dateString);

      // Kiểm tra nếu ngày không hợp lệ
      if (isNaN(date.getTime())) {
        console.log("Invalid date:", dateString);
        return new Date().toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      }

      console.log("Formatted date:", date);
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  const getStudentName = (student: any) => {
    if (typeof student === "string") return student;
    if (typeof student === "object" && student?.name) return student.name;
    return "N/A";
  };

  // Parse thông tin từ notes field hoặc fallback về description
  const parseFromNotes = (notes: string | undefined, description: string | undefined, actualStatus?: string) => {
    const defaultData = {
      title: description || "Sự cố y tế",
      location: "N/A",
      priority: "Thấp",
      contactStatus: actualStatus || "pending"
    };

    if (!notes) return defaultData;

    const titleMatch = notes.match(/Title: ([^|]+)/);
    const locationMatch = notes.match(/Location: ([^|]+)/);
    const priorityMatch = notes.match(/Priority: ([^|]+)/);
    const contactStatusMatch = notes.match(/Contact Status: ([^|]+)/);

    return {
      title: titleMatch ? titleMatch[1].trim() : (description || "Sự cố y tế"),
      location: locationMatch ? locationMatch[1].trim() : "N/A",
      priority: priorityMatch ? priorityMatch[1].trim() : "Thấp",
      contactStatus: actualStatus || (contactStatusMatch ? contactStatusMatch[1].trim() : "pending")
    };
  };

  return (
    <div className="bg-white rounded-lg border border-sky-100 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-sky-50/50 border-b border-sky-100">
              <TableHead className="text-gray-700 font-semibold">
                Tiêu đề sự cố
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Học sinh
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Địa điểm
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Mức độ ưu tiên
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Trạng thái
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Ngày tạo
              </TableHead>
              <TableHead className="text-gray-700 font-semibold text-center">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  Không có sự cố nào
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => {
                const parsedData = parseFromNotes(event.notes, event.description, event.status);
                return (
                <TableRow
                  key={event._id}
                  className="hover:bg-sky-50/30 transition-colors duration-200 border-b border-sky-50"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-sky-600" />
                      <span className="text-gray-900">{parsedData.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {getStudentName(event.student)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{parsedData.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(parsedData.priority)}</TableCell>
                  <TableCell>
                    {getStatusBadge(parsedData.contactStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {formatDate(event.date)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView({...event, ...parsedData})}
                        className="text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(event)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {onProcess && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onProcess(event)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Activity className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
