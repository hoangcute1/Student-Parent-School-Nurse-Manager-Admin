"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { API_URL } from "@/lib/env";
import { getAuthToken, clearAuthToken, parseJwt } from "@/lib/api/auth/token";
import { fetchData } from "@/lib/api/api";
import { GetMeResponse } from "@/lib/type/auth";

// Hook này giúp khôi phục trạng thái xác thực khi tải trang
export function useAuthInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {
    updateUserInfo,
    clearAuth,
    updateUserRole,
    setIsLoading: setStoreLoading,
    user,
  } = useAuthStore();

  // Sử dụng useCallback để tránh tạo hàm mới mỗi khi render
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setStoreLoading(true);
      const token = getAuthToken();

      // Nếu đã có user trong store thì không cần fetch lại
      if (user) {
        console.log("User already in store, skipping fetch");
        setIsInitialized(true);
        setIsLoading(false);
        setStoreLoading(false);
        return;
      }

      if (token) {
        console.log("Found auth token, checking validity...");

        try {
          const response = await fetchData<GetMeResponse>(`/auth/me`, {
            headers: {
              method: "GET",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const role = parseJwt(token).role;
          updateUserRole(role);
          updateUserInfo(response.user, response.profile);
          console.log("User data loaded successfully");
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Token không hợp lệ, xóa token và thông tin xác thực
          clearAuthToken();
          clearAuth();
        }
      } else {
        // Không có token, xóa thông tin xác thực
        clearAuth();
        console.log("No token found, cleared auth data");
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      clearAuth();
    } finally {
      setIsLoading(false);
      setStoreLoading(false);
      setIsInitialized(true);
    }
  }, [updateUserInfo, clearAuth, updateUserRole, user, setStoreLoading]);

  // Chỉ chạy một lần khi component được mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return { isInitialized, isLoading };
}
