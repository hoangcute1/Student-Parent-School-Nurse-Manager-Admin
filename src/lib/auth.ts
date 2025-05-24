// Authentication utilities

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RoleName } from "./roles";
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
export function storeAuthData(response: AuthResponse) {
  if (typeof window === "undefined") return;

  localStorage.setItem(AUTH_TOKEN_KEY, response.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
  localStorage.setItem(
    AUTH_DATA_KEY,
    JSON.stringify({
      user: response.user,
      profile: response.profile,
    })
  );
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
  window.location.href = "/login";
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

    const authData = getAuthData();
    if (!authData) {
      router.push("/login");
      setLoading(false);
      return;
    }

    setUser(authData.user);
    setLoading(false);
  }, [router]);

  return { user, loading };
}
