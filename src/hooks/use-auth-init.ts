"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { API_URL } from "@/lib/env";
import { getAuthToken, clearAuthToken, parseJwt } from "@/lib/api/auth/token";
import { fetchData } from "@/lib/api/api";
import { GetMeResponse } from "@/lib/type/auth";
import { set } from "react-hook-form";

// Hook này giúp khôi phục trạng thái xác thực khi tải trang
export function useAuthInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {
    updateUserInfo,
    clearAuth,
    updateUserRole,
    setIsLoading: setStoreLoading,
  } = useAuthStore();

  // Sử dụng useCallback để tránh tạo hàm mới mỗi khi render
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setStoreLoading(true);
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
        const role = parseJwt(token).role;
        updateUserRole(role);
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
      setStoreLoading(false);
      setIsInitialized(true);
    }
  }, [updateUserInfo, clearAuth]);

  // Chỉ chạy một lần khi component được mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return { isInitialized, isLoading };
}
