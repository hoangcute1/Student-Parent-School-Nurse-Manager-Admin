"use client";

import { useState, useEffect } from "react";
import { getAllRoles, Role } from "@/lib/roles";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function RolesAdminPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Get all roles from the roles utility
    setRoles(getAllRoles());
  }, []);

  // Function to get appropriate icon for each role
  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "admin":
        return <ShieldAlert className="h-6 w-6 text-destructive" />;
      case "staff":
        return <ShieldCheck className="h-6 w-6 text-primary" />;
      default:
        return <Shield className="h-6 w-6 text-muted-foreground" />;
    }
  };

  // Function to get appropriate color for each role badge
  const getRoleBadgeVariant = (
    roleName: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (roleName) {
      case "admin":
        return "destructive";
      case "staff":
        return "default";
      case "parent":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-lg bg-background p-8 shadow-lg">
          <h1 className="text-xl font-bold">Quyền truy cập hạn chế</h1>
          <p className="mt-2 text-muted-foreground">
            Bạn cần quyền quản trị viên để truy cập trang này.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Quản lý vai trò</h1>
      <p className="mb-8 text-muted-foreground">
        Hệ thống có các vai trò được xác định trước, xác định những hành động mà
        người dùng có thể thực hiện.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30 pb-2">
              <div className="flex items-center gap-2">
                {getRoleIcon(role.name)}
                <div>
                  <CardTitle className="text-lg capitalize">
                    {role.name}
                  </CardTitle>
                  <CardDescription>{role.id}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p>{role.description}</p>
            </CardContent>
            <CardFooter className="border-t bg-muted/30 p-4">
              <Badge variant={getRoleBadgeVariant(role.name)}>
                {role.name.toUpperCase()}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-lg border bg-muted/20 p-6">
        <h2 className="mb-4 text-xl font-bold">Thông tin về vai trò</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Quản trị viên (Admin)</h3>
            <p className="text-muted-foreground">
              Có toàn quyền truy cập vào tất cả các tính năng của hệ thống, bao
              gồm quản lý người dùng, cấu hình hệ thống và quản lý dữ liệu.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Nhân viên y tế (Staff)</h3>
            <p className="text-muted-foreground">
              Có thể quản lý hồ sơ sức khỏe, lịch tiêm chủng và sự kiện y tế.
              Nhân viên có thể xem và cập nhật thông tin học sinh.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Phụ huynh (Parent)</h3>
            <p className="text-muted-foreground">
              Có thể xem thông tin sức khỏe của con mình, lịch tiêm chủng và các
              sự kiện y tế của trường.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
