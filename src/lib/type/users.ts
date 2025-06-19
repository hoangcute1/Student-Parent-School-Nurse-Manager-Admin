interface User {
  _id: string;
  email: string;
  role: UserRoleType;
  created_at: Date;
  updated_at: Date;
}

interface UserProfile {
  name: string;
  gender: string;
  birth: string;
  address: string;
  avatar: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

type UserRoleType = "staff" | "parent" | "admin";

interface UserLoginResponse {
  email: string;
  role: UserRoleType;
}

export type { User, UserProfile, UserRoleType, UserLoginResponse };
