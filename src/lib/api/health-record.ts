import { HealthRecord, HealthRecordFormValues } from "../type/health-record";
import { fetchData } from "./api";

/**
 * Get all health records for the current parent's children
 */
export const getParentChildrenHealthRecords = async (): Promise<HealthRecord[]> => {
  try {
    return await fetchData<HealthRecord[]>("/health-records");
  } catch (error) {
    console.error("Error fetching health records:", error);
    throw error;
  }
};

/**
 * Get a health record by ID
 */
export const getHealthRecordById = async (id: string): Promise<HealthRecord> => {
  try {
    return await fetchData<HealthRecord>(`/health-records/${id}`);
  } catch (error) {
    console.error(`Error fetching health record with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new health record
 */
export const createHealthRecord = async (
  formData: HealthRecordFormValues
): Promise<HealthRecord> => {
  try {
    return await fetchData<HealthRecord>("/health-records", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  } catch (error) {
    console.error("Error creating health record:", error);
    throw error;
  }
};

/**
 * Update a health record
 */
export const updateHealthRecord = async (
  id: string,
  formData: Partial<HealthRecordFormValues>
): Promise<HealthRecord> => {
  try {
    return await fetchData<HealthRecord>(`/health-records/${id}`, {
      method: "PUT",
      body: JSON.stringify(formData),
    });
  } catch (error) {
    console.error(`Error updating health record with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a health record
 */
export const deleteHealthRecord = async (id: string): Promise<void> => {
  try {
    await fetchData<void>(`/health-records/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Error deleting health record with ID ${id}:`, error);
    throw error;
  }
};
