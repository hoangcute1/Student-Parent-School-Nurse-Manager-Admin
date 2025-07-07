
"use client";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import React, { useState } from 'react';

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: ""
  });
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
    setErrors({ password: "", confirmPassword: "" });
    
    // Validate password length
    if (password.length < 6) {
      setErrors(prev => ({
        ...prev,
        password: "Mật khẩu phải có ít nhất 6 ký tự"
      }));
      return;
    }
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: "Mật khẩu xác nhận không khớp"
      }));
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-sky-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-sky-700 to-gray-900 bg-clip-text text-transparent mb-2">
            Đặt lại mật khẩu
          </h2>
          <p className="text-gray-600 text-sm">
            Tạo mật khẩu mới cho tài khoản của bạn
          </p>
        </div>
      <form onSubmit={handleResetPassword} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
            <p className="text-sm text-sky-600 mb-2">* Mật khẩu phải có ít nhất 6 ký tự</p>
          <input
            type="password"
            className={`w-full p-3 border rounded-lg mb-2 transition-all duration-200 ${
              errors.password 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                : "border-gray-300 focus:border-sky-500 focus:ring-sky-500 hover:border-sky-300"
            }`}
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              // Clear error when user starts typing
              if (errors.password) {
                setErrors(prev => ({ ...prev, password: "" }));
              }
            }}
            required
            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-4 flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.password}
            </p>
          )}
          </div>
          
          <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            className={`w-full p-3 border rounded-lg mb-2 transition-all duration-200 ${
              errors.confirmPassword 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                : "border-gray-300 focus:border-sky-500 focus:ring-sky-500 hover:border-sky-300"
            }`}
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value);
              // Clear error when user starts typing
              if (errors.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: "" }));
              }
            }}
            required
            placeholder="Nhập lại mật khẩu mới"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mb-4 flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.confirmPassword}
            </p>
          )}
          </div>
          
          <div className="pt-2">
          
          <button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </div>
            ) : (
              "Đặt lại mật khẩu"
            )}
          </button>
          </div>
        </form>

        {message && (
          <p className={`mt-4 text-center text-sm ${
            message.includes("thành công") ? "text-green-600" : "text-red-600"
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
