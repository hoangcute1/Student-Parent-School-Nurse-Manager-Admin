import { create } from "zustand";
import { getNotificationsByParentId } from "@/lib/api/notification";
import { Notification } from "@/lib/type/notification";

interface NotificationStore {
  notifications: Notification[];
  fetchNotifications: (parentId: string) => Promise<void>;
}

export const useParentNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  fetchNotifications: async (parentId: string) => {
    const data = await getNotificationsByParentId(parentId);
    set({ notifications: data });
  },
}));
