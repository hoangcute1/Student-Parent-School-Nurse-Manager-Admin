// src/stores/auth-store.ts
import { create } from "zustand";

import { AuthState } from "@/lib/type/auth";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  role: null,
  // Các hàm cập nhật state
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  // Xóa toàn bộ thông tin xác thực
  clearAuth: () =>
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
    }),

  // Cập nhật thông tin người dùng
  updateUserInfo: (user, profile) => {
    set({
      user,
      profile: profile || null,
      isAuthenticated: true,
      role: user.role || null,
    });
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
