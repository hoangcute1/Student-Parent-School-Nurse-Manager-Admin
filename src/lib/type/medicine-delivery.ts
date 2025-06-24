import { Medication } from "./medications";
import { Staff } from "./staff";
import { Student } from "./students";

interface MedicineDelivery {
  id: string;
  name: string;
  date: Date;
  total: number;
  status: "pending" | "completed" | "cancelled";
  per_dose: string;
  per_day: string;
  note: string;
  reason: string;
  sent_at: Date;
  end_at: Date;
  created_at: Date;
  updated_at: Date;
  student: {
    _id: string;
    studentId: string;
    name: string;
    birth: Date;
    gender: string;
    class: {
      _id: string;
      name: string;
    };
  };
  staffName: string;
  parentName: string;
  medicine: Medication;
}

interface MedicineDeliveryResponse {
  data: MedicineDelivery[];
  total: number;
}

interface MedicineDeliveryStore {
  medicineDeliveries: MedicineDelivery[];
  isLoading: boolean;
  error: string | null;
  fetchMedicineDeliveries: () => Promise<void>;
  addMedicineDelivery: (data: MedicineDelivery) => Promise<void>;
  updateMedicineDelivery: (id: string, data: MedicineDelivery) => Promise<void>;
  deleteMedicineDelivery: (id: string) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type {
  MedicineDelivery,
  MedicineDeliveryResponse,
  MedicineDeliveryStore,
};
