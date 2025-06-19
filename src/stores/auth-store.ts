import { create } from "zustand";

import { AuthState } from "@/lib/type/auth";
import { 
  getAuthToken, 
  setAuthToken, 
  clearAuthToken, 
  logout as authLogout 
} from "@/lib/api/auth/token";

export const useAuthStore = create<AuthState>((set, get) => ({
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
      role: null,
    }),

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
