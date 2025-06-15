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
    setLoading(true);

    // Kiểm tra tất cả các vị trí token có thể được lưu trữ
    const authToken = localStorage.getItem("authToken");
    const accessToken = localStorage.getItem("access_token");
    const token = localStorage.getItem("token");

    console.log("Profile page - Available tokens:", { authToken, accessToken, token });

    // if (!authToken && !accessToken && !token) {
    //   console.log("Profile page - No auth token found in any location");
    //   toast({
    //     title: "Lỗi xác thực",
    //     description: "Vui lòng đăng nhập lại",
    //     variant: "destructive",
    //   });
    //   router.push("/login");
    //   return;
    // }

    // Thử lấy dữ liệu từ authData trước
    const authData = localStorage.getItem("authData");
    const directUser = localStorage.getItem("user");

    console.log("Profile page - Auth data exists:", !!authData);
    console.log("Profile page - Direct user exists:", !!directUser);

    if (authData) {
      try {
        const data = JSON.parse(authData);
        console.log("Profile page - Parsed auth data:", data);

        if (data.user) {
          setUser(data.user);
          if (data.profile) {
            setProfile(data.profile);
          }
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }

    // Nếu không có user từ authData, thử lấy từ user trực tiếp
    if (!user && directUser) {
      try {
        console.log("Profile page - Trying direct user data");
        const userData = JSON.parse(directUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing direct user data:", error);
      }
    }

    setLoading(false);
  }, [router, toast]);

  // Debug function to show auth state
  const showAuthDebug = () => {
    const authToken = localStorage.getItem("authToken");
    const accessToken = localStorage.getItem("access_token");
    const token = localStorage.getItem("token");
    const authData = localStorage.getItem("authData");
    const directUser = localStorage.getItem("user");

    console.log("=== Auth Debug ===");
    console.log("Tokens:", { authToken, accessToken, token });
    console.log("Auth Data exists:", !!authData);
    if (authData) {
      try {
        console.log("Auth Data content:", JSON.parse(authData));
      } catch (e) {
        console.log("Invalid auth data format");
      }
    }
    console.log("Direct User exists:", !!directUser);
    if (directUser) {
      try {
        console.log("Direct User content:", JSON.parse(directUser));
      } catch (e) {
        console.log("Invalid user data format");
      }
    }
    console.log("User state:", user);
    console.log("Profile state:", profile);
    console.log("=== End Debug ===");

    toast({
      title: "Auth Debug",
      description: `Tokens: ${!!authToken || !!accessToken || !!token ? "Yes" : "No"}, User: ${!!user ? "Yes" : "No"}`,
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Đang tải thông tin...</div>;
  }

  // Nếu chỉ có user mà không có profile, hiển thị thông tin cơ bản
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
                  <span className="capitalize">{user.userType}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>Thông tin cá nhân của bạn chưa được cập nhật</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Nếu không có thông tin người dùng, chuyển hướng đến trang đăng nhập
  if (!user) {
    router.push("/login");
    return null;
  }
  return (
    <div className="px-4 space-y-8 py-8">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar || ''} alt={profile?.name || user.email} />
              <AvatarFallback>
                {profile?.name 
                  ? profile.name.charAt(0).toUpperCase() 
                  : user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile?.name || user.email}</CardTitle>
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
              Tham gia ngày:{" "}
              {profile?.createdAt 
                ? new Date(profile.createdAt).toLocaleDateString("vi-VN") 
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
