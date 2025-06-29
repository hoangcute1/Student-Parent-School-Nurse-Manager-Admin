import { create } from "zustand";

import { AuthStore } from "@/lib/type/auth";
import {
  resetPasswordWithToken,
  sendForgotPasswordOTP,
  verifyResetOTP,
} from "@/lib/api/auth/forgot-password";

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  role: null,
  isLoading: false,
  // Các hàm cập nhật state
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  // Xóa toàn bộ thông tin xác thực
  clearAuth: () =>
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
      role: null,
    }),

  updateUserRole: (role) => {
    set({ role });
  },
  // Cập nhật thông tin người dùng
  updateUserInfo: (user, profile) => {
    // Chỉ cập nhật state nếu dữ liệu thực sự thay đổi
    const currentState = get();

    // Kiểm tra nếu dữ liệu đã tồn tại và giống nhau thì không cập nhật
    if (
      currentState.isAuthenticated &&
      currentState.user?.email === user.email &&
      JSON.stringify(currentState.profile) === JSON.stringify(profile)
    ) {
      console.log("User data unchanged, skipping update");
      return;
    }
    // Cập nhật state với dữ liệu mới
    set({
      user,
      profile: profile || null,
      isAuthenticated: true,
    });
  },
  // Forgot password actions
  forgotPassword: async (email: string) => {
    try {
      await sendForgotPasswordOTP(email);
    } catch (error) {
      console.error("Error sending forgot password request:", error);
      throw error;
    }
  },
  verifyResetOTP: async (email: string, otp: string) => {
    try {
      // Trả về response từ API (có thể chứa resetToken)
      return await verifyResetOTP(email, otp);
    } catch (error) {
      console.error("Error verifying reset OTP:", error);
      throw error;
    }
  },
  resetPasswordWithToken: async (resetToken: string, newPassword: string) => {
    try {
      // Trả về response từ API (nếu có)
      return await resetPasswordWithToken(resetToken, newPassword);
    } catch (error) {
      console.error("Error resetting password with token:", error);
      throw error;
    }
  },
}));

// Custom hook để kiểm tra role
export function useHasRole() {
  const user = useAuthStore((state) => state.user);

  return (requiredRoles: Array<"admin" | "staff" | "parent">): boolean => {
    if (!user || !user.role) return false;
    return requiredRoles.includes(user.role);
  };
}
