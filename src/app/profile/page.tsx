"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Shield, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User, UserProfile } from "@/lib/types";

export default function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const authData = localStorage.getItem("authData");
    if (!authData) {
      toast({
        title: "Lỗi xác thực",
        description: "Vui lòng đăng nhập lại",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    try {
      const data = JSON.parse(authData);
      if (data.user && data.profile) {
        setUser(data.user);
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Error parsing auth data:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin cá nhân",
        variant: "destructive",
      });
    }
    setLoading(false);
  }, [router, toast]);

  if (loading || !user || !profile) {
    return <div className="flex justify-center p-8">Đang tải thông tin...</div>;
  }

  return (
    <div className="px-4 space-y-8 py-8">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </CardDescription>
              <CardDescription className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{user.userType}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Tham gia ngày{" "}
              {new Date(profile.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </CardContent>
      </Card>{" "}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Chi tiết thông tin cá nhân của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Họ và tên
              </p>
              <p className="font-medium">{profile.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Giới tính
              </p>
              <p className="font-medium">
                {profile.gender === "male" ? "Nam" : "Nữ"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Ngày sinh
              </p>
              <p className="font-medium">
                {new Date(profile.birth).toLocaleDateString("vi-VN")}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Địa chỉ
              </p>
              <p className="font-medium">{profile.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
