import { useState, useEffect } from "react";
import { getNotificationsByParentId } from "@/lib/api/notification";
import { getParentId } from "@/lib/utils/parent-utils";

export const useUnreadConsultations = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = async () => {
    try {
      setLoading(true);
      const parentId = await getParentId();
      const notifications = await getNotificationsByParentId(parentId);
      console.log("Fetched notifications for unread count:", notifications);

      // Đếm số lượng thông báo lịch hẹn tư vấn chưa đọc
      const unreadConsultations = notifications.filter(
        (notification: any) =>
          notification.type === "CONSULTATION_APPOINTMENT" &&
          !notification.isRead
      );

      console.log("Unread consultations:", unreadConsultations);
      console.log("Unread count:", unreadConsultations.length);

      setUnreadCount(unreadConsultations.length);
    } catch (error) {
      console.error("Error fetching unread consultations:", error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Tự động refresh mỗi 30 giây
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // Log khi unreadCount thay đổi
  useEffect(() => {
    console.log("Unread count changed:", unreadCount);
  }, [unreadCount]);

  return {
    unreadCount,
    loading,
    refreshUnreadCount: fetchUnreadCount,
  };
};
