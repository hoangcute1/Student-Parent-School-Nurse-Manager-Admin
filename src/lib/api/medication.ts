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
    // Tạo object mới đúng chuẩn interface Medication
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

    // Xóa các trường undefined/null/rỗng để API không nhận giá trị rỗng
    Object.keys(newMedication).forEach((key) => {
      const v = (newMedication as any)[key];
      if (v === undefined || v === null || v === "") {
        delete (newMedication as any)[key];
      }
    });

    // Gửi request
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
export const deleteMedication = async (id: string): Promise<void> => {
  try {
    await fetchData(`/medicine-deliveries/${id}`, {
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
