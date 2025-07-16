
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
  status: "pending" | "morning" | "noon" | "completed" | "cancelled";
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
}

interface MedicineDeliveryByParent {
  id: string;
  staffId: string;
  staffName: string;
  name: string;
  date: string;
  total: number;
  status: "pending" | "morning" | "noon" | "completed" | "cancelled";
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
  created_at: string;
  updated_at: string;
}
interface MedicineDeliveryParentResponse {
  data: MedicineDeliveryByParent[];
  total: number;
}

interface MedicineDeliveryByStaff {
  id: string;
  parentId: string;
  parentName: string;
  name: string;
  date: string;
  total: number;
  status: "pending" | "morning" | "noon" | "completed" | "cancelled";
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
  created_at: string;
  updated_at: string;
}
interface MedicineDeliveryStaffResponse {
  data: MedicineDeliveryByStaff[];
  total: number;
}
interface CreateMedicineDelivery {
  name: string;
  total: number;
  status: "pending" | "morning" | "noon" | "completed" | "cancelled";
  per_day: string;
  note?: string; // Thành phần thuốc
  reason?: string;
  student: string;
  parent: string;
  staff?: string;
}

interface MedicineDeliveryResponse {
  data: MedicineDelivery[];
  total: number;
}

interface MedicineDeliveryStore {
  medicineDeliveries: MedicineDelivery[];
  medicineDeliveryByParentId: MedicineDeliveryByParent[];
  medicineDeliveryByStaffId: MedicineDeliveryByStaff[];
  isLoading: boolean;
  error: string | null;
  fetchMedicineDeliveries: () => Promise<void>;
  fetchMedicineDeliveryByStaffId: () => Promise<void>;
  fetchMedicineDeliveryByParentId: () => Promise<void>;
  addMedicineDelivery: (data: CreateMedicineDelivery) => Promise<any>;
  addManyMedicineDelivery: (data: CreateMedicineDelivery[]) => Promise<any>;
  updateMedicineDelivery: (
    id: string,
    data: Partial<MedicineDelivery>
  ) => Promise<any>;
  deleteMedicineDelivery: (id: string) => Promise<any>;
  softDeleteMedicineDelivery: (id: string) => Promise<any>;
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
  MedicineDeliveryByStaff,
  MedicineDeliveryStaffResponse,
};
