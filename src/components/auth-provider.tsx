// src/components/auth-provider.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthInit } from "@/hooks/use-auth-init";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isInitialized } = useAuthInit();

  // Có thể hiển thị loading state trong khi khởi tạo
  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
