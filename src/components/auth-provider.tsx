// src/components/auth-provider.tsx
"use client";

import { useAuthInit } from "@/hooks/use-auth-init";
import { useAuthStore } from "@/stores/auth-store";
import { ReactNode, useEffect, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isInitialized, isLoading } = useAuthInit();
  const { isLoading: isStoreLoading, isAuthenticated } = useAuthStore();
  const [forceShow, setForceShow] = useState(false);

  // Force show content after 3 seconds to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Auth timeout reached, forcing content display");
      setForceShow(true);
    }, 3000); // Reduced to 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Check if we should skip auth in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  const skipAuthEnv = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true';
  const [skipAuthUrl, setSkipAuthUrl] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSkipAuthUrl(window.location.search.includes('skipauth=true'));
    }
  }, []);

  const skipAuth = isDevelopment && (skipAuthEnv || skipAuthUrl);

  if (skipAuth) {
    console.log("Skipping auth in development mode");
    return <>{children}</>;
  }

  // Show loading only if still initializing and not forced to show
  const shouldShowLoading = (isLoading || !isInitialized || isStoreLoading) && !forceShow;

  if (shouldShowLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        <div className="ml-2 text-blue-600 text-center">
          <div>Đang tải dữ liệu người dùng...</div>
          <div className="text-sm mt-2 text-gray-500">
            Vui lòng chờ trong giây lát...
          </div>
        </div>
      </div>
    );
  }

  // If auth initialization is complete, show content regardless of auth status
  // The individual pages will handle auth requirements
  return <>{children}</>;
}
