// src/components/auth-provider.tsx
"use client";

import { useAuthInit } from "@/hooks/use-auth-init";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isInitialized, isLoading } = useAuthInit();

  // Hiển thị loading state trong khi khởi tạo hoặc loading
  if (isLoading || !isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        <span className="ml-2 text-blue-600">
          Đang tải dữ liệu người dùng...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
