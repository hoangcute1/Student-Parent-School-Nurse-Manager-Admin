import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, MessageSquare, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { parentNav, studentNav } from "../_constants/sidebar";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useParentStudentsStore } from "@/stores/parent-students-store";
import { ParentStudents } from "@/lib/type/parent-students";
import { useAuthStore } from "@/stores/auth-store";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { studentsData, fetchStudentsByParent, isLoading } =
    useParentStudentsStore();
  const { isAuthenticated, user } = useAuthStore();

  const [showStudentSection, setShowStudentSection] = useState(true);
  const [showStudentList, setShowStudentList] = useState(false);
  const [showParentSection, setShowParentSection] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<ParentStudents | null>(
    studentsData[0] || null
  );
  const pathname = usePathname();

  useEffect(() => {
    // Chỉ gọi fetchStudentsByParent khi user đã authenticated và có role parent
    if (isAuthenticated && user && user.role === "parent") {
      fetchStudentsByParent();
    }
  }, [fetchStudentsByParent, isAuthenticated, user]);
  useEffect(() => {
    if (studentsData.length > 0) {
      setSelectedStudent(studentsData[0]);
    } else {
      setSelectedStudent(null);
    }
  }, [studentsData]);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 transform border-r bg-blue-50",
        "grid grid-rows-[auto_minmax(0,1fr)_auto]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Header section */}
      <div className="p-4 border-b border-blue-200">
        <div className="flex items-center gap-3 group">
          <div className="relative p-2 rounded-xl bg-gradient-to-br from-red-400 to-red-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Heart className="h-7 w-7 text-white transition-all duration-300 group-hover:scale-110" />
          </div>
          <Link href="/" className="flex-1">
            <div className="font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 bg-clip-text text-transparent text-lg">
              Y Tế Học Đường{" "}
            </div>
            <div className="text-xs text-blue-500 font-medium opacity-80">
              Dành cho phụ huynh
            </div>
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-700 text-xs mt-1"
            >
              Phụ huynh
            </Badge>
          </Link>
        </div>
      </div>

      {/* Main navigation section */}
      <div className="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:rounded-lg [&::-webkit-scrollbar-thumb]:bg-blue-200 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-blue-50 hover:[&::-webkit-scrollbar-thumb]:bg-blue-300 [&::-webkit-scrollbar-thumb]:transition-colors [&::-webkit-scrollbar]:hover:w-2">
        <div className="p-4 space-y-4">
          {/* Parent navigation */}
          <div className="space-y-4">
            <button
              onClick={() => setShowParentSection(!showParentSection)}
              className="flex items-center justify-between w-full text-blue-400 hover:text-blue-600 transition-all duration-300"
            >
              <span className="text-sm">Chung</span>
              <div
                className={cn(
                  "transform transition-transform duration-300",
                  showParentSection ? "rotate-180" : "rotate-0"
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </div>
            </button>

            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                showParentSection
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <nav className="grid gap-1">
                  {parentNav.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-4 rounded-lg px-4 py-3 text-blue-700 transition-all hover:text-blue-900 hover:bg-blue-100 group border border-transparent hover:border-blue-200",
                          isActive && "bg-blue-100"
                        )}
                      >
                        <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-blue-600 mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Student section */}
          <div className="space-y-4">
            <button
              onClick={() => setShowStudentSection(!showStudentSection)}
              className="flex items-center justify-between w-full text-blue-400 hover:text-blue-600 transition-all duration-300"
            >
              <span className="text-sm">Học sinh</span>
              <div
                className={cn(
                  "transform transition-transform duration-300",
                  showStudentSection ? "rotate-180" : "rotate-0"
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </div>
            </button>

            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                showStudentSection
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="space-y-1">
                  {/* Student info card */}
                  <div className="bg-white rounded-lg border border-blue-200 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        {studentsData.length > 1 ? (
                          <button
                            onClick={() => setShowStudentList(!showStudentList)}
                            className="flex items-center gap-2 group transition-all duration-300 hover:text-blue-600 w-full"
                          >
                            <div className="flex-1 text-left">
                              <div className="text-md text-blue-800">
                                {selectedStudent?.student.name || "N/A"}
                              </div>
                              <div className="text-xs text-blue-600">
                                Lớp{" "}
                                {selectedStudent?.student.class.name || "N/A"}
                              </div>
                            </div>
                            <ChevronDown
                              className={cn(
                                "h-4 w-3 transition-transform duration-300",
                                showStudentList ? "rotate-180" : "rotate-0"
                              )}
                            />
                          </button>
                        ) : (
                          <div className="text-left">
                            <div className="font-medium text-blue-800">
                              {selectedStudent?.student.name || "N/A"}
                            </div>
                            <div className="text-xs text-blue-600">
                              Lớp{" "}
                              {(selectedStudent?.student.class?.name as any) ||
                                "N/A"}{" "}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Student list */}
                  {studentsData.length > 1 && (
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        showStudentList
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="space-y-2 p-2 bg-white rounded-lg border border-blue-200">
                          {studentsData.map(
                            (studentData) =>
                              selectedStudent &&
                              studentData.student._id !==
                                selectedStudent.student._id && (
                                <button
                                  key={studentData.student._id}
                                  onClick={() => {
                                    setSelectedStudent(studentData);
                                    setShowStudentList(false);
                                  }}
                                  className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-blue-50 transition-colors"
                                >
                                  <div className="flex flex-col text-left">
                                    <span className="font-medium text-md text-blue-800">
                                      {studentData.student.name}
                                    </span>
                                    <span className="text-xs text-blue-600">
                                      Lớp{" "}
                                      {studentData.student.class?.name || "N/A"}{" "}
                                    </span>
                                  </div>
                                </button>
                              )
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Student navigation - always visible */}
                  <nav className="grid gap-1">
                    {studentNav.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-4 rounded-lg px-4 py-3 text-blue-700 transition-all hover:text-blue-900 hover:bg-blue-100 group border border-transparent hover:border-blue-200",
                            isActive && "bg-blue-100"
                          )}
                        >
                          <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          <div className="flex-1">
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-blue-600 mt-0.5">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer section */}
      <div className="sticky bottom-0 border-t border-blue-200 p-4 bg-blue-50">
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-medium text-blue-800">Hỗ trợ</h3>
            </div>
            <p className="text-xs text-blue-600">
              Cần hỗ trợ? Liên hệ với nhân viên y tế qua tin nhắn hoặc gọi số
              hotline.
            </p>
            <Link href="/dashboard/feedback">
              <Button
                size="sm"
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
              >
                Liên hệ hỗ trợ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
