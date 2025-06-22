import { MedicationFormValues } from "@/app/cms/medications/_components/add-medication-dialog";
import { fetchData } from "./api";
import { MedicationListResponse } from "../type/medications";

import { Medication } from "../type/medications";

/**
 * Get all medications from the system
 */
export const getAllMedications = async (): Promise<MedicationListResponse> => {
  try {
    return await fetchData<MedicationListResponse>("/medicines");
  } catch (error) {
    console.error("Error fetching medications:", error);
    throw error;
  }
};

export const createMedication = async (
  formData: MedicationFormValues
): Promise<Medication> => {
  try {
    // Create new medication object matching the Medication interface
    const newMedication = {
      name: formData.name,
      dosage: formData.dosage || "",
      unit: Number(formData.unit),
      type: formData.type || "",
      usage_instructions: formData.usage_instructions || "",
      side_effects: formData.side_effects || "",
      contraindications: formData.contraindications || "",
      description: formData.description || "",
    };

    // Send API request
    return await fetchData<Medication>("/medicines", {
      method: "POST",
      body: JSON.stringify(newMedication),
    });
  } catch (error) {
    console.error("Error creating medication:", error);
    throw error;
  }
};

/**
 * Update an existing medication with form data
 */
export const updateMedicationForm = async (
  medicationId: string,
  formData: Partial<MedicationFormValues>
): Promise<Medication> => {
  try {
    return await fetchData<Medication>(`/medicines/${medicationId}`, {
      method: "PUT",
      body: JSON.stringify(formData),
    });
  } catch (error) {
    console.error("Error updating medication:", error);
    throw error;
  }
};

/**
 * Delete a medication by ID
 */
export const deleteMedication = async (medicationId: string): Promise<void> => {
  try {
    await fetchData<void>(`/medicines/${medicationId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting medication:", error);
    throw error;
  }
};

/**
 * Get a medication by ID
 */
export const getMedicationById = async (id: string): Promise<Medication> => {
  try {
    return await fetchData<Medication>(`/medicines/${id}`);
  } catch (error) {
    console.error(`Error fetching medication with ID ${id}:`, error);
    throw error;
  }
};
