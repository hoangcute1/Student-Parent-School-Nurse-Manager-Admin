// API utility functions for making HTTP requests
import { get } from "http";
import { getAuthToken } from "./auth";
import { API_URL } from "./env";
import type {
  AuthResponse,
  StudentResponse,
  Child,
  HealthRecord,
  UserProfile,
} from "./types";

// Generic fetch function with error handling
async function fetchData<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Get authentication token
    const token = getAuthToken();

    // Create headers object
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

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
      const errorData = await response.json().catch(() => ({}));
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

export type LoginCredentials = {
  email: string;
  password: string;
  role?: string;
};

export type LoginResponse = AuthResponse;

// Login user
export const loginUser = (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  return fetchData<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

// Get users
export const getUsers = () => {
  return fetchData("/users");
};

export const getStudents = (
  page: number = 1,
  pageSize: number = 10
): Promise<StudentResponse> => {
  return fetchData<StudentResponse>(
    `/students?page=${page}&pageSize=${pageSize}`
  );
};

// Get child by ID
export const getChildById = (id: string): Promise<Child> => {
  return fetchData<Child>(`/children/${id}`);
};

// Get health record by child ID
export const getHealthRecordByChildId = (
  childId: string
): Promise<HealthRecord> => {
  return fetchData<HealthRecord>(`/health-records/${childId}`);
};

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
