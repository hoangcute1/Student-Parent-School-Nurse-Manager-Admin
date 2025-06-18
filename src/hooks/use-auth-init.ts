// src/hooks/use-auth-init.ts
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { API_URL } from "@/lib/env";
import { setAuthToken } from "../lib/api/auth";

// Hook này giúp khôi phục trạng thái xác thực khi tải trang
export function useAuthInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { updateUserInfo } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const legacyToken = localStorage.getItem("token");
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
