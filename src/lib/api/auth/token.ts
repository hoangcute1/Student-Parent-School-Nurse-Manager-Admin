// Authentication utilities

import { LOCAL_STORAGE_TOKEN_KEY } from "@/lib/env";
import { useAuthStore } from "@/stores/auth-store";
import { fetchData } from "../api";
import { GetMeResponse } from "@/lib/type/auth";

// Trong hàm xử lý đăng nhập thành công
export const handleTokenLoginSuccess = async (response: string) => {
  const token = response;
  document.cookie = `authToken=${token}; path=/; max-age=86400; SameSite=Lax`;
  setAuthToken(token);

  // Extract role from token
  const decodedToken = parseJwt(token);
  const role = decodedToken?.role || null;

  // Update role in auth store
  const { updateUserRole } = useAuthStore.getState();
  updateUserRole(role);

  // Optionally fetch user data immediately
  try {
    const response = await fetchData<GetMeResponse>(`/auth/me`, {
      headers: {
        method: "GET",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Update user info in auth store
    const { updateUserInfo } = useAuthStore.getState();
    updateUserInfo(response.user, response.profile);

    return { success: true, role };
  } catch (error) {
    console.error("Error fetching user data after login:", error);
    return { success: true, role };
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  return token;
};

export const setAuthToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  document.cookie =
    "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
};

// Hàm giải mã JWT token (đơn giản)
export const parseJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return { role: null };
  }
};

// Function to logout
export const logout = () => {
  clearAuthToken();
  window.location.href = "/";
};
