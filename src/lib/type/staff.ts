import { StaffFormValues } from "@/app/cms/manage-staffs/_components/add-staff-dialog";
import { User, UserProfile } from "./users";

interface Staff {
  _id: string;
  user: User;
  profile: UserProfile;
}

interface StaffAccount extends User {}
interface StaffProfile extends UserProfile {}
interface StaffsTableRow {
  data: StaffAccount[];
  total: number;
  page: number;
  limit: number;
}
interface StaffStore {
  staffs: Staff[];
  isLoading: boolean;
  error: string | null;
  fetchStaffs: () => Promise<void>;
  addStaff: (data: StaffFormValues) => Promise<void>;
}

interface GetAllStaffsResponse {
  data: Staff[];
  total: number;
  page: number;
  limit: number;
}

interface UpdateStaffForm
  extends Partial<
    Omit<StaffAccount & StaffProfile, "_id" | "created_at" | "updated_at">
  > {}
interface UpdateStaffResponse {
  message: string;
  email: string;
}
export type {
  Staff,
  StaffAccount,
  StaffProfile,
  StaffsTableRow,
  StaffStore,
  GetAllStaffsResponse,
  UpdateStaffResponse,
  UpdateStaffForm,
};
