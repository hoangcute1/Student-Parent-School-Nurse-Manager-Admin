import { LoginRequestCredentials } from "@/lib/type/auth";
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
    // API mới chỉ trả về token
    const token = await fetchData<string>(`/auth/login-staff/verify`, {
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

export { requestStaffLoginOTP, loginStaffOTP };
