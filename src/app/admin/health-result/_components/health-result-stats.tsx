"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  Calendar,
  CheckCircle,
  Stethoscope,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { fetchData } from "@/lib/api/api";

interface HealthExaminationEvent {
  _id: string;
  title: string;
  examination_date: string;
  grade_levels: number[];
  total_students: number;
  completed_count: number;
}

export default function HealthResultStats() {
  const [events, setEvents] = useState<HealthExaminationEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetchData<any>("/health-examinations/events");
      setEvents(response);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  const getGradeLevelsDisplay = (gradeLevels: number[]) => {
    if (gradeLevels.length === 0) return "Cá nhân";
    if (gradeLevels.length === 1) return `Khối ${gradeLevels[0]}`;
    return `Khối ${gradeLevels.sort().join(", ")}`;
  };

  const getCompletionRate = (completed: number, total: number) => {
    if (total === 0) return 0;
    return (completed / total) * 100;
  };

  const getStatusBadge = (rate: number) => {
    if (rate >= 80) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          {Math.round(rate)}%
        </Badge>
      );
    } else if (rate >= 60) {
      return (
        <Badge className="bg-blue-100 text-blue-800">{Math.round(rate)}%</Badge>
      );
    } else if (rate >= 40) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          {Math.round(rate)}%
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800">{Math.round(rate)}%</Badge>
      );
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Không có dữ liệu thống kê</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng sự kiện
                </p>
                <p className="text-3xl font-bold text-blue-700">
                  {events.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng học sinh
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {events.reduce((sum, event) => sum + event.total_students, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tỷ lệ hoàn thành TB
                </p>
                <p className="text-3xl font-bold text-purple-700">
                  {(() => {
                    const totalStudents = events.reduce(
                      (sum, event) => sum + event.total_students,
                      0
                    );
                    const totalCompleted = events.reduce(
                      (sum, event) => sum + event.completed_count,
                      0
                    );
                    return totalStudents > 0
                      ? Math.round((totalCompleted / totalStudents) * 100)
                      : 0;
                  })()}
                  %
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Stethoscope className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
