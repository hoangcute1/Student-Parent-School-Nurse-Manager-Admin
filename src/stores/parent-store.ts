import { Parent } from "@/lib/type/parents";
import { create } from "zustand";
import { getAllParents, createParent } from "@/lib/api/parent";
import type { ParentStore } from "@/lib/type/parents";
import type { ParentFormValues } from "@/app/cms/manage-parents/_components/add-parent-dialog";
import { UserProfile } from "@/lib/type/users";

// Define DisplayParent for the UI
interface DisplayParent {
  name: string;
  phone: string;
  address: string;
  email: string;
  createdAt: string;
}

const mapToDisplayParent = (parent: Parent): DisplayParent => {
  const profile = parent.profile || {};
  const user = parent.user || {};

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

      // Process the response into an array
      const parentsList = Array.isArray(response) ? response : [];

      set({
        parents: parentsList,
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

      // Update the store with the new parent
      set((state) => ({
        parents: [...state.parents, newParent],
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
