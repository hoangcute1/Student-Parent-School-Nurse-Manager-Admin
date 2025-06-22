import { Staff } from "@/lib/type/staff";
import { StaffFormValues } from "@/app/cms/manage-staffs/_components/add-staff-dialog";
import { fetchData } from "../api";

// Get all parents
export const getAllStaffs = async (): Promise<Staff[]> => {
  try {
    return await fetchData<Staff[]>("/staff");
  } catch (error) {
    console.error("Error fetching staffs:", error);
    throw error;
  }
};

// Create a new Staff
export const createStaff = async (
  formData: StaffFormValues
): Promise<Staff> => {
  try {
    // Convert StaffFormValues to the format expected by the API
    const staffData = {
      ...formData,
      user: {
        username: formData.email,
        password: "defaultPassword123", // This might need to be generated or prompted
        role: "staff",
      },
    };

    return await fetchData<Staff>("/staff", {
      method: "POST",
      body: JSON.stringify(staffData),
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    throw error;
  }
};

// Update a staff
export const updateStaff = async (
  staffId: string,
  formData: Partial<StaffFormValues>
): Promise<Staff> => {
  try {
    return await fetchData<Staff>(`/staff/${staffId}`, {
      method: "PUT",
      body: JSON.stringify(formData),
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    throw error;
  }
};

// Delete a parent
export const deleteStaff = async (staffId: string): Promise<void> => {
  try {
    await fetchData<void>(`/staff/${staffId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting staff:", error);
    throw error;
  }
};
