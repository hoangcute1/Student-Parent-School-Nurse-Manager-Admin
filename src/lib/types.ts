export interface User {
  id: string;
  name: string;
  email: string;
  // Thêm các trường khác nếu cần
}

export interface UserProfile {
  // Thêm các trường profile nếu có
  [key: string]: any;
}

export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  token?: string;
  user?: User;
  profile?: UserProfile;
  role?: string;
}