// Forgot password utilities

import { fetchData } from "../api";

// Gửi OTP về email
export const sendForgotPasswordOTP = async (email: string) => {
  try {
    const res = await fetchData("/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res;
  } catch (error) {
    throw error;
  }
};

// Đặt lại mật khẩu bằng resetToken
export const resetPasswordWithToken = async (
  resetToken: string,
  newPassword: string
) => {
  try {
    const res = await fetchData("/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetToken, newPassword }),
    });
    return res;
  } catch (error) {
    throw error;
  }
};

// Xác thực OTP trước khi đặt lại mật khẩu
export const verifyResetOTP = async (email: string, otp: string) => {
  try {
    const res = await fetchData("/auth/verify-reset-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return res;
  } catch (error) {
    throw error;
  }
};
