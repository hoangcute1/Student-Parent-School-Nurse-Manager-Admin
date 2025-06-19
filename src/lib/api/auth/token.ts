// Authentication utilities

import { LOCAL_STORAGE_TOKEN_KEY } from "@/lib/env";

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  return token;
};

export const setAuthToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
};

// Function to logout
export const logout = () => {
  clearAuthToken();
  window.location.href = "/";
};
