import { ApiStaff } from "../type/staff";
import { fetchData } from "./api";
import type { StaffFormValues } from "@/app/cms/manage-staffs/_components/add-staff-dialog";

/**
 * Get all staff members
 */
export const getStaffs = async (): Promise<ApiStaff[]> => {
  try {
    return await fetchData<ApiStaff[]>("/staffs");
  } catch (error) {
    console.error("Error fetching staffs:", error);
    throw error;
  }
};

/**
 * Get a staff member by ID
 */
export const getStaffById = async (id: string): Promise<ApiStaff> => {
  try {
    return await fetchData<ApiStaff>(`/staffs/${id}`);
  } catch (error) {
    console.error(`Error fetching staff with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new staff member
 */
export const createStaff = async (
  staffData: StaffFormValues
): Promise<ApiStaff> => {
  try {
    return await fetchData<ApiStaff>("/staffs", {
      method: "POST",
      body: JSON.stringify(staffData),
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    throw error;
  }
};

/**
 * Update a staff member
 */
export const updateStaff = async (
  id: string,
  staffData: Partial<StaffFormValues>
): Promise<ApiStaff> => {
  try {
    return await fetchData<ApiStaff>(`/staffs/${id}`, {
      method: "PUT",
      body: JSON.stringify(staffData),
    });
  } catch (error) {
    console.error(`Error updating staff with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a staff member
 */
export const deleteStaff = async (id: string): Promise<void> => {
  try {
    await fetchData<void>(`/staffs/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Error deleting staff with ID ${id}:`, error);
    throw error;
  }
};
