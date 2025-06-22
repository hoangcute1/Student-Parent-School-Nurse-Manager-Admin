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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";
import { API_URL } from "@/lib/env";
import { getAuthToken } from "@/lib/api/auth";
export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { user, role, profile } = useAuthStore();
  const setProfile = useAuthStore((state) => state.setProfile);
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Only attempt to fetch if user is authenticated but profile is missing
        if (user && !profile) {
          // Get the token from the auth utility
          const token = getAuthToken();
          if (token) {
            const response = await fetch(`${API_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              // Update the profile in the store
              if (data.profile) {
                setProfile(data.profile);
              }
            }
          }
        }
        // Set loading to false after fetching or if no fetch is needed
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };

    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Khi dữ liệu từ useAuthStore đã được nạp, đặt loading thành false
    setLoading(false);
  }, [user, profile]);

  if (loading) {
    return <div className="flex justify-center p-8">Đang tải thông tin...</div>;
  }
  if (!user) {
    router.push("/login");
    return null;
  }

  if (!profile && user) {
    return (
      <div className="px-4 space-y-8 py-8">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback>
                  {user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.email}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </CardDescription>
                <CardDescription className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="capitalize">{role}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>
              Thông tin cá nhân của bạn chưa được cập nhật
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-8 py-8">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={profile?.avatar || ""}
                alt={profile?.name || user.email}
              />
              <AvatarFallback>
                {profile?.name
                  ? profile.name.charAt(0).toUpperCase()
                  : user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {profile?.name || user.email}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </CardDescription>
              <CardDescription className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{role}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Tham gia ngày:{" "}
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString("vi-VN")
                : new Date().toLocaleDateString("vi-VN")}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Chi tiết thông tin cá nhân của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          {profile ? (
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
          ) : (
            <p className="text-center text-muted-foreground">
              Không có thông tin cá nhân chi tiết.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
