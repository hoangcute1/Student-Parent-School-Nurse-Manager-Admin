import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); // Gracefully handle non-JSON responses
    const errorMessage =
      errorData.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
}

export const client = {
  get: async (endpoint: string, options?: RequestInit) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "GET",
    });
    return handleResponse(response);
  },
  post: async (endpoint: string, body: any, options?: RequestInit) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
  put: async (endpoint: string, body: any, options?: RequestInit) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
  delete: async (endpoint: string, options?: RequestInit) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "DELETE",
    });
    return handleResponse(response);
  },
};
