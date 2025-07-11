"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Eye, 
  Search, 
  Filter, 
  ClipboardCheck, 
  Clock, 
  Activity, 
  CheckCircle,
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  Shield
} from "lucide-react";
import { getAllTreatmentHistories } from "@/lib/api/treatment-history";
import { TreatmentHistory } from "@/lib/type/treatment-history";

export default function ViewEventsPage() {
  const [events, setEvents] = useState<TreatmentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<TreatmentHistory | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllTreatmentHistories();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getStatusBadge = (status?: string) => {
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
            Mới
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

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof event.student === "string" 
      ? event.student.toLowerCase().includes(searchTerm.toLowerCase())
      : event.student?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleViewDetails = (event: TreatmentHistory) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ClipboardCheck className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Xem sự cố y tế</h1>
            <p className="text-gray-600">Tất cả sự cố y tế từ staff - Chỉ xem</p>
          </div>
        </div>
        <Badge variant="outline" className="text-purple-600 border-purple-200">
          <Eye className="w-3 h-3 mr-1" />
          Read Only
        </Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề hoặc tên học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" disabled>
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{events.length}</p>
                <p className="text-sm text-gray-600">Tổng sự cố</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.status === "pending").length}
                </p>
                <p className="text-sm text-gray-600">Chờ xử lý</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.status === "processing").length}
                </p>
                <p className="text-sm text-gray-600">Đang xử lý</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.status === "resolved").length}
                </p>
                <p className="text-sm text-gray-600">Đã giải quyết</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sự cố y tế</CardTitle>
          <CardDescription>
            Hiển thị {filteredEvents.length} / {events.length} sự cố
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      {getPriorityBadge(event.priority)}
                      {getStatusBadge(event.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>
                          {typeof event.student === "string"
                            ? event.student
                            : event.student?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {event.createdAt
                            ? new Date(event.createdAt).toLocaleDateString("vi-VN")
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(event)}
                    className="ml-4"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            ))}

            {filteredEvents.length === 0 && (
              <div className="text-center py-8">
                <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Không tìm thấy sự cố nào</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Details Modal */}
      {showDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Chi tiết sự cố y tế</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                {getPriorityBadge(selectedEvent.priority)}
                {getStatusBadge(selectedEvent.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Học sinh</label>
                  <p className="text-gray-900">
                    {typeof selectedEvent.student === "string"
                      ? selectedEvent.student
                      : selectedEvent.student?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Địa điểm</label>
                  <p className="text-gray-900">{selectedEvent.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Người báo cáo</label>
                  <p className="text-gray-900">{selectedEvent.reporter || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Ngày tạo</label>
                  <p className="text-gray-900">
                    {selectedEvent.createdAt
                      ? new Date(selectedEvent.createdAt).toLocaleString("vi-VN")
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Mô tả</label>
                <p className="text-gray-900 mt-1">{selectedEvent.description}</p>
              </div>

              {selectedEvent.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Ghi chú xử lý</label>
                  <p className="text-gray-900 mt-1">{selectedEvent.notes}</p>
                </div>
              )}

              {selectedEvent.actionTaken && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Hành động đã thực hiện</label>
                  <p className="text-gray-900 mt-1">{selectedEvent.actionTaken}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowDetails(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
