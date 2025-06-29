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
import { getAuthToken } from "@/lib/auth";

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
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-br from-blue-100 to-purple-100 animate-pulse">
        <div className="text-xl font-semibold text-blue-700">
          Đang tải thông tin...
        </div>
      </div>
    );
  }
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-pink-100 py-10 px-2 md:px-0 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Lời chào tối giản */}
        <div className="mb-8 flex flex-col items-center">
          <span className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            {profile?.name || user.email}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch bg-gray-100 rounded-3xl p-8">
          {/* Avatar và thông tin cơ bản */}
          <Card className="rounded-3xl shadow border bg-white flex flex-col justify-center h-full">
            <CardHeader className="flex flex-col items-center gap-4 py-10">
              <Avatar className="h-32 w-32 border-2 border-gray-200">
                <AvatarImage
                  src={profile?.avatar || ""}
                  alt={profile?.name || user.email}
                />
                <AvatarFallback className="text-4xl">
                  {profile?.name
                    ? profile.name.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-semibold text-gray-800 mt-2">
                {profile?.name || user.email}
              </CardTitle>
              <div className="flex flex-col md:flex-row gap-2 items-center mt-2">
                <span className="px-3 py-1 rounded bg-gray-100 text-gray-700 font-medium">
                  {user.email}
                </span>
                <span className="px-3 py-1 rounded bg-gray-100 text-gray-700 font-medium">
                  <span className="capitalize">{role}</span>
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString("vi-VN")
                  : new Date().toLocaleDateString("vi-VN")}
              </div>
            </CardHeader>
          </Card>
          {/* Thông tin chi tiết */}
          <Card className="rounded-3xl shadow border bg-white flex flex-col justify-center h-full">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile ? (
                <div className="grid grid-cols-1 gap-6">
                  <div className="p-4 rounded bg-gray-50 flex flex-col gap-1 border border-gray-200">
                    <span className="text-sm text-gray-500 font-medium">
                      Họ và tên
                    </span>
                    <span className="text-base font-semibold text-gray-800">
                      {profile.name}
                    </span>
                  </div>
                  <div className="p-4 rounded bg-gray-50 flex flex-col gap-1 border border-gray-200">
                    <span className="text-sm text-gray-500 font-medium">
                      Giới tính
                    </span>
                    <span className="text-base font-semibold text-gray-800">
                      {profile.gender === "male" ? "Nam" : "Nữ"}
                    </span>
                  </div>
                  <div className="p-4 rounded bg-gray-50 flex flex-col gap-1 border border-gray-200">
                    <span className="text-sm text-gray-500 font-medium">
                      Ngày sinh
                    </span>
                    <span className="text-base font-semibold text-gray-800">
                      {new Date(profile.birth).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="p-4 rounded bg-gray-50 flex flex-col gap-1 border border-gray-200">
                    <span className="text-sm text-gray-500 font-medium">
                      Địa chỉ
                    </span>
                    <span className="text-base font-semibold text-gray-800">
                      {profile.address}
                    </span>
                  </div>
                  <div className="p-4 rounded bg-gray-50 flex flex-col gap-1 border border-gray-200">
                    <span className="text-sm text-gray-500 font-medium">
                      Thông tin liên hệ
                    </span>
                    <span className="text-base font-semibold text-gray-800">
                      {profile.phone}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8">
                  <span className="text-lg text-gray-400">
                    Không có thông tin cá nhân chi tiết.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
