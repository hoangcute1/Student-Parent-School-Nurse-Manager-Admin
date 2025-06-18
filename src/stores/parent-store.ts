import { create } from "zustand";
import { getAllParents, createParent } from "@/lib/api/parent";
import type { ParentStore } from "../lib/type/parents";
import type { ParentFormValues } from "@/app/cms/manage-parents/_components/add-parent-dialog";

const mapToDisplayParent = (apiParent: ApiParent): DisplayParent => ({
  name: apiParent.name,
  phone: apiParent.phone || "N/A",
  address: apiParent.address || "N/A",
  email: apiParent.email || "N/A",
  createdAt: new Date(apiParent.createdAt).toLocaleDateString("vi-VN"),
});

export const useParentStore = create<ParentStore>((set) => ({
  parents: [],
  isLoading: false,
  error: null,
  fetchParents: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log("Fetching parents...");
      const response = await getAllParents();
      console.log("Parents response:", response);

      // Kiểm tra nếu response là array thì dùng luôn, không thì check response.data
      const parentsList = Array.isArray(response)
        ? response
        : response?.data || [];
      set({
        parents: parentsList.map(mapToDisplayParent),
        error: null,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch parents";
      console.error("Failed to fetch parents:", err);
      set({ error: errorMessage, parents: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addParent: async (data: ParentFormValues) => {
    try {
      set({ isLoading: true, error: null });
      const newParent = await createParent(data);
      set((state) => ({
        parents: [...state.parents, mapToDisplayParent(newParent)],
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
