import { fetchData } from "../api";
import { LoginRequestCredentials } from "@/lib/type/auth";
import { setAuthToken } from "./token";

const requestAdminLoginOTP = (
  credentials: LoginRequestCredentials
): Promise<{ message: string }> => {
  return fetchData<{ message: string }>("/auth/login-admin", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

const loginAdminOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const token = await fetchData<string>(`/auth/login-admin/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!token) {
      throw new Error("OTP verification failed");
    }

    // Lưu token vào localStorage
    setAuthToken(token);
    return true;
  } catch (error) {
    console.error("OTP verification error:", error);
    return false;
  }
};

export { requestAdminLoginOTP, loginAdminOTP };
