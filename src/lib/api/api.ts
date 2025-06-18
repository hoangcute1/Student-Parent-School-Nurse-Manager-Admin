// API utility functions for making HTTP requests

import { API_URL } from "../env";
import { UserProfile } from "../type/users";
import { getAuthToken } from "./auth";

// Generic fetch function with error handling
export async function fetchData<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const token = getAuthToken();
    console.log(`API Request to ${endpoint} - token exists:`, !!token);

    // Create headers object
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Log the request details for debugging
    console.log(`API Request to ${endpoint}:`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.parse(options.body as string) : undefined,
    });

    // Xử lý URL cho API request
    const apiUrl = API_URL ? API_URL : ""; // Nếu không có API_URL, sử dụng URL tương đối

    // Ensure endpoint starts with / if it's not a full URL and doesn't already have a leading /
    const normalizedEndpoint = endpoint.startsWith("http")
      ? endpoint
      : endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;

    const url = endpoint.startsWith("http")
      ? endpoint // Nếu endpoint đã là URL đầy đủ
      : `${apiUrl}${normalizedEndpoint}`; // Nếu endpoint là đường dẫn tương đối

    console.log(`Making API request to: ${url}`);

    const response = await fetch(url, {
      ...options,
      headers,
    });
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(
        errorData.message ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export interface UpdateProfileData {
  name: string;
  gender: "male" | "female";
  birth: string;
  address: string;
  phone?: string;
  bio?: string;
}

// Update user profile
export const updateProfile = (
  data: UpdateProfileData
): Promise<UserProfile> => {
  return fetchData<UserProfile>("/users/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
