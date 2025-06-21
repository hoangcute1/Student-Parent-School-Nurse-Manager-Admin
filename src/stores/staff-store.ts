import { Staff } from "@/lib/type/staff";
import { create } from "zustand";
import { getAllStaffs, createStaff } from "@/lib/api/staff";
import type { StaffStore } from "@/lib/type/staff";
import type { StaffFormValues } from "@/app/cms/manage-staffs/_components/add-staff-dialog";
import { UserProfile } from "@/lib/type/users";

// Define DisplayParent for the UI
interface DisplayStaff {
  name: string;
  phone: string;
  address: string;
  email: string;
  createdAt: string;
}

const mapToDisplayStaff = (staff: Staff): DisplayStaff => {
  const profile = staff.profile || {};
  const user = staff.user || {};

  return {
    name: profile?.name || "N/A",
    phone: profile?.phone || "N/A",
    address: profile?.address || "N/A",
    email: user?.email || "N/A",
    createdAt: user?.created_at
      ? new Date(user.created_at).toLocaleDateString("vi-VN")
      : "N/A",
  };
};

export const useStaffStore = create<StaffStore>((set) => ({
  staffs: [],
  isLoading: false,
  error: null,
  fetchStaffs: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log("Fetching staffs...");
      const response = await getAllStaffs();
      console.log("Parents response:", response);

      // Process the response into an array
      const staffsList = Array.isArray(response) ? response : [];

      set({
        staffs: staffsList,
        error: null,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch staffs";
      console.error("Failed to fetch staffs:", err);
      set({ error: errorMessage, staffs: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addStaff: async (data: StaffFormValues) => {
    try {
      set({ isLoading: true, error: null });
      const newStaff = await createStaff(data);

      // Update the store with the new parent
      set((state) => ({
        staffs: [...state.staffs, newStaff],
      }));
    } catch (err: any) {
      set({ error: err.message });
      console.error("Failed to create parent:", err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));
