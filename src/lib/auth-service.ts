// src/lib/auth-service.ts
import { AuthResponse } from '@/lib/types';
import { useAuthStore } from '@/stores/auth-store';
import { API_URL } from '@/lib/env';

// Khóa lưu trữ token trong memory (không lưu vào localStorage)
let inMemoryToken: string | null = null;

// Service xử lý authentication logic
export const AuthService = {
  // Lấy token từ memory
  getToken: (): string | null => {
    return inMemoryToken;
  },

  // Lưu token vào memory
  setToken: (token: string): void => {
    inMemoryToken = token;
  },

  // Xóa token khỏi memory
  clearToken: (): void => {
    inMemoryToken = null;
  },

  // Kiểm tra token có tồn tại không
  hasToken: (): boolean => {
    return !!inMemoryToken;
  },

  // Đăng nhập với email/password
  login: async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data: AuthResponse = await response.json();
      
      // Lưu token vào memory, không lưu vào localStorage
      AuthService.setToken(data.token);
      
      // Lưu thông tin người dùng vào Zustand store
      useAuthStore.getState().updateUserInfo(data.user, data.profile);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  // Đăng nhập với OTP
  loginWithOTP: async (email: string, password: string, otp: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, otp }),
      });

      if (!response.ok) {
        throw new Error('OTP verification failed');
      }

      const data: AuthResponse = await response.json();
      
      // Lưu token vào memory, không lưu vào localStorage
      AuthService.setToken(data.token);
      
      // Lưu thông tin người dùng vào Zustand store
      useAuthStore.getState().updateUserInfo(data.user, data.profile);
      
      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  },

  // Đăng xuất
  logout: (): void => {
    // Xóa token khỏi memory
    AuthService.clearToken();
    
    // Xóa thông tin người dùng khỏi Zustand store
    useAuthStore.getState().clearAuth();
  },
  // Làm mới token nếu cần - NOT IMPLEMENTED
  // API hiện tại không hỗ trợ refresh token
  refreshToken: async (): Promise<boolean> => {
    console.warn('refreshToken is not implemented because the API does not support refresh tokens');
    return false;
  },

  // Kiểm tra xem người dùng đã đăng nhập chưa
  isAuthenticated: (): boolean => {
    return AuthService.hasToken() && useAuthStore.getState().isAuthenticated;
  },

  // Giải mã JWT token để lấy thông tin (chỉ dùng cho debug)
  decodeToken: (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  },
};

// Custom hook để sử dụng trong components
export function useAuth() {
  const { user, profile, isAuthenticated, clearAuth } = useAuthStore();

  // Đăng nhập
  const login = async (email: string, password: string) => {
    return AuthService.login(email, password);
  };

  // Đăng nhập với OTP
  const loginWithOTP = async (email: string, password: string, otp: string) => {
    return AuthService.loginWithOTP(email, password, otp);
  };

  // Đăng xuất
  const logout = () => {
    AuthService.logout();
  };
  // API Request với token tự động
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    // Kiểm tra token
    if (!AuthService.hasToken()) {
      throw new Error('Not authenticated');
    }

    // Tạo headers với token
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AuthService.getToken()}`,
      ...options.headers,
    };

    // Thực hiện request
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Nếu token hết hạn (401)
      if (response.status === 401) {
        // API không hỗ trợ refresh token, đăng xuất ngay lập tức
        AuthService.logout();
        throw new Error('Authentication expired');
      }

      return response;
    } catch (error) {
      console.error('Authenticated fetch error:', error);
      throw error;
    }
  };

  return {
    user,
    profile,
    isAuthenticated,
    login,
    loginWithOTP,
    logout,
    authenticatedFetch,
  };
}
