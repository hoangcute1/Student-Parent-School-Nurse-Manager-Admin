import { create } from "zustand";
import { getParents, createParent } from "@/lib/api/parents";
import type { Parent as ApiParent } from "@/lib/type/parents";
import type { ParentFormValues } from "@/app/cms/manage-parents/_components/add-parent-dialog";

interface DisplayParent {
  name: string;
  phone: string;
  address: string;
  email: string;
  createdAt: string;
}

interface ParentStore {
  parents: DisplayParent[];
  isLoading: boolean;
  error: string | null;
  fetchParents: () => Promise<void>;
  addParent: (data: ParentFormValues) => Promise<void>;
}

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
      const data = await getParents();
      const parentsList = Array.isArray(data) ? data : data.data || [];
      set({ parents: parentsList.map(mapToDisplayParent) });
    } catch (err: any) {
      set({ error: err.message });
      console.error("Failed to fetch parents:", err);
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
