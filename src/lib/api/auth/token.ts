// Authentication utilities

import { LOCAL_STORAGE_TOKEN_KEY } from "@/lib/env";
import { useAuthStore } from "@/stores/auth-store";


const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  return token;
};

const setAuthToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
};

const clearAuthToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
};

// Function to logout
const logout = () => {
  clearAuthToken();
  window.location.href = "/";
};

export { getAuthToken, setAuthToken, clearAuthToken, logout };
