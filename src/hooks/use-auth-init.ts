"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { API_URL } from "@/lib/env";
import { getAuthToken, clearAuthToken } from "@/lib/api/auth/token";

// Hook này giúp khôi phục trạng thái xác thực khi tải trang
export function useAuthInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sử dụng các actions cụ thể từ store thay vì toàn bộ store
  const updateUserInfo = useAuthStore((state) => state.updateUserInfo);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // Sử dụng useCallback để tránh tạo hàm mới mỗi khi render
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();

      if (token) {
        console.log("Found auth token, checking validity...");

        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Auth response status:", response);
        if (response.ok) {
          const data = await response.json();
          console.log("Auth response data:", data);
          // Cập nhật thông tin người dùng vào store
          updateUserInfo(data.user, data.profile);
          console.log("Auth initialized successfully");
        } else {
          // Token không hợp lệ, xóa token và thông tin xác thực
          clearAuthToken();
          clearAuth();
          console.log("Token invalid, cleared auth data");
        }
      } else {
        // Không tìm thấy token, xóa dữ liệu xác thực cũ nếu có
        clearAuth();

        // Xóa các localStorage cũ để tránh conflict
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          localStorage.removeItem("token");
          localStorage.removeItem("authData");
          localStorage.removeItem("user");
        }

        console.log("No token found, auth state cleared");
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      clearAuth();
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [updateUserInfo, clearAuth]);

  // Chỉ chạy một lần khi component được mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return { isInitialized, isLoading };
}
