// API utility functions for making HTTP requests
import { getAuthToken } from "./auth";
import { RoleName } from "./roles";
import { Child, HealthRecord, VaccinationRecord } from "./models";

// Lấy API URL từ biến môi trường hoặc sử dụng giá trị mặc định
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

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
    } // Xử lý URL cho API request
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

// User related API calls
export interface User {
  id: string; // Sửa thành string vì MongoDB sử dụng chuỗi ID
  email: string;
  password?: string;
  role: RoleName;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string; // Để tương thích với code cũ
  access_token?: string; // Thêm cho API mới
  refresh_token?: string; // Thêm cho API mới
}

// Get all users
export const getUsers = (): Promise<User[]> => {
  return fetchData<User[]>("/users");
};

// Login user
export const loginUser = (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  return fetchData<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

// Register user
export const registerUser = (userData: Omit<User, "id">): Promise<User> => {
  return fetchData<User>("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

// Get user profile
export const getUserProfile = (): Promise<{ user: User }> => {
  return fetchData<{ user: User }>("/api/auth/me");
};

// Update user role
export const updateUserRole = (
  userId: string,
  role: RoleName
): Promise<User> => {
  return fetchData<User>(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
};

// Child related API calls

// Get all children for a parent
export const getParentChildren = (parentId: string): Promise<Child[]> => {
  return fetchData<Child[]>(`/api/children?parentId=${parentId}`);
};

// Get a specific child by ID
export const getChildById = (childId: string): Promise<Child> => {
  return fetchData<Child>(`/api/children/${childId}`);
};

// Add a child
export const addChild = (childData: Omit<Child, "id">): Promise<Child> => {
  return fetchData<Child>("/api/children", {
    method: "POST",
    body: JSON.stringify(childData),
  });
};

// Update a child
export const updateChild = (
  childId: string,
  childData: Partial<Child>
): Promise<Child> => {
  return fetchData<Child>(`/api/children/${childId}`, {
    method: "PUT",
    body: JSON.stringify(childData),
  });
};

// Delete a child
export const deleteChild = (childId: string): Promise<void> => {
  return fetchData<void>(`/api/children/${childId}`, {
    method: "DELETE",
  });
};

// Health Record related API calls

// Get a health record by child ID
export const getHealthRecordByChildId = (
  childId: string
): Promise<HealthRecord> => {
  return fetchData<HealthRecord>(`/api/health-records?childId=${childId}`);
};

// Get all health records
export const getAllHealthRecords = (): Promise<HealthRecord[]> => {
  return fetchData<HealthRecord[]>("/api/health-records");
};

// Create a health record
export const createHealthRecord = (
  recordData: Omit<HealthRecord, "id" | "lastUpdated" | "updatedBy">
): Promise<HealthRecord> => {
  return fetchData<HealthRecord>("/api/health-records", {
    method: "POST",
    body: JSON.stringify(recordData),
  });
};

// Update a health record
export const updateHealthRecord = (
  recordId: string,
  recordData: Partial<HealthRecord>
): Promise<HealthRecord> => {
  return fetchData<HealthRecord>(`/api/health-records/${recordId}`, {
    method: "PUT",
    body: JSON.stringify(recordData),
  });
};

// Delete a health record
export const deleteHealthRecord = (recordId: string): Promise<void> => {
  return fetchData<void>(`/api/health-records/${recordId}`, {
    method: "DELETE",
  });
};

// Vaccination related API calls

// Add a vaccination record
export const addVaccinationRecord = (
  childId: string,
  vaccinationData: Omit<VaccinationRecord, "id">
): Promise<HealthRecord> => {
  return fetchData<HealthRecord>(
    `/api/health-records/${childId}/vaccinations`,
    {
      method: "POST",
      body: JSON.stringify(vaccinationData),
    }
  );
};

// Update a vaccination record
export const updateVaccinationRecord = (
  childId: string,
  vaccinationId: string,
  vaccinationData: Partial<VaccinationRecord>
): Promise<HealthRecord> => {
  return fetchData<HealthRecord>(
    `/api/health-records/${childId}/vaccinations/${vaccinationId}`,
    {
      method: "PUT",
      body: JSON.stringify(vaccinationData),
    }
  );
};

export default {
  getUsers,
  loginUser,
  registerUser,
  getUserProfile,
  updateUserRole,
  getParentChildren,
  getChildById,
  addChild,
  updateChild,
  deleteChild,
  getHealthRecordByChildId,
  getAllHealthRecords,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  addVaccinationRecord,
  updateVaccinationRecord,
};
