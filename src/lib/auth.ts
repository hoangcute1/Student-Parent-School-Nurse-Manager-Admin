// Authentication utilities

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RoleName, hasPermission } from "./roles";

// Type for user data
export interface AuthUser {
  id: string; // Sửa từ number thành string vì từ MongoDB sẽ trả về ID dạng string
  email: string;
  role: RoleName;
}

// Check if code is running on the client side
const isClient = typeof window !== "undefined";

// Custom hook to check if user is authenticated
export function useAuth(requiredRole?: RoleName | RoleName[]) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    let isMounted = true;

    // Check if the user is logged in
    const checkAuth = async () => {
      try {
        if (!isClient) {
          if (isMounted) setLoading(false);
          return;
        }

        const storedUser = localStorage.getItem("user");
        const token =
          localStorage.getItem("access_token") || localStorage.getItem("token");

        if (!storedUser || !token) {
          // Not logged in, redirect to login page
          if (isMounted) {
            setLoading(false);
            setUser(null);
          }
          return;
        }

        try {
          const userData = JSON.parse(storedUser) as AuthUser;

          console.log("Đã đọc thông tin người dùng từ localStorage:", userData); // Cập nhật state ngay lập tức với dữ liệu từ localStorage
          if (isMounted) {
            setUser(userData);
          }

          // Check if the user has the required role
          if (requiredRole) {
            const requiredRoles = Array.isArray(requiredRole)
              ? requiredRole
              : [requiredRole];

            if (!hasPermission(userData.role, requiredRoles)) {
              console.log("Người dùng không có quyền cần thiết:", requiredRole);
              // User doesn't have the required role
              if (isMounted) {
                setLoading(false);
              }
              return;
            }
          }

          // Kết thúc loading
          if (isMounted) {
            setLoading(false);
          }
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("access_token");

          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    checkAuth();

    // Cleanup function để tránh memory leak
    return () => {
      isMounted = false;
    };
  }, [router, requiredRole]);

  return { user, loading };
}

// Function to log out the user
export function logout() {
  if (isClient) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Sử dụng setTimeout để đảm bảo localStorage đã được xóa
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }, 100);
  }
}

// Function to get the authentication token
export function getAuthToken() {
  if (!isClient) return null;
  return localStorage.getItem("access_token") || localStorage.getItem("token");
}

// Function to check if the user is logged in
export function isLoggedIn() {
  if (!isClient) return false;
  return !!(
    localStorage.getItem("access_token") || localStorage.getItem("token")
  );
}
