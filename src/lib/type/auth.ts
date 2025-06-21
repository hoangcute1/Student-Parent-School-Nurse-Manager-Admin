import { UserLoginResponse, UserProfile, UserRoleType } from "./users";

interface LoginRequestCredentials {
  email: string;
  password: string;
}

interface LoginVerifyCredentials {
  email: string;
  otp: string;
}

interface TokenResponse {
  token: string;
}
interface GetMeResponse {
  user: UserLoginResponse;
  profile: UserProfile;
}
interface AuthResponse extends GetMeResponse {
  token: string;
}
interface AuthState {
  // Thông tin người dùng
  user: UserLoginResponse | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  role: UserRoleType | null;
  isLoading: boolean;
  // Các hàm cập nhật state
  setUser: (user: UserLoginResponse | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
  updateUserRole: (role: UserRoleType | null) => void;
  updateUserInfo: (user: UserLoginResponse, profile?: UserProfile) => void;
}

export type {
  AuthResponse,
  GetMeResponse,
  TokenResponse,
  AuthState,
  LoginRequestCredentials,
  LoginVerifyCredentials,
};
