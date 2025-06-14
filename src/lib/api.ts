// API utility functions for making HTTP requests
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
      const errorData = await response.json().catch(() => ({}));
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

export type LoginRequestCredentials = {
  email: string;
  password: string;
  role?: string;
};

export type LoginVerifyCredentials = {
  email: string;
  password: string;
  otp: string;
};

export type LoginResponse = AuthResponse;

// Request OTP for login
export const requestParentLoginOTP = (
  credentials: LoginRequestCredentials
): Promise<{ message: string }> => {
  // Remove role from credentials to prevent API error
  const { role, ...credentialsWithoutRole } = credentials;

  return fetchData<{ message: string }>("/auth/login-parent", {
    method: "POST",
    body: JSON.stringify(credentialsWithoutRole),
  });
};

export const requestStaffLoginOTP = (
  credentials: LoginRequestCredentials
): Promise<{ message: string }> => {
  // Remove role from credentials to prevent API error
  const { role, ...credentialsWithoutRole } = credentials;

  return fetchData<{ message: string }>("/auth/login-staff", {
    method: "POST",
    body: JSON.stringify(credentialsWithoutRole),
  });
};

export const requestAdminLoginOTP = (
  credentials: LoginRequestCredentials
): Promise<{ message: string }> => {
  // Remove role from credentials to prevent API error
  const { role, ...credentialsWithoutRole } = credentials;

  return fetchData<{ message: string }>("/auth/login-admin", {
    method: "POST",
    body: JSON.stringify(credentialsWithoutRole),
  });
};

// Verify OTP and login
export const verifyParentLoginOTP = (
  credentials: LoginVerifyCredentials
): Promise<LoginResponse> => {
  console.log("Verifying parent login with credentials:", credentials);

  // Send email, password and OTP as required by the backend
  return fetchData<LoginResponse>("/auth/login-parent/verify", {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      otp: credentials.otp,
    }),
  });
};

export const verifyStaffLoginOTP = (
  credentials: LoginVerifyCredentials
): Promise<LoginResponse> => {
  console.log("Verifying staff login with credentials:", credentials);
  
  // Send email, password and OTP as required by the backend
  return fetchData<LoginResponse>("/auth/login-staff/verify", {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      otp: credentials.otp,
    }),
  });
};

export const verifyAdminLoginOTP = (
  credentials: LoginVerifyCredentials
): Promise<LoginResponse> => {
  console.log("Verifying admin login with credentials:", credentials);
  
  // Send email, password and OTP as required by the backend
  return fetchData<LoginResponse>("/auth/login-admin/verify", {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      otp: credentials.otp,
    }),
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
