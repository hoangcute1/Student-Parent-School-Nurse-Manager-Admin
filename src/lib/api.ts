// src/lib/api.ts
import { API_URL } from "@/lib/env";

// Khóa lưu trữ token trong memory (không lưu vào localStorage)
let inMemoryToken: string | null = null;

// Set token function that is used by auth-init.ts
export const setToken = (token: string): void => {
  inMemoryToken = token;
};

// Get token helper
export const getToken = (): string | null => {
  return inMemoryToken;
};

// Clear token helper
export const clearToken = (): void => {
  inMemoryToken = null;
};

// Authenticated fetch helper
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  // Check for token
  if (!inMemoryToken) {
    throw new Error("Not authenticated");
  }

  // Create headers with token
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${inMemoryToken}`,
    ...options.headers,
  };

  // Make the request
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If token expired (401)
    if (response.status === 401) {
      clearToken();
      throw new Error("Authentication expired");
    }

    return response;
  } catch (error) {
    console.error("Authenticated fetch error:", error);
    throw error;
  }
};

// API function for getting user profile
export const getUserProfile = async () => {
  if (!inMemoryToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${inMemoryToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
};
