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
      console.log("Starting auth initialization...");
      setIsLoading(true);
      setStoreLoading(true);

      const token = getAuthToken();
      console.log("Token found:", !!token);

      if (!token) {
        console.log("No token found, user not authenticated");
        clearAuth();
        setIsInitialized(true);
        setIsLoading(false);
        setStoreLoading(false);
        return;
      }

      // Parse token để lấy thông tin cơ bản trước
      let tokenData;
      try {
        tokenData = parseJwt(token);
        if (tokenData && tokenData.role) {
          updateUserRole(tokenData.role);
          console.log("Token parsed successfully, role:", tokenData.role);
        } else {
          throw new Error("Invalid token data");
        }
      } catch (parseError) {
        console.error("Failed to parse token:", parseError);
        clearAuthToken();
        clearAuth();
        setIsInitialized(true);
        setIsLoading(false);
        setStoreLoading(false);
        return;
      }

      // Thử gọi API để lấy thông tin chi tiết (không bắt buộc)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

        const response = await fetchData<GetMeResponse>(`/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        updateUserInfo(response.user, response.profile);
        console.log("User data loaded from API successfully");
      } catch (error) {
        console.warn("Failed to fetch user data from API, using token data only:", error);
        // Không xóa auth ở đây vì chúng ta đã có thông tin cơ bản từ token
        // Tạo user object từ token data
        if (tokenData) {
          const basicUser = {
            id: tokenData.sub || tokenData.id || '',
            email: tokenData.email || '',
            role: tokenData.role,
            name: tokenData.name || tokenData.email || 'User'
          };
          updateUserInfo(basicUser, null);
          console.log("Using basic user data from token");
        }
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      clearAuth();
    } finally {
      console.log("Auth initialization completed");
      setIsLoading(false);
      setStoreLoading(false);
      setIsInitialized(true);
    }
  }, [updateUserInfo, clearAuth, updateUserRole, setStoreLoading]);

  // Chỉ chạy một lần khi component được mount
  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, []); // Empty dependency array to run only once

  return { isInitialized, isLoading };
}
