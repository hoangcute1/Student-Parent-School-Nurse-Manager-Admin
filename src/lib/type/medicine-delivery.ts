import { create } from "zustand";
import { Medication } from "./medications";
import { Staff } from "./staff";
import { Student } from "./students";

interface MedicineDelivery {
  id: string;
  parentId: string;
  staffId: string;
  name: string;
  date: string; // Chuyển sang string để đồng bộ với API
  total: number;
  status: "pending" | "completed" | "cancelled";
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

interface MedicineDeliveryByParentId {
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
  medicine: string; // Giữ string để đơn giản
  staff: string;
}
interface MedicineDeliveryParentResponse {
  data: MedicineDeliveryByParentId[];
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
  sent_at: string;
  end_at?: string;
  student_id: string;
  parent_id?: string;
  medicine: string;
  staff_id?: string;
}

interface MedicineDeliveryResponse {
  data: MedicineDelivery[];
  total: number;
}

interface MedicineDeliveryStore {
  students: Student[];
  medicineDeliveryByParentId: MedicineDeliveryByParentId[];
  medicineDeliveries: MedicineDelivery[];
  isLoading: boolean;
  error: string | null;
  fetchMedicineDeliveries: () => Promise<void>;
  fetchMedicineDeliveryByParentId: (
    parentId: string
  ) => Promise<MedicineDeliveryByParentId[]>;
  addMedicineDelivery: (data: CreateMedicineDelivery) => Promise<any>;
  updateMedicineDelivery: (id: string, data: MedicineDelivery) => Promise<void>;
  deleteMedicineDelivery: (id: string) => Promise<void>;

  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type {
  MedicineDelivery,
  MedicineDeliveryResponse,
  MedicineDeliveryStore,
  CreateMedicineDelivery,
  MedicineDeliveryByParentId,
  MedicineDeliveryParentResponse,
};
