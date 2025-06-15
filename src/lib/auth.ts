// Authentication utilities

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthResponse, User, UserProfile } from "./types";

// Storage keys
const AUTH_TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const AUTH_DATA_KEY = "authData";

// Type for stored auth data
interface StoredAuthData {
  user: User;
  profile: UserProfile;
}

// Function to store auth data
export function storeAuthData(response: any) {
  if (typeof window === "undefined") return;

  console.log("Storing auth data:", response);

  // Handle different token property names
  const accessToken = response.access_token || response.token;
  const refreshToken = response.refresh_token || response.token;

  if (accessToken) {
    // Lưu token vào tất cả các khóa có thể được sử dụng
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("token", accessToken);
    
    console.log("Stored tokens to all locations:", {
      [AUTH_TOKEN_KEY]: accessToken,
      "access_token": accessToken,
      "token": accessToken
    });
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  // Store user data and profile if available
  if (response.user) {
    const userData = {
      user: response.user,
      profile: response.profile || {},
    };

    localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(userData));
    console.log("Stored auth data:", userData);

    // Also store the user directly for broader compatibility
    localStorage.setItem("user", JSON.stringify(response.user));
    console.log("Stored direct user:", response.user);
  }
}

// Function to get auth token
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  
  // Kiểm tra tất cả các vị trí token có thể được lưu trữ
  const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
  const accessToken = localStorage.getItem("access_token");
  const token = localStorage.getItem("token");
  
  // Trả về token đầu tiên tìm thấy
  return authToken || accessToken || token;
}

// Function to get user data
export function getAuthData(): StoredAuthData | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(AUTH_DATA_KEY);
  return data ? JSON.parse(data) : null;
}

// Function to clear auth data on logout
export function clearAuthData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_DATA_KEY);
}

// Function to logout
export async function logout() {
  clearAuthData();
  window.location.href = "/";
}

// Custom hook to check if user is authenticated
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const initialized = useRef(false);
  
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Kiểm tra token trước tiên
    const token = getAuthToken();
    console.log("Found token in useAuth:", !!token);
    
    if (!token) {
      console.log("No token found, user is not authenticated");
      setLoading(false);
      return;
    }

    // Try getting user data in order of preference
    const authData = getAuthData();
    const directUser = localStorage.getItem("user");
    
    console.log("Auth data exists in useAuth:", !!authData);
    console.log("Direct user exists in useAuth:", !!directUser);

    if (authData && authData.user) {
      console.log("Using auth data user:", authData.user);
      setUser(authData.user);
      setLoading(false);
      return;
    } else if (directUser) {
      try {
        console.log("Using direct user data");
        const userData = JSON.parse(directUser);
        setUser(userData);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // No auth data found but token exists
    if (token) {
      console.log("Token exists but no user data found. User might need to re-login");
    }
    
    setLoading(false);
  }, [router]);

  return { user, loading };
}
