import { create } from "zustand";
import { Medication } from "./medications";

interface MedicineDelivery {
  id: string;
  parentId: string;
  staffId: string;
  parentName: string;
  staffName: string;
  name: string;
  date: string; // Chuyển sang string để đồng bộ với API
  total: number;
  status: "pending" | "progress" | "completed" | "cancelled";
  per_dose: string;
  per_day: string;
  note?: string; // Optional
  reason?: string; // Optional
  sent_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
  student: {
    _id: string;
    studentId: string;
    name: string;
    birth: string;
    gender: string;
    class: {
      _id: string;
      name: string;
    };
  };
  staff: {
    _id: string;
    name: string;
  };
  parent: {
    _id: string;
    name: string;
  };
  medicine: Medication;
}

interface MedicineDeliveryByParent {
  id: string;
  staffId: string;
  staffName: string;
  name: string;
  date: string;
  total: number;
  status: "pending" | "completed" | "cancelled";
  per_dose: string;
  per_day: string;
  note?: string;
  reason?: string;
  sent_at: string;
  end_at: string;
  student: {
    _id: string;
    name: string;
    studentId: string;
    class: {
      _id: string;
      name: string;
    };
  };
  medicine: Medication;
  created_at: Date;
  updated_at: Date;
}
interface MedicineDeliveryParentResponse {
  data: MedicineDeliveryByParent[];
  total: number;
}
interface CreateMedicineDelivery {
  name: string;
  date: string;
  total: number;
  status?: "pending" | "completed" | "cancelled";
  per_dose: string;
  per_day: string;
  note?: string;
  reason?: string;
  end_at?: string;
  student: string;
  parent: string;
  medicine: string;
  staff: string;
}

interface MedicineDeliveryResponse {
  data: MedicineDelivery[];
  total: number;
}

interface MedicineDeliveryStore {
  medicineDeliveries: MedicineDelivery[];
  medicineDeliveryByParentId: MedicineDeliveryByParent[];
  isLoading: boolean;
  error: string | null;
  fetchMedicineDeliveries: () => Promise<void>;
  fetchMedicineDeliveryByParentId: () => Promise<void>;
  addMedicineDelivery: (data: CreateMedicineDelivery) => Promise<any>;
  updateMedicineDelivery: (
    id: string,
    data: Partial<MedicineDelivery>
  ) => Promise<any>;
  deleteMedicineDelivery: (id: string) => Promise<any>;
  viewMedicineDeliveries: (id: string) => Promise<any>;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type {
  MedicineDelivery,
  MedicineDeliveryResponse,
  MedicineDeliveryStore,
  CreateMedicineDelivery,
  MedicineDeliveryByParent,
  MedicineDeliveryParentResponse,
};
