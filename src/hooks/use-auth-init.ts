"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { API_URL } from "@/lib/env";
import { getAuthToken, clearAuthToken } from "@/lib/api/auth/token";
import { fetchData } from "@/lib/api/api";
import { GetMeResponse } from "@/lib/type/auth";
import { clear } from "console";

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

        const response = await fetchData<Promise<GetMeResponse>>(`/auth/me`, {
          headers: {
            method: "GET",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        updateUserInfo(response.user, response.profile);
      } else {
        // Token không hợp lệ, xóa token và thông tin xác thực
        clearAuthToken();
        clearAuth();
        console.log("Token invalid, cleared auth data");
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
