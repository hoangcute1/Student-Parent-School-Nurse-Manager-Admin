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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-sky-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-1/4 -right-20 w-60 h-60 bg-blue-100 rounded-full opacity-20 animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-sky-50 rounded-full opacity-25 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-10 right-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-30 animate-bounce" style={{animationDuration: '4s', animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Card container với animation */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-sky-100 transform transition-all duration-500 hover:shadow-3xl animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center mb-4 transform transition-all duration-300 hover:scale-110 animate-bounce-in">
              <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-700 via-blue-600 to-sky-700 bg-clip-text text-transparent mb-2 animate-slide-down">
              Quên mật khẩu?
            </h1>
            <p className="text-gray-600 animate-slide-up" style={{animationDelay: '0.2s'}}>
              {step === "email" 
                ? "Nhập email của bạn để nhận mã OTP" 
                : "Nhập mã OTP đã được gửi đến email của bạn"
              }
            </p>
          </div>

          {/* Progress indicator với animation */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 transform ${
                step === "email" 
                  ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white scale-110 animate-pulse" 
                  : "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
              }`}>
                1
              </div>
              <div className={`w-12 h-1 transition-all duration-500 ${
                step === "otp" 
                  ? "bg-gradient-to-r from-emerald-500 to-green-500" 
                  : "bg-gradient-to-r from-sky-200 to-blue-200"
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 transform ${
                step === "otp" 
                  ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white scale-110 animate-pulse" 
                  : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600"
              }`}>
                2
              </div>
            </div>
          </div>

          {/* Forms với animation */}
          <div className="animate-fade-in">
            {step === "email" ? (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-cyan-500">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 hover:border-cyan-300"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang gửi...
                      </div>
                    ) : (
                      "Gửi mã OTP"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã OTP
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-center tracking-widest font-mono text-lg hover:border-emerald-300"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center animate-fade-in" style={{animationDelay: '0.5s'}}>
                    Mã OTP đã được gửi đến <span className="font-medium text-cyan-600">{email}</span>
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang xác thực...
                        </div>
                      ) : (
                        "Xác thực OTP"
                      )}
                    </button>
                  </div>
                  <div className="animate-slide-up" style={{animationDelay: '0.5s'}}>
                    <button
                      type="button"
                      onClick={() => setStep("email")}
                      className="w-full text-cyan-600 hover:text-cyan-800 font-medium py-2 px-4 border border-cyan-200 hover:border-cyan-300 hover:bg-cyan-50 rounded-lg transition-all duration-200"
                    >
                      Quay lại
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Message với animation */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg text-center text-sm animate-bounce-in ${
              message.includes("thành công") || message.includes("đã được gửi") 
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center animate-fade-in" style={{animationDelay: '0.6s'}}>
            <p className="text-sm text-gray-600">
              Nhớ mật khẩu?{" "}
              <a href="/login" className="text-cyan-600 hover:text-cyan-800 font-medium transition-colors duration-200">
                Đăng nhập
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
