import { fetchData } from "./api";
import { Medication, MedicationFormValues } from "../type/medications";

/**
 * Get all medications from the system
 */
export const getAllMedications = async (): Promise<Medication[]> => {
  try {
    return await fetchData<Medication[]>("/medicines");
  } catch (error) {
    console.error("Error fetching medications:", error);
    throw error;
  }
};

export const createMedication = async (
  formData: MedicationFormValues
): Promise<Medication> => {
  try {
    const newMedication: Partial<Medication> = {
      name: formData.name ?? "",
      dosage: formData.dosage ?? "",
      quantity:
        formData.quantity !== undefined && formData.quantity !== null
          ? Number(formData.quantity)
          : 0,
      unit:
        formData.unit !== undefined && formData.unit !== null
          ? String(formData.unit)
          : "",
      type: formData.type ?? "",
      usage_instructions: formData.usage_instructions ?? "",
      side_effects: formData.side_effects ?? "",
      contraindications: formData.contraindications ?? "",
      description: formData.description ?? "",
      manufacturer: (formData as any).manufacturer || undefined,
      image: (formData as any).image
        ? String((formData as any).image)
        : undefined,
      is_prescription_required:
        typeof (formData as any).is_prescription_required === "string"
          ? (formData as any).is_prescription_required === "true"
          : Boolean((formData as any).is_prescription_required),
    };

    Object.keys(newMedication).forEach((key) => {
      const v = (newMedication as any)[key];
      if (v === undefined || v === null || v === "") {
        delete (newMedication as any)[key];
      }
    });

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
 * ❗️FIXED: Delete a medication by ID (đã sửa đúng endpoint)
 */
export const deleteMedication = async (id: string): Promise<void> => {
  try {
    await fetchData(`/medicines/${id}`, {
      method: "DELETE",
    });
    return;
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

/**
 * Export medication from inventory (reduces quantity)
 */
export const exportMedication = async (exportData: {
  medicationId: string;
  quantity: number;
  reason: string;
  medicalStaffName: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetchData<{ success: boolean; message: string }>(
      `/medicines/${exportData.medicationId}/export`,
      {
        method: "POST",
        body: JSON.stringify({
          quantity: exportData.quantity,
          reason: exportData.reason,
          medicalStaffName: exportData.medicalStaffName,
          exportDate: new Date().toISOString(),
        }),
      }
    );

    return response;
  } catch (error) {
    console.error("Error exporting medication:", error);
    throw error;
  }
};

/**
 * Get medication export history
 */
export const getMedicationExportHistory = async (
  medicationId?: string
): Promise<any[]> => {
  try {
    const url = medicationId
      ? `/medicines/${medicationId}/exports`
      : `/medicine-exports`;
    return await fetchData<any[]>(url);
  } catch (error) {
    console.error("Error fetching export history:", error);
    throw error;
  }
};

/**
 * Get filtered export history with pagination
 */
export const getFilteredExportHistory = async (filters: {
  dateFrom?: string;
  dateTo?: string;
  medicationName?: string;
  medicalStaffName?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: any[]; total: number }> => {
  try {
    const queryParams = new URLSearchParams();

    if (filters.dateFrom) queryParams.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) queryParams.append("dateTo", filters.dateTo);
    if (filters.medicationName)
      queryParams.append("medicationName", filters.medicationName);
    if (filters.medicalStaffName)
      queryParams.append("medicalStaffName", filters.medicalStaffName);
    if (filters.limit) queryParams.append("limit", filters.limit.toString());
    if (filters.offset) queryParams.append("offset", filters.offset.toString());

    const url = `/medicine-exports?${queryParams.toString()}`;
    return await fetchData<{ data: any[]; total: number }>(url);
  } catch (error) {
    console.error("Error fetching filtered export history:", error);
    throw error;
  }
};
