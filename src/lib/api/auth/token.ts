// Authentication utilities

import { LOCAL_STORAGE_TOKEN_KEY } from "@/lib/env";

// Trong hàm xử lý đăng nhập thành công
export const handleTokenLoginSuccess = (response: string) => {
  const token = response;
  document.cookie = `authToken=${token}; path=/; max-age=86400; SameSite=Lax`;
  setAuthToken(token);
  
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
