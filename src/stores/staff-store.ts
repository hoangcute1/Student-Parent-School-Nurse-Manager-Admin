import { createStaff, getStaffs } from "@/lib/api/staff";
import { ApiStaff, DisplayStaff, StaffStore } from "../type/staff";
import { create } from "zustand";
import type { StaffFormValues } from "@/app/cms/manage-staffs/_components/add-staff-dialog";

const mapToDisplayStaff = (apiStaff: ApiStaff): DisplayStaff => ({
  _id: apiStaff._id,
  user_id: apiStaff._id,
  roleId: "staff",
  name: apiStaff.name || "N/A",
  email: apiStaff.email || "N/A",
});

export const useStaffStore = create<StaffStore>((set) => ({
  staff: [],
  isLoading: false,
  error: null,
  fetchStaff: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log("Fetching staffs...");
      const response = await getStaffs();
      console.log("Staffs response:", response);

      // Kiểm tra nếu response là array thì dùng luôn, không thì check response.data
      const staffList = Array.isArray(response)
        ? response
        : response?.data || [];
      set({
        staff: staffList.map(mapToDisplayStaff),
        error: null,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch staffs";
      console.error("Failed to fetch staffs:", err);
      set({ error: errorMessage, staff: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  createStaff: async (data: StaffFormValues) => {
    // try {
    //   set({ isLoading: true, error: null });
    //   const newStaff = await createStaff(data);
    //   set((state) => ({
    //     staff: [...state.staff, maptoDisplaystaff(newStaff)],
    //   }));
    // } catch (err: any) {
    //   set({ error: err.message });
    //   console.error("Failed to create staff:", err);
    //   throw err;
    // } finally {
    //   set({ isLoading: false });
    // }
  },
}));
