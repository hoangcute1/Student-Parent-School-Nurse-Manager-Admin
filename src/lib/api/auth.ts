// src/lib/auth-service.ts
import { AuthResponse } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";
import { API_URL } from "@/lib/env";

// Khóa lưu trữ token trong memory (không lưu vào localStorage)
let inMemoryToken: string | null = null;

// Service xử lý authentication logic
const getToken = (): string | null => {
  return inMemoryToken;
};

// Lưu token vào memory
const setToken = (token: string): void => {
  inMemoryToken = token;
};

// Xóa token khỏi memory
const clearToken = (): void => {
  inMemoryToken = null;
};

// Kiểm tra token có tồn tại không
const hasToken = (): boolean => {
  return !!inMemoryToken;
}; // Đăng nhập với email/password
const loginParent = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/auth/login-parent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }
    return true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}; // Đăng nhập với OTP
const loginParentOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/auth/login-parent/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      throw new Error("OTP verification failed");
    }
    const data: AuthResponse = await response.json();
    setToken(data.token);
    useAuthStore.getState().updateUserInfo(data.user, data.profile);
    return true;
  } catch (error) {
    console.error("OTP verification error:", error);
    return false;
  }
};

// Đăng xuất
const logout = (): void => {
  // Xóa token khỏi memory
  clearToken();

  // Xóa thông tin người dùng khỏi Zustand store
  useAuthStore.getState().clearAuth();
};

export {
  getToken,
  setToken,
  clearToken,
  hasToken,
  loginParent,
  loginParentOTP,
  logout,
};
