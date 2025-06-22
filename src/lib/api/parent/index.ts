import { API_URL } from "@/lib/env";
import { Parent } from "@/lib/type/parents";
import { ParentFormValues } from "@/app/cms/manage-parents/_components/add-parent-dialog";
import { fetchData } from "../api";

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
    // Convert ParentFormValues to the format expected by the API
    const parentData = {
      ...formData,
      user: {
        username: formData.email,
        password: "defaultPassword123", // This might need to be generated or prompted
        role: "parent",
      },
    };

    return await fetchData<Parent>("/parents", {
      method: "POST",
      body: JSON.stringify(parentData),
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
