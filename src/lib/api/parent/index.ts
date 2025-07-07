import { API_URL } from "@/lib/env";
import { Parent } from "@/lib/type/parents";
import { fetchData } from "../api";

// Định nghĩa lại type cho form tạo phụ huynh, các trường phẳng
export interface ParentFormValues {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  gender: string;
}

// Get all parents
export const getAllParents = async (): Promise<Parent[]> => {
  try {
    return await fetchData<Parent[]>("/parents");
  } catch (error) {
    console.error("Error fetching parents:", error);
    throw error;
  }
};

// Create a new parent
export const createParent = async (
  formData: ParentFormValues
): Promise<Parent> => {
  try {
    // Gửi trực tiếp các trường phẳng, không thêm user lồng bên trong
    return await fetchData<Parent>("/parents/create-parent-with-user-profile", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  } catch (error) {
    console.error("Error creating parent:", error);
    throw error;
  }
};

// Update a parent
export const updateParent = async (
  parentId: string,
  formData: Partial<ParentFormValues>
): Promise<Parent> => {
  try {
    return await fetchData<Parent>(`/parents/${parentId}`, {
      method: "PUT",
      body: JSON.stringify(formData),
    });
  } catch (error) {
    console.error("Error updating parent:", error);
    throw error;
  }
};

// Delete a parent
export const deleteParent = async (parentId: string): Promise<void> => {
  try {
    await fetchData<void>(`/parents/${parentId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting parent:", error);
    throw error;
  }
};
