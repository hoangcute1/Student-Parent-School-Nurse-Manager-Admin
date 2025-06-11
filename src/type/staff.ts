import { StaffFormValues } from "@/app/cms/manage-staffs/_components/add-staff-dialog";

export interface Staff {
  _id: string;
  user_id: string;
  roleId: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  createdAt: string;
}

export interface StaffResponse {
  data: Staff[];
  total: number;
  page: number;
  limit: number;
}

export interface StaffTableProps {
  staffs: DisplayStaff[];
  isLoading: boolean;
  error: string | null;
}

export interface ApiStaff {
  _id: string;
  user_id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface DisplayStaff {
  _id: string;
  user_id: string;
  email: string;
  name: string;
  roleId: string;
}

export interface StaffStore {
  staff: DisplayStaff[];
  isLoading: boolean;
  error: string | null;
  fetchStaff: () => Promise<void>;
  createStaff: (data: StaffFormValues) => Promise<void>;
}
