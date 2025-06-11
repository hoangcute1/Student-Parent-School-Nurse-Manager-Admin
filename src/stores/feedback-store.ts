import { create } from "zustand";
import { Feedback, CreateFeedbackDTO, UpdateFeedbackDTO } from "@/lib/type/feedbacks";
import * as feedbackAPI from "@/lib/api/feedbacks";

interface FeedbackStore {
  feedbacks: Feedback[];
  isLoading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  
  // Actions
  fetchFeedbacks: () => Promise<void>;
  createFeedback: (data: CreateFeedbackDTO) => Promise<void>;
  updateFeedback: (id: number, data: UpdateFeedbackDTO) => Promise<void>;
  deleteFeedback: (id: number) => Promise<void>;
  resetError: () => void;
}

export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
  feedbacks: [],
  isLoading: false,
  error: null,
  page: 1,
  pageSize: 10,
  total: 0,

  fetchFeedbacks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await feedbackAPI.getFeedbacks();
      set({
        feedbacks: response.data,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to fetch feedbacks" });
    } finally {
      set({ isLoading: false });
    }
  },

  createFeedback: async (data: CreateFeedbackDTO) => {
    set({ isLoading: true, error: null });
    try {
      const response = await feedbackAPI.createFeedback(data);
      set((state) => ({
        feedbacks: [...state.feedbacks, response],
        total: state.total + 1,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to create feedback" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateFeedback: async (id: number, data: UpdateFeedbackDTO) => {
    set({ isLoading: true, error: null });
    try {
      const response = await feedbackAPI.updateFeedback(id, data);
      set((state) => ({
        feedbacks: state.feedbacks.map((feedback) =>
          feedback.id === id ? response : feedback
        ),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to update feedback" });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFeedback: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await feedbackAPI.deleteFeedback(id);
      set((state) => ({
        feedbacks: state.feedbacks.filter((feedback) => feedback.id !== id),
        total: state.total - 1,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to delete feedback" });
    } finally {
      set({ isLoading: false });
    }
  },

  resetError: () => set({ error: null }),
}));
