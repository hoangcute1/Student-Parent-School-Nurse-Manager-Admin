// src/hooks/use-auth-init.ts
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { API_URL, LOCAL_STORAGE_TOKEN_KEY } from "@/lib/env";
import { getAuthToken, setAuthToken } from "../lib/api/auth";

// Hook này giúp khôi phục trạng thái xác thực khi tải trang
export function useAuthInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { updateUserInfo } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAuthToken();

        if (token) {
          // Nếu có token, gửi request kiểm tra
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            // Cập nhật thông tin người dùng trong store
            updateUserInfo(data.user, data.profile);
            console.log("Auth initialized from stored token");
          } else {
            // Nếu token không hợp lệ, xóa token
            localStorage.removeItem("authToken");
            console.log("Stored token invalid, cleared auth data");
          }
        } else {
          // Kiểm tra legacy token nếu có
          const legacyToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
          if (legacyToken) {
            setAuthToken(legacyToken);
            const response = await fetch(`${API_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${legacyToken}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              updateUserInfo(data.user, data.profile);
              localStorage.removeItem("token");
              console.log("Auth initialized from legacy token");
            } else {
              localStorage.removeItem("token");
              localStorage.removeItem("authData");
              localStorage.removeItem("user");
              console.log(
                "Legacy token invalid, but extracted user info if available"
              );
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [updateUserInfo]);

  return { isInitialized };
}
