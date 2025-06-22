import { LoginRequestCredentials, TokenResponse } from "@/lib/type/auth";
import { fetchData } from "../api";
import { handleTokenLoginSuccess, parseJwt } from "./token";

const requestStaffLoginOTP = (
  credentials: LoginRequestCredentials
): Promise<{ message: string }> => {
  return fetchData<{ message: string }>("/auth/login-staff", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

const loginStaffOTP = async (
  email: string,
  otp: string
): Promise<{ success: boolean; role: string | null }> => {
  try {
    // API mới chỉ trả về token
    const data = await fetchData<TokenResponse>(`/auth/login-staff/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!data || !data.token) {
      throw new Error("OTP verification failed");
    }

    // Lưu token và khởi tạo user state
    const result = await handleTokenLoginSuccess(data.token);
    console.log(
      "Token saved and user state initialized after OTP verification"
    );

    return result;
  } catch (error) {
    console.error("OTP verification error:", error);
    return { success: false, role: null };
  }
};

export { requestStaffLoginOTP, loginStaffOTP };
