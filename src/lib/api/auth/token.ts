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
};

// Function to logout
export const logout = () => {
  clearAuthToken();
  window.location.href = "/";
};
