"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const verifyResetOTP = useAuthStore((state) => state.verifyResetOTP);
  const router = useRouter();

  // Bước 1: Gửi OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await forgotPassword(email);
      setMessage("OTP đã được gửi tới email của bạn.");
      setStep("otp");
    } catch (error) {
      setMessage("Không thể gửi OTP. Vui lòng thử lại.");
    }
    setLoading(false);
  };

  // Bước 2: Xác thực OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await verifyResetOTP(email, otp);
      if (res && res.resetToken) {
        // Lưu resetToken vào localStorage/sessionStorage hoặc truyền qua query nếu cần
        sessionStorage.setItem("resetToken", res.resetToken);
        sessionStorage.setItem("resetEmail", email);
        router.push("/reset-password");
      } else {
        setMessage("Không nhận được resetToken từ server.");
      }
    } catch (error) {
      setMessage("OTP không hợp lệ hoặc đã hết hạn.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Quên mật khẩu</h2>
      {step === "email" ? (
        <form onSubmit={handleSendOTP}>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP}>
          <label className="block mb-2">Nhập mã OTP đã gửi về email</label>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Đang xác thực..." : "Xác thực OTP"}
          </button>
        </form>
      )}
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
}
