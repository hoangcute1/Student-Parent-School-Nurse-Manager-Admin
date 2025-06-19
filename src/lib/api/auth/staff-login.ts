import { useAuthStore } from "@/stores/auth-store";
import { AuthResponse, LoginRequestCredentials } from "@/lib/type/auth";
import { fetchData } from "../api";
import { setAuthToken } from "./token";

const requestStaffLoginOTP = (
  credentials: LoginRequestCredentials
): Promise<{ message: string }> => {
  return fetchData<{ message: string }>("/auth/login-staff", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

const loginStaffOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const response = await fetchData<AuthResponse>(`/auth/login-staff/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response) {
      throw new Error("OTP verification failed");
    }
    setAuthToken(response.token);
    useAuthStore.getState().updateUserInfo(response.user, response.profile);
    return true;
  } catch (error) {
    console.error("OTP verification error:", error);
    return false;
  }
};

export { requestStaffLoginOTP, loginStaffOTP };
