import { create } from "zustand";
import { fetchData } from "@/lib/api/api";

export interface VaccinationEvent {
  _id: string;
  title: string;
  description: string;
  vaccination_date: string;
  vaccination_time: string;
  location?: string;
  doctor_name?: string;
  vaccine_type?: string;
  grade_levels: number[];
  total_students: number;
  approved_count: number;
  pending_count: number;
  rejected_count: number;
  completed_count: number;
  classes: any[];
}

interface VaccinationStore {
  events: VaccinationEvent[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
}

export const useVaccinationStore = create<VaccinationStore>((set) => ({
  events: [],
  loading: false,
  error: null,
  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchData<VaccinationEvent[]>(
        "/vaccination-schedules/events"
      );
      set({ events: data, loading: false });
    } catch (err: any) {
      set({
        error: err.message || "Lỗi tải sự kiện tiêm chủng",
        loading: false,
      });
    }
  },
}));
