// API utility functions for making HTTP requests

import { API_URL } from "../env";
import { UserProfile } from "../type/users";
import { getAuthToken } from "./auth/token";

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

    console.log(`API Response received:`, {
      url: url,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    });
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.error("Failed to parse error response as JSON:", parseError);
        errorData = { message: response.statusText };
      }

      console.error("🚨 API Error Response:", {
        url: url,
        method: options.method || "GET",
        status: response.status,
        statusText: response.statusText,
        errorData,
        headers: Object.fromEntries(response.headers.entries()),
      });

      // Thêm thông báo lỗi cụ thể cho từng status code
      let userFriendlyMessage = errorData.message;
      if (response.status === 401) {
        userFriendlyMessage = "Email hoặc mật khẩu không chính xác";
      } else if (response.status === 403) {
        userFriendlyMessage = "Tài khoản không có quyền truy cập";
      } else if (response.status === 404) {
        userFriendlyMessage = "Không tìm thấy API endpoint";
      } else if (response.status === 500) {
        userFriendlyMessage = "Lỗi server nội bộ";
      } else if (response.status >= 500) {
        userFriendlyMessage = "Server đang gặp sự cố";
      }

      throw new Error(
        userFriendlyMessage ||
          errorData.message ||
          `API error: ${response.status} ${response.statusText}`
      );
    }

    // Only parse JSON if response has content
    if (response.status === 204) return undefined as T;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    } else {
      // If no content or not JSON, return undefined
      return undefined as T;
    }
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
