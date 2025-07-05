
"use client";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import React, { useState } from 'react';

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const resetPasswordWithToken = useAuthStore((state) => state.resetPasswordWithToken);
  const [resetToken, setResetToken] = useState("");
  const [email, setEmail] = useState("");
  const router = typeof window !== "undefined" ? require("next/navigation").useRouter() : null;

  // Chỉ cho phép mở trang nếu có resetToken trong sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("resetToken");
      const emailStored = sessionStorage.getItem("resetEmail");
      if (!token) {
        window.location.href = "/forgot-password";
      } else {
        setResetToken(token);
        setEmail(emailStored || "");
      }
    }
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    try {
      await resetPasswordWithToken(resetToken, password);
      setMessage("Đặt lại mật khẩu thành công! Đang chuyển hướng...");
      // Xoá token/email khỏi sessionStorage sau khi thành công
      sessionStorage.removeItem("resetToken");
      sessionStorage.removeItem("resetEmail");
      setTimeout(() => {
        if (router) {
          router.push("/login");
        } else {
          window.location.href = "/login";
        }
      }, 1500);
    } catch (error) {
      setMessage("Không thể đặt lại mật khẩu. Token không hợp lệ hoặc đã hết hạn.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Đặt lại mật khẩu</h2>
      <form onSubmit={handleResetPassword}>
          <label className="block mb-2">Mật khẩu mới</label>
          <p className="text-sm text-gray-600 mb-2">* Mật khẩu phải có ít nhất 6 ký tự</p>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
          />
          <label className="block mb-2">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Nhập lại mật khẩu mới"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </button>
        </form>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
}
