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

  // Handle different token property names
  const accessToken = response.access_token || response.token;
  const refreshToken = response.refresh_token || response.token;

  if (accessToken) {
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
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

    // Also store the user directly for broader compatibility
    localStorage.setItem("user", JSON.stringify(response.user));
  }
}

// Function to get auth token
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
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

    // Try getting user data in order of preference
    const authData = getAuthData();
    const directUser = localStorage.getItem("user");

    if (authData) {
      console.log("Found auth data:", authData);
      setUser(authData.user);
      setLoading(false);
      return;
    } else if (directUser) {
      try {
        console.log("Found direct user data");
        const userData = JSON.parse(directUser);
        setUser(userData);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // No auth data found
    setLoading(false);
  }, [router]);

  return { user, loading };
}
