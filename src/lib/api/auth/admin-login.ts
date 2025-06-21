import { fetchData } from "../api";
import { LoginRequestCredentials, TokenResponse } from "@/lib/type/auth";
import { handleTokenLoginSuccess, parseJwt, setAuthToken } from "./token";

const requestAdminLoginOTP = (
  credentials: LoginRequestCredentials
): Promise<{ message: string }> => {
  return fetchData<{ message: string }>("/auth/login-admin", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

const loginAdminOTP = async (
  email: string,
  otp: string
): Promise<{ success: boolean; role: string | null }> => {
  try {
    // API mới chỉ trả về token
    const data = await fetchData<TokenResponse>(`/auth/login-admin/verify`, {
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

export { requestAdminLoginOTP, loginAdminOTP };
