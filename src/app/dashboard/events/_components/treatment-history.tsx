"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, MapPin, User, Clock, FileText, Phone, AlertCircle, Eye, RefreshCw } from "lucide-react";
import { TreatmentHistory } from "@/lib/type/treatment-history";
import { useParentId, useIsParent } from "@/lib/utils/parent-utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTreatmentHistoryStore } from "@/stores/treatment-history-store";
import { useTreatmentHistorySync } from "@/hooks/use-treatment-history-sync";
import { TreatmentHistoryUpdateNotifier } from "@/components/treatment-history-update-notifier";

export default function TreatmentHistoryComponent() {
  const [selectedEvent, setSelectedEvent] = useState<TreatmentHistory | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Sử dụng utility functions
  const { parentId, loading: parentIdLoading } = useParentId();
  const isParent = useIsParent();

  // Sử dụng store
  const { 
    treatmentHistories, 
    isLoading, 
    error, 
    lastUpdated,
    fetchTreatmentHistoryByParentId, 
    clearError 
  } = useTreatmentHistoryStore();

  // Sử dụng sync hook
  const { manualRefresh } = useTreatmentHistorySync();

  // Hàm fetch data
  const fetchData = useCallback(async () => {
    console.log("=== TREATMENT HISTORY DEBUG ===");
    console.log("isParent:", isParent);
    console.log("parentId:", parentId);
    console.log("parentIdLoading:", parentIdLoading);

    // Đợi parent ID loading xong
    if (parentIdLoading) {
      return;
    }

    // Kiểm tra nếu không phải parent
    if (!isParent) {
      clearError();
      return;
    }

    // Kiểm tra nếu không có parent ID
    if (!parentId) {
      clearError();
      return;
    }

    try {
      console.log("Fetching treatment history for parent ID:", parentId);
      await fetchTreatmentHistoryByParentId(parentId);
      console.log("Treatment history data received:", treatmentHistories);
    } catch (error) {
      console.error("Error fetching treatment history:", error);
    }
  }, [parentId, isParent, parentIdLoading, fetchTreatmentHistoryByParentId, clearError, treatmentHistories]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Manual refresh function
  const handleManualRefresh = useCallback(async () => {
    console.log("🔄 Manual refresh triggered");
    await manualRefresh();
  }, [manualRefresh]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Cao":
        return "bg-red-100 text-red-800 border-red-200";
      case "Trung bình":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Thấp":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-orange-100 text-orange-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "resolved":
        return "Đã xử lý";
      case "processing":
        return "Đang xử lý";
      case "pending":
        return "Chờ xử lý";
      default:
        return "Mới";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Ngày không hợp lệ";

      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Lỗi định dạng ngày";
    }
  };

  const handleViewDetails = (event: TreatmentHistory) => {
    setSelectedEvent(event);
    setDetailsOpen(true);
  };

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch sử bệnh án...</p>
        </div>
      </div>
    );
  }

  if (treatmentHistories.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử bệnh án</h3>
          <p className="text-gray-600">Hiện tại chưa có sự cố y tế nào được ghi nhận cho con em bạn.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Update notification */}
      <TreatmentHistoryUpdateNotifier onRefresh={handleManualRefresh} />
      
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Lịch sử sự cố y tế</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Cập nhật lần cuối: {new Date(lastUpdated).toLocaleString('vi-VN')}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      <div className="space-y-4">
        {treatmentHistories.map((event) => (
          <Card key={event._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <Badge className={getPriorityColor(event.priority || "Thấp")}>
                      {event.priority || "Thấp"}
                    </Badge>
                    <Badge className={getStatusColor(event.status)}>
                      {getStatusText(event.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <span>
                        {typeof event.student === 'object'
                          ? `${event.student.name} (${event.student.studentId})`
                          : event.student
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {(() => {
                          const dateValue = event.date || event.createdAt || "";
                          console.log("🔍 Date debug for event:", event._id);
                          console.log("- event.date:", event.date);
                          console.log("- event.createdAt:", event.createdAt);
                          console.log("- dateValue:", dateValue);
                          console.log("- formatted:", formatDate(dateValue));
                          return formatDate(dateValue);
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{event.contactStatus}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(event)}
                  className="ml-4"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Chi tiết
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-800">Chi tiết sự cố y tế</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về sự cố y tế của con em bạn
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Tiêu đề</label>
                  <p className="text-gray-900">{selectedEvent.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Học sinh</label>
                  <p className="text-gray-900">
                    {typeof selectedEvent.student === 'object' 
                      ? `${selectedEvent.student.name} (${selectedEvent.student.studentId})`
                      : selectedEvent.student
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Lớp</label>
                  <p className="text-gray-900">{selectedEvent.class}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Địa điểm</label>
                  <p className="text-gray-900">{selectedEvent.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Mức độ ưu tiên</label>
                  <Badge className={getPriorityColor(selectedEvent.priority || "Thấp")}>
                    {selectedEvent.priority || "Thấp"}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Trạng thái xử lý</label>
                  <Badge className={getStatusColor(selectedEvent.status)}>
                    {getStatusText(selectedEvent.status)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Trạng thái liên hệ</label>
                  <p className="text-gray-900">{selectedEvent.contactStatus}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Thời gian</label>
                  <p className="text-gray-900">
                    {selectedEvent.date ? new Date(selectedEvent.date).toLocaleString('vi-VN') : (selectedEvent.createdAt ? new Date(selectedEvent.createdAt).toLocaleString('vi-VN') : 'N/A')}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Mô tả chi tiết</label>
                <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">{selectedEvent.description}</p>
              </div>

              {selectedEvent.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Ghi chú xử lý</label>
                  <p className="text-gray-900 mt-1 p-3 bg-blue-50 rounded-md whitespace-pre-line">
                    {selectedEvent.notes.includes('|')
                      ? selectedEvent.notes.split('|').map((line, idx) => <div key={idx}>{line.trim()}</div>)
                      : selectedEvent.notes}
                  </p>
                </div>
              )}

              {selectedEvent.actionTaken && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Hành động đã thực hiện</label>
                  <p className="text-gray-900 mt-1 p-3 bg-green-50 rounded-md">{selectedEvent.actionTaken}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
