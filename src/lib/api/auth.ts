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


const loginAdmin = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/auth/login-admin`, {
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
const loginAdminOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/auth/login-admin/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        email, 
        otp,
      }),
    });

    if (!response.ok) {
      // Đọc thông tin lỗi từ response
      const errorData = await response.json().catch(() => ({}));
      // Ném ra lỗi với thông tin chi tiết hơn
      throw new Error(errorData.message || `Xác thực OTP không thành công: ${response.status}`);
    }
    
    // Xử lý response thành công
    const data: AuthResponse = await response.json();
    
    // Lưu token và thông tin người dùng
    setToken(data.token);
    useAuthStore.getState().updateUserInfo(data.user, data.profile);
    
    return true;
  } catch (error) {
    console.error("Admin OTP verification error:", error);
    throw error; // Re-throw để xử lý ở hàm gọi
  }
};

const loginStaff = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/auth/login-staff`, {
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
const loginStaffOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/auth/login-staff/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        email, 
        otp,
      }),
    });

    if (!response.ok) {
      // Đọc thông tin lỗi từ response
      const errorData = await response.json().catch(() => ({}));
      // Ném ra lỗi với thông tin chi tiết hơn
      throw new Error(errorData.message || `Xác thực OTP không thành công: ${response.status}`);
    }
    
    // Xử lý response thành công
    const data: AuthResponse = await response.json();
    
    // Lưu token và thông tin người dùng
    setToken(data.token);
    useAuthStore.getState().updateUserInfo(data.user, data.profile);
    
    return true;
  } catch (error) {
    console.error("Staff OTP verification error:", error);
    throw error; // Re-throw để xử lý ở hàm gọi
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
  loginAdmin,
  loginAdminOTP,
  loginStaff,
  loginStaffOTP,
  logout,
};
