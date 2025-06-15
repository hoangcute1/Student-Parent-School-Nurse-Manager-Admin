import { User, UserProfile } from "./types";

interface AuthState {
  // Thông tin người dùng
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  role: "staff" | "parent" | "admin" | null;
  // Các hàm cập nhật state
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;

  // Các hàm tiện ích
  clearAuth: () => void;
  updateUserInfo: (user: User, profile?: UserProfile) => void;
}

export type { AuthState };
