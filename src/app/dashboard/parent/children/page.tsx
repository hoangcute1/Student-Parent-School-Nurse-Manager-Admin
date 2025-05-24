"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getParentChildren } from "@/lib/api";
import { Child as ChildType } from "@/lib/models";
import { useAuth } from "@/lib/auth";

export default function ParentChildrenPage() {
  const { user } = useAuth();
  const [children, setChildren] = useState<ChildType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildren = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const result = await getParentChildren(user.id);
        setChildren(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching children:", error);
        setError("Không thể tải danh sách học sinh. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchChildren();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center p-8">Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Danh sách con của bạn</h1>
          <p className="text-gray-500">
            Quản lý thông tin con của bạn trong hệ thống
          </p>
        </div>
        <Link href="/dashboard/parent/children/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm học sinh
          </Button>
        </Link>
      </div>

      {children.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <Link
              key={child.id}
              href={`/dashboard/parent/children/${child.id}`}
            >
              <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{child.name}</CardTitle>
                  </div>
                  <CardDescription>
                    {calculateAge(child.dob)} tuổi - Lớp {child.class}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Giới tính:
                      </span>
                      <span className="text-sm">
                        {child.gender === "male" ? "Nam" : "Nữ"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Ngày sinh:
                      </span>
                      <span className="text-sm">
                        {new Date(child.dob).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Khối:
                      </span>
                      <span className="text-sm">{child.grade}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Xem chi tiết
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h3 className="mt-4 text-lg font-medium">Chưa có học sinh</h3>
              <p className="mt-2 text-sm text-gray-500">
                Bạn chưa thêm thông tin học sinh nào vào hệ thống
              </p>
              <Link href="/dashboard/parent/children/add">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm học sinh
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper function to calculate age from DOB
function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}
