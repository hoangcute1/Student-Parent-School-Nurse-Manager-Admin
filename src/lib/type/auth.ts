import { UserLoginResponse, UserProfile, UserRoleType } from "./users";

interface LoginRequestCredentials {
  email: string;
  password: string;
}

interface LoginVerifyCredentials {
  email: string;
  otp: string;
}
interface AuthResponse {
  token: string;
  user: UserLoginResponse;
  profile: UserProfile;
}
interface AuthState {
  // Thông tin người dùng
  user: UserLoginResponse | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  role: UserRoleType | null;
  // Các hàm cập nhật state
  setUser: (user: UserLoginResponse | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  clearAuth: () => void;
  updateUserInfo: (user: UserLoginResponse, profile?: UserProfile) => void;
}

export type {
  AuthResponse,
  AuthState,
  LoginRequestCredentials,
  LoginVerifyCredentials,
};
