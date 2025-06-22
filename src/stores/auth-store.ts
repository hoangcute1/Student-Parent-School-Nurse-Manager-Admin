import { create } from "zustand";

import { AuthStore } from "@/lib/type/auth";

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
}));

// Custom hook để kiểm tra role
export function useHasRole() {
  const user = useAuthStore((state) => state.user);

  return (requiredRoles: Array<"admin" | "staff" | "parent">): boolean => {
    if (!user || !user.role) return false;
    return requiredRoles.includes(user.role);
  };
}
